"use client";

import { useEffect, useState } from "react";
import BookEditor from "@/components/admin/book-editor";
import { getAdminBook } from "@/lib/admin-library-api";
import type { ApiBook } from "@/lib/books-api";

export default function EditBookPage({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<ApiBook | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getAdminBook(params.id).then(setBook).catch(() => setError("Книга не найдена."));
  }, [params.id]);

  if (error) return <div className="p-8 text-red-700">{error}</div>;
  if (!book) return <div className="p-8 text-gray-500">Загрузка книги...</div>;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-black">Редактировать книгу</h1>
      <BookEditor book={book} />
    </div>
  );
}
