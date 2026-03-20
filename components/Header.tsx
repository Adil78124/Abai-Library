"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const LOGO_SRC = "/LogoAbaiLibraryNoBackground 4.png";

const navItems = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/assistant", label: "ИИ помощник" },
  { href: "/about", label: "О проекте" },
  { href: "/profile", label: "Профиль" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="relative flex h-10 shrink-0 items-center transition-opacity hover:opacity-85"
          aria-label="Abai Library"
        >
          <Image
            src={LOGO_SRC}
            alt="Abai Library"
            width={208}
            height={60}
            className="h-[60px] w-auto object-contain object-left sm:h-[70px]"
            priority
          />
        </Link>

        <nav className="flex items-center gap-1" aria-label="Основная навигация">
          {navItems.map(({ href, label }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-600 hover:text-black",
                ].join(" ")}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="w-10 shrink-0" />
      </div>
    </header>
  );
}
