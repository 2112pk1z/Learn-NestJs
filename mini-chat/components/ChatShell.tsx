"use client";

import ChatPanel from "@/components/ChatPanel";
import ChatSidebar from "@/components/ChatSidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatSessionStore } from "@/store/useChatSessionStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ChatShellProps {
  sessionId?: string;
}

export default function ChatShell({ sessionId }: ChatShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const selectSession = useChatSessionStore((state) => state.selectSession);
  const router = useRouter();
  const { isAuthenticated, isLoading, loadProfile } = useAuthStore();

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    selectSession(sessionId ?? null);
  }, [sessionId, selectSession]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const syncSidebar = () => setIsSidebarOpen(mediaQuery.matches);

    syncSidebar();
    mediaQuery.addEventListener("change", syncSidebar);

    return () => mediaQuery.removeEventListener("change", syncSidebar);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#fbfdff] text-sm text-slate-500">
        Đang kiểm tra đăng nhập...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-full overflow-hidden bg-[#fbfdff]">
      <ChatSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <ChatPanel
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((isOpen) => !isOpen)}
      />
    </div>
  );
}
