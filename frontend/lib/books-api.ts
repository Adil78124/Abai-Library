import { apiFetch } from './api';

export type BookStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type AiAvailability =
  | 'PROCESSING'
  | 'AVAILABLE'
  | 'UNAVAILABLE'
  | 'FAILED';

export type ApiBook = {
  id: string;
  slug: string;
  title: string;
  author: string;
  authorId?: string | null;
  authorRecord?: ApiAuthor | null;
  description: string | null;
  shortDescription?: string | null;
  language: string | null;
  ageLimit?: number | null;
  isbn?: string | null;
  publishedYear?: number | null;
  publisher?: string | null;
  pageCount?: number | null;
  genre: string | null;
  tags: string[];
  categories?: ApiCategory[];
  tagRecords?: ApiTag[];
  categoryIds?: string[];
  tagIds?: string[];
  coverImage?: string | null;
  pdfFile?: string | null;
  image: string | null;
  file: string | null;
  imageUrl?: string | null;
  fileUrl?: string | null;
  status: BookStatus;
  aiAvailability: AiAvailability;
  createdAt: string;
  updatedAt: string;
};

export type ApiAuthor = {
  id: string;
  fullName: string;
  slug: string;
  description?: string | null;
  birthYear?: number | null;
  deathYear?: number | null;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: { books?: number };
};

export type ApiCategory = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  sortOrder: number;
  isActive: boolean;
  _count?: { bookLinks?: number };
};

export type ApiTag = {
  id: string;
  title: string;
  slug: string;
  _count?: { bookLinks?: number };
};

export type BooksListResponse = {
  items: ApiBook[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ApiCollectionBooksResponse = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  books: ApiBook[];
};

export type GetBooksParams = {
  q?: string;
  page?: number;
  limit?: number;
  status?: BookStatus;
  aiAvailability?: AiAvailability;
  language?: string;
  genre?: string;
  categoryId?: string;
  categorySlug?: string;
  tagId?: string;
  sort?: 'newest' | 'oldest' | 'title';
};

function toQuery(params: GetBooksParams): string {
  const search = new URLSearchParams();
  if (params.q) search.set('q', params.q);
  if (params.page != null) search.set('page', String(params.page));
  if (params.limit != null) search.set('limit', String(params.limit));
  if (params.status) search.set('status', params.status);
  if (params.aiAvailability) search.set('aiAvailability', params.aiAvailability);
  if (params.language) search.set('language', params.language);
  if (params.genre) search.set('genre', params.genre);
  if (params.categoryId) search.set('categoryId', params.categoryId);
  if (params.categorySlug) search.set('categorySlug', params.categorySlug);
  if (params.tagId) search.set('tagId', params.tagId);
  if (params.sort) search.set('sort', params.sort);
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

/** GET /api/books — публичный каталог (по умолчанию только PUBLISHED на backend). */
export async function getBooks(params: GetBooksParams = {}) {
  return apiFetch<BooksListResponse>(`/books${toQuery(params)}`);
}

/** GET /api/books/:idOrSlug */
export async function getBook(idOrSlug: string) {
  return apiFetch<ApiBook>(
    `/books/${encodeURIComponent(idOrSlug)}`,
  );
}

/** GET /api/collections/:slug/books */
export async function getCollectionBooks(slug: string) {
  return apiFetch<ApiCollectionBooksResponse>(
    `/collections/${encodeURIComponent(slug)}/books`,
  );
}

/** GET /api/books/admin/list — все книги (ADMIN). */
export async function getAdminBooks(params: GetBooksParams = {}) {
  return apiFetch<BooksListResponse>(
    `/admin/books${toQuery({ ...params, limit: params.limit ?? 100 })}`,
  );
}
