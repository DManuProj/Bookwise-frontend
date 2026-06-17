import { useAuth } from "@clerk/nextjs";
import axios, { AxiosInstance } from "axios";
import { useRef } from "react";

// ── Public API instance — for endpoints that don't need auth
// Used for: public booking page, invitation pages
// No 401 interceptor — public endpoints don't require auth
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

// ── Authenticated API hook — for protected routes
// Used for: all dashboard, onboarding, profile pages
// Returns a stable axios instance that auto-attaches the Clerk JWT
export function useApi(): AxiosInstance {
  const { getToken } = useAuth();
  const apiRef = useRef<AxiosInstance | null>(null);

  if (!apiRef.current) {
    const authApi = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    authApi.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    authApi.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          window.location.href = "/";
        }
        return Promise.reject(error);
      },
    );

    apiRef.current = authApi;
  }

  return apiRef.current;
}
