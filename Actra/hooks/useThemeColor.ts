import { useColorScheme } from "react-native";

export function useThemeColor() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

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

export function useIsLightTheme(): boolean {
  return useColorScheme() !== "dark";
}
