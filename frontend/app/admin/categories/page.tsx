"use client";

import EntityList from "@/components/admin/entity-list";
import { deleteCategory, getCategories } from "@/lib/admin-library-api";
import type { ApiCategory } from "@/lib/books-api";

export default function CategoriesPage() {
  return (
    <EntityList<ApiCategory>
      title="Категории"
      description="Разделы каталога и фильтры публичного сайта."
      newHref="/admin/categories/new"
      load={() => getCategories({ limit: 100 })}
      remove={deleteCategory}
      editHref={(category) => `/admin/categories/${category.id}`}
      columns={[
        { label: "Название", render: (category) => <span className="font-medium text-black">{category.title}</span> },
        { label: "Активна", render: (category) => category.isActive ? "Да" : "Нет" },
        { label: "Порядок", render: (category) => category.sortOrder },
        { label: "Книг", render: (category) => category._count?.bookLinks ?? 0 },
      ]}
    />
  );
}
