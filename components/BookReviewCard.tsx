type BookReviewCardProps = {
  avatarUrl?: string;
  name: string;
  rating: number;
  text: string;
  date: string;
};

export default function BookReviewCard({
  avatarUrl,
  name,
  rating,
  text,
  date,
}: BookReviewCardProps) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-xs font-semibold text-black">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              name.slice(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-black">{name}</p>
            <p className="text-[11px] text-gray-500">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-gold">
          ★ {rating.toFixed(1)}
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">{text}</p>
      <button className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-black">
        ❤
        <span>Мне полезен этот отзыв</span>
      </button>
    </article>
  );
}

