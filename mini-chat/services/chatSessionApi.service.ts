import { api } from "@/lib/api";
import { unwrapResponse } from "@/services/request.service";
import type { ChatSession } from "@/types/chat.type";

const DEFAULT_TITLE = "Cuộc trò chuyện mới";

export const chatSessionApi = {
  async getSessions(): Promise<ChatSession[]> {
    const response = await api.get("/sessions");
    return unwrapResponse<ChatSession[]>(response);
  },

  async createSession(): Promise<ChatSession> {
    const response = await api.post("/sessions", {
      title: DEFAULT_TITLE,
      createdAt: new Date().toISOString(),
    });

    return unwrapResponse<ChatSession>(response);
  },

  async updateTitle(sessionId: string, title: string): Promise<ChatSession> {
    const response = await api.put(`/sessions/${sessionId}`, {
      title,
    });

    return unwrapResponse<ChatSession>(response);
  },
};
