"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

export default function HeaderAuth() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <span className="text-xs text-gray-400" aria-hidden>
        …
      </span>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {user.role === "ADMIN" ? (
          <Link
            href="/admin"
            className="rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800"
          >
            Панель
          </Link>
        ) : null}
        <Link
          href="/profile"
          className="hidden max-w-[120px] truncate text-xs font-medium text-gray-600 hover:text-black sm:inline"
          title={user.email}
        >
          {user.name}
        </Link>
        <button
          type="button"
          onClick={() => logout()}
          className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-black hover:bg-gray-200"
        >
          Выйти
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-black hover:bg-gray-200"
      >
        Войти
      </Link>
    </div>
  );
}
