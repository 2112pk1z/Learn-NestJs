import { chatSessionApi } from "@/services/chatSessionApi.service";
import type { ChatSession } from "@/types/chat.type";
import { create } from "zustand";

interface ChatSessionState {
  sessions: ChatSession[];
  selectedSessionId: string | number | null;
  isFetchingSessions: boolean;
  isCreatingSession: boolean;
  sessionError: string | null;

  fetchSessions: () => Promise<void>;
  selectSession: (sessionId: string | number | null) => void;
  createSession: () => Promise<ChatSession | null>;
  updateSessionTitle: (
    sessionId: string | number,
    title: string,
  ) => Promise<void>;
  deleteSession: (sessionId: string | number) => Promise<void>;
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
      });
    } catch {
      set({ sessionError: "Không thể tải danh sách phiên chat!" });
    } finally {
      set({ isFetchingSessions: false });
    }
  },

  selectSession: (sessionId: string | number | null) => {
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

  updateSessionTitle: async (sessionId: string | number, title: string) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    try {
      const updatedSession = await chatSessionApi.updateTitle(
        sessionId,
        trimmedTitle,
      );

      set((state) => ({
        sessions: state.sessions.map((session) =>
          String(session.id) === String(sessionId) ? updatedSession : session,
        ),
      }));
    } catch {
      set({ sessionError: "Không thể đổi tên phiên chat!" });
    }
  },

  deleteSession: async (sessionId: string | number) => {
    try {
      await chatSessionApi.deleteSession(sessionId);

      set((state) => ({
        sessions: state.sessions.filter(
          (session) => String(session.id) !== String(sessionId),
        ),
        selectedSessionId:
          String(state.selectedSessionId) === String(sessionId)
            ? null
            : state.selectedSessionId,
      }));
    } catch {
      set({ sessionError: "Không thể xóa phiên chat!" });
    }
  },
}));
