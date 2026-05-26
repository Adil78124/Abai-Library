import Image from "next/image";
import BookCoverPlaceholder from "./BookCoverPlaceholder";

export type BookHeroProps = {
  coverUrl: string;
  title: string;
  author: string;
  rating: number;
  reviewsCount: number;
  tags: string[];
  description: string;
  slug?: string;
  pdfPath?: string;
  /** Есть PDF для чтения через backend/MinIO */
  canRead?: boolean;
  /** Показывать обложку-плейсхолдер (фон + название + автор) вместо картинки */
  coverPlaceholder?: boolean;
};

export default function BookHero({
  coverUrl,
  title,
  author,
  rating,
  reviewsCount,
  tags,
  description,
  slug = "",
  pdfPath,
  canRead,
  coverPlaceholder,
}: BookHeroProps) {
  const readable = canRead ?? Boolean(pdfPath);
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm fade-in sm:p-8 lg:grid lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-8">
      <div className="flex flex-col items-center gap-4 sm:flex-row lg:flex-col lg:items-stretch">
        <div className="relative h-64 w-40 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 sm:h-72 sm:w-48 lg:h-80">
          {coverPlaceholder ? (
            <BookCoverPlaceholder title={title} author={author} size="normal" className="absolute inset-0 h-full w-full" />
          ) : (
            <Image
              src={coverUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="192px"
            />
          )}
        </div>
        <div className="flex w-full justify-between gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-600 lg:flex-col lg:items-start">
          <div>
            <p className="font-semibold text-black">Рейтинг</p>
            <p className="mt-1 flex items-center gap-1 text-sm font-medium text-gold">
              ★ {rating.toFixed(1)}
              <span className="text-[11px] text-gray-500">
                · {reviewsCount} отзывов
              </span>
            </p>
          </div>
          <div className="hidden h-10 w-px bg-gray-200 lg:block" />
          <div>
            <p className="font-semibold text-black">Формат</p>
            <p className="mt-1 text-sm text-gray-600">Электронная книга · Аудио</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:mt-0">
        <div>
          <h1 className="text-2xl font-semibold text-black sm:text-3xl lg:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-600 sm:text-base">
            {author}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
          {description}
        </p>

        <div className="mt-2 flex flex-wrap gap-3">
          {readable ? (
            <a
              href={`/book/${slug}/read`}
              className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 transition"
            >
              Читать книгу
            </a>
          ) : (
            <button className="rounded-xl bg-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-500 cursor-not-allowed">
              Читать книгу (скоро)
            </button>
          )}
          <button className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-medium text-black hover:bg-gray-200 transition">
            Добавить в библиотеку
          </button>
          <button className="rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-black hover:bg-gray-200 transition">
            Поделиться
          </button>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-gray-600">
          <button className="rounded-full border border-gray-200 bg-white px-4 py-1.5 hover:bg-gray-50 transition">
            Слушать аудио
          </button>
          <button className="rounded-full border border-gray-200 bg-white px-4 py-1.5 hover:bg-gray-50 transition">
            Добавить в избранное
          </button>
        </div>
      </div>
    </section>
  );
}

