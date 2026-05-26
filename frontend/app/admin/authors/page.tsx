"use client";

import EntityList from "@/components/admin/entity-list";
import { deleteAuthor, getAuthors } from "@/lib/admin-library-api";
import type { ApiAuthor } from "@/lib/books-api";

export default function AuthorsPage() {
  return (
    <EntityList<ApiAuthor>
      title="Авторы"
      description="Карточки авторов, биографии и изображения."
      newHref="/admin/authors/new"
      load={() => getAuthors({ limit: 100 })}
      remove={deleteAuthor}
      editHref={(author) => `/admin/authors/${author.id}`}
      columns={[
        { label: "Имя", render: (author) => <span className="font-medium text-black">{author.fullName}</span> },
        { label: "Slug", render: (author) => <span className="text-gray-500">{author.slug}</span> },
        { label: "Книг", render: (author) => author._count?.books ?? 0 },
      ]}
    />
  );
}
