import { useAuth } from "@clerk/nextjs";
import axios from "axios";

// ── Public API instance — for endpoints that don't need auth
// Used for: public booking page, invitation pages
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Global 401 handling for public api too
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default api;

// ── Authenticated API hook — for protected routes
// Used for: all dashboard, onboarding, profile pages
// Returns an axios instance that auto-attaches the Clerk JWT
export function useApi() {
  const { getToken } = useAuth();

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

  return authApi;
}
