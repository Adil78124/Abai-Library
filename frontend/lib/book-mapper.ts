import type { AiAvailability, ApiBook } from './books-api';

export type UiBook = {
  id: string;
  slug: string;
  title: string;
  author: string;
  coverUrl: string;
  coverPlaceholder: boolean;
  rating: number;
  reviewsCount: number;
  genre: string;
  badge: 'available' | 'popular' | 'new';
  tags?: string[];
  language?: string;
  shortDescription?: string;
  about?: string;
  themes?: string[];
  context?: string;
  year?: number;
  pages?: number;
  publisher?: string;
  pdfPath?: string;
  backendId?: string;
  aiAvailability?: AiAvailability;
  fileUrl?: string | null;
  imageUrl?: string | null;
  status?: ApiBook['status'];
  fromApi?: boolean;
};

function resolveCoverUrl(api: ApiBook): string {
  if (api.imageUrl) return api.imageUrl;
  if (api.coverImage?.startsWith('http')) return api.coverImage;
  if (api.coverImage?.startsWith('/')) return api.coverImage;
  if (api.image?.startsWith('http')) return api.image;
  if (api.image?.startsWith('/')) return api.image;
  return '';
}

export function resolveReadPdfUrl(book: UiBook, slug: string): string | null {
  if (book.fileUrl) return book.fileUrl;
  if (book.pdfPath) return `/api/books/${encodeURIComponent(slug)}/pdf`;
  return null;
}

export function canReadBook(book: UiBook): boolean {
  return Boolean(book.fileUrl || book.pdfPath);
}

export function mapApiBookToUi(api: ApiBook): UiBook {
  const coverUrl = resolveCoverUrl(api);
  const fileValue = api.pdfFile ?? api.file;
  const legacyPdf =
    fileValue && !fileValue.startsWith('books/') && !fileValue.startsWith('http')
      ? fileValue
      : undefined;
  const tagTitles =
    api.tags?.length
      ? api.tags
      : api.tagRecords?.length
        ? api.tagRecords.map((tag) => tag.title)
        : api.genre
          ? [api.genre]
          : [];

  return {
    id: api.id,
    slug: api.slug,
    title: api.title,
    author: api.authorRecord?.fullName ?? api.author,
    coverUrl,
    coverPlaceholder: !coverUrl,
    rating: 4.8,
    reviewsCount: 0,
    genre: api.genre ?? api.categories?.[0]?.title ?? 'Книга',
    badge: 'available',
    tags: tagTitles,
    language: api.language ?? undefined,
    shortDescription: api.shortDescription ?? api.description ?? undefined,
    about: api.description ?? undefined,
    year: api.publishedYear ?? undefined,
    pages: api.pageCount ?? undefined,
    publisher: api.publisher ?? undefined,
    pdfPath: legacyPdf,
    backendId: api.id,
    aiAvailability: api.aiAvailability,
    fileUrl: api.fileUrl ?? null,
    imageUrl: api.imageUrl ?? null,
    status: api.status,
    fromApi: true,
  };
}

export function mapBookCardProps(book: UiBook) {
  return {
    id: book.id,
    slug: book.slug,
    title: book.title,
    author: book.author,
    coverUrl: book.coverUrl,
    imageUrl: book.coverUrl,
    genre: book.genre,
    rating: book.rating,
    badge: book.badge,
    coverPlaceholder: book.coverPlaceholder,
  };
}
