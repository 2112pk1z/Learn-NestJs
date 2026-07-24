"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import {
  ArrowLeft,
  CalendarDays,
  LockKeyhole,
  LogIn,
  Mail,
  Phone,
  Scale,
  User,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AuthFormProps {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const isLogin = mode === "login";
  const router = useRouter();

  const { login, register, isLoading, error, clearError } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearError();

    if (isLogin) {
      const success = await login({
        email,
        password,
      });

      if (success) {
        router.push("/");
      }

      return;
    }
    const success = await register({
      name,
      email,
      phone,
      password,
      dateOfBirth,
    });

    if (success) {
      router.push("/login");
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
                Legal AI
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-6 text-blue-50/90">
                Đăng nhập để lưu phiên trò chuyện, quản lý lịch sử và tiếp tục
                tra cứu pháp lý trên cùng một tài khoản.
              </p>
            </div>

            <p className="text-xs text-blue-100/80">
              Legal AI - giao diện xác thực
            </p>
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
                  <div className="font-semibold">Legal AI</div>
                  <div className="text-xs text-slate-500">Trợ lý pháp lý</div>
                </div>
              </div>
            </div>

            <div className="mb-7">
              <h2 className="text-2xl font-semibold tracking-tight">
                {isLogin ? "Đăng nhập" : "Đăng ký tài khoản"}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {isLogin
                  ? "Nhập email và mật khẩu để tiếp tục."
                  : "Tạo tài khoản mới để sử dụng đầy đủ tính năng."}
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <Field
                  icon={<User className="h-4 w-4" />}
                  id="name"
                  label="Họ tên"
                >
                  <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    placeholder="Lê Việt Hoàng"
                    className="h-11 rounded-xl pl-10"
                  />
                </Field>
              )}

              <Field
                icon={<Mail className="h-4 w-4" />}
                id="email"
                label="Email"
              >
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="hoang@gmail.com"
                  className="h-11 rounded-xl pl-10"
                />
              </Field>

              {!isLogin && (
                <Field
                  icon={<Phone className="h-4 w-4" />}
                  id="phone"
                  label="Số điện thoại"
                >
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    placeholder="0912345678"
                    className="h-11 rounded-xl pl-10"
                  />
                </Field>
              )}

              {!isLogin && (
                <Field
                  icon={<CalendarDays className="h-4 w-4" />}
                  id="dateOfBirth"
                  label="Ngày sinh"
                >
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="h-11 rounded-xl pl-10"
                  />
                </Field>
              )}

              <Field
                icon={<LockKeyhole className="h-4 w-4" />}
                id="password"
                label="Mật khẩu"
              >
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  placeholder="Tối thiểu 8 ký tự"
                  className="h-11 rounded-xl pl-10"
                />
              </Field>

              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLogin ? (
                  <LogIn className="h-4 w-4" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                {isLoading
                  ? isLogin
                    ? "Đang đăng nhập..."
                    : "Đang đăng ký..."
                  : isLogin
                    ? "Đăng nhập"
                    : "Đăng ký"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
              <Link
                href={isLogin ? "/register" : "/login"}
                className="font-medium text-blue-700 hover:text-blue-800"
              >
                {isLogin ? "Đăng ký" : "Đăng nhập"}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

interface FieldProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  id: string;
  label: string;
}

function Field({ children, icon, id, label }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
        {children}
      </div>
    </div>
  );
}
