"use client";

import ChatPanel from "@/components/ChatPanel";
import ChatSidebar from "@/components/ChatSidebar";
import { useEffect, useState } from "react";

export default function ChatShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const syncSidebar = () => setIsSidebarOpen(mediaQuery.matches);

    syncSidebar();
    mediaQuery.addEventListener("change", syncSidebar);

    return () => mediaQuery.removeEventListener("change", syncSidebar);
  }, []);

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
