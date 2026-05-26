import 'dotenv/config';
import {
  AiAvailability,
  BookStatus,
  CollectionPlacement,
  CollectionType,
  PrismaClient,
} from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { SEED_BOOKS } from './seed-data';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

function slugify(input: string): string {
  return (
    input
      .trim()
      .toLowerCase()
      .replace(/['"]/g, '')
      .replace(/[^a-z0-9а-яёәғқңөұүһі]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 120) || 'item'
  );
}

const DEFAULT_CATEGORIES = [
  'Абай',
  'Классика',
  'Поэзия',
  'Философия',
  'Зарубежная литература',
  'Детская литература',
  'История',
  'Наука',
];

const DEFAULT_TAGS = [
  'школьникам',
  'казахская литература',
  'короткие книги',
  'обязательное чтение',
  'AI доступен',
  'новинка',
];

function inferCategoryTitles(book: (typeof SEED_BOOKS)[number]): string[] {
  const result = new Set<string>();
  if (book.author.includes('Abai') || book.author.includes('Абай') || book.slug.includes('abai')) {
    result.add('Абай');
    result.add('Классика');
  }
  if (book.language === 'English') result.add('Зарубежная литература');
  if (book.genre) result.add(book.genre);
  if (result.size === 0) result.add('Классика');
  return [...result];
}

async function main() {
  console.log(`Seeding library CMS with ${SEED_BOOKS.length} books...`);

  const categoriesByTitle = new Map<string, string>();
  for (const [index, title] of DEFAULT_CATEGORIES.entries()) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(title) },
      create: {
        title,
        slug: slugify(title),
        sortOrder: index,
        isActive: true,
      },
      update: {
        title,
        sortOrder: index,
        isActive: true,
      },
    });
    categoriesByTitle.set(title, category.id);
  }

  const tagsByTitle = new Map<string, string>();
  for (const title of DEFAULT_TAGS) {
    const tag = await prisma.tag.upsert({
      where: { slug: slugify(title) },
      create: { title, slug: slugify(title) },
      update: { title },
    });
    tagsByTitle.set(title, tag.id);
  }

  for (const book of SEED_BOOKS) {
    const author = await prisma.author.upsert({
      where: { slug: slugify(book.author) },
      create: {
        fullName: book.author,
        slug: slugify(book.author),
      },
      update: { fullName: book.author },
    });

    const categoryIds: string[] = [];
    for (const title of inferCategoryTitles(book)) {
      let id = categoriesByTitle.get(title);
      if (!id) {
        const category = await prisma.category.upsert({
          where: { slug: slugify(title) },
          create: { title, slug: slugify(title), isActive: true },
          update: { title, isActive: true },
        });
        id = category.id;
        categoriesByTitle.set(title, id);
      }
      categoryIds.push(id);
    }

    const tagIds: string[] = [];
    for (const title of book.tags ?? []) {
      let id = tagsByTitle.get(title);
      if (!id) {
        const tag = await prisma.tag.upsert({
          where: { slug: slugify(title) },
          create: { title, slug: slugify(title) },
          update: { title },
        });
        id = tag.id;
        tagsByTitle.set(title, id);
      }
      tagIds.push(id);
    }

    const saved = await prisma.book.upsert({
      where: { slug: book.slug },
      create: {
        slug: book.slug,
        title: book.title,
        author: author.fullName,
        authorId: author.id,
        description: book.description ?? null,
        shortDescription: book.description?.slice(0, 280) ?? null,
        language: book.language ?? null,
        genre: book.genre ?? null,
        tags: book.tags ?? [],
        image: book.image ?? null,
        coverImage: book.image ?? null,
        file: book.file ?? null,
        pdfFile: book.file ?? null,
        status: BookStatus.PUBLISHED,
        aiAvailability: AiAvailability.UNAVAILABLE,
      },
      update: {
        title: book.title,
        author: author.fullName,
        authorId: author.id,
        description: book.description ?? null,
        shortDescription: book.description?.slice(0, 280) ?? null,
        language: book.language ?? null,
        genre: book.genre ?? null,
        tags: book.tags ?? [],
        image: book.image ?? null,
        coverImage: book.image ?? null,
        file: book.file ?? null,
        pdfFile: book.file ?? null,
        status: BookStatus.PUBLISHED,
      },
    });

    await prisma.bookCategory.deleteMany({ where: { bookId: saved.id } });
    await prisma.bookCategory.createMany({
      data: categoryIds.map((categoryId) => ({ bookId: saved.id, categoryId })),
      skipDuplicates: true,
    });

    await prisma.bookTag.deleteMany({ where: { bookId: saved.id } });
    await prisma.bookTag.createMany({
      data: tagIds.map((tagId) => ({ bookId: saved.id, tagId })),
      skipDuplicates: true,
    });
  }

  const allBooks = await prisma.book.findMany({
    where: { status: BookStatus.PUBLISHED },
    orderBy: { createdAt: 'asc' },
  });

  const collections = [
    { slug: 'popular-books', title: 'Популярные книги', sortOrder: 0, books: allBooks.slice(0, 6) },
    { slug: 'new-books', title: 'Новинки', sortOrder: 1, books: [...allBooks].reverse().slice(0, 6) },
    {
      slug: 'abai-books',
      title: 'Книги Абая',
      sortOrder: 2,
      books: allBooks.filter((book) => book.author.includes('Абай') || book.slug.includes('abai')).slice(0, 8),
    },
    { slug: 'recommended', title: 'Рекомендуем', sortOrder: 3, books: allBooks.slice(0, 4) },
  ];

  for (const collectionSeed of collections) {
    const collection = await prisma.collection.upsert({
      where: { slug: collectionSeed.slug },
      create: {
        slug: collectionSeed.slug,
        title: collectionSeed.title,
        placement: CollectionPlacement.HOME,
        type: CollectionType.MANUAL,
        isActive: true,
        sortOrder: collectionSeed.sortOrder,
      },
      update: {
        title: collectionSeed.title,
        placement: CollectionPlacement.HOME,
        type: CollectionType.MANUAL,
        isActive: true,
        sortOrder: collectionSeed.sortOrder,
      },
    });

    await prisma.collectionBook.deleteMany({ where: { collectionId: collection.id } });
    await prisma.collectionBook.createMany({
      data: collectionSeed.books.map((book, index) => ({
        collectionId: collection.id,
        bookId: book.id,
        sortOrder: index,
      })),
      skipDuplicates: true,
    });
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
