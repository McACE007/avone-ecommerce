import { API_ROUTES } from "@/utils/api";
import axios, { isAxiosError } from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "SUPER_ADMIN";
};

type AuthStore = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<string | null>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
};

const axoisInstance = axios.create({
  baseURL: API_ROUTES.AUTH,
  withCredentials: true,
});

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      register: async (name, email, password) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axoisInstance.post("/register", {
            name,
            email,
            password,
          });
          set({ isLoading: false });
          return response.data.userId;
        } catch (error) {
          console.error(error);
          set({
            isLoading: false,
            error: isAxiosError(error)
              ? error.response?.data.error
              : "Registration failed",
          });
          return null;
        }
      },
      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axoisInstance.post("/login", {
            email,
            password,
          });
          set({ isLoading: false, user: response.data.user });
          return true;
        } catch (error) {
          console.error(error);
          set({
            isLoading: false,
            error: isAxiosError(error)
              ? error.response?.data.error
              : "Login failed",
          });
          return false;
        }
      },
      logout: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await axoisInstance.post("/logout");
          set({ isLoading: false, user: null });
          return;
        } catch (error) {
          console.error(error);
          set({
            isLoading: false,
            error: isAxiosError(error)
              ? error.response?.data.error
              : "Logout failed",
          });
          return;
        }
      },
      refreshAccessToken: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await axoisInstance.post("/refresh-token");
          set({ isLoading: false });
          return true;
        } catch (error) {
          console.error(error);
          set({
            isLoading: false,
            error: isAxiosError(error)
              ? error.response?.data.error
              : "Refresh failed",
          });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
