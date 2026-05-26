import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
        404
      </p>
      <h1 className="mt-3 text-2xl font-semibold text-black sm:text-3xl">
        Страница не найдена
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">
        Возможно, ссылка устарела или книга была перемещена. Вернитесь в каталог
        и попробуйте найти нужное издание там.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/catalog"
          className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Открыть каталог
        </Link>
        <Link
          href="/"
          className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-gray-200"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
