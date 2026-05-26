import { apiFetch } from './api';
import {
  getAdminBooks,
  type AiAvailability,
  type ApiBook,
  type BookStatus,
} from './books-api';

export type UploadResponse = {
  book: ApiBook;
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

function bookPath(id: string, suffix: string) {
  return `/admin/books/${encodeURIComponent(id)}${suffix}`;
}

/** POST /api/books/:id/upload/pdf (multipart field: file) */
export async function uploadBookPdf(
  bookId: string,
  file: File,
): Promise<UploadResponse> {
  const form = new FormData();
  form.append('file', file);
  return apiFetch<UploadResponse>(bookPath(bookId, '/upload/pdf'), {
    method: 'POST',
    body: form,
  });
}

/** POST /api/books/:id/upload/image (multipart field: file) */
export async function uploadBookImage(
  bookId: string,
  file: File,
): Promise<UploadResponse> {
  const form = new FormData();
  form.append('file', file);
  return apiFetch<UploadResponse>(bookPath(bookId, '/upload/image'), {
    method: 'POST',
    body: form,
  });
}

/** DELETE /api/books/:id/pdf */
export async function deleteBookPdf(bookId: string): Promise<ApiBook> {
  return apiFetch<ApiBook>(bookPath(bookId, '/pdf'), { method: 'DELETE' });
}

/** DELETE /api/books/:id/image */
export async function deleteBookImage(bookId: string): Promise<ApiBook> {
  return apiFetch<ApiBook>(bookPath(bookId, '/image'), { method: 'DELETE' });
}

/** POST /api/books/:id/end_upload — для будущей интеграции N8N */
export async function endBookUpload(
  bookId: string,
  success: boolean,
): Promise<ApiBook> {
  return apiFetch<ApiBook>(bookPath(bookId, '/end_upload'), {
    method: 'POST',
    json: { success },
  });
}

export type { BookStatus };
export { getAdminBooks };
