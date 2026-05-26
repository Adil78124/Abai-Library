import { notFound } from "next/navigation";
import BookHero from "@/components/BookHero";
import BookAIChat from "@/components/BookAIChat";
import BookDescription from "@/components/BookDescription";
import BookReviews from "@/components/BookReviews";
import BookComments from "@/components/BookComments";
import BookInfoSidebar from "@/components/BookInfoSidebar";
import SimilarBooksSection from "@/components/SimilarBooksSection";
import { getBookPageContent } from "@/data/bookPageContent";
import { canReadBook, mapBookCardProps } from "@/lib/book-mapper";
import {
  getStaticBooksForSimilar,
  loadBookBySlug,
  loadPublishedBooks,
} from "@/lib/books-loader";

type PageProps = {
  params: { slug: string };
};

export default async function BookDetailPage({ params }: PageProps) {
  const loaded = await loadBookBySlug(params.slug);

  if (!loaded) {
    notFound();
  }

  const { book, apiBook } = loaded;
  const pageContent = getBookPageContent(book.slug);
  const showDescription =
    (book.about && book.themes && book.context) ||
    (pageContent.about && pageContent.context);

  const list = await loadPublishedBooks(20).catch(() => ({ books: getStaticBooksForSimilar() }));
  const similar = list.books
    .filter((b) => b.slug !== book.slug)
    .slice(0, 4)
    .map(mapBookCardProps);

  const recommended = similar.map((b, i) => ({
    ...b,
    id: `${b.id}-rec-${i}`,
    genre: "Рекомендуем",
  }));

  const chatBookId = apiBook.id;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <BookHero
        coverUrl={book.coverUrl}
        title={book.title}
        author={book.author}
        rating={book.rating}
        reviewsCount={book.reviewsCount ?? 0}
        tags={book.tags ?? [book.genre]}
        description={
          book.shortDescription ??
          "Описание книги будет доступно позднее. Сейчас вы можете начать чтение или добавить её в библиотеку."
        }
        slug={book.slug}
        canRead={canReadBook(book)}
        coverPlaceholder={book.coverPlaceholder}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,0.9fr)]">
        <div className="space-y-6">
          <BookAIChat
            bookId={chatBookId}
            aiAvailability={book.aiAvailability}
            isLegacyDemo={!book.fromApi}
            exampleQuestion={pageContent.aiExampleQuestion}
            exampleResponse={pageContent.aiExampleResponse}
          />
          {showDescription ? (
            <BookDescription
              about={book.about ?? pageContent.about ?? ""}
              themes={book.themes ?? pageContent.aiThemes}
              context={book.context ?? pageContent.context ?? ""}
            />
          ) : null}

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm fade-in sm:p-7">
            <h2 className="text-lg font-semibold text-black sm:text-xl">
              Цитаты из книги
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Любимые цитаты читателей
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <figure className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-black shadow-sm">
                <blockquote>“{pageContent.quotes[0]}”</blockquote>
              </figure>
              <figure className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-black shadow-sm">
                <blockquote>“{pageContent.quotes[1]}”</blockquote>
              </figure>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm fade-in sm:p-7">
            <h2 className="text-lg font-semibold text-black sm:text-xl">
              ИИ‑анализ книги
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Краткий обзор основных тем, философии произведения и похожих книг.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold text-black">
                  Основные темы
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  {pageContent.aiThemes.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-black">
                  Философия книги
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {pageContent.aiPhilosophy}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-black">
                  Похожие произведения
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-gold">
                  {pageContent.aiSimilarWorks.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <BookReviews reviews={pageContent.reviews} />
          <BookComments bookSlug={book.slug} />
        </div>

        <div className="space-y-6">
          <BookInfoSidebar
            author={book.author}
            genre={book.genre}
            year={book.year ?? 0}
            pages={book.pages ?? 0}
            language={book.language ?? "—"}
            publisher={book.publisher ?? "—"}
          />
          <SimilarBooksSection title="Похожие книги" books={similar} />
          <SimilarBooksSection
            title="Вам может понравиться"
            books={recommended}
          />
        </div>
      </div>
    </div>
  );
}
