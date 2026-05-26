import { mapApiBookToUi, type UiBook } from './book-mapper';
import {
  getBook,
  getBooks,
  getCollectionBooks,
  type ApiBook,
  type GetBooksParams,
} from './books-api';
import { getHome } from './admin-library-api';

export type BooksLoadSource = 'api';

export type BooksLoadResult = {
  books: UiBook[];
  source: BooksLoadSource;
  total?: number;
  page?: number;
  totalPages?: number;
};

export type HomeCollection = {
  slug: string;
  title: string;
  description: string | null;
  books: UiBook[];
};

export type CatalogQuery = {
  q?: string;
  cat?: string | null;
  filter?: 'all' | 'popular' | 'new';
  collection?: string | null;
  page?: number;
  limit?: number;
};

function buildApiParams(query: CatalogQuery): GetBooksParams {
  const params: GetBooksParams = {
    page: query.page ?? 1,
    limit: query.limit ?? 100,
    q: query.q || undefined,
    categorySlug: query.cat || undefined,
  };

  params.sort = query.filter === 'new' ? 'newest' : 'newest';
  return params;
}

export async function loadBooks(
  query: CatalogQuery = {},
): Promise<BooksLoadResult> {
  if (query.collection) {
    const collection = await getCollectionBooks(query.collection);
    const books = collection.books.map(mapApiBookToUi);
    return {
      books,
      source: 'api',
      total: books.length,
      page: 1,
      totalPages: 1,
    };
  }

  const res = await getBooks(buildApiParams(query));
  return {
    books: res.items.map(mapApiBookToUi),
    source: 'api',
    total: res.total,
    page: res.page,
    totalPages: res.totalPages,
  };
}

export async function loadPublishedBooks(
  limit = 12,
): Promise<BooksLoadResult> {
  return loadBooks({ limit, filter: 'all' });
}

export async function loadHomeCollections(): Promise<{
  collections: HomeCollection[];
  source: BooksLoadSource;
}> {
  const home = await getHome();
  return {
    source: 'api',
    collections: home.collections.map((collection) => ({
      slug: collection.slug,
      title: collection.title,
      description: collection.description,
      books: collection.books.map(mapApiBookToUi),
    })),
  };
}

export type BookLoadResult = {
  book: UiBook;
  apiBook: ApiBook;
  source: BooksLoadSource;
};

export async function loadBookBySlug(
  slug: string,
): Promise<BookLoadResult | null> {
  try {
    const apiBook = await getBook(slug);
    return {
      book: mapApiBookToUi(apiBook),
      apiBook,
      source: 'api',
    };
  } catch {
    return null;
  }
}

export async function loadCatalogSections(): Promise<{
  source: BooksLoadSource;
  popular: UiBook[];
  abai: UiBook[];
  foreign: UiBook[];
  poetry: UiBook[];
  all: UiBook[];
}> {
  const res = await getBooks({ limit: 100, sort: 'newest' });
  const all = res.items.map(mapApiBookToUi);
  return {
    source: 'api',
    popular: all.slice(0, 6),
    abai: all.filter((b) => b.slug.includes('abai')).slice(0, 6),
    foreign: all.filter((b) => b.language === 'English').slice(0, 6),
    poetry: all
      .filter((b) =>
        [b.genre, ...(b.tags ?? [])].some((value) =>
          ['poetry', 'philosophy'].includes(value.toLowerCase()),
        ),
      )
      .slice(0, 6),
    all,
  };
}

export function getStaticBooksForSimilar(): UiBook[] {
  return [];
}
