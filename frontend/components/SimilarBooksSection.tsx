import BookCard, { BookCardProps } from "./BookCard";

type SimilarBooksSectionProps = {
  title: string;
  books: BookCardProps[];
};

export default function SimilarBooksSection({
  title,
  books,
}: SimilarBooksSectionProps) {
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-black sm:text-lg">
          {title}
        </h2>
      </div>
      <div className="-mx-2 mt-3 overflow-x-auto pb-2">
        <div className="flex gap-3 px-2">
          {books.map((book) => (
            <div
              key={book.id}
              className="w-36 shrink-0 sm:w-40 md:w-44 lg:w-48"
            >
              <BookCard {...book} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

