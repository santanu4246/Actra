import { create } from "zustand";

type Theme = "light" | "dark";

type ThemeState = {
  activeTheme: Theme;
  setTheme: (theme: Theme) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  activeTheme: "light",
  setTheme: (activeTheme) => set({ activeTheme }),
}));
