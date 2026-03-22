import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach Clerk JWT to every request
api.interceptors.request.use(async (config) => {
  try {
    // We'll wire this to Clerk's getToken later
    // when backend is ready
    const token = null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Failed to get auth token", error);
  }
  return config;
});

// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized — redirect to sign in
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);

export default api;