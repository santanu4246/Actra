import { useThemeStore } from "@/store/theme-store";

export function useIsLightTheme(): boolean {
  const { activeTheme } = useThemeStore();
  return activeTheme === "light";
}

export function useThemeColor() {
  const isLight = useIsLightTheme();
  const isDark = !isLight;

  return {
    card: isDark ? "#141414" : "#FFFFFF",
    primaryLight: isDark ? "#34D399" : "#007725",
    textSecondary: isDark ? "#A3A3A3" : "#666666",
    text: isDark ? "#FAFAFA" : "#111111",
    border: isDark ? "#262626" : "#E5E5E5",
    primary: isDark ? "#10B981" : "#007725",
    error: "#E74C3C",
  };
}
