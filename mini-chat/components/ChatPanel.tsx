"use client";

import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import { Button } from "@/components/ui/button";
import { useChatScroll } from "@/hooks/useChatScroll";
import { useChatMessageStore } from "@/store/useChatMessageStore";
import { useChatSessionStore } from "@/store/useChatSessionStore";
import {
  AlertCircle,
  ArrowDown,
  Loader2,
  Menu,
  PanelLeftOpen,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface ChatPanelProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function ChatPanel({
  isSidebarOpen,
  onToggleSidebar,
}: ChatPanelProps) {
  const selectedSessionId = useChatSessionStore(
    (state) => state.selectedSessionId,
  );

  const {
    messages,
    isFetchingMessages,
    isSendingMessage,
    messageError,
    fetchHistory,
    clearMessageError,
  } = useChatMessageStore();

  const isLoading = isFetchingMessages || isSendingMessage;

  const { ref, scrollToBottom } = useChatScroll([messages, isLoading]);

  useEffect(() => {
    if (!selectedSessionId) return;
    fetchHistory(selectedSessionId);
  }, [selectedSessionId, fetchHistory]);

  return (
    <section className="relative flex min-w-0 flex-1 flex-col bg-[#fbfdff]">
      <header className="flex h-14 items-center justify-between border-b border-slate-100 bg-white/85 px-3 backdrop-blur md:px-5">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onToggleSidebar}
            title={isSidebarOpen ? "Thu thanh bên" : "Mở thanh bên"}
            className="text-slate-600 hover:bg-blue-50 hover:text-blue-700"
          >
            {isSidebarOpen ? (
              <Menu className="size-5" />
            ) : (
              <PanelLeftOpen className="size-5" />
            )}
          </Button>
          <div>
            <h1 className="text-sm font-semibold text-slate-900 md:text-base">
              Legal AI
            </h1>
            <p className="hidden text-xs text-slate-500 sm:block">
              Trò chuyện và tra cứu pháp lý
            </p>
          </div>
        </div>

        <Link
          href="/login"
          className="inline-flex h-9 items-center justify-center rounded-full bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Đăng nhập
        </Link>
      </header>

      <div ref={ref} className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
          ))}

          {isLoading && (
            <div className="flex animate-pulse items-center gap-2 px-2 text-sm text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              <span>Đang xử lý dữ liệu với Server...</span>
            </div>
          )}
        </div>
      </div>

      {messageError && (
        <div className="mx-auto mb-2 w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{messageError}</span>
            </div>

            <button
              type="button"
              onClick={clearMessageError}
              className="text-red-400 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <Button
        onClick={scrollToBottom}
        variant="outline"
        size="icon"
        className="absolute bottom-24 right-4 z-10 rounded-full border-slate-200 bg-white text-slate-500 shadow-md hover:bg-blue-50 hover:text-blue-700 sm:right-6"
        title="Cuộn xuống dưới"
      >
        <ArrowDown className="h-4 w-4" />
      </Button>

      <div className={isLoading ? "pointer-events-none opacity-60" : ""}>
        <ChatInput />
      </div>
    </section>
  );
}
