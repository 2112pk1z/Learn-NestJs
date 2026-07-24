"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import { ArrowLeft, LockKeyhole, Mail, Scale, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearError();

    const success = await adminLogin({
      email,
      password,
    });

    if (success) {
      router.replace("/admin");
    }
  }

  return (
    <main className="min-h-screen bg-[#fbfdff] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-8">
        <div className="grid w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="hidden bg-blue-600 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm text-blue-50 transition hover:bg-white/15"
            >
              <ArrowLeft className="h-4 w-4" />
              Về trang chat
            </Link>

            <div>
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                <Scale className="size-7" />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Legal AI Admin
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-6 text-blue-50/90">
                Đăng nhập để quản lý người dùng, tài liệu và các dữ liệu phục vụ
                hệ thống tra cứu pháp lý.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-blue-50/90">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-4" />
                Quản lý hệ thống
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-8 lg:p-10">
            <div className="mb-8 lg:hidden">
              <Link
                href="/"
                className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Về trang chat
              </Link>

              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Scale className="size-5" />
                </div>
                <div>
                  <div className="font-semibold">Legal AI Admin</div>
                  <div className="text-xs text-slate-500">Khu vực quản trị</div>
                </div>
              </div>
            </div>

            <div className="mb-7">
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <ShieldCheck className="size-5" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Đăng nhập admin
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Nhập tài khoản quản trị để truy cập bảng điều khiển.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="admin-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@gmail.com"
                    className="h-11 rounded-xl pl-10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="admin-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Nhập mật khẩu admin"
                    className="h-11 rounded-xl pl-10"
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700"
              >
                <ShieldCheck className="size-4" />
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
