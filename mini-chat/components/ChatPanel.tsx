"use client";

import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import { Button } from "@/components/ui/button";
import { useChatScroll } from "@/hooks/useChatScroll";
import { useChatMessageStore } from "@/store/useChatMessageStore";
import { useChatSessionStore } from "@/store/useChatSessionStore";
import { AlertCircle, ArrowDown, Loader2, X } from "lucide-react";
import { useEffect } from "react";

export default function ChatPanel() {
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
    <section className="relative flex min-w-0 flex-1 flex-col">
      <header className="flex h-14 items-center justify-between border-b px-4">
        <div>
          <h1 className="font-semibold">Mini Chat</h1>
        </div>

        <Button>Đăng nhập</Button>
      </header>

      <div ref={ref} className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-6xl px-8 py-6">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 px-2 text-sm text-slate-400 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span>Đang xử lý dữ liệu với Server...</span>
            </div>
          )}
        </div>
      </div>

      {messageError && (
        <div className="mx-auto mb-2 w-full max-w-6xl px-8">
          <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{messageError}</span>
            </div>

            <button
              onClick={clearMessageError}
              className="text-red-400 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <Button
        onClick={scrollToBottom}
        variant="outline"
        size="icon"
        className="absolute bottom-24 right-6 z-10 rounded-full bg-white shadow-md"
        title="Cuộn xuống dưới"
      >
        <ArrowDown className="w-4 h-4" />
      </Button>

      <div className={isLoading ? "opacity-60 pointer-events-none" : ""}>
        <ChatInput />
      </div>
    </section>
  );
}
