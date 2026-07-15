import ChatPanel from "@/components/ChatPanel";
import ChatSidebar from "@/components/ChatSidebar";

export default function Home() {
  return (
    <main className="h-screen bg-white text-slate-950">
      <div className="flex h-full">
        <ChatSidebar />
        <ChatPanel />
      </div>
    </main>
  );
}
