"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addCollectionBook,
  createCollection,
  getAdminBooks,
  getCollection,
  removeCollectionBook,
  reorderCollectionBooks,
  updateCollection,
  type ApiCollection,
  type AutomaticCollectionKind,
  type CollectionPlacement,
  type CollectionType,
} from "@/lib/admin-library-api";
import type { ApiBook } from "@/lib/books-api";

type Form = {
  title: string;
  slug: string;
  description: string;
  placement: CollectionPlacement;
  type: CollectionType;
  automaticKind: AutomaticCollectionKind | "";
  isActive: boolean;
  startsAt: string;
  endsAt: string;
  sortOrder: string;
};

const emptyForm: Form = {
  title: "",
  slug: "",
  description: "",
  placement: "HOME",
  type: "MANUAL",
  automaticKind: "",
  isActive: true,
  startsAt: "",
  endsAt: "",
  sortOrder: "0",
};

function toDateInput(value?: string | null) {
  return value ? value.slice(0, 16) : "";
}

export default function CollectionEditor({ id }: { id?: string }) {
  const router = useRouter();
  const [collection, setCollection] = useState<ApiCollection | null>(null);
  const [books, setBooks] = useState<ApiBook[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<Form>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const bookRes = await getAdminBooks({ limit: 100, q: query || undefined });
    setBooks(bookRes.items);
    if (id) {
      const item = await getCollection(id);
      setCollection(item);
      setForm({
        title: item.title,
        slug: item.slug,
        description: item.description ?? "",
        placement: item.placement,
        type: item.type,
        automaticKind: item.automaticKind ?? "",
        isActive: item.isActive,
        startsAt: toDateInput(item.startsAt),
        endsAt: toDateInput(item.endsAt),
        sortOrder: String(item.sortOrder),
      });
    }
  };

  useEffect(() => {
    void load().catch(() => setError("Не удалось загрузить подборку."));
  }, [id]);

  const selectedBookIds = useMemo(
    () => new Set(collection?.books?.map((item) => item.bookId) ?? []),
    [collection],
  );

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const payload = {
        title: form.title,
        slug: form.slug || undefined,
        description: form.description || undefined,
        placement: form.placement,
        type: form.type,
        automaticKind: form.automaticKind || undefined,
        isActive: form.isActive,
        startsAt: form.startsAt || undefined,
        endsAt: form.endsAt || undefined,
        sortOrder: Number(form.sortOrder || 0),
      };
      const saved = id ? await updateCollection(id, payload) : await createCollection(payload);
      router.push(`/admin/collections/${saved.id}`);
      router.refresh();
    } catch {
      setError("Не удалось сохранить подборку.");
    }
  };

  const addBook = async (bookId: string) => {
    if (!id) return;
    await addCollectionBook(id, bookId);
    setCollection(await getCollection(id));
  };

  const removeBook = async (bookId: string) => {
    if (!id) return;
    await removeCollectionBook(id, bookId);
    setCollection(await getCollection(id));
  };

  const reorder = async () => {
    if (!id || !collection?.books) return;
    const items = collection.books.map((item) => ({
      bookId: item.bookId,
      sortOrder: item.sortOrder,
    }));
    setCollection(await reorderCollectionBooks(id, items));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <form onSubmit={save} className="rounded-lg border bg-white p-5 shadow-sm">
        {error ? <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="rounded-lg border px-3 py-2" placeholder="Название" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="rounded-lg border px-3 py-2" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <select className="rounded-lg border px-3 py-2" value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value as CollectionPlacement })}>
            <option value="HOME">Главная</option>
            <option value="CATALOG">Каталог</option>
            <option value="BOOK_PAGE">Страница книги</option>
          </select>
          <select className="rounded-lg border px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as CollectionType })}>
            <option value="MANUAL">Ручная</option>
            <option value="AUTOMATIC">Автоматическая</option>
          </select>
          <select className="rounded-lg border px-3 py-2" value={form.automaticKind} onChange={(e) => setForm({ ...form, automaticKind: e.target.value as AutomaticCollectionKind | "" })}>
            <option value="">Без автоматической логики</option>
            <option value="NEW_BOOKS">Новые книги</option>
            <option value="POPULAR">Популярные</option>
            <option value="AI_READY">AI доступен</option>
            <option value="RECENTLY_UPDATED">Недавно обновленные</option>
          </select>
          <input className="rounded-lg border px-3 py-2" placeholder="Порядок" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
          <input className="rounded-lg border px-3 py-2" type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} />
          <input className="rounded-lg border px-3 py-2" type="datetime-local" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} />
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Активна</label>
          <textarea className="min-h-28 rounded-lg border px-3 py-2 sm:col-span-2" placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="mt-6 flex gap-2">
          <button className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white">Сохранить</button>
          <Link href="/admin/collections" className="rounded-lg border px-4 py-2 text-sm font-medium">Назад</Link>
        </div>
      </form>

      <section className="rounded-lg border bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-black">Книги в подборке</h2>
        {!id ? (
          <p className="mt-3 text-sm text-gray-500">Сначала сохраните подборку.</p>
        ) : (
          <>
            <div className="mt-4 space-y-2">
              {collection?.books?.map((item, index) => (
                <div key={item.bookId} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                  <input className="w-16 rounded border px-2 py-1" value={item.sortOrder} onChange={(e) => {
                    const next = [...(collection.books ?? [])];
                    next[index] = { ...item, sortOrder: Number(e.target.value || 0) };
                    setCollection({ ...collection, books: next });
                  }} />
                  <span className="min-w-0 flex-1 truncate">{item.book.title}</span>
                  <button type="button" className="text-red-700" onClick={() => void removeBook(item.bookId)}>Удалить</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => void reorder()} className="mt-3 rounded-lg border px-3 py-2 text-sm">Сохранить порядок</button>

            <div className="mt-6">
              <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Поиск книг" value={query} onChange={(e) => setQuery(e.target.value)} />
              <button type="button" className="mt-2 rounded-lg border px-3 py-2 text-sm" onClick={() => void load()}>Найти</button>
              <div className="mt-3 max-h-72 space-y-2 overflow-auto">
                {books.filter((book) => !selectedBookIds.has(book.id)).map((book) => (
                  <button key={book.id} type="button" onClick={() => void addBook(book.id)} className="block w-full rounded-lg border px-3 py-2 text-left text-sm hover:bg-gray-50">
                    {book.title}
                    <span className="block text-xs text-gray-500">{book.author}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
