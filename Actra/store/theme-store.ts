import { useColorScheme } from "react-native";

/** System-backed theme for screens expecting `activeTheme` */
export function useThemeStore() {
  const scheme = useColorScheme();
  return {
    activeTheme: scheme === "dark" ? ("dark" as const) : ("light" as const),
  };
}
