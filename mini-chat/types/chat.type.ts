export type ChatRole = "user" | "assistant";

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  message: string;
}
