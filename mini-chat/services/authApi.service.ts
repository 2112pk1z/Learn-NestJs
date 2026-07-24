import { api } from "@/lib/api";
import { unwrapResponse } from "@/services/request.service";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  dateOfBirth: string;
}

export interface LoginResponse {
  accessToken: string;
  name: string;
  email: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  isActive: boolean;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
}

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await api.post("/auth/login", payload);
    return unwrapResponse<LoginResponse>(response);
  },

  async register(payload: RegisterPayload): Promise<UserProfile> {
    const response = await api.post("/auth/register", payload);
    return unwrapResponse<UserProfile>(response);
  },

  async getProfile(): Promise<UserProfile> {
    const response = await api.get("/auth/profile");
    return unwrapResponse<UserProfile>(response);
  },
};
