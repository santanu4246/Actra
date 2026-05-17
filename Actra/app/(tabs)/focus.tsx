import React from "react";
import { Platform, StatusBar, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import { Ion } from "@/components/ui/icon";

const HOME_GREEN = "#24bf55";

export default function FocusScreen() {
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const isLight = activeTheme === "light";

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: isLight ? "#F7F8FA" : "#0F0F0F",
          paddingTop: insets.top + (Platform.OS === "android" ? 10 : 0),
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <StatusBar
        barStyle={isLight ? "dark-content" : "light-content"}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.center}>
        <View style={styles.copyBlock}>
          <Text style={[styles.screenTitle, { color: Colors.text }]}>Focus</Text>
          <Text style={[styles.screenSubtitle, { color: Colors.textSecondary }]}>
            {`Quiet the apps that pull you off today's plan.`}
          </Text>
        </View>
        <Image
          source={require("../../assets/focus/centerimage.png")}
          style={styles.centerImage}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
        <Text style={[styles.sectionLabel, { color: Colors.textSecondary }]}>
          Blocked apps
        </Text>
        <View style={styles.addAppOuterContainer}>
          <View style={styles.appsRow}>
            <View style={styles.appIconContainer}>
              <Image source={require("../../assets/focus/insta.png")} style={styles.appIcon} />
              <View style={styles.appBadge}>
                <Ion name="checkmark" size={10} color="#000" />
              </View>
            </View>
            <View style={styles.appIconContainer}>
              <Image source={require("../../assets/focus/youtube.png")} style={styles.appIcon} />
              <View style={styles.appBadge}>
                <Ion name="checkmark" size={10} color="#000" />
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.addAppButton} activeOpacity={0.7}>
            <View style={styles.addAppIconBg}>
              <Ion name="add" size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.addAppText}>Add app(s)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  copyBlock: {
    width: "100%",
    alignSelf: "stretch",
    marginBottom: 4,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  screenSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
    fontWeight: "500",
  },
  sectionLabel: {
    alignSelf: "flex-start",
    width: "100%",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 0,
  },
  centerImage: {
    width: 300,
    height: 300,
    marginTop: -8,
    marginBottom: -20,
  },
  addAppOuterContainer: {
    width: "100%",
    backgroundColor: "#222222",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  appsRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  appIconContainer: {
    position: "relative",
  },
  appIcon: {
    width: 44,
    height: 44,
  },
  appBadge: {
    position: "absolute",
    bottom: -4,
    left: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: HOME_GREEN,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#222222",
  },
  addAppButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333333",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  addAppIconBg: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: HOME_GREEN,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addAppText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
