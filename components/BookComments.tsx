"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "abai-library-comments";

export type StoredComment = {
  id: string;
  bookSlug: string;
  text: string;
  createdAt: string;
};

function getStoredComments(bookSlug: string): StoredComment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: StoredComment[] = raw ? JSON.parse(raw) : [];
    return all.filter((c) => c.bookSlug === bookSlug);
  } catch {
    return [];
  }
}

function saveComment(comment: StoredComment) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: StoredComment[] = raw ? JSON.parse(raw) : [];
    all.push(comment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

type BookCommentsProps = {
  bookSlug: string;
};

export default function BookComments({ bookSlug }: BookCommentsProps) {
  const [comments, setComments] = useState<StoredComment[]>([]);
  const [text, setText] = useState("");

  const load = useCallback(() => {
    setComments(getStoredComments(bookSlug));
  }, [bookSlug]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    const newComment: StoredComment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      bookSlug,
      text: trimmed,
      createdAt: new Date().toISOString(),
    };
    saveComment(newComment);
    setComments((prev) => [...prev, newComment]);
    setText("");
  };

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm fade-in sm:p-7">
      <h2 className="text-lg font-semibold text-black sm:text-xl">
        Комментарии
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        Временные комментарии (сохраняются в браузере). Оставьте отзыв или заметку.
      </p>

      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Напишите комментарий..."
          rows={3}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black placeholder:text-gray-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
        <button
          type="submit"
          className="mt-2 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Отправить
        </button>
      </form>

      <ul className="mt-4 space-y-3">
        {comments.length === 0 && (
          <li className="text-sm text-gray-500">Пока нет комментариев.</li>
        )}
        {comments.map((c) => (
          <li
            key={c.id}
            className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-black"
          >
            <p className="whitespace-pre-wrap">{c.text}</p>
            <p className="mt-2 text-xs text-gray-500">
              {new Date(c.createdAt).toLocaleString("ru")}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
