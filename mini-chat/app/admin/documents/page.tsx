"use client";

import AdminShell from "@/components/AdminShell";
import DocumentModal from "@/components/DocumentModal";
import { AdminDocument, documentApi } from "@/services/documentApi.service";
import { FileUp, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedDocument, setSelectedDocument] =
    useState<AdminDocument | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleViewDocument(documentId: number) {
    try {
      const data = await documentApi.getViewUrl(documentId);
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch {
      setError("Không thể mở tài liệu");
    }
  }

  async function handleSubmitDocument(payload: {
    title: string;
    file: File | null;
  }) {
    try {
      setIsSubmitting(true);
      setError(null);

      if (modalMode === "create") {
        if (!payload.file) return;

        const createdDocument = await documentApi.uploadDocument(
          payload.title,
          payload.file,
        );

        setDocuments((currentDocuments) => [
          createdDocument,
          ...currentDocuments,
        ]);
      }

      if (modalMode === "edit" && selectedDocument) {
        const updatedDocument = await documentApi.updateTitle(
          selectedDocument.id,
          payload.title,
        );

        setDocuments((currentDocuments) =>
          currentDocuments.map((item) =>
            item.id === updatedDocument.id ? updatedDocument : item,
          ),
        );
      }

      setIsModalOpen(false);
      setSelectedDocument(null);
    } catch {
      setError(
        modalMode === "create"
          ? "Không thể tải lên tài liệu"
          : "Không thể cập nhật tài liệu",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteDocument(document: AdminDocument) {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa tài liệu "${document.title}"?`,
    );

    if (!confirmed) return;

    try {
      await documentApi.deleteDocument(document.id);

      setDocuments((currentDocuments) =>
        currentDocuments.filter((item) => item.id !== document.id),
      );
    } catch {
      setError("Không thể xóa tài liệu");
    }
  }

  async function loadDocuments(keyword = search) {
    try {
      const data = await documentApi.getDocuments(keyword);
      setDocuments(data);
    } catch {
      setError("Không thể tải danh sách tài liệu");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadDocuments("");
  }, []);

  function formatDate(value: string) {
    return new Intl.DateTimeFormat("vi-VN").format(new Date(value));
  }

  return (
    <AdminShell>
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700">Quản lý</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              Tài liệu
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Danh sách tài liệu dùng để phục vụ tra cứu pháp lý.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setModalMode("create");
              setSelectedDocument(null);
              setIsModalOpen(true);
            }}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <FileUp className="size-4" />
            Tải lên tài liệu
          </button>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
            <Search className="size-4 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setIsLoading(true);
                  void loadDocuments(search);
                }
              }}
              className="h-8 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              placeholder="Tìm theo tên tài liệu"
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
                Đang tải danh sách tài liệu...
              </div>
            ) : documents.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-slate-500">
                Không tìm thấy tài liệu phù hợp.
              </div>
            ) : (
              <table className="w-full min-w-155 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Tên tài liệu</th>
                    <th className="px-4 py-3 font-semibold">Ngày tải lên</th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents.map((document) => (
                    <tr key={document.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        <button
                          type="button"
                          onClick={() => void handleViewDocument(document.id)}
                          className="font-medium text-blue-700 hover:underline"
                        >
                          {document.title}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(document.uploadedAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setModalMode("edit");
                              setSelectedDocument(document);
                              setIsModalOpen(true);
                            }}
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50"
                          >
                            Cập nhật
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleDeleteDocument(document)}
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <DocumentModal
        open={isModalOpen}
        mode={modalMode}
        initialTitle={selectedDocument?.title ?? ""}
        isSubmitting={isSubmitting}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDocument(null);
        }}
        onSubmit={handleSubmitDocument}
      />
    </AdminShell>
  );
}
