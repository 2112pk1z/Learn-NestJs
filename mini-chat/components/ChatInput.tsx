"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatMessageStore } from "@/store/useChatMessageStore";
import {
  Image as ImageIcon,
  Mic,
  Paperclip,
  SendHorizontal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ChatInput() {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const addMessage = useChatMessageStore((state) => state.addMessage);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addMessage(text);
    setText("");
  };

  return (
    <form
      onSubmit={handleSend}
      className="mx-auto w-full max-w-5xl px-4 pb-4 pt-2 sm:px-6 lg:px-8"
    >
      <div className="flex min-h-14 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 shadow-lg shadow-slate-200/70">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          title="Đính kèm tệp"
          className="hidden rounded-full text-slate-400 hover:bg-blue-50 hover:text-blue-700 sm:inline-flex"
        >
          <Paperclip className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          title="Thêm ảnh"
          className="hidden rounded-full text-slate-400 hover:bg-blue-50 hover:text-blue-700 sm:inline-flex"
        >
          <ImageIcon className="size-4" />
        </Button>
        <Input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Hỏi tôi bất cứ điều gì..."
          className="h-11 flex-1 border-0 bg-transparent px-2 shadow-none focus-visible:ring-0"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          title="Ghi âm"
          className="rounded-full text-slate-400 hover:bg-blue-50 hover:text-blue-700"
        >
          <Mic className="size-4" />
        </Button>
        <Button
          type="submit"
          size="icon"
          title="Gửi tin nhắn"
          disabled={!text.trim()}
          className="rounded-full bg-blue-600 text-white shadow-sm hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400"
        >
          <SendHorizontal className="size-4" />
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-slate-400">
        Legal AI là trí tuệ nhân tạo và có thể mắc sai sót.
      </p>
    </form>
  );
}
