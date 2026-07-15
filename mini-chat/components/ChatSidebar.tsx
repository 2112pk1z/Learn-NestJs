"use client";

import { Button } from "@/components/ui/button";
import { useChatMessageStore } from "@/store/useChatMessageStore";
import { useChatSessionStore } from "@/store/useChatSessionStore";
import { Check, MessageSquare, Pencil, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function ChatSidebar() {
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const {
    sessions,
    selectedSessionId,
    fetchSessions,
    selectSession,
    createSession,
    updateSessionTitle,
  } = useChatSessionStore();

  const createWelcomeMessage = useChatMessageStore(
    (state) => state.createWelcomeMessage,
  );

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r bg-slate-50 p-3">
      <div className="mb-4 px-2 text-lg font-semibold">Mini Chat</div>

      <Button
        variant="ghost"
        className="mb-4 justify-start gap-2"
        onClick={async () => {
          const newSession = await createSession();

          if (newSession) {
            await createWelcomeMessage(newSession.id);
            selectSession(newSession.id);
          }
        }}
      >
        <Plus className="h-4 w-4" />
        Đoạn chat mới
      </Button>

      <div className="mb-2 flex items-center justify-between px-2">
        <span className="text-xs font-medium text-slate-500">Phiên chat</span>
        <span className="text-xs text-slate-400">{sessions.length}</span>
      </div>

      <div className="space-y-1">
        {sessions.map((session) => {
          const isEditing = editingSessionId === session.id;

          return (
            <div
              key={session.id}
              className={`group flex items-center gap-1 rounded-md px-2 py-1 hover:bg-slate-200 ${
                selectedSessionId === session.id
                  ? "bg-slate-200 font-medium"
                  : ""
              }`}
            >
              {isEditing ? (
                <>
                  <input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="min-w-0 flex-1 rounded border bg-white px-2 py-1 text-sm outline-none"
                    autoFocus
                  />

                  <button
                    onClick={async () => {
                      await updateSessionTitle(session.id, editingTitle);
                      setEditingSessionId(null);
                    }}
                    className="rounded p-1 hover:bg-slate-300"
                  >
                    <Check className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setEditingSessionId(null)}
                    className="rounded p-1 hover:bg-slate-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => selectSession(session.id)}
                    className="flex min-w-0 flex-1 items-center gap-2 py-1 text-left text-sm"
                  >
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    <span className="truncate">{session.title}</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingSessionId(session.id);
                      setEditingTitle(session.title);
                    }}
                    className="invisible rounded p-1 hover:bg-slate-300 group-hover:visible"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
