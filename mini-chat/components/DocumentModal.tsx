"use client";

import { FileUp, X } from "lucide-react";
import { useEffect, useState } from "react";

type DocumentModalMode = "create" | "edit";

interface DocumentModalProps {
  open: boolean;
  mode: DocumentModalMode;
  initialTitle?: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: { title: string; file: File | null }) => Promise<void>;
}

export default function DocumentModal({
  open,
  mode,
  initialTitle = "",
  isSubmitting = false,
  onClose,
  onSubmit,
}: DocumentModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setFile(null);
      setLocalError(null);
    }
  }, [open, initialTitle]);

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setLocalError("Vui lòng nhập tên tài liệu");
      return;
    }

    if (mode === "create" && !file) {
      setLocalError("Vui lòng chọn file tài liệu");
      return;
    }

    await onSubmit({
      title: title.trim(),
      file,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              {mode === "create" ? "Tải lên tài liệu" : "Cập nhật tài liệu"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {mode === "create"
                ? "Chọn file PDF, DOCX hoặc TXT để thêm vào hệ thống."
                : "Cập nhật tên hiển thị của tài liệu."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="size-4" />
          </button>
        </div>

        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="space-y-4 px-5 py-5"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Tên tài liệu
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition-colors focus:border-blue-500"
              placeholder="Nhập tên tài liệu"
            />
          </div>

          {mode === "create" && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                File tài liệu
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/50">
                <FileUp className="size-6 text-blue-600" />
                <span className="mt-2 text-sm font-medium text-slate-700">
                  {file ? file.name : "Chọn file để tải lên"}
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  Chỉ hỗ trợ PDF, DOCX, TXT
                </span>

                <input
                  type="file"
                  accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  onChange={(event) => {
                    setFile(event.target.files?.[0] ?? null);
                  }}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {localError && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {localError}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-lg px-4 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSubmitting
                ? "Đang lưu..."
                : mode === "create"
                  ? "Tải lên"
                  : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
