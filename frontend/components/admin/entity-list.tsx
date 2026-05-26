"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";

type Props<T extends { id: string }> = {
  title: string;
  description: string;
  newHref: string;
  load: () => Promise<{ items: T[] }>;
  remove: (id: string) => Promise<unknown>;
  columns: Array<{ label: string; render: (item: T) => React.ReactNode }>;
  editHref: (item: T) => string;
};

export default function EntityList<T extends { id: string }>({
  title,
  description,
  newHref,
  load,
  remove,
  columns,
  editHref,
}: Props<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await load();
      setItems(result.items);
    } catch {
      setError("Не удалось загрузить данные.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const handleRemove = async (id: string) => {
    if (!window.confirm("Удалить запись?")) return;
    await remove(id);
    await refresh();
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">{title}</h1>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>
        <Link href={newHref} className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white">
          <Plus className="size-4" />
          Создать
        </Link>
      </div>

      {error ? <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              {columns.map((column) => (
                <th key={column.label} className="px-4 py-3">{column.label}</th>
              ))}
              <th className="px-4 py-3">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-gray-500">Загрузка...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-gray-500">Записей пока нет.</td></tr>
            ) : items.map((item) => (
              <tr key={item.id}>
                {columns.map((column) => (
                  <td key={column.label} className="px-4 py-4">{column.render(item)}</td>
                ))}
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <Link href={editHref(item)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium"><Edit className="size-3.5" /> Редактировать</Link>
                    <button onClick={() => void handleRemove(item.id)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700"><Trash2 className="size-3.5" /> Удалить</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
