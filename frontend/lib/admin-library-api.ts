import { apiFetch } from './api';
import type {
  AiAvailability,
  ApiAuthor,
  ApiBook,
  ApiCategory,
  ApiTag,
  BookStatus,
  BooksListResponse,
  GetBooksParams,
} from './books-api';

export type ListResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CollectionPlacement = 'HOME' | 'CATALOG' | 'BOOK_PAGE';
export type CollectionType = 'MANUAL' | 'AUTOMATIC';
export type AutomaticCollectionKind =
  | 'NEW_BOOKS'
  | 'POPULAR'
  | 'AI_READY'
  | 'RECENTLY_UPDATED';

export type ApiCollection = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  placement: CollectionPlacement;
  type: CollectionType;
  automaticKind?: AutomaticCollectionKind | null;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  _count?: { books?: number };
  books?: Array<{ id: string; bookId: string; sortOrder: number; book: ApiBook }>;
};

export type HomeResponse = {
  collections: Array<{
    id: string;
    slug: string;
    title: string;
    description: string | null;
    books: ApiBook[];
  }>;
};

function toQuery(params: Record<string, string | number | undefined | null>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export function getAdminBook(id: string) {
  return apiFetch<ApiBook>(`/admin/books/${encodeURIComponent(id)}`);
}

export function createBook(payload: Partial<ApiBook> & {
  title: string;
  author?: string;
  categoryIds?: string[];
  tagIds?: string[];
}) {
  return apiFetch<ApiBook>('/admin/books', { method: 'POST', json: payload });
}

export function updateBook(id: string, payload: Partial<ApiBook> & {
  status?: BookStatus;
  aiAvailability?: AiAvailability;
  categoryIds?: string[];
  tagIds?: string[];
}) {
  return apiFetch<ApiBook>(`/admin/books/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    json: payload,
  });
}

export function duplicateBook(id: string) {
  return apiFetch<ApiBook>(`/admin/books/${encodeURIComponent(id)}/duplicate`, {
    method: 'POST',
  });
}

export function deleteBook(id: string) {
  return apiFetch<void>(`/admin/books/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export function getAdminBooks(params: GetBooksParams = {}) {
  return apiFetch<BooksListResponse>(
    `/admin/books${toQuery({ ...params, limit: params.limit ?? 100 })}`,
  );
}

export function getAuthors(params: Record<string, string | number> = {}) {
  return apiFetch<ListResponse<ApiAuthor>>(`/admin/authors${toQuery(params)}`);
}

export function getAuthor(id: string) {
  return apiFetch<ApiAuthor>(`/admin/authors/${encodeURIComponent(id)}`);
}

export function createAuthor(payload: Partial<ApiAuthor> & { fullName: string }) {
  return apiFetch<ApiAuthor>('/admin/authors', { method: 'POST', json: payload });
}

export function updateAuthor(id: string, payload: Partial<ApiAuthor>) {
  return apiFetch<ApiAuthor>(`/admin/authors/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    json: payload,
  });
}

export function deleteAuthor(id: string) {
  return apiFetch<void>(`/admin/authors/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export function getCategories(params: Record<string, string | number> = {}) {
  return apiFetch<ListResponse<ApiCategory>>(`/admin/categories${toQuery(params)}`);
}

export function getCategory(id: string) {
  return apiFetch<ApiCategory>(`/admin/categories/${encodeURIComponent(id)}`);
}

export function createCategory(payload: Partial<ApiCategory> & { title: string }) {
  return apiFetch<ApiCategory>('/admin/categories', { method: 'POST', json: payload });
}

export function updateCategory(id: string, payload: Partial<ApiCategory>) {
  return apiFetch<ApiCategory>(`/admin/categories/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    json: payload,
  });
}

export function deleteCategory(id: string) {
  return apiFetch<void>(`/admin/categories/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export function getTags(params: Record<string, string | number> = {}) {
  return apiFetch<ListResponse<ApiTag>>(`/admin/tags${toQuery(params)}`);
}

export function getTag(id: string) {
  return apiFetch<ApiTag>(`/admin/tags/${encodeURIComponent(id)}`);
}

export function createTag(payload: Partial<ApiTag> & { title: string }) {
  return apiFetch<ApiTag>('/admin/tags', { method: 'POST', json: payload });
}

export function updateTag(id: string, payload: Partial<ApiTag>) {
  return apiFetch<ApiTag>(`/admin/tags/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    json: payload,
  });
}

export function deleteTag(id: string) {
  return apiFetch<void>(`/admin/tags/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export function getCollections(params: Record<string, string | number> = {}) {
  return apiFetch<ListResponse<ApiCollection>>(
    `/admin/collections${toQuery(params)}`,
  );
}

export function getCollection(id: string) {
  return apiFetch<ApiCollection>(`/admin/collections/${encodeURIComponent(id)}`);
}

export function createCollection(payload: Partial<ApiCollection> & { title: string }) {
  return apiFetch<ApiCollection>('/admin/collections', {
    method: 'POST',
    json: payload,
  });
}

export function updateCollection(id: string, payload: Partial<ApiCollection>) {
  return apiFetch<ApiCollection>(`/admin/collections/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    json: payload,
  });
}

export function deleteCollection(id: string) {
  return apiFetch<void>(`/admin/collections/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export function addCollectionBook(id: string, bookId: string, sortOrder?: number) {
  return apiFetch(`/admin/collections/${encodeURIComponent(id)}/books`, {
    method: 'POST',
    json: { bookId, sortOrder },
  });
}

export function reorderCollectionBooks(
  id: string,
  items: Array<{ bookId: string; sortOrder: number }>,
) {
  return apiFetch<ApiCollection>(
    `/admin/collections/${encodeURIComponent(id)}/books/reorder`,
    { method: 'PATCH', json: { items } },
  );
}

export function removeCollectionBook(id: string, bookId: string) {
  return apiFetch<void>(
    `/admin/collections/${encodeURIComponent(id)}/books/${encodeURIComponent(bookId)}`,
    { method: 'DELETE' },
  );
}

export function getHome() {
  return apiFetch<HomeResponse>('/home');
}
