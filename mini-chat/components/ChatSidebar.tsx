"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useChatSessionStore } from "@/store/useChatSessionStore";
import {
  Check,
  MessageSquare,
  MoreVertical,
  PanelLeftClose,
  Pencil,
  Plus,
  Scale,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const [openMenuSessionId, setOpenMenuSessionId] = useState<
    string | number | null
  >(null);
  const [editingSessionId, setEditingSessionId] = useState<
    string | number | null
  >(null);
  const [editingTitle, setEditingTitle] = useState("");

  const router = useRouter();

  const {
    sessions,
    selectedSessionId,
    fetchSessions,
    createSession,
    updateSessionTitle,
    deleteSession,
  } = useChatSessionStore();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return (
    <>
      <button
        type="button"
        aria-label="Đóng thanh bên"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-[1px] transition-opacity md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[280px] shrink-0 flex-col overflow-hidden border-r border-slate-200/80 bg-[#f7f9ff] p-3 shadow-xl shadow-slate-200/60 transition-[transform,width,padding] duration-300 ease-out md:transition-none md:static md:z-auto md:translate-x-0 md:shadow-none",
          isOpen
            ? "translate-x-0 md:w-64"
            : "-translate-x-full md:w-0 md:border-r-0 md:p-0",
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-3 px-1">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Scale className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-900">
                Legal AI
              </div>
              <div className="text-xs text-slate-500">Trợ lý pháp lý</div>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            title="Thu thanh bên"
            className="text-slate-500 hover:bg-white hover:text-slate-900"
          >
            <PanelLeftClose className="size-4" />
          </Button>
        </div>

        <Button
          variant="ghost"
          className="mb-3 h-10 justify-start gap-2 rounded-full border border-slate-200 bg-white px-4 text-slate-700 shadow-sm hover:bg-blue-50 hover:text-blue-700"
          onClick={async () => {
            const newSession = await createSession();

            if (newSession) {
              router.push(`/sessions/${newSession.id}`);
            }
          }}
        >
          <Plus className="h-4 w-4" />
          Cuộc trò chuyện mới
        </Button>

        <div className="mb-4 flex h-9 items-center gap-2 rounded-lg border border-transparent bg-white/75 px-3 text-sm text-slate-400 shadow-sm">
          <Search className="size-4 shrink-0" />
          <span className="truncate">Tìm kiếm trò chuyện...</span>
        </div>

        <div className="mb-2 flex items-center justify-between px-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Phiên chat
          </span>
          <span className="text-xs text-slate-400">{sessions.length}</span>
        </div>

        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
          {sessions.map((session) => {
            const isEditing = editingSessionId === session.id;

            return (
              <div
                key={session.id}
                className={cn(
                  "group flex items-center gap-1 rounded-lg px-2 py-1.5 text-slate-600 transition-colors hover:bg-white hover:text-slate-900",
                  String(selectedSessionId) === String(session.id) &&
                    "bg-white font-medium text-blue-700 shadow-sm",
                )}
              >
                {isEditing ? (
                  <>
                    <input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="min-w-0 flex-1 rounded-lg border border-blue-100 bg-white px-2 py-1 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                      autoFocus
                    />

                    <button
                      type="button"
                      onClick={async () => {
                        await updateSessionTitle(session.id, editingTitle);
                        setEditingSessionId(null);
                      }}
                      className="rounded-lg p-1 text-blue-600 hover:bg-blue-50"
                    >
                      <Check className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingSessionId(null)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuSessionId(null);
                        router.push(`/sessions/${session.id}`);

                        if (window.innerWidth < 768) {
                          onClose();
                        }
                      }}
                      className="flex min-w-0 flex-1 items-center gap-2 py-1 text-left text-sm"
                    >
                      <MessageSquare className="h-4 w-4 shrink-0" />
                      <span className="truncate">{session.title}</span>
                    </button>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpenMenuSessionId(
                            openMenuSessionId === session.id
                              ? null
                              : session.id,
                          );
                        }}
                        className="invisible rounded-lg p-1 text-slate-400 hover:bg-blue-50 hover:text-blue-700 group-hover:visible"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {openMenuSessionId === session.id && (
                        <div className="absolute right-0 top-7 z-20 w-32 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSessionId(session.id);
                              setEditingTitle(session.title);
                              setOpenMenuSessionId(null);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Pencil className="h-4 w-4" />
                            Sửa
                          </button>

                          <button
                            type="button"
                            onClick={async () => {
                              const confirmed = window.confirm(
                                "Bạn có chắc muốn xóa phiên chat này?",
                              );
                              if (!confirmed) return;
                              await deleteSession(session.id);
                              setOpenMenuSessionId(null);

                              if (
                                String(selectedSessionId) === String(session.id)
                              ) {
                                router.push("/");
                              }
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Xóa
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
