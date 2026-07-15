import { api } from "@/lib/api";
import { unwrapResponse } from "@/services/request.service";
import type { ChatMessage, ChatRole } from "@/types/chat.type";

export const chatMessageApi = {
  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    const response = await api.get(`/messages?sessionId=${sessionId}`);
    const messages = unwrapResponse<ChatMessage[]>(response);

    return messages.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  },

  async createMessage(params: {
    sessionId: string;
    role: ChatRole;
    content: string;
  }): Promise<ChatMessage> {
    const response = await api.post("/messages", {
      sessionId: params.sessionId,
      role: params.role,
      content: params.content,
      createdAt: new Date().toISOString(),
    });

    return unwrapResponse<ChatMessage>(response);
  },
};
