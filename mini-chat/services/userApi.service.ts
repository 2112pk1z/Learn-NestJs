import { api } from "@/lib/api";
import { unwrapResponse } from "@/services/request.service";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  isActive: boolean;
  role: "user";
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  password?: string;
  dateOfBirth?: string;
  isActive?: boolean;
}

export interface UserStats {
  activeUsers: number;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

async function updateUser(
  id: number,
  payload: UpdateUserPayload,
): Promise<AdminUser> {
  const response = await api.patch(`/users/${id}`, payload);
  return unwrapResponse<AdminUser>(response);
}

export const userApi = {
  async getUsers(search?: string): Promise<AdminUser[]> {
    const response = await api.get("/users", {
      params: {
        search: search?.trim() || undefined,
      },
    });

    return unwrapResponse<AdminUser[]>(response);
  },

  async getStats(): Promise<UserStats> {
    const response = await api.get("/users/stats");
    return unwrapResponse<UserStats>(response);
  },

  updateUser,

  async updateStatus(id: number, isActive: boolean): Promise<AdminUser> {
    return updateUser(id, { isActive });
  },

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    const response = await api.patch("/users/me/password", payload);
    unwrapResponse<null>(response);
  },
};
