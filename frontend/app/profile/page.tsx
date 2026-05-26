"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import UserProfile from "@/components/UserProfile";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-gray-500">
        Загрузка профиля…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-16 text-center">
        <p className="text-lg text-gray-600">Войдите, чтобы открыть профиль</p>
        <Link
          href="/login"
          className="rounded-xl bg-black px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Войти
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-black">Профиль</h1>
      <UserProfile
        name={user.name}
        email={user.email}
        level={user.role === "ADMIN" ? "Admin" : "Читатель"}
        stats={[
          { label: "Роль", value: user.role },
        ]}
      />
      <p className="mt-6 text-sm text-gray-500">
        Избранное, прогресс чтения и персональные подборки — в следующих этапах.
      </p>
    </div>
  );
}
