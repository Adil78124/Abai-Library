"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Archive, Copy, Edit, Plus, Trash2 } from "lucide-react";
import { ApiError } from "@/lib/api";
import {
  deleteBook,
  duplicateBook,
  getAdminBooks,
  getCategories,
  updateBook,
} from "@/lib/admin-library-api";
import type { ApiBook, ApiCategory, AiAvailability, BookStatus } from "@/lib/books-api";

function formatError(err: unknown) {
  if (err instanceof ApiError) return err.message;
  return "Не удалось выполнить действие.";
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<ApiBook[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<BookStatus | "">("");
  const [aiAvailability, setAiAvailability] = useState<AiAvailability | "">("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [bookRes, categoryRes] = await Promise.all([
        getAdminBooks({
          q: q || undefined,
          status: status || undefined,
          aiAvailability: aiAvailability || undefined,
          categoryId: categoryId || undefined,
          page,
          limit: 20,
          sort: "newest",
        }),
        getCategories({ limit: 100 }),
      ]);
      setBooks(bookRes.items);
      setTotalPages(bookRes.totalPages);
      setCategories(categoryRes.items);
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  }, [aiAvailability, categoryId, page, q, status]);

  useEffect(() => {
    void load();
  }, [load]);

  const archiveBook = async (book: ApiBook) => {
    await updateBook(book.id, { status: book.status === "ARCHIVED" ? "DRAFT" : "ARCHIVED" });
    await load();
  };

  const copyBook = async (book: ApiBook) => {
    await duplicateBook(book.id);
    await load();
  };

  const removeBook = async (book: ApiBook) => {
    if (!window.confirm(`Архивировать книгу «${book.title}»?`)) return;
    await deleteBook(book.id);
    await load();
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">CMS</p>
          <h1 className="mt-2 text-2xl font-bold text-black">Книги</h1>
          <p className="mt-1 text-sm text-gray-600">Каталог, публикация, файлы и AI-статусы.</p>
        </div>
        <Link href="/admin/books/new" className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white">
          <Plus className="size-4" />
          Добавить книгу
        </Link>
      </div>

      <div className="mt-6 grid gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-5">
        <input className="rounded-lg border px-3 py-2 text-sm md:col-span-2" placeholder="Поиск по названию или автору" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        <select className="rounded-lg border px-3 py-2 text-sm" value={status} onChange={(e) => { setStatus(e.target.value as BookStatus | ""); setPage(1); }}>
          <option value="">Все статусы</option>
          <option value="DRAFT">Черновики</option>
          <option value="PUBLISHED">Опубликованные</option>
          <option value="ARCHIVED">Архив</option>
        </select>
        <select className="rounded-lg border px-3 py-2 text-sm" value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}>
          <option value="">Все категории</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.title}</option>
          ))}
        </select>
        <select className="rounded-lg border px-3 py-2 text-sm" value={aiAvailability} onChange={(e) => { setAiAvailability(e.target.value as AiAvailability | ""); setPage(1); }}>
          <option value="">Все AI-статусы</option>
          <option value="PROCESSING">Обработка</option>
          <option value="AVAILABLE">Доступен</option>
          <option value="UNAVAILABLE">Недоступен</option>
          <option value="FAILED">Ошибка</option>
        </select>
      </div>

      {error ? <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Книга</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3">Категории</th>
              <th className="px-4 py-3">AI</th>
              <th className="px-4 py-3">Файлы</th>
              <th className="px-4 py-3">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td className="px-4 py-8 text-gray-500" colSpan={6}>Загрузка книг...</td></tr>
            ) : books.length === 0 ? (
              <tr><td className="px-4 py-8 text-gray-500" colSpan={6}>Книги не найдены.</td></tr>
            ) : books.map((book) => (
              <tr key={book.id} className="align-top">
                <td className="px-4 py-4">
                  <div className="font-semibold text-black">{book.title}</div>
                  <div className="text-xs text-gray-500">{book.authorRecord?.fullName ?? book.author}</div>
                  <div className="mt-1 text-[11px] text-gray-400">{book.slug}</div>
                </td>
                <td className="px-4 py-4"><span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs">{book.status}</span></td>
                <td className="px-4 py-4 text-gray-600">{book.categories?.map((c) => c.title).join(", ") || "—"}</td>
                <td className="px-4 py-4"><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs text-amber-800">{book.aiAvailability}</span></td>
                <td className="px-4 py-4 text-gray-600">{book.file || book.pdfFile ? "PDF" : "—"} {book.image || book.coverImage ? " / обложка" : ""}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/books/${book.id}`} className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium"><Edit className="size-3.5" /> Редактировать</Link>
                    <button onClick={() => void copyBook(book)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium"><Copy className="size-3.5" /> Дублировать</button>
                    <button onClick={() => void archiveBook(book)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium"><Archive className="size-3.5" /> Архив</button>
                    <button onClick={() => void removeBook(book)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700"><Trash2 className="size-3.5" /> В архив</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <button className="rounded-lg border px-3 py-2 disabled:opacity-50" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Назад</button>
        <span className="text-gray-600">Страница {page} из {totalPages}</span>
        <button className="rounded-lg border px-3 py-2 disabled:opacity-50" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Вперед</button>
      </div>
    </div>
  );
}
