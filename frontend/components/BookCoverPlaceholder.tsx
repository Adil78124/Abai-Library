type BookCoverPlaceholderProps = {
  title: string;
  author: string;
  className?: string;
  size?: "compact" | "normal";
};

const placeholderBgColors = [
  "bg-[#2c3e50]",   // синевато-серый
  "bg-[#1e3a5f]",   // глубокий синий
  "bg-[#2d4a3e]",   // тёмно-зелёный
  "bg-[#4a3d5c]",   // тёмно-сливовый
  "bg-[#3d3b4a]",   // серо-фиолетовый
  "bg-[#36454f]",   // тёмный slate
];

export default function BookCoverPlaceholder({
  title,
  author,
  className = "",
  size = "compact",
}: BookCoverPlaceholderProps) {
  const hash = (title + author).split("").reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
  const bgClass = placeholderBgColors[Math.abs(hash) % placeholderBgColors.length];
  const isNormal = size === "normal";

  return (
    <div
      className={`flex min-h-full flex-col items-center justify-center p-5 text-center text-white ${bgClass} ${className}`}
    >
      <h3
        className={`font-bold leading-snug text-white/95 ${isNormal ? "text-base sm:text-lg" : "text-[13px] sm:text-[15px]"} line-clamp-4`}
        style={{ wordBreak: "break-word" }}
      >
        {title}
      </h3>
      <p
        className={`mt-2 shrink-0 opacity-90 ${isNormal ? "text-xs sm:text-sm" : "text-[10px] sm:text-xs"} line-clamp-1`}
      >
        {author}
      </p>
    </div>
  );
}
