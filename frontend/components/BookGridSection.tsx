import BookCard, { BookCardProps } from "./BookCard";

export type BookGridSectionProps = {
  id?: string;
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  books: (BookCardProps & { coverUrl?: string; genre?: string; rating?: number })[];
};

export default function BookGridSection({
  id,
  title,
  subtitle,
  viewAllHref,
  books,
}: BookGridSectionProps) {
  return (
    <section id={id} className="mt-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-black sm:text-xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <a
            href={viewAllHref}
            className="inline-flex items-center gap-1 text-xs font-medium text-gold hover:text-gold-hover"
          >
            Смотреть все
            <span aria-hidden>→</span>
          </a>
        )}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 lg:gap-5">
        {books.map((book) => {
          const imageUrl = book.imageUrl ?? book.coverUrl;
          return <BookCard key={book.id} {...book} imageUrl={imageUrl} />;
        })}
      </div>
    </section>
  );
}

