import { create } from "zustand";
import { User } from "../types/user";

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
      const res = await fetch("http://localhost:5001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Register failed");
    } catch (err: any) {
      throw new Error(err.message || "Register failed");
    }
  },

  login: async (email, password) => {
    try {
      const res = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

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
    const token =
      get().token ||
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    if (!token) return;

    try {
      const res = await fetch("http://localhost:5001/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        get().logout();
        return;
      }

      const user = await res.json();
      get().setUser(user);
    } catch (err) {
      get().logout();
    }
  },
}));
