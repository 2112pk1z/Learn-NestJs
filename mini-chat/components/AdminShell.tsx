"use client";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AdminGuard from "./AdminGuard";

const navItems = [
  {
    href: "/admin",
    label: "Tổng quan",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/users",
    label: "Quản lý người dùng",
    icon: Users,
  },
  {
    href: "/admin/documents",
    label: "Quản lý tài liệu",
    icon: FileText,
  },
];

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    router.replace("/admin/login");
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#f7f9fc] text-slate-900">
        <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white px-4 py-5 md:flex">
          <Link href="/admin" className="mb-7 flex items-center gap-3 px-1">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Scale className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">
                Legal AI Admin
              </div>
              <div className="text-xs text-slate-500">Bảng điều khiển</div>
            </div>
          </Link>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700",
                    isActive && "bg-blue-50 text-blue-700",
                  )}
                >
                  <Icon className="size-4" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-slate-100 pt-4">
            <button
              type="button"
              className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              Đăng xuất
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col md:pl-64">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-6">
            <div className="flex items-center gap-2 md:hidden">
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Scale className="size-4" />
              </div>
              <span className="text-sm font-semibold">Legal AI Admin</span>
            </div>
            <div className="hidden text-sm text-slate-500 md:block">
              Hệ thống quản trị
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
              <ShieldCheck className="size-3.5 text-blue-600" />
              Admin
            </div>
          </header>

          <main className="flex-1 px-4 py-5 md:px-6 lg:px-8">{children}</main>

          <nav className="grid grid-cols-3 border-t border-slate-200 bg-white md:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 px-2 py-2 text-[11px] font-medium text-slate-500",
                    isActive && "text-blue-700",
                  )}
                >
                  <Icon className="size-4" />
                  <span className="max-w-full truncate">
                    {item.href === "/admin"
                      ? "Tổng quan"
                      : item.href === "/admin/users"
                        ? "Người dùng"
                        : "Tài liệu"}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </AdminGuard>
  );
}
