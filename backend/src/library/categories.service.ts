import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { resolveUniqueSlug, slugifyTitle } from '../books/utils/slug';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, ListQueryDto, UpdateCategoryDto } from './library.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListQueryDto, activeOnly = false) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 100;
    const where: Prisma.CategoryWhereInput = {
      ...(activeOnly ? { isActive: true } : {}),
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
      this.prisma.category.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: { _count: { select: { bookLinks: true } } },
      }),
      this.prisma.category.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
  }

  async findOne(id: string) {
    const item = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { bookLinks: true } } },
    });
    if (!item) throw new NotFoundException('Категория не найдена');
    return item;
  }

  async create(dto: CreateCategoryDto) {
    const slug = await this.resolveSlug(dto.slug, dto.title);
    try {
      return await this.prisma.category.create({
        data: {
          title: dto.title.trim(),
          slug,
          description: dto.description?.trim() ?? null,
          sortOrder: dto.sortOrder ?? 0,
          isActive: dto.isActive ?? true,
        },
      });
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === 'P2002') {
        throw new BadRequestException('Slug уже занят');
      }
      throw err;
    }
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const existing = await this.findOne(id);
    const slug =
      dto.slug !== undefined
        ? await this.resolveSlug(dto.slug, dto.title ?? existing.title, id)
        : undefined;
    try {
      return await this.prisma.category.update({
        where: { id },
        data: {
          ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
          ...(slug !== undefined ? { slug } : {}),
          ...(dto.description !== undefined
            ? { description: dto.description?.trim() ?? null }
            : {}),
          ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
          ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
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
    await this.prisma.category.delete({ where: { id } });
  }

  private async resolveSlug(explicitSlug: string | undefined, title: string, excludeId?: string) {
    const base = slugifyTitle(explicitSlug?.trim() || title);
    return resolveUniqueSlug(base, async (candidate) => {
      const found = await this.prisma.category.findUnique({ where: { slug: candidate } });
      if (!found) return false;
      return !(excludeId && found.id === excludeId);
    });
  }
}
