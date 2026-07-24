export type ChatRole = "user" | "assistant";

export interface ChatSession {
  id: number | string;
  title: string;
  createdAt: string;
  updatedAt?: string;
  status?: boolean;
}

export interface ChatMessage {
  id: number | string;
  sessionId?: number | string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  message: string;
}
