import { create } from "zustand";

type AuthState = {
  loginError: string | null;
  signupError: string | null;
  clearErrors: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    fullName: string,
    email: string,
    password: string,
  ) => Promise<boolean>;
};

export const useAuthStore = create<AuthState>((set) => ({
  loginError: null,
  signupError: null,
  clearErrors: () => set({ loginError: null, signupError: null }),
  login: async (email, password) => {
    set({ loginError: null, signupError: null });
    await new Promise((r) => setTimeout(r, 450));
    if (!email.includes("@")) {
      set({ loginError: "Enter a valid email address" });
      return false;
    }
    if (password.length < 6) {
      set({ loginError: "Password must be at least 6 characters" });
      return false;
    }
    return true;
  },
  signup: async (fullName, email, password) => {
    set({ loginError: null, signupError: null });
    await new Promise((r) => setTimeout(r, 450));
    if (!fullName.trim()) {
      set({ signupError: "Display name is required" });
      return false;
    }
    if (!email.includes("@")) {
      set({ signupError: "Enter a valid email address" });
      return false;
    }
    if (password.length < 6) {
      set({ signupError: "Password must be at least 6 characters" });
      return false;
    }
    return true;
  },
}));
