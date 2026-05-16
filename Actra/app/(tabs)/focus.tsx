import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { screenGradientColors, ONBOARDING_GRADIENT_LOCATIONS } from "@/constants/brand";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import { Ion } from "@/components/ui/icon";

export default function FocusScreen() {
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const insets = useSafeAreaInsets();

  const isLight = activeTheme === "light";

  const gradientColors = screenGradientColors(isLight);

  return (
    <LinearGradient
      colors={[...gradientColors]}
      locations={[...ONBOARDING_GRADIENT_LOCATIONS]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.safeArea,
        {
          paddingTop: insets.top + (Platform.OS === "android" ? 10 : 0),
        },
      ]}
    >
      <StatusBar
        barStyle={isLight ? "dark-content" : "light-content"}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors.text }]}>Focus</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsRow}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: isLight ? "#FFFFFF" : Colors.card,
                borderColor: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
              },
            ]}
          >
            <View
              style={[
                styles.iconBg,
                { backgroundColor: isLight ? "#E7FFC6" : "rgba(16, 185, 129, 0.15)" },
              ]}
            >
              <Ion name="flame" size={24} color={isLight ? "#007725" : Colors.primaryLight} />
            </View>
            <Text style={[styles.statValue, { color: Colors.text }]}>3</Text>
            <Text style={[styles.statLabel, { color: Colors.textSecondary }]}>
              Day Streak
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: isLight ? "#FFFFFF" : Colors.card,
                borderColor: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
              },
            ]}
          >
            <View
              style={[
                styles.iconBg,
                { backgroundColor: isLight ? "#E0F2FE" : "rgba(56, 189, 248, 0.15)" },
              ]}
            >
              <Ion name="checkmark-circle" size={24} color={isLight ? "#0284C7" : "#38BDF8"} />
            </View>
            <Text style={[styles.statValue, { color: Colors.text }]}>12</Text>
            <Text style={[styles.statLabel, { color: Colors.textSecondary }]}>
              Tasks Done
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.chartCard,
            {
              backgroundColor: isLight ? "#FFFFFF" : Colors.card,
              borderColor: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
            },
          ]}
        >
          <Text style={[styles.chartTitle, { color: Colors.text }]}>This Week</Text>
          <View style={styles.chartPlaceholder}>
            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
              const height = Math.random() * 60 + 20;
              const isToday = i === 2;
              return (
                <View key={i} style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height,
                        backgroundColor: isToday
                          ? isLight
                            ? "#007725"
                            : Colors.primary
                          : isLight
                          ? "#E5E5E5"
                          : "rgba(255,255,255,0.1)",
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.barLabel,
                      {
                        color: isToday
                          ? isLight
                            ? "#007725"
                            : Colors.primary
                          : Colors.textSecondary,
                        fontWeight: isToday ? "700" : "500",
                      },
                    ]}
                  >
                    {day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  chartCard: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 24,
  },
  chartPlaceholder: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
  },
  barContainer: {
    alignItems: "center",
    width: 32,
  },
  bar: {
    width: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  barLabel: {
    fontSize: 13,
  },
});
