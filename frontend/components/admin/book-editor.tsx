"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { uploadBookImage, uploadBookPdf } from "@/lib/admin-books-api";
import {
  createBook,
  getAuthors,
  getCategories,
  getTags,
  updateBook,
} from "@/lib/admin-library-api";
import type { ApiAuthor, ApiBook, ApiCategory, ApiTag } from "@/lib/books-api";

type BookForm = {
  title: string;
  slug: string;
  authorId: string;
  author: string;
  description: string;
  shortDescription: string;
  language: string;
  ageLimit: string;
  isbn: string;
  publishedYear: string;
  publisher: string;
  pageCount: string;
  genre: string;
  status: ApiBook["status"];
  aiAvailability: ApiBook["aiAvailability"];
  categoryIds: string[];
  tagIds: string[];
};

const emptyForm: BookForm = {
  title: "",
  slug: "",
  authorId: "",
  author: "",
  description: "",
  shortDescription: "",
  language: "",
  ageLimit: "",
  isbn: "",
  publishedYear: "",
  publisher: "",
  pageCount: "",
  genre: "",
  status: "DRAFT",
  aiAvailability: "UNAVAILABLE",
  categoryIds: [],
  tagIds: [],
};

function formatError(error: unknown) {
  if (error instanceof ApiError) return error.message;
  return "Не удалось сохранить книгу. Проверьте поля и попробуйте еще раз.";
}

function numberOrUndefined(value: string) {
  if (!value.trim()) return undefined;
  return Number(value);
}

export default function BookEditor({ book }: { book?: ApiBook }) {
  const router = useRouter();
  const [form, setForm] = useState<BookForm>(() =>
    book
      ? {
          title: book.title,
          slug: book.slug,
          authorId: book.authorId ?? "",
          author: book.author,
          description: book.description ?? "",
          shortDescription: book.shortDescription ?? "",
          language: book.language ?? "",
          ageLimit: book.ageLimit?.toString() ?? "",
          isbn: book.isbn ?? "",
          publishedYear: book.publishedYear?.toString() ?? "",
          publisher: book.publisher ?? "",
          pageCount: book.pageCount?.toString() ?? "",
          genre: book.genre ?? "",
          status: book.status,
          aiAvailability: book.aiAvailability,
          categoryIds: book.categoryIds ?? [],
          tagIds: book.tagIds ?? [],
        }
      : emptyForm,
  );
  const [authors, setAuthors] = useState<ApiAuthor[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [tags, setTags] = useState<ApiTag[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([
      getAuthors({ limit: 100 }),
      getCategories({ limit: 100 }),
      getTags({ limit: 100 }),
    ]).then(([a, c, t]) => {
      setAuthors(a.items);
      setCategories(c.items);
      setTags(t.items);
    });
  }, []);

  const previewTags = useMemo(
    () =>
      tags
        .filter((tag) => form.tagIds.includes(tag.id))
        .map((tag) => tag.title)
        .join(", "),
    [form.tagIds, tags],
  );

  const setField = <K extends keyof BookForm>(key: K, value: BookForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggle = (key: "categoryIds" | "tagIds", id: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(id)
        ? prev[key].filter((item) => item !== id)
        : [...prev[key], id],
    }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError("Укажите название книги.");
      return;
    }
    if (!form.authorId && !form.author.trim()) {
      setError("Выберите автора или укажите имя автора.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || undefined,
        authorId: form.authorId || undefined,
        author: form.author.trim() || undefined,
        description: form.description.trim() || undefined,
        shortDescription: form.shortDescription.trim() || undefined,
        language: form.language.trim() || undefined,
        ageLimit: numberOrUndefined(form.ageLimit),
        isbn: form.isbn.trim() || undefined,
        publishedYear: numberOrUndefined(form.publishedYear),
        publisher: form.publisher.trim() || undefined,
        pageCount: numberOrUndefined(form.pageCount),
        genre: form.genre.trim() || undefined,
        status: form.status,
        aiAvailability: form.aiAvailability,
        categoryIds: form.categoryIds,
        tagIds: form.tagIds,
      };
      const saved = book
        ? await updateBook(book.id, payload)
        : await createBook(payload);
      if (coverFile) await uploadBookImage(saved.id, coverFile);
      if (pdfFile) await uploadBookPdf(saved.id, pdfFile);
      router.push(`/admin/books/${saved.id}`);
      router.refresh();
    } catch (err) {
      setError(formatError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_320px]">
      <div className="space-y-6">
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-black">Основные данные</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="text-sm font-medium text-gray-700">Название</span>
              <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.title} onChange={(e) => setField("title", e.target.value)} />
            </label>
            <label>
              <span className="text-sm font-medium text-gray-700">Slug</span>
              <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.slug} onChange={(e) => setField("slug", e.target.value)} />
            </label>
            <label>
              <span className="text-sm font-medium text-gray-700">Язык</span>
              <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.language} onChange={(e) => setField("language", e.target.value)} />
            </label>
            <label>
              <span className="text-sm font-medium text-gray-700">Автор</span>
              <select className="mt-1 w-full rounded-lg border px-3 py-2" value={form.authorId} onChange={(e) => setField("authorId", e.target.value)}>
                <option value="">Указать вручную</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>{author.fullName}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="text-sm font-medium text-gray-700">Автор вручную</span>
              <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.author} onChange={(e) => setField("author", e.target.value)} />
            </label>
            <label className="sm:col-span-2">
              <span className="text-sm font-medium text-gray-700">Краткое описание</span>
              <textarea className="mt-1 min-h-20 w-full rounded-lg border px-3 py-2" value={form.shortDescription} onChange={(e) => setField("shortDescription", e.target.value)} />
            </label>
            <label className="sm:col-span-2">
              <span className="text-sm font-medium text-gray-700">Описание</span>
              <textarea className="mt-1 min-h-32 w-full rounded-lg border px-3 py-2" value={form.description} onChange={(e) => setField("description", e.target.value)} />
            </label>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-black">Метаданные</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <input className="rounded-lg border px-3 py-2" placeholder="Жанр" value={form.genre} onChange={(e) => setField("genre", e.target.value)} />
            <input className="rounded-lg border px-3 py-2" placeholder="ISBN" value={form.isbn} onChange={(e) => setField("isbn", e.target.value)} />
            <input className="rounded-lg border px-3 py-2" placeholder="Издатель" value={form.publisher} onChange={(e) => setField("publisher", e.target.value)} />
            <input className="rounded-lg border px-3 py-2" placeholder="Год" value={form.publishedYear} onChange={(e) => setField("publishedYear", e.target.value)} />
            <input className="rounded-lg border px-3 py-2" placeholder="Страниц" value={form.pageCount} onChange={(e) => setField("pageCount", e.target.value)} />
            <input className="rounded-lg border px-3 py-2" placeholder="Возраст" value={form.ageLimit} onChange={(e) => setField("ageLimit", e.target.value)} />
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-black">Категории и теги</h2>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-700">Категории</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <label key={category.id} className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm">
                    <input type="checkbox" checked={form.categoryIds.includes(category.id)} onChange={() => toggle("categoryIds", category.id)} />
                    {category.title}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Теги</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <label key={tag.id} className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm">
                    <input type="checkbox" checked={form.tagIds.includes(tag.id)} onChange={() => toggle("tagIds", tag.id)} />
                    {tag.title}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <aside className="space-y-6">
        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-black">Публикация</h2>
          <div className="mt-4 space-y-3">
            <select className="w-full rounded-lg border px-3 py-2" value={form.status} onChange={(e) => setField("status", e.target.value as BookForm["status"])}>
              <option value="DRAFT">Черновик</option>
              <option value="PUBLISHED">Опубликована</option>
              <option value="ARCHIVED">Архив</option>
            </select>
            <select className="w-full rounded-lg border px-3 py-2" value={form.aiAvailability} onChange={(e) => setField("aiAvailability", e.target.value as BookForm["aiAvailability"])}>
              <option value="PROCESSING">AI обрабатывается</option>
              <option value="AVAILABLE">AI доступен</option>
              <option value="UNAVAILABLE">AI недоступен</option>
              <option value="FAILED">AI ошибка</option>
            </select>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-black">Файлы</h2>
          <label className="mt-4 block text-sm">
            <span className="font-medium text-gray-700">Обложка</span>
            <input className="mt-1 w-full text-sm" type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} />
          </label>
          <label className="mt-4 block text-sm">
            <span className="font-medium text-gray-700">PDF</span>
            <input className="mt-1 w-full text-sm" type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)} />
          </label>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-black">Preview</h2>
          <div className="mt-4 rounded-lg border bg-gray-50 p-4">
            <div className="aspect-[3/4] rounded-lg bg-gray-200" />
            <h3 className="mt-3 font-semibold text-black">{form.title || "Название книги"}</h3>
            <p className="text-sm text-gray-600">
              {authors.find((a) => a.id === form.authorId)?.fullName || form.author || "Автор"}
            </p>
            <p className="mt-2 line-clamp-3 text-sm text-gray-500">{form.shortDescription || form.description}</p>
            {previewTags ? <p className="mt-2 text-xs text-gold">{previewTags}</p> : null}
          </div>
        </section>

        <div className="flex gap-2">
          <button disabled={saving} className="flex-1 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
          <Link href="/admin/books" className="rounded-lg border px-4 py-2 text-sm font-medium text-black">
            Назад
          </Link>
        </div>
      </aside>
    </form>
  );
}
