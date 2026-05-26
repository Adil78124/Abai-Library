"use client";

import EntityList from "@/components/admin/entity-list";
import { deleteCollection, getCollections } from "@/lib/admin-library-api";
import type { ApiCollection } from "@/lib/admin-library-api";

export default function CollectionsPage() {
  return (
    <EntityList<ApiCollection>
      title="Подборки"
      description="Витрины главной, каталога и страницы книги."
      newHref="/admin/collections/new"
      load={() => getCollections({ limit: 100 })}
      remove={deleteCollection}
      editHref={(collection) => `/admin/collections/${collection.id}`}
      columns={[
        { label: "Название", render: (collection) => <span className="font-medium text-black">{collection.title}</span> },
        { label: "Активна", render: (collection) => collection.isActive ? "Да" : "Нет" },
        { label: "Placement", render: (collection) => collection.placement },
        { label: "Тип", render: (collection) => collection.type },
        { label: "Книг", render: (collection) => collection._count?.books ?? 0 },
        { label: "Порядок", render: (collection) => collection.sortOrder },
      ]}
    />
  );
}
