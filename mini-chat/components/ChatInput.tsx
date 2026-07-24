"use client";

import { Button } from "@/components/ui/button";

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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const addMessage = useChatMessageStore((state) => state.addMessage);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addMessage(text);
    setText("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  return (
    <form
      onSubmit={handleSend}
      className="mx-auto w-full max-w-5xl px-4 pb-4 pt-2 sm:px-6 lg:px-8"
    >
      <div className="flex min-h-14 items-end gap-2 rounded-3xl border border-slate-200 bg-white px-3 py-2 shadow-lg shadow-slate-200/70">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Đính kèm tệp"
          className="hidden mb-px rounded-full text-slate-400 hover:bg-blue-50 hover:text-blue-700 sm:inline-flex"
        >
          <Paperclip className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Thêm ảnh"
          className="hidden mb-px rounded-full text-slate-400 hover:bg-blue-50 hover:text-blue-700 sm:inline-flex"
        >
          <ImageIcon className="size-4" />
        </Button>
        <textarea
          ref={inputRef}
          rows={1}
          value={text}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Hỏi tôi bất cứ điều gì..."
          className="max-h-40 min-h-9 flex-1 resize-none overflow-y-auto break-words bg-transparent px-2 pt-1.5 text-sm leading-5 outline-none placeholder:text-slate-400"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Ghi âm"
          className="mb-px rounded-full text-slate-400 hover:bg-blue-50 hover:text-blue-700"
        >
          <Mic className="size-4" />
        </Button>
        <Button
          type="submit"
          size="icon"
          title="Gửi tin nhắn"
          disabled={!text.trim()}
          className="mb-px rounded-full bg-blue-600 text-white shadow-sm hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400"
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
