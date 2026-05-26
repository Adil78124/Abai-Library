import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { resolveUniqueSlug, slugifyTitle } from '../books/utils/slug';
import { CreateAuthorDto, ListQueryDto, UpdateAuthorDto } from './library.dto';

@Injectable()
export class AuthorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const where: Prisma.AuthorWhereInput = query.q?.trim()
      ? {
          OR: [
            { fullName: { contains: query.q.trim(), mode: 'insensitive' } },
            { description: { contains: query.q.trim(), mode: 'insensitive' } },
          ],
        }
      : {};
    const [items, total] = await Promise.all([
      this.prisma.author.findMany({
        where,
        orderBy: { fullName: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { _count: { select: { books: true } } },
      }),
      this.prisma.author.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
  }

  async findOne(id: string) {
    const item = await this.prisma.author.findUnique({
      where: { id },
      include: { _count: { select: { books: true } } },
    });
    if (!item) throw new NotFoundException('Автор не найден');
    return item;
  }

  async create(dto: CreateAuthorDto) {
    const slug = await this.resolveSlug(dto.slug, dto.fullName);
    try {
      return await this.prisma.author.create({
        data: {
          fullName: dto.fullName.trim(),
          slug,
          description: dto.description?.trim() ?? null,
          birthYear: dto.birthYear ?? null,
          deathYear: dto.deathYear ?? null,
          image: dto.image?.trim() ?? null,
        },
      });
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === 'P2002') {
        throw new BadRequestException('Slug уже занят');
      }
      throw err;
    }
  }

  async update(id: string, dto: UpdateAuthorDto) {
    const existing = await this.findOne(id);
    const slug =
      dto.slug !== undefined
        ? await this.resolveSlug(dto.slug, dto.fullName ?? existing.fullName, id)
        : undefined;
    try {
      const updated = await this.prisma.author.update({
        where: { id },
        data: {
          ...(dto.fullName !== undefined ? { fullName: dto.fullName.trim() } : {}),
          ...(slug !== undefined ? { slug } : {}),
          ...(dto.description !== undefined
            ? { description: dto.description?.trim() ?? null }
            : {}),
          ...(dto.birthYear !== undefined ? { birthYear: dto.birthYear } : {}),
          ...(dto.deathYear !== undefined ? { deathYear: dto.deathYear } : {}),
          ...(dto.image !== undefined ? { image: dto.image?.trim() ?? null } : {}),
        },
      });
      if (dto.fullName !== undefined) {
        await this.prisma.book.updateMany({
          where: { authorId: id },
          data: { author: updated.fullName },
        });
      }
      return updated;
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === 'P2002') {
        throw new BadRequestException('Slug уже занят');
      }
      throw err;
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.author.delete({ where: { id } });
  }

  private async resolveSlug(explicitSlug: string | undefined, name: string, excludeId?: string) {
    const base = slugifyTitle(explicitSlug?.trim() || name);
    return resolveUniqueSlug(base, async (candidate) => {
      const found = await this.prisma.author.findUnique({ where: { slug: candidate } });
      if (!found) return false;
      return !(excludeId && found.id === excludeId);
    });
  }
}
