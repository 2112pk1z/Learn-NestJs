"use client";

import AdminShell from "@/components/AdminShell";
import { AdminUser, userApi } from "@/services/userApi.service";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function formatDate(value: string) {
    return new Intl.DateTimeFormat("vi-VN").format(new Date(value));
  }

  async function handleToggleStatus(user: AdminUser) {
    const confirmed = window.confirm(
      user.isActive
        ? "Bạn có chắc muốn khóa tài khoản này?"
        : "Bạn có chắc muốn mở khóa tài khoản này?",
    );

    if (!confirmed) return;

    try {
      const updatedUser = await userApi.updateStatus(user.id, !user.isActive);

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item.id === updatedUser.id ? updatedUser : item,
        ),
      );
    } catch {
      setError("Không thể cập nhật trạng thái người dùng");
    }
  }

  async function loadUsers(keyword = search) {
    setIsLoading(true);
    setError(null);

    try {
      const data = await userApi.getUsers(keyword);
      setUsers(data);
    } catch {
      setError("Không thể tải danh sách người dùng");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers("");
  }, []);

  return (
    <AdminShell>
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700">Quản lý</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              Người dùng
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Danh sách chỉ hiển thị tài khoản người dùng thông thường.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
            <Search className="size-4 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void loadUsers(search);
                }
              }}
              className="h-8 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              placeholder="Tìm theo tên, email hoặc số điện thoại"
            />
          </div>

          <div className="overflow-x-auto">
            {error && (
              <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="px-4 py-8 text-center text-sm text-slate-500">
                Đang tải danh sách người dùng...
              </div>
            ) : users.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-slate-500">
                Không tìm thấy người dùng phù hợp.
              </div>
            ) : (
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Họ tên</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Số điện thoại</th>
                    <th className="px-4 py-3 font-semibold">Ngày sinh</th>
                    <th className="px-4 py-3 font-semibold">Trạng thái</th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.email} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {user.name}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{user.email}</td>
                      <td className="px-4 py-3 text-slate-600">{user.phone}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(user.dateOfBirth)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <span
                          className={
                            user.isActive
                              ? "rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700"
                              : "rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
                          }
                        >
                          {user.isActive ? "Hoạt động" : "Đã khóa"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => void handleToggleStatus(user)}
                          className={
                            user.isActive
                              ? "rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                              : "rounded-lg px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50"
                          }
                        >
                          {user.isActive ? "Khóa" : "Mở khóa"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
