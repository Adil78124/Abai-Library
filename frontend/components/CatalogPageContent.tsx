"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import SearchBar from "@/components/SearchBar";
import BookCard from "@/components/BookCard";
import BookGridSection from "@/components/BookGridSection";
import CategoryCard from "@/components/CategoryCard";
import PromoBanner from "@/components/PromoBanner";
import { mapBookCardProps } from "@/lib/book-mapper";
import {
  loadBooks,
  loadCatalogSections,
  type BooksLoadSource,
} from "@/lib/books-loader";
import type { UiBook } from "@/lib/book-mapper";

type CatalogFilter = "all" | "popular" | "new";

type CatalogSections = {
  popular: UiBook[];
  abai: UiBook[];
  foreign: UiBook[];
  poetry: UiBook[];
  all: UiBook[];
};

export default function CatalogPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get("q") ?? "",
  );
  const [loading, setLoading] = useState(true);
  const [, setSource] = useState<BooksLoadSource>("api");
  const [error, setError] = useState<string | null>(null);
  const [filteredBooks, setFilteredBooks] = useState<UiBook[]>([]);
  const [sections, setSections] = useState<CatalogSections | null>(null);

  const cat = searchParams.get("cat");
  const collection = searchParams.get("collection");
  const all = searchParams.get("all") === "1";
  const filter = (searchParams.get("filter") as CatalogFilter | null) ?? "all";
  const q = searchParams.get("q") ?? "";

  const showFullLayout = !cat && !collection && !all && !q && filter === "all";

  const setParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    }
    const qs = params.toString();
    router.push(qs ? `/catalog?${qs}` : "/catalog");
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      if (showFullLayout) {
        const sec = await loadCatalogSections().catch(() => null);
        if (!sec) {
          if (!cancelled) {
            setError("Каталог временно недоступен.");
            setLoading(false);
          }
          return;
        }
        if (!cancelled) {
          setSections(sec);
          setSource(sec.source);
          setFilteredBooks(sec.all);
          setLoading(false);
        }
        return;
      }

      const result = await loadBooks({
        q: q || undefined,
        cat,
        collection,
        filter,
        limit: 100,
      }).catch(() => null);
      if (!result) {
        if (!cancelled) {
          setError("Каталог временно недоступен.");
          setLoading(false);
        }
        return;
      }
      if (!cancelled) {
        setFilteredBooks(result.books);
        setSource(result.source);
        setSections(null);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [showFullLayout, q, cat, collection, filter]);

  const categoryTitle = useMemo(() => {
    if (cat === "abai") return "Книги Абая";
    if (cat === "classic") return "Зарубежная классика";
    if (cat === "poetry") return "Поэзия и философия";
    if (all) return "Все книги";
    if (filter === "popular") return "Популярные книги";
    if (filter === "new") return "Новинки";
    if (collection) return "Подборка";
    if (q) return "Результаты поиска";
    return null;
  }, [cat, all, filter, collection, q]);

  const categories = [
    {
      title: "Книги Абая",
      description: "Стихи, слова назидания, поэмы",
      count: sections?.abai.length ?? 7,
      href: "/catalog?cat=abai",
    },
    {
      title: "Зарубежная классика",
      description: "Английская литература",
      count: sections?.foreign.length ?? 5,
      href: "/catalog?cat=classic",
    },
    {
      title: "Поэзия и философия",
      description: "Стихи и философские произведения",
      count: sections?.poetry.length ?? 10,
      href: "/catalog?cat=poetry",
    },
    {
      title: "Все книги",
      description: "Полный каталог",
      count: sections?.all.length ?? filteredBooks.length,
      href: "/catalog?all=1",
    },
  ];

  const filterButtonClass = (active: boolean) =>
    [
      "rounded-full px-4 py-2 text-xs font-medium transition",
      active
        ? "border border-gray-200 bg-white text-black shadow-sm"
        : "bg-gray-100 text-black hover:bg-gray-200",
    ].join(" ");

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setParams({ q: value.trim() || null });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-gray-500">Загрузка каталога…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  const popularBooks = sections?.popular ?? filteredBooks.slice(0, 6);
  const abaiBooks = sections?.abai ?? [];
  const foreignClassics = sections?.foreign ?? [];
  const poetryPhilosophy = sections?.poetry ?? [];
  const allBooksOrdered = sections?.all ?? filteredBooks;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-black sm:text-3xl">Каталог</h1>
      <p className="mt-2 text-gray-600">
        Найдите книгу по названию, автору или категории
      </p>
      <div className="mt-6 max-w-xl">
        <SearchBar
          placeholder="Поиск по каталогу..."
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearch}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={filterButtonClass(filter === "all" && !cat && !collection && !all)}
          onClick={() => setParams({ filter: null, cat: null, collection: null, all: null })}
        >
          Все книги
        </button>
        <button
          type="button"
          className={filterButtonClass(filter === "popular")}
          onClick={() =>
            setParams({ filter: "popular", cat: null, collection: null, all: null })
          }
        >
          Популярные
        </button>
        <button
          type="button"
          className={filterButtonClass(filter === "new")}
          onClick={() => setParams({ filter: "new", cat: null, collection: null, all: null })}
        >
          Новинки
        </button>
      </div>

      {showFullLayout ? (
        <>
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-black">Категории</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((c) => (
                <CategoryCard key={c.title} {...c} />
              ))}
            </div>
          </section>

          <BookGridSection
            id="popular"
            title="Популярные книги"
            subtitle="Самые читаемые книги каталога"
            viewAllHref="/catalog?filter=popular"
            books={popularBooks.map(mapBookCardProps)}
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
            books={abaiBooks.map(mapBookCardProps)}
          />

          <BookGridSection
            id="foreign"
            title="Зарубежная классика"
            subtitle="Английская литература"
            viewAllHref="/catalog?cat=classic"
            books={foreignClassics.map(mapBookCardProps)}
          />

          <BookGridSection
            id="poetry"
            title="Поэзия и философия"
            subtitle="Стихи и философские произведения"
            viewAllHref="/catalog?cat=poetry"
            books={poetryPhilosophy.map(mapBookCardProps)}
          />

          <BookGridSection
            id="all"
            title="Все книги"
            subtitle="Полный каталог Abai Library"
            books={allBooksOrdered.map(mapBookCardProps)}
          />
        </>
      ) : (
        <section className="mt-10" id={all ? "all" : undefined}>
          <h2 className="text-lg font-semibold text-black">
            {categoryTitle ?? "Каталог"}
          </h2>
          {q ? (
            <p className="mt-1 text-sm text-gray-600">
              По запросу «{q}» найдено: {filteredBooks.length}
            </p>
          ) : null}
          {filteredBooks.length === 0 ? (
            <p className="mt-6 text-sm text-gray-600">
              Ничего не найдено.{" "}
              <button
                type="button"
                className="font-medium text-gold hover:underline"
                onClick={() => {
                  setSearchInput("");
                  router.push("/catalog");
                }}
              >
                Сбросить фильтры
              </button>
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filteredBooks.map((b) => (
                <BookCard key={b.slug} {...mapBookCardProps(b)} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
