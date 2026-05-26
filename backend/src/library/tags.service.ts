import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { resolveUniqueSlug, slugifyTitle } from '../books/utils/slug';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto, ListQueryDto, UpdateTagDto } from './library.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 100;
    const where: Prisma.TagWhereInput = query.q?.trim()
      ? { title: { contains: query.q.trim(), mode: 'insensitive' } }
      : {};
    const [items, total] = await Promise.all([
      this.prisma.tag.findMany({
        where,
        orderBy: { title: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { _count: { select: { bookLinks: true } } },
      }),
      this.prisma.tag.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
  }

  async findOne(id: string) {
    const item = await this.prisma.tag.findUnique({
      where: { id },
      include: { _count: { select: { bookLinks: true } } },
    });
    if (!item) throw new NotFoundException('Тег не найден');
    return item;
  }

  async create(dto: CreateTagDto) {
    const slug = await this.resolveSlug(dto.slug, dto.title);
    try {
      return await this.prisma.tag.create({
        data: { title: dto.title.trim(), slug },
      });
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === 'P2002') {
        throw new BadRequestException('Slug уже занят');
      }
      throw err;
    }
  }

  async update(id: string, dto: UpdateTagDto) {
    const existing = await this.findOne(id);
    const slug =
      dto.slug !== undefined
        ? await this.resolveSlug(dto.slug, dto.title ?? existing.title, id)
        : undefined;
    try {
      return await this.prisma.tag.update({
        where: { id },
        data: {
          ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
          ...(slug !== undefined ? { slug } : {}),
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
    await this.prisma.tag.delete({ where: { id } });
  }

  private async resolveSlug(explicitSlug: string | undefined, title: string, excludeId?: string) {
    const base = slugifyTitle(explicitSlug?.trim() || title);
    return resolveUniqueSlug(base, async (candidate) => {
      const found = await this.prisma.tag.findUnique({ where: { slug: candidate } });
      if (!found) return false;
      return !(excludeId && found.id === excludeId);
    });
  }
}
