import {
  authApi,
  type LoginPayload,
  type RegisterPayload,
  type UserProfile,
} from "@/services/authApi.service";
import { userApi, type UpdateUserPayload } from "@/services/userApi.service";
import axios from "axios";
import { create } from "zustand";

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  loadProfile: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
  adminLogin: (payload: LoginPayload) => Promise<boolean>;
  updateProfile: (payload: UpdateUserPayload) => Promise<boolean>;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.message;

    if (Array.isArray(responseMessage)) {
      return responseMessage.join(", ");
    }

    if (typeof responseMessage === "string") {
      return responseMessage;
    }
  }

  return fallback;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  clearError: () => set({ error: null }),

  login: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const loginData = await authApi.login(payload);

      localStorage.setItem("accessToken", loginData.accessToken);

      const profile = await authApi.getProfile();

      set({
        user: profile,
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      localStorage.removeItem("accessToken");

      set({
        user: null,
        isAuthenticated: false,
        error: getErrorMessage(error, "Đăng nhập thất bại"),
      });

      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      await authApi.register(payload);
      return true;
    } catch (error) {
      set({
        error: getErrorMessage(error, "Đăng ký thất bại"),
      });

      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  loadProfile: async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      set({
        user: null,
        isAuthenticated: false,
      });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const profile = await authApi.getProfile();

      set({
        user: profile,
        isAuthenticated: true,
      });
    } catch {
      localStorage.removeItem("accessToken");

      set({
        user: null,
        isAuthenticated: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("accessToken");

    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  adminLogin: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const loginData = await authApi.login(payload);

      localStorage.setItem("accessToken", loginData.accessToken);

      const profile = await authApi.getProfile();

      if (profile.role !== "admin") {
        localStorage.removeItem("accessToken");

        set({
          user: null,
          isAuthenticated: false,
          error: "Tài khoản không có quyền quản trị",
        });

        return false;
      }

      set({
        user: profile,
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      localStorage.removeItem("accessToken");

      set({
        user: null,
        isAuthenticated: false,
        error: getErrorMessage(error, "Đăng nhập admin thất bại"),
      });

      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (payload) => {
    const currentUser = get().user;

    if (!currentUser) {
      set({ error: "Bạn cần đăng nhập để cập nhật thông tin" });
      return false;
    }

    set({ isLoading: true, error: null });

    try {
      const updatedUser = await userApi.updateUser(currentUser.id, payload);

      set({
        user: updatedUser,
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      set({
        error: getErrorMessage(error, "Không thể cập nhật thông tin"),
      });

      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
