"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatMessageStore } from "@/store/useChatMessageStore";
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
      className="mx-auto flex w-full max-w-6xl gap-2 border-t bg-white px-8 py-4"
    >
      <Input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nhập tin nhắn..."
        className="h-11 flex-1 rounded-full px-4"
      />
      <Button type="submit" className="h-11 rounded-full px-5">
        Gửi
      </Button>
    </form>
  );
}
