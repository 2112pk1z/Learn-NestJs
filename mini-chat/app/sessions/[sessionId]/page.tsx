import ChatShell from "@/components/ChatShell";

interface SessionPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { sessionId } = await params;

  return (
    <main className="h-screen bg-[#fbfdff] text-slate-900">
      <ChatShell sessionId={sessionId} />
    </main>
  );
}
