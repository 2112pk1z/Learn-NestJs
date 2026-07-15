import { chatSessionApi } from "@/services/chatSessionApi.service";
import type { ChatSession } from "@/types/chat.type";
import { create } from "zustand";

interface ChatSessionState {
  sessions: ChatSession[];
  selectedSessionId: string | null;
  isFetchingSessions: boolean;
  isCreatingSession: boolean;
  sessionError: string | null;

  fetchSessions: () => Promise<void>;
  selectSession: (sessionId: string) => void;
  createSession: () => Promise<ChatSession | null>;
  updateSessionTitle: (sessionId: string, title: string) => Promise<void>;
  clearSessionError: () => void;
}

export const useChatSessionStore = create<ChatSessionState>((set) => ({
  sessions: [],
  selectedSessionId: null,
  isFetchingSessions: false,
  isCreatingSession: false,
  sessionError: null,

  clearSessionError: () => set({ sessionError: null }),

  fetchSessions: async () => {
    set({ isFetchingSessions: true, sessionError: null });

    try {
      const sessions = await chatSessionApi.getSessions();

      const sortedSessions = sessions.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      set({
        sessions: sortedSessions,
        selectedSessionId: sortedSessions[0]?.id ?? null,
      });
    } catch {
      set({ sessionError: "Không thể tải danh sách phiên chat!" });
    } finally {
      set({ isFetchingSessions: false });
    }
  },

  selectSession: (sessionId: string) => {
    set({ selectedSessionId: sessionId });
  },

  createSession: async () => {
    set({ isCreatingSession: true, sessionError: null });

    try {
      const newSession = await chatSessionApi.createSession();

      set((state) => ({
        sessions: [newSession, ...state.sessions],
      }));

      return newSession;
    } catch {
      set({ sessionError: "Không thể tạo phiên chat mới!" });
      return null;
    } finally {
      set({ isCreatingSession: false });
    }
  },

  updateSessionTitle: async (sessionId: string, title: string) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    try {
      const updatedSession = await chatSessionApi.updateTitle(
        sessionId,
        trimmedTitle,
      );

      set((state) => ({
        sessions: state.sessions.map((session) =>
          session.id === sessionId ? updatedSession : session,
        ),
      }));
    } catch {
      set({ sessionError: "Không thể đổi tên phiên chat!" });
    }
  },
}));
