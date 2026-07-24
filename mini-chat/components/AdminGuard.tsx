"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, loadProfile } = useAuthStore();

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    if (!isLoading && !isAuthenticated) {
      router.replace("/admin/login");
      return;
    }

    if (!isLoading && isAuthenticated && user?.role !== "admin") {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router, user?.role]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f9fc] text-sm text-slate-500">
        Đang kiểm tra quyền quản trị...
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
