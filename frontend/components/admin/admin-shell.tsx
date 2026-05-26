"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
    router.refresh();
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "14rem",
          "--sidebar-width-icon": "3rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b bg-white px-4">
          <div className="flex min-w-0 items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-black">Админ-панель</p>
              <p className="hidden truncate text-xs text-gray-500 sm:block">
                Управление контентом и AI-обработкой
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden min-w-0 text-right sm:block">
              <p className="max-w-[180px] truncate text-sm font-medium text-black">
                {user?.name}
              </p>
              <p className="max-w-[180px] truncate text-xs text-gray-500">
                {user?.email}
              </p>
            </div>
            <Button type="button" variant="outline" onClick={handleLogout}>
              <LogOut className="size-4" />
              Выйти
            </Button>
          </div>
        </header>
        <main className="min-h-[calc(100svh-4rem)] bg-gray-50">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
