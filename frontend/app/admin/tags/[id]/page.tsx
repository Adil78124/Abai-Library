import { TagEditor } from "@/components/admin/entity-editors";

export default function EditTagPage({ params }: { params: { id: string } }) {
  return <div className="p-8"><h1 className="mb-6 text-2xl font-bold">Редактировать тег</h1><TagEditor id={params.id} /></div>;
}
