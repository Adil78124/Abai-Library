import BookEditor from "@/components/admin/book-editor";

export default function NewBookPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-black">Добавить книгу</h1>
      <BookEditor />
    </div>
  );
}
