import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1.8fr)_minmax(0,1.6fr)]">
          {/* Бренд и краткое описание */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-black soft-ring">
              <span>Abai Library</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Электронная библиотека произведений Абая Кунанбаева и современной
              казахской литературы. Читайте, изучайте и открывайте новое.
            </p>
          </div>

          {/* Ресурсы */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-black">
                Ресурсы
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/catalog" className="text-gray-700 transition-colors hover:text-gold">
                    Все книги
                  </Link>
                </li>
                <li>
                  <Link href="/catalog?tab=authors" className="text-gray-700 transition-colors hover:text-gold">
                    Авторы
                  </Link>
                </li>
                <li>
                  <Link href="/catalog?tab=collections" className="text-gray-700 transition-colors hover:text-gold">
                    Коллекции
                  </Link>
                </li>
                <li>
                  <Link href="/catalog?tab=audio" className="text-gray-700 transition-colors hover:text-gold">
                    Аудиокниги
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-black">
                Поддержка
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/about" className="text-gray-700 transition-colors hover:text-gold">
                    О проекте
                  </Link>
                </li>
                <li>
                  <Link href="/assistant" className="text-gray-700 transition-colors hover:text-gold">
                    Помощь
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="text-gray-700 transition-colors hover:text-gold">
                    Контакты
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-700 transition-colors hover:text-gold">
                    API
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Подписка */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-black">
              Подписка
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Получайте подборки книг, новости проекта и новые коллекции один раз в
              неделю.
            </p>
            <form className="mt-4 space-y-2">
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="sr-only" htmlFor="newsletter-email">
                  Email
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-10 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm text-black placeholder:text-gray-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button
                  type="button"
                  className="h-10 shrink-0 rounded-lg bg-gold px-4 text-sm font-medium text-black hover:bg-gold-hover transition"
                >
                  Подписаться
                </button>
              </div>
              <p className="text-[11px] text-gray-500">
                Подписываясь, вы соглашаетесь получать письма от Abai Library.
              </p>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Abai Library. Все права защищены.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/about" className="text-gray-700 transition-colors hover:text-gold">
              Конфиденциальность
            </Link>
            <span className="hidden h-3 w-px bg-gray-200 sm:inline-block" />
            <Link href="/catalog" className="text-gray-700 transition-colors hover:text-gold">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
