"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HeaderAuth from "@/components/HeaderAuth";

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
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 sm:px-6 lg:h-16 lg:flex-nowrap lg:px-8 lg:py-0">
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

        <nav
          className="order-3 flex w-full items-center gap-1 overflow-x-auto pb-1 lg:order-none lg:w-auto lg:overflow-visible lg:pb-0"
          aria-label="Основная навигация"
        >
          {navItems.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors lg:px-5",
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

        <HeaderAuth />
      </div>
    </header>
  );
}
