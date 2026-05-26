export default function AdminAiPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
        AI-обработка
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-black sm:text-3xl">
        Статусы AI и N8N
      </h1>
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 text-sm leading-6 text-gray-600 shadow-sm">
        Статус AI для каждой книги отображается в разделе книг. После загрузки PDF backend переводит книгу в обработку, а callback N8N обновляет доступность AI-чата.
      </div>
    </div>
  );
}
