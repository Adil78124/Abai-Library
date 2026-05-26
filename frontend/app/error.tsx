"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
        Ошибка
      </p>
      <h1 className="mt-3 text-2xl font-semibold text-black sm:text-3xl">
        Не удалось загрузить страницу
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">
        Попробуйте обновить страницу. Если backend временно недоступен, данные
        появятся после восстановления API.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Повторить
        </button>
        <Link
          href="/catalog"
          className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-gray-200"
        >
          Открыть каталог
        </Link>
      </div>
    </div>
  );
}
