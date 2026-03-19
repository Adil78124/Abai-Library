import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import BookCard from "@/components/BookCard";
import { getPopularBooks } from "@/data/books";

const featuredBooks = getPopularBooks();

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden rounded-b-hero bg-white px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
        <div className="absolute inset-0 opacity-70">
          <div className="h-full w-full bg-gradient-to-br from-gold/10 to-transparent" />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col items-stretch gap-10 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Abai Library
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-5xl">
              Электронная библиотека Абая и казахской литературы
            </h1>
            <p className="mt-4 text-sm text-gray-600 sm:text-base">
              Читайте классические произведения, исследуйте каталоги и задавайте вопросы
              ИИ‑помощнику на одном экране.
            </p>
            <div className="mt-6 max-w-md">
              <SearchBar placeholder="Поиск по книгам и авторам..." />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-600 sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success" />
                <span>Онлайн‑доступ 24/7</span>
              </div>
              <div className="h-4 w-px bg-gray-200" />
              <span>Подборки, рекомендации и избранное</span>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/catalog"
                className="rounded-xl bg-gold px-6 py-3 text-sm font-medium text-black shadow-sm hover:bg-gold-hover"
              >
                Перейти в каталог
              </Link>
              <Link
                href="/assistant"
                className="rounded-xl bg-gray-100 px-6 py-3 text-sm font-medium text-black hover:bg-gray-200 "
              >
                ИИ помощник
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                  AL
                </div>
                <div>
                  <p className="text-xs font-medium text-black">ИИ помощник</p>
                  <p className="text-[11px] text-gray-600">
                    Отвечает на вопросы по книгам и каталогу
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-end">
                  <div className="max-w-[70%] rounded-xl bg-black px-3 py-2 text-white">
                    Покажи популярные книги Абая.
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-xl border border-gray-200 bg-white px-3 py-2 text-black shadow-sm">
                    Нашёл 14 книг. Начать с &laquo;Абайдың қара сөздері&raquo;?
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500">
                  <span>Напишите вопрос по каталогу...</span>
                  <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px]">
                    Enter
                  </span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center text-[11px] text-gray-500">
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-2 py-2">
                  <div className="text-base font-semibold text-black">14</div>
                  <div>книг</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-2 py-2">
                  <div className="text-base font-semibold text-black">7</div>
                  <div>произведения Абая</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-2 py-2">
                  <div className="text-base font-semibold text-black">AI</div>
                  <div>подборки</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-black">Популярные книги</h2>
          <div className="w-full sm:max-w-xs">
            <SearchBar placeholder="Поиск по каталогу..." />
          </div>
        </div>
        <div className="-mx-4 mt-4 overflow-x-auto pb-4">
          <div className="flex gap-4 px-4">
            {featuredBooks.slice(0, 6).map((book) => (
              <div
                key={book.slug}
                className="w-[180px] shrink-0 sm:w-[200px] lg:w-[220px]"
              >
                <BookCard
                  id={book.id}
                  slug={book.slug}
                  title={book.title}
                  author={book.author}
                  badge={book.badge}
                  imageUrl={book.coverUrl}
                  genre={book.genre}
                  rating={book.rating}
                  coverPlaceholder={book.coverPlaceholder}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/catalog"
            className="inline-flex items-center rounded-xl bg-gray-100 px-6 py-3 text-sm font-medium text-black hover:bg-gray-200"
          >
            Смотреть весь каталог
          </Link>
        </div>
      </section>

      {/* Рекомендуем для вас */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-black sm:text-2xl">
              Рекомендуем для вас
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Подборка книг из каталога
            </p>
          </div>
          <Link
            href="/catalog"
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-gold hover:text-gold-hover"
          >
            Весь каталог
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {featuredBooks.slice(0, 2).map((book) => (
            <Link
              key={book.slug}
              href={`/book/${book.slug}`}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:flex-row"
            >
              <div className="relative h-40 w-full shrink-0 overflow-hidden sm:h-auto sm:w-48">
                {book.coverPlaceholder ? (
                  <div className="flex h-full w-full flex-col justify-end bg-[#1F2942] p-4 text-white">
                    <span className="text-sm font-semibold line-clamp-2">{book.title}</span>
                    <span className="mt-1 text-xs opacity-90">{book.author}</span>
                  </div>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-gold">
                    Рекомендация
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-black">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                    {book.shortDescription}
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold">
                  Читать сейчас
                  <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Новинки */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-black sm:text-2xl">
            Новинки
          </h2>
          <button className="inline-flex items-center gap-1 text-sm font-medium text-gold hover:text-gold-hover">
            Все новинки
          </button>
        </div>
        <div className="-mx-4 mt-4 overflow-x-auto pb-4">
          <div className="flex gap-4 px-4">
            {featuredBooks.slice(0, 6).map((book) => (
              <div
                key={`new-${book.slug}`}
                className="w-[190px] shrink-0 sm:w-[210px] lg:w-[230px]"
              >
                <BookCard
                  id={book.id}
                  slug={book.slug}
                  title={book.title}
                  author={book.author}
                  badge={book.badge}
                  imageUrl={book.coverUrl}
                  genre={book.genre}
                  rating={book.rating}
                  coverPlaceholder={book.coverPlaceholder}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Тематические коллекции */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-black sm:text-2xl">
              Тематические коллекции
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Подборки по интересам и жанрам
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Классика", count: "14 книг" },
            { title: "Философия", count: "2 книги" },
            { title: "Поэзия", count: "10 книг" },
            { title: "Зарубежная литература", count: "5 книг" },
          ].map((col) => (
            <article
              key={col.title}
              className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Коллекция
                </p>
                <h3 className="mt-2 text-base font-semibold text-black">
                  {col.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-gold">
                  {col.count}
                </p>
              </div>
              <button className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-black">
                Открыть подборку
                <span aria-hidden>→</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Промо‑блок ИИ помощника на светлом фоне */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-3xl border border-gray-200 bg-gray-50 px-6 py-8 text-black shadow-sm sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-10">
          <div className="flex flex-col justify-center gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              ИИ помощник
            </p>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Задавайте вопросы — получайте ответы по каталогу
            </h2>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>Поиск книг по теме, автору, жанру и цитатам.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>Советы, с чего начать знакомство с Абаем.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>Подборки под ваше настроение и интересы.</span>
              </li>
            </ul>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/assistant"
                className="rounded-xl bg-black px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Открыть ИИ помощника
              </Link>
              <p className="text-xs text-gray-500">
                Без регистрации — для теста возможностей.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                  AL
                </div>
                <div>
                  <p className="text-xs font-medium text-black">ИИ помощник</p>
                  <p className="text-[11px] text-gray-600">
                    Онлайн‑чат по каталогу и книгам
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-end">
                  <div className="max-w-[75%] rounded-xl bg-black px-3 py-2 text-white">
                    Подбери книги для первого знакомства с Абаем.
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-xl border border-gray-200 bg-white px-3 py-2 text-black shadow-sm">
                    Я нашёл 5 произведений, с которых чаще всего начинают. Показать
                    список?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[70%] rounded-xl bg-black px-3 py-2 text-white">
                    Да, покажи и добавь в избранное.
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500">
                  <span>Напишите вопрос по каталогу...</span>
                  <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px]">
                    Enter
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
