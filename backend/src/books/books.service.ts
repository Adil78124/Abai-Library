import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AiAvailability, BookStatus, Prisma } from '@prisma/client';
import type { Book } from '@prisma/client';
import { N8nService } from '../n8n/n8n.service';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { UsersService } from '../users/users.service';
import { BookChatDto } from './dto/book-chat.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { assertImageUpload, assertPdfUpload } from './utils/file-validation';
import { resolveUniqueSlug, slugifyTitle } from './utils/slug';

const bookInclude = {
  authorRecord: true,
  categoryLinks: {
    include: { category: true },
    orderBy: { category: { sortOrder: 'asc' as const } },
  },
  tagLinks: {
    include: { tag: true },
    orderBy: { tag: { title: 'asc' as const } },
  },
};

type BookWithRelations = Prisma.BookGetPayload<{ include: typeof bookInclude }>;

export type BookUploadResult = {
  book: BookDto;
  objectKey: string;
  publicUrl: string;
  aiAvailability: AiAvailability;
  aiProcessingStarted: boolean;
  warning?: string;
};

export type BookFileInfo = {
  objectKey: string | null;
  publicUrl: string | null;
  aiAvailability: AiAvailability;
};

export type BookDto = Omit<Book, 'tags'> & {
  author: string;
  tags: string[];
  authorRecord: BookWithRelations['authorRecord'];
  categories: BookWithRelations['categoryLinks'][number]['category'][];
  tagRecords: BookWithRelations['tagLinks'][number]['tag'][];
  categoryIds: string[];
  tagIds: string[];
  imageUrl: string | null;
  fileUrl: string | null;
};

export type BooksListResponse = {
  items: BookDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly storage: StorageService,
    private readonly n8nService: N8nService,
  ) {}

  async findAllPublic(query: QueryBooksDto): Promise<BooksListResponse> {
    return this.findAll(query, true);
  }

  async findAllAdmin(query: QueryBooksDto): Promise<BooksListResponse> {
    return this.findAll(query, false);
  }

  async findOnePublic(
    idOrSlug: string,
    sessionUserId?: string,
  ): Promise<BookDto> {
    const isAdmin = sessionUserId
      ? await this.usersService.isAdmin(sessionUserId)
      : false;

    const book = await this.findByIdOrSlug(idOrSlug);
    if (!book || (!isAdmin && book.status !== BookStatus.PUBLISHED)) {
      throw new NotFoundException('Книга не найдена');
    }

    return this.toBookDto(book);
  }

  async findOneAdmin(id: string): Promise<BookDto> {
    const book = await this.findByIdOrThrow(id);
    return this.toBookDto(book);
  }

  async create(dto: CreateBookDto): Promise<BookDto> {
    const slug = await this.resolveSlug(dto.slug, dto.title);
    const author = await this.resolveAuthorInput(dto.authorId, dto.author);
    const coverImage = dto.coverImage?.trim() || dto.image?.trim() || null;
    const pdfFile = dto.pdfFile?.trim() || dto.file?.trim() || null;

    try {
      const created = await this.prisma.book.create({
        data: {
          slug,
          title: dto.title.trim(),
          author: author.displayName,
          authorId: author.authorId,
          description: dto.description?.trim() ?? null,
          shortDescription: dto.shortDescription?.trim() ?? null,
          language: dto.language?.trim() ?? null,
          ageLimit: dto.ageLimit ?? null,
          isbn: dto.isbn?.trim() ?? null,
          publishedYear: dto.publishedYear ?? null,
          publisher: dto.publisher?.trim() ?? null,
          pageCount: dto.pageCount ?? null,
          coverImage,
          pdfFile,
          genre: dto.genre?.trim() ?? null,
          tags: dto.tags ?? [],
          image: coverImage,
          file: pdfFile,
          status: dto.status ?? BookStatus.DRAFT,
          aiAvailability: dto.aiAvailability ?? AiAvailability.UNAVAILABLE,
          categoryLinks: this.createCategoryLinks(dto.categoryIds),
          tagLinks: this.createTagLinks(dto.tagIds),
        },
        include: bookInclude,
      });
      return this.toBookDto(created);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === 'P2002') {
        throw new BadRequestException('Slug уже занят');
      }
      if ((err as { code?: string })?.code === 'P2025') {
        throw new BadRequestException('Связанная сущность не найдена');
      }
      throw err;
    }
  }

  async update(id: string, dto: UpdateBookDto): Promise<BookDto> {
    const existing = await this.findByIdOrThrow(id);

    let slug: string | undefined;
    if (dto.slug !== undefined) {
      slug = await this.resolveSlug(dto.slug, dto.title ?? existing.title, id);
    }

    const author =
      dto.authorId !== undefined || dto.author !== undefined
        ? await this.resolveAuthorInput(
            dto.authorId,
            dto.author,
            existing.author,
          )
        : null;
    const coverImage =
      dto.coverImage !== undefined || dto.image !== undefined
        ? dto.coverImage?.trim() || dto.image?.trim() || null
        : undefined;
    const pdfFile =
      dto.pdfFile !== undefined || dto.file !== undefined
        ? dto.pdfFile?.trim() || dto.file?.trim() || null
        : undefined;

    try {
      const updated = await this.prisma.book.update({
        where: { id },
        data: {
          ...(slug !== undefined ? { slug } : {}),
          ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
          ...(author
            ? { author: author.displayName, authorId: author.authorId }
            : {}),
          ...(dto.description !== undefined
            ? { description: dto.description?.trim() ?? null }
            : {}),
          ...(dto.shortDescription !== undefined
            ? { shortDescription: dto.shortDescription?.trim() ?? null }
            : {}),
          ...(dto.language !== undefined
            ? { language: dto.language?.trim() ?? null }
            : {}),
          ...(dto.ageLimit !== undefined ? { ageLimit: dto.ageLimit } : {}),
          ...(dto.isbn !== undefined ? { isbn: dto.isbn?.trim() ?? null } : {}),
          ...(dto.publishedYear !== undefined
            ? { publishedYear: dto.publishedYear }
            : {}),
          ...(dto.publisher !== undefined
            ? { publisher: dto.publisher?.trim() ?? null }
            : {}),
          ...(dto.pageCount !== undefined
            ? { pageCount: dto.pageCount }
            : {}),
          ...(dto.genre !== undefined
            ? { genre: dto.genre?.trim() ?? null }
            : {}),
          ...(dto.tags !== undefined ? { tags: dto.tags } : {}),
          ...(coverImage !== undefined ? { coverImage, image: coverImage } : {}),
          ...(pdfFile !== undefined ? { pdfFile, file: pdfFile } : {}),
          ...(dto.status !== undefined ? { status: dto.status } : {}),
          ...(dto.aiAvailability !== undefined
            ? { aiAvailability: dto.aiAvailability }
            : {}),
          ...(dto.categoryIds !== undefined
            ? {
                categoryLinks: {
                  deleteMany: {},
                  create: dto.categoryIds.map((categoryId) => ({
                    category: { connect: { id: categoryId } },
                  })),
                },
              }
            : {}),
          ...(dto.tagIds !== undefined
            ? {
                tagLinks: {
                  deleteMany: {},
                  create: dto.tagIds.map((tagId) => ({
                    tag: { connect: { id: tagId } },
                  })),
                },
              }
            : {}),
        },
        include: bookInclude,
      });
      return this.toBookDto(updated);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === 'P2002') {
        throw new BadRequestException('Slug уже занят');
      }
      if ((err as { code?: string })?.code === 'P2025') {
        throw new BadRequestException('Связанная сущность не найдена');
      }
      throw err;
    }
  }

  async remove(id: string): Promise<void> {
    await this.findByIdOrThrow(id);
    await this.prisma.book.update({
      where: { id },
      data: { status: BookStatus.ARCHIVED },
    });
  }

  async duplicate(id: string): Promise<BookDto> {
    const existing = await this.findByIdOrThrow(id);
    const slug = await this.resolveSlug(undefined, `${existing.title} copy`);

    const created = await this.prisma.book.create({
      data: {
        slug,
        title: `${existing.title} copy`,
        author: this.resolveAuthorName(existing),
        authorId: existing.authorId,
        description: existing.description,
        shortDescription: existing.shortDescription,
        language: existing.language,
        ageLimit: existing.ageLimit,
        isbn: existing.isbn,
        publishedYear: existing.publishedYear,
        publisher: existing.publisher,
        pageCount: existing.pageCount,
        coverImage: existing.coverImage,
        pdfFile: existing.pdfFile,
        genre: existing.genre,
        tags: existing.tags,
        image: existing.image,
        file: existing.file,
        status: BookStatus.DRAFT,
        aiAvailability: AiAvailability.UNAVAILABLE,
        categoryLinks: {
          create: existing.categoryLinks.map((link) => ({
            category: { connect: { id: link.categoryId } },
          })),
        },
        tagLinks: {
          create: existing.tagLinks.map((link) => ({
            tag: { connect: { id: link.tagId } },
          })),
        },
      },
      include: bookInclude,
    });

    return this.toBookDto(created);
  }

  async uploadPdf(
    id: string,
    file: Express.Multer.File,
  ): Promise<BookUploadResult> {
    assertPdfUpload(file);
    const book = await this.findByIdOrThrow(id);

    try {
      await this.deleteStoredFileIfManaged(book.pdfFile ?? book.file);
      const objectKey = this.storage.generateObjectKey(
        id,
        'pdf',
        file.originalname || 'book.pdf',
      );
      await this.storage.uploadFile(objectKey, file.buffer, file.mimetype);

      let updated = await this.prisma.book.update({
        where: { id },
        data: {
          file: objectKey,
          pdfFile: objectKey,
          aiAvailability: AiAvailability.PROCESSING,
        },
        include: bookInclude,
      });

      const fileUrl = this.storage.getPublicUrl(objectKey);

      if (!this.n8nService.isBookProcessingConfigured()) {
        updated = await this.prisma.book.update({
          where: { id },
          data: { aiAvailability: AiAvailability.UNAVAILABLE },
          include: bookInclude,
        });
        return {
          ...this.toUploadResult(updated, objectKey),
          aiProcessingStarted: false,
          warning: 'N8N processing webhook is not configured',
        };
      }

      try {
        await this.n8nService.startBookProcessing({
          bookId: id,
          title: updated.title,
          author: this.resolveAuthorName(updated),
          fileKey: objectKey,
          fileUrl,
        });
        return {
          ...this.toUploadResult(updated, objectKey),
          aiProcessingStarted: true,
        };
      } catch {
        updated = await this.prisma.book.update({
          where: { id },
          data: { aiAvailability: AiAvailability.FAILED },
          include: bookInclude,
        });
        return {
          ...this.toUploadResult(updated, objectKey),
          aiProcessingStarted: false,
          warning: 'PDF uploaded, but AI processing could not be started',
        };
      }
    } catch {
      await this.setAiAvailabilitySafe(id, AiAvailability.FAILED);
      throw new BadRequestException('Не удалось загрузить PDF');
    }
  }

  async uploadImage(
    id: string,
    file: Express.Multer.File,
  ): Promise<BookUploadResult> {
    assertImageUpload(file);
    const book = await this.findByIdOrThrow(id);

    try {
      await this.deleteStoredFileIfManaged(book.coverImage ?? book.image);
      const objectKey = this.storage.generateObjectKey(
        id,
        'images',
        file.originalname || 'cover.jpg',
      );
      await this.storage.uploadFile(objectKey, file.buffer, file.mimetype);

      const updated = await this.prisma.book.update({
        where: { id },
        data: { image: objectKey, coverImage: objectKey },
        include: bookInclude,
      });

      return {
        ...this.toUploadResult(updated, objectKey),
        aiProcessingStarted: false,
      };
    } catch {
      throw new BadRequestException('Не удалось загрузить изображение');
    }
  }

  async deletePdf(id: string): Promise<BookDto> {
    const book = await this.findByIdOrThrow(id);
    await this.deleteStoredFileIfManaged(book.pdfFile ?? book.file);

    const updated = await this.prisma.book.update({
      where: { id },
      data: {
        file: null,
        pdfFile: null,
        aiAvailability: AiAvailability.UNAVAILABLE,
      },
      include: bookInclude,
    });
    return this.toBookDto(updated);
  }

  async deleteImage(id: string): Promise<BookDto> {
    const book = await this.findByIdOrThrow(id);
    await this.deleteStoredFileIfManaged(book.coverImage ?? book.image);

    const updated = await this.prisma.book.update({
      where: { id },
      data: { image: null, coverImage: null },
      include: bookInclude,
    });
    return this.toBookDto(updated);
  }

  async completeUploadProcessing(
    id: string,
    success: boolean,
    error?: string,
  ): Promise<BookDto> {
    await this.findByIdOrThrow(id);

    if (error) {
      this.logger.warn(
        `N8N end_upload for book ${id} reported error: ${error.slice(0, 500)}`,
      );
    }

    const updated = await this.prisma.book.update({
      where: { id },
      data: {
        aiAvailability: success
          ? AiAvailability.AVAILABLE
          : AiAvailability.FAILED,
      },
      include: bookInclude,
    });
    return this.toBookDto(updated);
  }

  async chatWithBook(
    id: string,
    dto: BookChatDto,
    sessionUserId?: string,
  ): Promise<{ answer: string }> {
    const book = await this.findByIdOrThrow(id);
    const isAdmin = sessionUserId
      ? await this.usersService.isAdmin(sessionUserId)
      : false;

    if (!isAdmin && book.status !== BookStatus.PUBLISHED) {
      throw new NotFoundException('Книга не найдена');
    }

    if (book.aiAvailability !== AiAvailability.AVAILABLE) {
      throw new ConflictException(
        'AI assistant is not available for this book yet',
      );
    }

    if (!this.n8nService.isChatConfigured()) {
      throw new ServiceUnavailableException('AI service is not configured');
    }

    try {
      return await this.n8nService.chatWithBook({
        bookId: id,
        message: dto.message.trim(),
        sessionId: dto.sessionId,
        userId: sessionUserId,
      });
    } catch (err) {
      if (
        err instanceof ServiceUnavailableException ||
        err instanceof ConflictException ||
        err instanceof NotFoundException
      ) {
        throw err;
      }
      if (err instanceof BadGatewayException) {
        throw err;
      }
      throw new BadGatewayException('AI service is temporarily unavailable');
    }
  }

  getBookFileInfo(book: Book): BookFileInfo {
    const fileValue = book.pdfFile ?? book.file;
    const objectKey = this.storage.extractObjectKey(fileValue);
    return {
      objectKey,
      publicUrl: objectKey
        ? this.storage.getPublicUrl(objectKey)
        : fileValue,
      aiAvailability: book.aiAvailability,
    };
  }

  private async findAll(
    query: QueryBooksDto,
    publicOnly: boolean,
  ): Promise<BooksListResponse> {
    const page = query.page ?? 1;
    const limit = query.limit ?? (publicOnly ? 12 : 50);
    const skip = (page - 1) * limit;
    const where: Prisma.BookWhereInput = publicOnly
      ? { status: BookStatus.PUBLISHED }
      : {};

    if (!publicOnly && query.status) where.status = query.status;
    if (query.aiAvailability) where.aiAvailability = query.aiAvailability;

    if (query.q?.trim()) {
      const q = query.q.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { author: { contains: q, mode: 'insensitive' } },
        { authorRecord: { fullName: { contains: q, mode: 'insensitive' } } },
      ];
    }

    if (query.language?.trim()) {
      where.language = { equals: query.language.trim(), mode: 'insensitive' };
    }

    if (query.genre?.trim()) {
      where.genre = { equals: query.genre.trim(), mode: 'insensitive' };
    }

    if (query.categoryId?.trim()) {
      where.categoryLinks = { some: { categoryId: query.categoryId.trim() } };
    }

    if (query.categorySlug?.trim()) {
      where.categoryLinks = {
        some: { category: { slug: query.categorySlug.trim() } },
      };
    }

    if (query.tagId?.trim()) {
      where.tagLinks = { some: { tagId: query.tagId.trim() } };
    }

    const orderBy = this.getOrderBy(query.sort ?? 'newest');

    const [items, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        orderBy,
        include: bookInclude,
        skip,
        take: limit,
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      items: items.map((b) => this.toBookDto(b)),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  private async findByIdOrThrow(id: string): Promise<BookWithRelations> {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: bookInclude,
    });
    if (!book) {
      throw new NotFoundException('Книга не найдена');
    }
    return book;
  }

  private async findByIdOrSlug(
    idOrSlug: string,
  ): Promise<BookWithRelations | null> {
    if (UUID_REGEX.test(idOrSlug)) {
      return this.prisma.book.findUnique({
        where: { id: idOrSlug },
        include: bookInclude,
      });
    }
    return this.prisma.book.findUnique({
      where: { slug: idOrSlug },
      include: bookInclude,
    });
  }

  private async deleteStoredFileIfManaged(
    value: string | null | undefined,
  ): Promise<void> {
    if (!this.storage.isManagedStorageKey(value)) return;
    await this.storage.deleteFile(value!);
  }

  private async setAiAvailabilitySafe(
    id: string,
    status: AiAvailability,
  ): Promise<void> {
    try {
      await this.prisma.book.update({
        where: { id },
        data: { aiAvailability: status },
      });
    } catch {
      // best effort only
    }
  }

  private toUploadResult(
    book: BookWithRelations,
    objectKey: string,
    warning?: string,
  ): Omit<BookUploadResult, 'aiProcessingStarted'> {
    return {
      book: this.toBookDto(book),
      objectKey,
      publicUrl: this.storage.getPublicUrl(objectKey),
      aiAvailability: book.aiAvailability,
      ...(warning ? { warning } : {}),
    };
  }

  private toBookDto(book: BookWithRelations): BookDto {
    const coverValue = book.coverImage ?? book.image;
    const fileValue = book.pdfFile ?? book.file;
    const imageKey = this.storage.extractObjectKey(coverValue);
    const fileKey = this.storage.extractObjectKey(fileValue);

    const imageUrl = imageKey
      ? this.storage.getPublicUrl(imageKey)
      : coverValue?.trim().startsWith('http') || coverValue?.trim().startsWith('/')
        ? coverValue.trim()
        : null;

    const fileUrl = fileKey
      ? this.storage.getPublicUrl(fileKey)
      : fileValue?.trim().startsWith('http')
        ? fileValue.trim()
        : null;

    const tagTitles = book.tagLinks.length
      ? book.tagLinks.map((link) => link.tag.title)
      : book.tags;

    return {
      ...book,
      author: this.resolveAuthorName(book),
      image: coverValue,
      file: fileValue,
      tags: tagTitles,
      categories: book.categoryLinks.map((link) => link.category),
      tagRecords: book.tagLinks.map((link) => link.tag),
      categoryIds: book.categoryLinks.map((link) => link.categoryId),
      tagIds: book.tagLinks.map((link) => link.tagId),
      imageUrl,
      fileUrl,
    };
  }

  private async resolveSlug(
    explicitSlug: string | undefined,
    title: string,
    excludeId?: string,
  ): Promise<string> {
    const base = slugifyTitle(explicitSlug?.trim() || title);
    return resolveUniqueSlug(base, async (candidate) => {
      const found = await this.prisma.book.findUnique({
        where: { slug: candidate },
      });
      if (!found) return false;
      if (excludeId && found.id === excludeId) return false;
      return true;
    });
  }

  private async resolveAuthorInput(
    authorId?: string,
    authorName?: string,
    fallback = '',
  ): Promise<{ authorId: string | null; displayName: string }> {
    if (authorId) {
      const author = await this.prisma.author.findUnique({
        where: { id: authorId },
      });
      if (!author) throw new BadRequestException('Автор не найден');
      return { authorId, displayName: author.fullName };
    }

    const displayName = authorName?.trim() || fallback.trim();
    if (!displayName) {
      throw new BadRequestException('Укажите автора');
    }
    return { authorId: null, displayName };
  }

  private resolveAuthorName(book: BookWithRelations): string {
    return book.authorRecord?.fullName ?? book.author;
  }

  private createCategoryLinks(categoryIds?: string[]) {
    if (!categoryIds?.length) return undefined;
    return {
      create: categoryIds.map((categoryId) => ({
        category: { connect: { id: categoryId } },
      })),
    };
  }

  private createTagLinks(tagIds?: string[]) {
    if (!tagIds?.length) return undefined;
    return {
      create: tagIds.map((tagId) => ({
        tag: { connect: { id: tagId } },
      })),
    };
  }

  private getOrderBy(
    sort: 'newest' | 'oldest' | 'title',
  ): Prisma.BookOrderByWithRelationInput {
    switch (sort) {
      case 'oldest':
        return { createdAt: 'asc' };
      case 'title':
        return { title: 'asc' };
      case 'newest':
      default:
        return { createdAt: 'desc' };
    }
  }
}
