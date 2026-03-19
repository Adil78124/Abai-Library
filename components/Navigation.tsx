import Link from "next/link";

export type NavItem = { href: string; label: string };

type NavigationProps = {
  items: NavItem[];
  activeHref?: string;
};

export default function Navigation({ items, activeHref }: NavigationProps) {
  return (
    <nav className="flex flex-wrap items-center gap-2" aria-label="Навигация">
      {items.map(({ href, label }) => {
        const isActive = activeHref === href;
        return (
          <Link
            key={href}
            href={href}
            className={[
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-black",
            ].join(" ")}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
