import { create } from "zustand";
import { api } from "@/lib/api";
import { setToken, deleteToken, getToken } from "@/lib/auth-token";
import type { User } from "@/types/api";

type AuthState = {
  user: User | null;
  token: string | null;
  loginError: string | null;
  signupError: string | null;
  isLoading: boolean;
  clearErrors: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; onboardingCompleted: boolean }>;
  signup: (fullName: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loginError: null,
  signupError: null,
  isLoading: false,

  clearErrors: () => set({ loginError: null, signupError: null }),

  login: async (email, password) => {
    set({ loginError: null, signupError: null });
    try {
      const data = await api.auth.login({ email, password });
      await setToken(data.token);
      set({ user: data.user, token: data.token });
      return { success: true, onboardingCompleted: data.onboardingCompleted };
    } catch (err: any) {
      set({ loginError: err.message ?? "Login failed" });
      return { success: false, onboardingCompleted: false };
    }
  },

  signup: async (fullName, email, password) => {
    set({ loginError: null, signupError: null });
    try {
      const data = await api.auth.signup({ name: fullName, email, password });
      await setToken(data.token);
      set({ user: data.user, token: data.token });
      return true;
    } catch (err: any) {
      set({ signupError: err.message ?? "Sign up failed" });
      return false;
    }
  },

  logout: async () => {
    await deleteToken();
    set({ user: null, token: null });
  },

  hydrate: async () => {
    set({ isLoading: true });
    try {
      const storedToken = await getToken();
      if (!storedToken) return;
      const data = await api.auth.me();
      set({ user: data.user, token: storedToken });
    } catch {
      await deleteToken();
    } finally {
      set({ isLoading: false });
    }
  },
}));
