import { MessageSquarePlus } from "lucide-react";

export default function ChatEmptyState() {
  return (
    <div className="flex h-full items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <MessageSquarePlus className="size-6" />
        </div>

        <h2 className="text-xl font-semibold text-slate-900">
          Chào mừng đến với Legal AI
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Chọn một phiên chat ở thanh bên hoặc mở cuộc trò chuyện mới để bắt
          đầu.
        </p>
      </div>
    </div>
  );
}
