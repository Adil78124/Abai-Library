type BookInfoSidebarProps = {
  author: string;
  genre: string;
  year: number;
  pages: number;
  language: string;
  publisher: string;
};

export default function BookInfoSidebar({
  author,
  genre,
  year,
  pages,
  language,
  publisher,
}: BookInfoSidebarProps) {
  return (
    <aside className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm fade-in sm:p-6">
      <h2 className="text-sm font-semibold text-black sm:text-base">
        Характеристики
      </h2>
      <dl className="mt-4 space-y-2 text-sm text-gray-600">
        <div className="flex justify-between gap-3">
          <dt>Автор</dt>
          <dd className="font-medium text-black">{author}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Жанр</dt>
          <dd className="font-medium text-black">{genre}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Год</dt>
          <dd className="font-medium text-black">{year}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Страниц</dt>
          <dd className="font-medium text-black">{pages}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Язык</dt>
          <dd className="font-medium text-black">{language}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Издательство</dt>
          <dd className="font-medium text-black">{publisher}</dd>
        </div>
      </dl>
    </aside>
  );
}

