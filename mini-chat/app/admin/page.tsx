"use client";

import AdminShell from "@/components/AdminShell";
import { documentApi } from "@/services/documentApi.service";
import { userApi } from "@/services/userApi.service";
import { FileText, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminOverviewPage() {
  const [activeUsers, setActiveUsers] = useState<number | null>(null);
  const [documentCount, setDocumentCount] = useState<number | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const stats = await userApi.getStats();
        setActiveUsers(stats.activeUsers);
      } catch {
        setActiveUsers(0);
      }

      try {
        const documents = await documentApi.getDocuments();
        setDocumentCount(documents.length);
      } catch {
        setDocumentCount(0);
      }
    }

    void loadStats();
  }, []);

  const summaryItems = [
    {
      label: "Người dùng",
      value: activeUsers === null ? "..." : activeUsers.toString(),
      caption: "Tài khoản người dùng đang hoạt động",
      icon: Users,
    },
    {
      label: "Tài liệu",
      value: documentCount === null ? "..." : documentCount.toString(),
      caption: "Tổng số tài liệu trong hệ thống",
      icon: FileText,
    },
  ];

  return (
    <AdminShell>
      <div className="space-y-6">
        <section className="rounded-lg border border-slate-200 bg-white px-5 py-5 shadow-sm">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-blue-700">Tổng quan</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Chào mừng đến với trang quản trị Legal AI
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Khu vực này dùng để theo dõi người dùng, tài liệu và các nội dung
              quan trọng của hệ thống.
            </p>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-2">
          {summaryItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {item.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">
                      {item.value}
                    </p>
                  </div>
                  <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <Icon className="size-4" />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-500">{item.caption}</p>
              </div>
            );
          })}
        </section>
      </div>
    </AdminShell>
  );
}
