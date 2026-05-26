import { CategoryEditor } from "@/components/admin/entity-editors";

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  return <div className="p-8"><h1 className="mb-6 text-2xl font-bold">Редактировать категорию</h1><CategoryEditor id={params.id} /></div>;
}
