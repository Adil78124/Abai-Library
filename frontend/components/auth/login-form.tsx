"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, Loader2, LogIn } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { login } from "@/lib/auth-api";
import { cn } from "@/lib/utils";

export function LoginForm({ className }: { className?: string }) {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      await refresh();
      router.replace(user.role === "ADMIN" ? "/admin" : "/profile");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Не удалось войти. Проверьте email и пароль.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "grid min-h-[calc(100svh-8rem)] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm lg:grid-cols-2",
        className,
      )}
    >
      <div className="hidden bg-black p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold">
          <span className="flex size-9 items-center justify-center rounded-lg bg-white text-black">
            <BookOpen className="size-4" />
          </span>
          Abai Library
        </Link>
        <div className="max-w-md">
          <p className="text-3xl font-semibold leading-tight">
            Управляйте библиотекой из отдельного защищенного пространства.
          </p>
          <p className="mt-4 text-sm leading-6 text-white/70">
            Администраторы после входа попадают сразу в панель управления, а публичный сайт остается чистым для читателей.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-normal text-black">
              Вход в аккаунт
            </h1>
            <p className="text-sm text-gray-600">
              Введите данные, чтобы продолжить работу в Abai Library.
            </p>
          </div>

          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LogIn className="size-4" />
            )}
            {loading ? "Входим..." : "Войти"}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Нет аккаунта?{" "}
            <Link href="/signup" className="font-medium text-black underline underline-offset-4">
              Зарегистрироваться
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
