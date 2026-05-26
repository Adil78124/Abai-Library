import Link from "next/link";

export type CategoryCardProps = {
  title: string;
  description?: string;
  count?: number;
  href?: string;
  className?: string;
};

export default function CategoryCard({
  title,
  description,
  count,
  href = "#",
  className = "",
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className={[
        "block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:border-gray-300",
        className,
      ].join(" ")}
    >
      <h3 className="font-semibold text-black">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      )}
      {count != null && (
        <p className="mt-2 text-sm text-gold font-medium">{count} книг</p>
      )}
    </Link>
  );
}
