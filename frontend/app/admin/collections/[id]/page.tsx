import CollectionEditor from "@/components/admin/collection-editor";

export default function EditCollectionPage({ params }: { params: { id: string } }) {
  return <div className="p-8"><h1 className="mb-6 text-2xl font-bold">Редактировать подборку</h1><CollectionEditor id={params.id} /></div>;
}
