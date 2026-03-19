import SearchBar from "@/components/SearchBar";
import BookCard from "@/components/BookCard";
import CategoryCard from "@/components/CategoryCard";
import BookGridSection from "@/components/BookGridSection";
import PromoBanner from "@/components/PromoBanner";
import {
  getCatalogDisplayOrder,
  getPopularForCatalog,
  getAbaiBooksForCatalog,
  getForeignClassicsForCatalog,
  getPoetryPhilosophyForCatalog,
} from "@/data/books";

const categories = [
  { title: "Книги Абая", description: "Стихи, слова назидания, поэмы", count: 7, href: "/catalog?cat=abai" },
  { title: "Зарубежная классика", description: "Английская литература", count: 5, href: "/catalog?cat=classic" },
  { title: "Поэзия и философия", description: "Стихи и философские произведения", count: 10, href: "/catalog?cat=poetry" },
  { title: "Все книги", description: "Полный каталог", count: 14, href: "/catalog?all=1" },
];

const popularBooks = getPopularForCatalog();
const abaiBooks = getAbaiBooksForCatalog();
const foreignClassics = getForeignClassicsForCatalog();
const poetryPhilosophy = getPoetryPhilosophyForCatalog();
const allBooksOrdered = getCatalogDisplayOrder();

export default function CatalogPage() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-black sm:text-3xl">Каталог</h1>
        <p className="mt-2 text-gray-600">
          Найдите книгу по названию, автору или категории
        </p>
        <div className="mt-6 max-w-xl">
          <SearchBar placeholder="Поиск по каталогу..." />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
            Все книги
          </button>
          <button className="rounded-full bg-gray-100 px-4 py-2 text-xs font-medium text-black hover:bg-gray-200">
            Популярные
          </button>
          <button className="rounded-full bg-gray-100 px-4 py-2 text-xs font-medium text-black hover:bg-gray-200">
            Новинки
          </button>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-black">Категории</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.title} {...cat} />
            ))}
          </div>
        </section>

        <BookGridSection
          id="popular"
          title="Популярные книги"
          subtitle="Самые читаемые книги каталога"
          viewAllHref="#all"
          books={popularBooks.map((b) => ({
            id: b.id,
            slug: b.slug,
            title: b.title,
            author: b.author,
            coverUrl: b.coverUrl,
            imageUrl: b.coverUrl,
            genre: b.genre,
            rating: b.rating,
            badge: b.badge,
            coverPlaceholder: b.coverPlaceholder,
          }))}
        />

        <PromoBanner
          title="Откройте классику Казахстана"
          subtitle="Произведения Абая и казахская литература — основа культурного наследия."
          ctaLabel="Смотреть подборку"
          ctaHref="/catalog?cat=abai"
          imageUrl=""
          tone="light"
          variant="classic"
        />

        <BookGridSection
          id="abai"
          title="Книги Абая"
          subtitle="Стихи, слова назидания, поэмы и переводы"
          viewAllHref="/catalog?cat=abai"
          books={abaiBooks.map((b) => ({
            id: b.id,
            slug: b.slug,
            title: b.title,
            author: b.author,
            coverUrl: b.coverUrl,
            imageUrl: b.coverUrl,
            genre: b.genre,
            rating: b.rating,
            badge: b.badge,
            coverPlaceholder: b.coverPlaceholder,
          }))}
        />

        <BookGridSection
          id="foreign"
          title="Зарубежная классика"
          subtitle="Английская литература"
          viewAllHref="/catalog?cat=classic"
          books={foreignClassics.map((b) => ({
            id: b.id,
            slug: b.slug,
            title: b.title,
            author: b.author,
            coverUrl: b.coverUrl,
            imageUrl: b.coverUrl,
            genre: b.genre,
            rating: b.rating,
            badge: b.badge,
            coverPlaceholder: b.coverPlaceholder,
          }))}
        />

        <BookGridSection
          id="poetry"
          title="Поэзия и философия"
          subtitle="Стихи и философские произведения"
          viewAllHref="/catalog?cat=poetry"
          books={poetryPhilosophy.map((b) => ({
            id: b.id,
            slug: b.slug,
            title: b.title,
            author: b.author,
            coverUrl: b.coverUrl,
            imageUrl: b.coverUrl,
            genre: b.genre,
            rating: b.rating,
            badge: b.badge,
            coverPlaceholder: b.coverPlaceholder,
          }))}
        />

        <BookGridSection
          id="all"
          title="Все книги"
          subtitle="Полный каталог Abai Library"
          books={allBooksOrdered.map((b) => ({
            id: b.id,
            slug: b.slug,
            title: b.title,
            author: b.author,
            coverUrl: b.coverUrl,
            imageUrl: b.coverUrl,
            genre: b.genre,
            rating: b.rating,
            badge: b.badge,
            coverPlaceholder: b.coverPlaceholder,
          }))}
        />
      </div>
    </>
  );
}
