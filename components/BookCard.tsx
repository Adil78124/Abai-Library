import Image from "next/image";
import Link from "next/link";
import BookCoverPlaceholder from "./BookCoverPlaceholder";

export type BookCardProps = {
  id: string;
  title: string;
  author?: string;
  imageUrl?: string;
  badge?: "available" | "popular" | "new";
  href?: string;
  slug?: string;
  genre?: string;
  rating?: number;
  /** Показывать обложку-плейсхолдер (фон + название + автор) вместо картинки */
  coverPlaceholder?: boolean;
};

const badgeStyles = {
  available: "bg-success text-white",
  popular: "bg-navy/80 text-white",
  new: "bg-gold text-black",
};

export default function BookCard({
  id,
  title,
  author,
  imageUrl,
  badge,
  href,
  slug,
  genre,
  rating,
  coverPlaceholder,
}: BookCardProps) {
  const linkHref = href ?? (slug ? `/book/${slug}` : "#");

  return (
    <Link
      href={linkHref}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:border-gray-300"
    >
      <div className="relative aspect-[230/307] w-full overflow-hidden bg-gray-100">
        {coverPlaceholder ? (
          <BookCoverPlaceholder title={title} author={author ?? ""} size="compact" className="h-full w-full" />
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 230px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500 text-sm">
            Обложка
          </div>
        )}
        {badge && (
          <span
            className={[
              "absolute left-3 top-3 rounded-badge px-2 py-0.5 text-xs font-medium",
              badgeStyles[badge],
            ].join(" ")}
          >
            {badge === "available" && "Доступна"}
            {badge === "popular" && "Популярная"}
            {badge === "new" && "Новая"}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wide text-gray-500">
          <span className="truncate">{genre}</span>
          {rating != null && (
            <span className="ml-2 flex items-center gap-0.5">
              <span className="text-gold">★</span>
              <span>{rating.toFixed(1)}</span>
            </span>
          )}
        </div>
        <h3 className={`mt-1 line-clamp-2 text-black group-hover:text-black ${coverPlaceholder ? "text-sm font-medium" : "font-medium"}`}>
          {title}
        </h3>
        {author && (
          <p className="text-xs text-gray-600">{author}</p>
        )}
      </div>
    </Link>
  );
}
