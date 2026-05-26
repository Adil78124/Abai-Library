import { AuthorEditor } from "@/components/admin/entity-editors";

export default function EditAuthorPage({ params }: { params: { id: string } }) {
  return <div className="p-8"><h1 className="mb-6 text-2xl font-bold">Редактировать автора</h1><AuthorEditor id={params.id} /></div>;
}
