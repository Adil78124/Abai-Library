"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ApiAuthor, ApiCategory, ApiTag } from "@/lib/books-api";
import {
  createAuthor,
  createCategory,
  createTag,
  getAuthor,
  getCategory,
  getTag,
  updateAuthor,
  updateCategory,
  updateTag,
} from "@/lib/admin-library-api";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

const inputClass = "mt-1 w-full rounded-lg border px-3 py-2 text-sm";

export function AuthorEditor({ id }: { id?: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", slug: "", description: "", birthYear: "", deathYear: "", image: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    void getAuthor(id).then((author: ApiAuthor) =>
      setForm({
        fullName: author.fullName,
        slug: author.slug,
        description: author.description ?? "",
        birthYear: author.birthYear?.toString() ?? "",
        deathYear: author.deathYear?.toString() ?? "",
        image: author.image ?? "",
      }),
    );
  }, [id]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const payload = {
        fullName: form.fullName,
        slug: form.slug || undefined,
        description: form.description || undefined,
        birthYear: form.birthYear ? Number(form.birthYear) : undefined,
        deathYear: form.deathYear ? Number(form.deathYear) : undefined,
        image: form.image || undefined,
      };
      const saved = id ? await updateAuthor(id, payload) : await createAuthor(payload);
      router.push(`/admin/authors/${saved.id}`);
      router.refresh();
    } catch {
      setError("Не удалось сохранить автора.");
    }
  };

  return (
    <form onSubmit={save} className="max-w-3xl rounded-lg border bg-white p-5 shadow-sm">
      {error ? <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Полное имя"><input className={inputClass} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></Field>
        <Field label="Slug"><input className={inputClass} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></Field>
        <Field label="Год рождения"><input className={inputClass} value={form.birthYear} onChange={(e) => setForm({ ...form, birthYear: e.target.value })} /></Field>
        <Field label="Год смерти"><input className={inputClass} value={form.deathYear} onChange={(e) => setForm({ ...form, deathYear: e.target.value })} /></Field>
        <Field label="Изображение"><input className={inputClass} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></Field>
        <label className="block sm:col-span-2"><span className="text-sm font-medium text-gray-700">Описание</span><textarea className={`${inputClass} min-h-32`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
      </div>
      <Actions back="/admin/authors" />
    </form>
  );
}

export function CategoryEditor({ id }: { id?: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", slug: "", description: "", sortOrder: "0", isActive: true });

  useEffect(() => {
    if (!id) return;
    void getCategory(id).then((category: ApiCategory) =>
      setForm({
        title: category.title,
        slug: category.slug,
        description: category.description ?? "",
        sortOrder: String(category.sortOrder),
        isActive: category.isActive,
      }),
    );
  }, [id]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      title: form.title,
      slug: form.slug || undefined,
      description: form.description || undefined,
      sortOrder: Number(form.sortOrder || 0),
      isActive: form.isActive,
    };
    const saved = id ? await updateCategory(id, payload) : await createCategory(payload);
    router.push(`/admin/categories/${saved.id}`);
    router.refresh();
  };

  return (
    <form onSubmit={save} className="max-w-3xl rounded-lg border bg-white p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Название"><input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <Field label="Slug"><input className={inputClass} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></Field>
        <Field label="Порядок"><input className={inputClass} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} /></Field>
        <label className="mt-7 inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Активна</label>
        <label className="block sm:col-span-2"><span className="text-sm font-medium text-gray-700">Описание</span><textarea className={`${inputClass} min-h-24`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
      </div>
      <Actions back="/admin/categories" />
    </form>
  );
}

export function TagEditor({ id }: { id?: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", slug: "" });

  useEffect(() => {
    if (!id) return;
    void getTag(id).then((tag: ApiTag) => setForm({ title: tag.title, slug: tag.slug }));
  }, [id]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const saved = id
      ? await updateTag(id, { title: form.title, slug: form.slug || undefined })
      : await createTag({ title: form.title, slug: form.slug || undefined });
    router.push(`/admin/tags/${saved.id}`);
    router.refresh();
  };

  return (
    <form onSubmit={save} className="max-w-3xl rounded-lg border bg-white p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Название"><input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <Field label="Slug"><input className={inputClass} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></Field>
      </div>
      <Actions back="/admin/tags" />
    </form>
  );
}

function Actions({ back }: { back: string }) {
  return (
    <div className="mt-6 flex gap-2">
      <button className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white">Сохранить</button>
      <Link href={back} className="rounded-lg border px-4 py-2 text-sm font-medium text-black">Назад</Link>
    </div>
  );
}
