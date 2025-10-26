import { create } from "zustand";
import { User } from "../types/user";
import * as api from "@/app/lib/api";

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;

  register: (username: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  isAuthenticated: () => boolean;
}

export const useAuth = create<AuthState>((set, get) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user: null,

  setToken: (token) => {
    set({ token });
    if (typeof window !== "undefined") {
      if (token) localStorage.setItem("token", token);
      else localStorage.removeItem("token");
    }
  },

  setUser: (user) => set({ user }),

  isAuthenticated: () => !!get().token && !!get().user,

  register: async (username, email, password) => {
    try {
      await api.post("/auth/register", { username, email, password });
    } catch (err: any) {
      throw new Error(err.message || "Register failed");
    }
  },

  login: async (email, password) => {
    try {
      const data = await api.post<{ access_token: string }>("/auth/login", { email, password });
      get().setToken(data.access_token);
      await get().fetchUser();
    } catch (err: any) {
      throw new Error(err.message || "Login failed");
    }
  },

  logout: () => {
    set({ token: null, user: null });
    if (typeof window !== "undefined") localStorage.removeItem("token");
  },

  fetchUser: async () => {
    const token = get().token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!token) return;

    try {
      const user = await api.get<User>("/auth/me", true);
      get().setUser(user);
    } catch (err) {
      get().logout();
    }
  },
}));