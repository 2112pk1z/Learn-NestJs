import { chatMessageApi } from "@/services/chatMessageApi.service";
import { useChatSessionStore } from "@/store/useChatSessionStore";
import type { ChatMessage } from "@/types/chat.type";
import { create } from "zustand";

const DEFAULT_SESSION_TITLE = "Cuộc trò chuyện mới";

interface ChatMessageState {
  messages: ChatMessage[];
  isFetchingMessages: boolean;
  isSendingMessage: boolean;
  messageError: string | null;

  fetchHistory: (sessionId: string) => Promise<void>;
  addMessage: (text: string) => Promise<void>;
  createWelcomeMessage: (sessionId: string) => Promise<void>;
  clearMessageError: () => void;
}

export const useChatMessageStore = create<ChatMessageState>((set) => ({
  messages: [],
  isFetchingMessages: false,
  isSendingMessage: false,
  messageError: null,

  clearMessageError: () => set({ messageError: null }),

  fetchHistory: async (sessionId: string) => {
    set({ isFetchingMessages: true, messageError: null, messages: [] });

    try {
      const messages = await chatMessageApi.getMessages(sessionId);
      set({ messages });
    } catch {
      set({ messageError: "Không thể tải lịch sử đoạn chat từ server!" });
    } finally {
      set({ isFetchingMessages: false });
    }
  },

  createWelcomeMessage: async (sessionId: string) => {
    set({ messageError: null });
    try {
      const welcomeMessage = await chatMessageApi.createMessage({
        sessionId,
        role: "assistant",
        content: "Xin chào, tôi có thể giúp gì cho bạn?",
      });

      set({ messages: [welcomeMessage] });
    } catch {
      set({ messageError: "Không thể tạo tin nhắn chào mừng!" });
    }
  },

  addMessage: async (text: string) => {
    const { selectedSessionId, sessions, updateSessionTitle } =
      useChatSessionStore.getState();

    if (!selectedSessionId) {
      set({
        messageError: "Vui lòng chọn một phiên chat trước khi gửi tin nhắn!",
      });
      return;
    }

    const tempUserMsg: ChatMessage = {
      id: Date.now().toString(),
      sessionId: selectedSessionId,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    const currentSession = sessions.find(
      (session) => session.id === selectedSessionId,
    );

    const shouldRenameSession = currentSession?.title === DEFAULT_SESSION_TITLE;

    set((state) => ({
      messages: [...state.messages, tempUserMsg],
      isSendingMessage: true,
      messageError: null,
    }));

    try {
      await chatMessageApi.createMessage({
        sessionId: selectedSessionId,
        role: "user",
        content: text,
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      const assistantMessage = await chatMessageApi.createMessage({
        sessionId: selectedSessionId,
        role: "assistant",
        content: `Hệ thống đã lưu trữ thành công tin nhắn: "${text}"`,
      });

      if (shouldRenameSession) {
        const newTitle = text.length > 40 ? `${text.slice(0, 40)}...` : text;
        await updateSessionTitle(selectedSessionId, newTitle);
      }

      set((state) => ({
        messages: [...state.messages, assistantMessage],
      }));
    } catch {
      set({ messageError: "Không thể gửi tin nhắn, vui lòng thử lại!" });
    } finally {
      set({ isSendingMessage: false });
    }
  },
}));
