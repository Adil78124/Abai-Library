"use client";

import EntityList from "@/components/admin/entity-list";
import { deleteTag, getTags } from "@/lib/admin-library-api";
import type { ApiTag } from "@/lib/books-api";

export default function TagsPage() {
  return (
    <EntityList<ApiTag>
      title="Теги"
      description="Гибкая фильтрация и редакционные метки книг."
      newHref="/admin/tags/new"
      load={() => getTags({ limit: 100 })}
      remove={deleteTag}
      editHref={(tag) => `/admin/tags/${tag.id}`}
      columns={[
        { label: "Название", render: (tag) => <span className="font-medium text-black">{tag.title}</span> },
        { label: "Slug", render: (tag) => <span className="text-gray-500">{tag.slug}</span> },
        { label: "Книг", render: (tag) => tag._count?.bookLinks ?? 0 },
      ]}
    />
  );
}
