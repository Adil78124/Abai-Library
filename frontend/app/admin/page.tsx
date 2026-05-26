import Link from "next/link";
import { BookOpen, Settings, Sparkles, UploadCloud, Users } from "lucide-react";

const summaryCards = [
  {
    title: "Книги",
    description: "Каталог, статусы публикации, PDF и обложки.",
    href: "/admin/books",
    icon: BookOpen,
  },
  {
    title: "Загрузка книг",
    description: "Быстрый переход к загрузке PDF и изображений.",
    href: "/admin/upload",
    icon: UploadCloud,
  },
  {
    title: "AI-обработка",
    description: "Контроль N8N-обработки и доступности чата.",
    href: "/admin/ai",
    icon: Sparkles,
  },
  {
    title: "Пользователи",
    description: "Будущий раздел управления ролями и доступами.",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Настройки",
    description: "Параметры окружения, интеграций и публикации.",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminOverviewPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
          Обзор
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-black sm:text-3xl">
          Панель управления Abai Library
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Здесь собраны административные разделы для управления книгами, загрузками, пользователями и AI-обработкой.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-black text-white">
                  <Icon className="size-4" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-black">{card.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">{card.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
