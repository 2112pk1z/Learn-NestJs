import {
  buildMessageStreamUrl,
  chatMessageApi,
} from "@/services/chatMessageApi.service";
import type { ChatMessage } from "@/types/chat.type";
import { EventSourcePolyfill } from "event-source-polyfill";
import { create } from "zustand";
import { useChatSessionStore } from "./useChatSessionStore";

interface ChatMessageState {
  messages: ChatMessage[];
  isFetchingMessages: boolean;
  isSendingMessage: boolean;
  messageError: string | null;

  fetchHistory: (sessionId: string | number) => Promise<void>;
  addMessage: (text: string) => Promise<void>;
  clearMessageError: () => void;
}

let latestHistoryRequestId = 0;

export const useChatMessageStore = create<ChatMessageState>((set) => ({
  messages: [],
  isFetchingMessages: false,
  isSendingMessage: false,
  messageError: null,

  clearMessageError: () => set({ messageError: null }),

  fetchHistory: async (sessionId: string | number) => {
    const requestId = ++latestHistoryRequestId;

    set({
      isFetchingMessages: true,
      messageError: null,
      messages: [],
    });

    try {
      const messages = await chatMessageApi.getMessages(sessionId);
      if (requestId !== latestHistoryRequestId) return;

      set({ messages });
    } catch {
      if (requestId !== latestHistoryRequestId) return;

      set({
        messageError: "Không thể tải lịch sử đoạn chat từ server!",
      });
    } finally {
      if (requestId === latestHistoryRequestId) {
        set({ isFetchingMessages: false });
      }
    }
  },

  addMessage: async (text: string) => {
    const { selectedSessionId, fetchSessions } = useChatSessionStore.getState();

    if (!selectedSessionId) {
      set({
        messageError: "Vui lòng chọn một phiên chat trước khi gửi tin nhắn!",
      });
      return;
    }

    const tempUserId = `temp-user-${Date.now()}`;

    const tempUserMsg: ChatMessage = {
      id: tempUserId,
      sessionId: selectedSessionId,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, tempUserMsg],
      isSendingMessage: true,
      messageError: null,
    }));

    try {
      const savedUserMessage = await chatMessageApi.createUserMessage({
        sessionId: selectedSessionId,
        content: text,
      });

      set((state) => ({
        messages: state.messages.map((message) =>
          message.id === tempUserId ? savedUserMessage : message,
        ),
      }));

      const token = localStorage.getItem("accessToken");

      if (!token) {
        set({
          messageError: "Bạn cần đăng nhập để gửi tin nhắn!",
          isSendingMessage: false,
        });
        return;
      }

      const streamUrl = buildMessageStreamUrl({
        sessionId: selectedSessionId,
        userMessageId: savedUserMessage.id,
      });

      const tempAssistantId = `temp-assistant-${Date.now()}`;

      const tempAssistantMsg: ChatMessage = {
        id: tempAssistantId,
        sessionId: selectedSessionId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, tempAssistantMsg],
      }));

      const eventSource = new EventSourcePolyfill(streamUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      eventSource.addEventListener("chunk", (event) => {
        const messageEvent = event as MessageEvent;
        const data = JSON.parse(messageEvent.data) as { content: string };

        set((state) => ({
          messages: state.messages.map((message) =>
            message.id === tempAssistantId
              ? { ...message, content: message.content + data.content }
              : message,
          ),
        }));
      });

      eventSource.addEventListener("done", (event) => {
        const messageEvent = event as MessageEvent;
        const assistantMessage = JSON.parse(messageEvent.data) as ChatMessage;

        set((state) => ({
          messages: state.messages.map((message) =>
            message.id === tempAssistantId ? assistantMessage : message,
          ),
          isSendingMessage: false,
        }));

        void fetchSessions();

        eventSource.close();
      });

      eventSource.onerror = () => {
        set({
          messageError: "Kết nối phản hồi bị gián đoạn!",
          isSendingMessage: false,
        });

        eventSource.close();
      };
    } catch {
      set({
        messageError: "Không thể gửi tin nhắn, vui lòng thử lại!",
        isSendingMessage: false,
      });
    }
  },
}));
