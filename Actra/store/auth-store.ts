import { create } from "zustand";
import { api } from "@/lib/api";
import { setToken, deleteToken, getToken } from "@/lib/auth-token";
import type { User } from "@/types/api";

type AuthState = {
  user: User | null;
  token: string | null;
  onboardingCompleted: boolean;
  isHydrated: boolean;
  loginError: string | null;
  signupError: string | null;
  clearErrors: () => void;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; onboardingCompleted: boolean }>;
  signup: (fullName: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  markOnboardingComplete: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  onboardingCompleted: false,
  isHydrated: false,
  loginError: null,
  signupError: null,

  clearErrors: () => set({ loginError: null, signupError: null }),

  login: async (email, password) => {
    set({ loginError: null, signupError: null });
    try {
      const data = await api.auth.login({ email, password });
      await setToken(data.token);
      set({
        user: data.user,
        token: data.token,
        onboardingCompleted: data.onboardingCompleted,
      });
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
      set({
        user: data.user,
        token: data.token,
        onboardingCompleted: false,
      });
      return true;
    } catch (err: any) {
      set({ signupError: err.message ?? "Sign up failed" });
      return false;
    }
  },

  logout: async () => {
    await deleteToken();
    set({
      user: null,
      token: null,
      onboardingCompleted: false,
    });
  },

  hydrate: async () => {
    try {
      const storedToken = await getToken();
      if (!storedToken) {
        set({ user: null, token: null, onboardingCompleted: false });
        return;
      }
      const data = await api.auth.me();
      set({
        user: data.user,
        token: storedToken,
        onboardingCompleted: data.onboardingCompleted,
      });
    } catch {
      await deleteToken();
      set({ user: null, token: null, onboardingCompleted: false });
    } finally {
      set({ isHydrated: true });
    }
  },

  markOnboardingComplete: () => set({ onboardingCompleted: true }),
}));
