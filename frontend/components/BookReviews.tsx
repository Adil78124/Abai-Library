import BookReviewCard from "./BookReviewCard";

export type ReviewItem = {
  name: string;
  rating: number;
  date: string;
  text: string;
};

type BookReviewsProps = {
  reviews?: ReviewItem[];
};

const defaultReviews: ReviewItem[] = [
  { name: "Читатель", rating: 4.5, date: "недавно", text: "Интересное произведение. Рекомендую к прочтению." },
];

export default function BookReviews({ reviews = defaultReviews }: BookReviewsProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm fade-in sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-black sm:text-xl">
          Отзывы читателей
        </h2>
        <button className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-medium text-black hover:bg-gray-200">
          Написать отзыв
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {reviews.map((r) => (
          <BookReviewCard key={`${r.name}-${r.date}`} {...r} />
        ))}
      </div>
    </section>
  );
}

