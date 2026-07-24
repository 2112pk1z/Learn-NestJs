"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { userApi } from "@/services/userApi.service";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import {
  ArrowLeft,
  CalendarDays,
  KeyRound,
  LockKeyhole,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function formatDateForInput(value?: string) {
  if (!value) return "";
  return value.slice(0, 10);
}

export default function ProfilePage() {
  const { user, updateProfile, isLoading, error, clearError } = useAuthStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? "");
    setPhone(user.phone ?? "");
    setDateOfBirth(formatDateForInput(user.dateOfBirth));
  }, [user]);

  function getErrorMessage(error: unknown, fallback: string) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;

      if (typeof message === "string") {
        return message;
      }

      if (Array.isArray(message)) {
        return message.join(", ");
      }
    }

    return fallback;
  }

  async function handleUpdateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearError();
    setSuccessMessage(null);

    const success = await updateProfile({
      name,
      phone,
      dateOfBirth,
    });

    if (success) {
      setSuccessMessage("Cập nhật thông tin thành công");
      router.push("/");
    }
  }

  async function handleChangePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }

    setIsChangingPassword(true);

    try {
      await userApi.changePassword({
        currentPassword,
        newPassword,
      });

      setPasswordSuccess("Đổi mật khẩu thành công");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.push("/");
    } catch (error) {
      setPasswordError(getErrorMessage(error, "Không thể đổi mật khẩu"));
    } finally {
      setIsChangingPassword(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fbfdff] text-slate-900">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 underline underline-offset-4 transition-colors hover:text-blue-700"
            >
              <ArrowLeft className="size-4" />
              Về trang chat
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              Thông tin cá nhân
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Xem và chỉnh sửa thông tin tài khoản của bạn.
            </p>
          </div>

          <div className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm sm:w-auto">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <User className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-950">
                {user?.name ?? "Người dùng"}
              </div>
              <div className="truncate text-xs text-slate-500">
                {user?.email ?? "email@example.com"}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-xl font-semibold text-white">
                {(user?.name?.charAt(0) ?? "U").toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-slate-950">
                  {user?.name ?? "Người dùng"}
                </h2>
                <p className="mt-1 truncate text-sm text-slate-500">
                  {user?.email ?? "email@example.com"}
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  <ShieldCheck className="size-3.5" />
                  {user?.role === "admin" ? "Quản trị viên" : "Người dùng"}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 text-sm">
              <div className="rounded-lg border border-slate-200 px-3 py-2.5">
                <div className="text-xs text-slate-400">Trạng thái</div>
                <div className="mt-1 font-medium text-emerald-700">
                  {user?.isActive === false ? "Đã khóa" : "Đang hoạt động"}
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 px-3 py-2.5">
                <div className="text-xs text-slate-400">Ngày tạo tài khoản</div>
                <div className="mt-1 font-medium text-slate-700">
                  {user?.createdAt
                    ? new Intl.DateTimeFormat("vi-VN").format(
                        new Date(user.createdAt),
                      )
                    : "Chưa có dữ liệu"}
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-5">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-slate-950">
                  Cập nhật hồ sơ
                </h2>
              </div>

              <form className="grid gap-4" onSubmit={handleUpdateProfile}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    icon={<User className="size-4" />}
                    id="profile-name"
                    label="Họ tên"
                  >
                    <Input
                      id="profile-name"
                      name="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Nhập họ tên"
                      className="h-11 rounded-xl pl-10"
                    />
                  </Field>

                  <Field
                    icon={<Mail className="size-4" />}
                    id="profile-email"
                    label="Email"
                  >
                    <Input
                      id="profile-email"
                      name="email"
                      type="email"
                      value={user?.email ?? ""}
                      readOnly
                      className="h-11 rounded-xl bg-slate-50 pl-10 text-slate-500"
                    />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    icon={<Phone className="size-4" />}
                    id="profile-phone"
                    label="Số điện thoại"
                  >
                    <Input
                      id="profile-phone"
                      name="phone"
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="0912345678"
                      className="h-11 rounded-xl pl-10"
                    />
                  </Field>

                  <Field
                    icon={<CalendarDays className="size-4" />}
                    id="profile-date-of-birth"
                    label="Ngày sinh"
                  >
                    <Input
                      id="profile-date-of-birth"
                      name="dateOfBirth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(event) => setDateOfBirth(event.target.value)}
                      className="h-11 rounded-xl pl-10"
                    />
                  </Field>
                </div>

                {error && (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </p>
                )}

                {successMessage && (
                  <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    {successMessage}
                  </p>
                )}

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-11 w-full rounded-xl bg-blue-600 px-4 text-white hover:bg-blue-700 sm:w-auto"
                  >
                    <Save className="size-4" />
                    {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                </div>
              </form>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-slate-950">
                  Đổi mật khẩu
                </h2>
              </div>

              <form className="grid gap-4" onSubmit={handleChangePassword}>
                <Field
                  icon={<LockKeyhole className="size-4" />}
                  id="current-password"
                  label="Mật khẩu hiện tại"
                >
                  <Input
                    id="current-password"
                    name="currentPassword"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    type="password"
                    autoComplete="current-password"
                    placeholder="Nhập mật khẩu hiện tại"
                    className="h-11 rounded-xl pl-10"
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    icon={<LockKeyhole className="size-4" />}
                    id="new-password"
                    label="Mật khẩu mới"
                  >
                    <Input
                      id="new-password"
                      name="newPassword"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      type="password"
                      autoComplete="new-password"
                      placeholder="Tối thiểu 8 ký tự"
                      className="h-11 rounded-xl pl-10"
                    />
                  </Field>

                  <Field
                    icon={<LockKeyhole className="size-4" />}
                    id="confirm-password"
                    label="Xác nhận mật khẩu"
                  >
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      type="password"
                      autoComplete="new-password"
                      placeholder="Nhập lại mật khẩu mới"
                      className="h-11 rounded-xl pl-10"
                    />
                  </Field>
                </div>

                {passwordError && (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {passwordError}
                  </p>
                )}

                {passwordSuccess && (
                  <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    {passwordSuccess}
                  </p>
                )}

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isChangingPassword}
                    className="h-11 w-full rounded-xl bg-blue-600 px-4 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    <KeyRound className="size-4" />
                    {isChangingPassword
                      ? "Đang cập nhật..."
                      : "Cập nhật mật khẩu"}
                  </Button>
                </div>
              </form>
            </section>
          </div>
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
