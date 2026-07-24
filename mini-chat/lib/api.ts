import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      localStorage.removeItem("accessToken");

      const isAdminPath = window.location.pathname.startsWith("/admin");
      const loginPath = isAdminPath ? "/admin/login" : "/login";

      if (window.location.pathname !== loginPath) {
        window.location.href = loginPath;
      }
    }

    return Promise.reject(error);
  },
);
