import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useThemeStore } from "@/store/theme-store";

export type ButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
};

export function Button({ title, onPress, loading, style }: ButtonProps) {
  const { activeTheme } = useThemeStore();
  const isLight = activeTheme === "light";

  const labelColor = isLight ? "#FFFFFF" : "#000000";
  const spinnerColor = labelColor;

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        isLight ? styles.btnLight : styles.btnDark,
        { opacity: loading ? 0.85 : 1 },
        style,
      ]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
    >
      <View style={styles.innerHighlight} pointerEvents="none" />
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <Text style={[styles.btnText, { color: labelColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
  },
  btnLight: {
    borderColor: "#000000",
    backgroundColor: "#222222",
  },
  btnDark: {
    borderColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
  },
  innerHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  btnText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
