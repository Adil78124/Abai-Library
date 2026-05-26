import Link from "next/link";

export default function AdminUploadPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
        Загрузка книг
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-black sm:text-3xl">
        PDF и обложки
      </h1>
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 text-sm leading-6 text-gray-600 shadow-sm">
        Загрузка файлов сейчас выполняется в разделе{" "}
        <Link href="/admin/books" className="font-medium text-black underline underline-offset-4">
          Книги
        </Link>
        : выберите нужную книгу и загрузите PDF или изображение.
      </div>
    </div>
  );
}
