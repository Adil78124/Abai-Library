import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  AiAvailability,
  Book,
  BookStatus,
  CollectionPlacement,
  CollectionType,
  Prisma,
} from '@prisma/client';
import { resolveUniqueSlug, slugifyTitle } from '../books/utils/slug';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import {
  AddCollectionBookDto,
  CreateCollectionDto,
  ListQueryDto,
  ReorderCollectionBooksDto,
  UpdateCollectionDto,
} from './library.dto';

const collectionInclude = {
  books: {
    include: { book: true },
    orderBy: { sortOrder: 'asc' as const },
  },
  _count: { select: { books: true } },
};

@Injectable()
export class CollectionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async findAll(query: ListQueryDto, publicOnly = false) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const where: Prisma.CollectionWhereInput = {
      ...(publicOnly ? this.activeWhere() : {}),
      ...(query.q?.trim()
        ? {
            OR: [
              { title: { contains: query.q.trim(), mode: 'insensitive' } },
              { description: { contains: query.q.trim(), mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.collection.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: { _count: { select: { books: true } } },
      }),
      this.prisma.collection.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
  }

  async findOne(id: string) {
    const item = await this.prisma.collection.findUnique({
      where: { id },
      include: collectionInclude,
    });
    if (!item) throw new NotFoundException('Подборка не найдена');
    return {
      ...item,
      books: item.books.map((link) => ({
        ...link,
        book: this.toBookDto(link.book),
      })),
    };
  }

  async create(dto: CreateCollectionDto) {
    const slug = await this.resolveSlug(dto.slug, dto.title);
    try {
      return await this.prisma.collection.create({
        data: {
          slug,
          title: dto.title.trim(),
          description: dto.description?.trim() ?? null,
          placement: dto.placement ?? CollectionPlacement.HOME,
          type: dto.type ?? CollectionType.MANUAL,
          automaticKind: dto.automaticKind ?? null,
          isActive: dto.isActive ?? true,
          startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
          endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
          sortOrder: dto.sortOrder ?? 0,
          books: dto.bookIds?.length
            ? {
                create: dto.bookIds.map((bookId, index) => ({
                  book: { connect: { id: bookId } },
                  sortOrder: index,
                })),
              }
            : undefined,
        },
      });
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === 'P2002') {
        throw new BadRequestException('Slug уже занят');
      }
      throw err;
    }
  }

  async update(id: string, dto: UpdateCollectionDto) {
    const existing = await this.findOne(id);
    const slug =
      dto.slug !== undefined
        ? await this.resolveSlug(dto.slug, dto.title ?? existing.title, id)
        : undefined;
    try {
      return await this.prisma.collection.update({
        where: { id },
        data: {
          ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
          ...(slug !== undefined ? { slug } : {}),
          ...(dto.description !== undefined
            ? { description: dto.description?.trim() ?? null }
            : {}),
          ...(dto.placement !== undefined ? { placement: dto.placement } : {}),
          ...(dto.type !== undefined ? { type: dto.type } : {}),
          ...(dto.automaticKind !== undefined
            ? { automaticKind: dto.automaticKind }
            : {}),
          ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
          ...(dto.startsAt !== undefined
            ? { startsAt: dto.startsAt ? new Date(dto.startsAt) : null }
            : {}),
          ...(dto.endsAt !== undefined
            ? { endsAt: dto.endsAt ? new Date(dto.endsAt) : null }
            : {}),
          ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
        },
      });
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === 'P2002') {
        throw new BadRequestException('Slug уже занят');
      }
      throw err;
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.collection.delete({ where: { id } });
  }

  async addBook(id: string, dto: AddCollectionBookDto) {
    await this.findOne(id);
    const max = await this.prisma.collectionBook.aggregate({
      where: { collectionId: id },
      _max: { sortOrder: true },
    });
    try {
      return await this.prisma.collectionBook.create({
        data: {
          collectionId: id,
          bookId: dto.bookId,
          sortOrder: dto.sortOrder ?? (max._max.sortOrder ?? -1) + 1,
        },
      });
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === 'P2002') {
        throw new BadRequestException('Книга уже есть в подборке');
      }
      throw err;
    }
  }

  async reorderBooks(id: string, dto: ReorderCollectionBooksDto) {
    await this.findOne(id);
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.collectionBook.update({
          where: { collectionId_bookId: { collectionId: id, bookId: item.bookId } },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );
    return this.findOne(id);
  }

  async removeBook(id: string, bookId: string) {
    await this.prisma.collectionBook.delete({
      where: { collectionId_bookId: { collectionId: id, bookId } },
    });
  }

  async getBooksBySlug(slug: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { slug },
      include: collectionInclude,
    });
    if (!collection || !this.isActive(collection)) {
      throw new NotFoundException('Подборка не найдена');
    }

    if (collection.type === CollectionType.AUTOMATIC) {
      return {
        ...collection,
        books: await this.getAutomaticBooks(collection.automaticKind),
      };
    }

    return {
      ...collection,
      books: collection.books
        .map((link) => this.toBookDto(link.book))
        .filter((book) => book.status === BookStatus.PUBLISHED),
    };
  }

  async getHome() {
    const collections = await this.prisma.collection.findMany({
      where: {
        placement: CollectionPlacement.HOME,
        ...this.activeWhere(),
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: collectionInclude,
    });

    const resolved = await Promise.all(
      collections.map(async (collection) => {
        const books =
          collection.type === CollectionType.AUTOMATIC
            ? await this.getAutomaticBooks(collection.automaticKind)
            : collection.books
                .map((link) => this.toBookDto(link.book))
                .filter((book) => book.status === BookStatus.PUBLISHED);
        return {
          id: collection.id,
          slug: collection.slug,
          title: collection.title,
          description: collection.description,
          placement: collection.placement,
          type: collection.type,
          isActive: collection.isActive,
          sortOrder: collection.sortOrder,
          books,
        };
      }),
    );

    return { collections: resolved };
  }

  private activeWhere(): Prisma.CollectionWhereInput {
    const now = new Date();
    return {
      isActive: true,
      OR: [{ startsAt: null }, { startsAt: { lte: now } }],
      AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
    };
  }

  private isActive(collection: { isActive: boolean; startsAt: Date | null; endsAt: Date | null }) {
    const now = Date.now();
    return (
      collection.isActive &&
      (!collection.startsAt || collection.startsAt.getTime() <= now) &&
      (!collection.endsAt || collection.endsAt.getTime() >= now)
    );
  }

  private async getAutomaticBooks(kind: unknown) {
    const orderBy =
      kind === 'RECENTLY_UPDATED'
        ? { updatedAt: 'desc' as const }
        : { createdAt: 'desc' as const };
    const where: Prisma.BookWhereInput = {
      status: BookStatus.PUBLISHED,
      ...(kind === 'AI_READY'
        ? { aiAvailability: AiAvailability.AVAILABLE }
        : {}),
    };
    const books = await this.prisma.book.findMany({
      where,
      orderBy,
      take: 12,
    });
    return books.map((book) => this.toBookDto(book));
  }

  private toBookDto(book: Book) {
    const coverValue = book.coverImage ?? book.image;
    const fileValue = book.pdfFile ?? book.file;
    const imageKey = this.storage.extractObjectKey(coverValue);
    const fileKey = this.storage.extractObjectKey(fileValue);
    return {
      ...book,
      image: coverValue,
      file: fileValue,
      imageUrl: imageKey
        ? this.storage.getPublicUrl(imageKey)
        : coverValue?.startsWith('http') || coverValue?.startsWith('/')
          ? coverValue
          : null,
      fileUrl: fileKey
        ? this.storage.getPublicUrl(fileKey)
        : fileValue?.startsWith('http')
          ? fileValue
          : null,
    };
  }

  private async resolveSlug(explicitSlug: string | undefined, title: string, excludeId?: string) {
    const base = slugifyTitle(explicitSlug?.trim() || title);
    return resolveUniqueSlug(base, async (candidate) => {
      const found = await this.prisma.collection.findUnique({ where: { slug: candidate } });
      if (!found) return false;
      return !(excludeId && found.id === excludeId);
    });
  }
}
