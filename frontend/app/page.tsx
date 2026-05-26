import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import BookCard from "@/components/BookCard";
import { mapBookCardProps } from "@/lib/book-mapper";
import { loadHomeCollections } from "@/lib/books-loader";

export default async function HomePage() {
  const home = await loadHomeCollections().catch(() => ({ collections: [] }));
  const collections = home.collections.filter((collection) => collection.books.length > 0);
  const featuredBooks = collections.flatMap((collection) => collection.books);
  const abaiCount = featuredBooks.filter(
    (book) => book.slug.includes("abai") || book.author.toLowerCase().includes("abai"),
  ).length;

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
              Электронная библиотека с редакционными подборками
            </h1>
            <p className="mt-4 text-sm text-gray-600 sm:text-base">
              Главная страница, каталог и витрины управляются через backend и CMS-админку.
            </p>
            <div className="mt-6 max-w-md">
              <SearchBar
                placeholder="Поиск по книгам и авторам..."
                redirectToCatalog
              />
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
                className="rounded-xl bg-gray-100 px-6 py-3 text-sm font-medium text-black hover:bg-gray-200"
              >
                AI помощник
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="grid grid-cols-3 gap-3 text-center text-[11px] text-gray-500">
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-2 py-3">
                  <div className="text-base font-semibold text-black">{featuredBooks.length}</div>
                  <div>книг на главной</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-2 py-3">
                  <div className="text-base font-semibold text-black">{collections.length}</div>
                  <div>подборок</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-2 py-3">
                  <div className="text-base font-semibold text-black">{abaiCount}</div>
                  <div>книг Абая</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Чтобы изменить витрину, создайте или отредактируйте подборку в разделе
                {" "}
                <Link href="/admin/collections" className="font-medium text-gold hover:underline">
                  CMS подборок
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {collections.length === 0 ? (
          <section className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-black">Главная витрина пока пуста</h2>
            <p className="mt-2 text-sm text-gray-600">
              Активные подборки с placement HOME появятся здесь автоматически.
            </p>
          </section>
        ) : (
          <div className="space-y-12">
            {collections.map((collection) => (
              <section key={collection.slug}>
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-black sm:text-2xl">
                      {collection.title}
                    </h2>
                    {collection.description ? (
                      <p className="mt-1 text-sm text-gray-600">
                        {collection.description}
                      </p>
                    ) : null}
                  </div>
                  <Link
                    href={`/catalog?collection=${collection.slug}`}
                    className="text-sm font-medium text-gold hover:text-gold-hover"
                  >
                    Открыть подборку
                  </Link>
                </div>
                <div className="-mx-4 overflow-x-auto pb-4">
                  <div className="flex gap-4 px-4">
                    {collection.books.slice(0, 12).map((book) => (
                      <div
                        key={`${collection.slug}-${book.slug}`}
                        className="w-[180px] shrink-0 sm:w-[200px] lg:w-[220px]"
                      >
                        <BookCard {...mapBookCardProps(book)} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
