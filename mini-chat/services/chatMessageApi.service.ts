import { api } from "@/lib/api";
import { unwrapResponse } from "@/services/request.service";
import type { ChatMessage } from "@/types/chat.type";

export const chatMessageApi = {
  async getMessages(sessionId: string | number): Promise<ChatMessage[]> {
    const response = await api.get(`/messages?sessionId=${Number(sessionId)}`);
    const messages = unwrapResponse<ChatMessage[]>(response);

    return messages.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  },

  async createUserMessage(params: {
    sessionId: number | string;
    content: string;
  }): Promise<ChatMessage> {
    const response = await api.post("/messages/user", {
      sessionId: Number(params.sessionId),
      content: params.content,
    });

    return unwrapResponse<ChatMessage>(response);
  },
};

export function buildMessageStreamUrl(params: {
  sessionId: number | string;
  userMessageId: number | string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  return `${baseUrl}/messages/stream?sessionId=${Number(
    params.sessionId,
  )}&userMessageId=${Number(params.userMessageId)}`;
}
