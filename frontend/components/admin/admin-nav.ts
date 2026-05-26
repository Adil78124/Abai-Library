import {
  BookOpen,
  FolderTree,
  LayoutDashboard,
  Settings,
  Sparkles,
  Tags,
  UploadCloud,
  UserRoundPen,
  Users,
  LibraryBig,
} from "lucide-react";

export const adminNavItems = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard, exact: true },
  { href: "/admin/books", label: "Книги", icon: BookOpen },
  { href: "/admin/authors", label: "Авторы", icon: UserRoundPen },
  { href: "/admin/categories", label: "Категории", icon: FolderTree },
  { href: "/admin/tags", label: "Теги", icon: Tags },
  { href: "/admin/collections", label: "Подборки", icon: LibraryBig },
  { href: "/admin/upload", label: "Загрузка", icon: UploadCloud },
  { href: "/admin/ai", label: "AI-обработка", icon: Sparkles },
  { href: "/admin/users", label: "Пользователи", icon: Users },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
];
