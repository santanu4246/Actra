import React, { useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import { Button } from "@/components/ui/button";
import { Ion } from "@/components/ui/icon";
import { screenGradientColors, SCREEN_GRADIENT_LOCATIONS } from "@/constants/brand";

const DAILY_TIMES = [
  { label: "15m", value: 15 },
  { label: "30m", value: 30 },
  { label: "60m", value: 60 },
  { label: "120m", value: 120 },
];

const PREFERRED_TIMES = [
  { label: "Morning", value: "morning", icon: "partly-sunny-outline" },
  { label: "Midday", value: "midday", icon: "sunny-outline" },
  { label: "Evening", value: "evening", icon: "moon-outline" },
];

export default function GoalTimeScreen() {
  const router = useRouter();
  const { topic } = useLocalSearchParams<{ topic: string }>();
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const insets = useSafeAreaInsets();

  const [dailyTime, setDailyTime] = useState<number>(60);
  const [preferredTime, setPreferredTime] = useState<string>("evening");
  const [loading, setLoading] = useState(false);

  const isLight = activeTheme === "light";

  const gradientColors = screenGradientColors(isLight);

  const handleContinue = async () => {
    setLoading(true);
    // Simulate saving goal & time preferences
    setTimeout(() => {
      setLoading(false);
      router.replace("/(onboarding)/generating" as Href);
    }, 600);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <LinearGradient
      colors={[...gradientColors]}
      locations={[...SCREEN_GRADIENT_LOCATIONS]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[
        styles.safeArea,
        {
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
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ion name="chevron-back" size={28} color={Colors.text} />
        </TouchableOpacity>
        <View style={[styles.progressTrack, { backgroundColor: isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)" }]}>
          <View style={[styles.progressFill, { width: "100%", backgroundColor: Colors.text }]} />
        </View>
      </View>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={Platform.OS === "ios" ? 20 : 40}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: Colors.text }]}>
            When works best for you?
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: Colors.text }]}>
              Daily time commitment
            </Text>
            <View style={styles.pillsContainer}>
              {DAILY_TIMES.map((time) => {
                const isSelected = dailyTime === time.value;
                return (
                  <TouchableOpacity
                    key={time.value}
                    style={[
                      styles.pill,
                      {
                        backgroundColor: isSelected
                          ? isLight
                            ? "#007725"
                            : Colors.primary
                          : isLight
                          ? "#F0F0F0"
                          : Colors.card,
                        borderColor: isSelected
                          ? isLight
                            ? "#007725"
                            : Colors.primary
                          : Colors.border,
                      },
                    ]}
                    onPress={() => setDailyTime(time.value)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        {
                          color: isSelected
                            ? "#FFFFFF"
                            : Colors.textSecondary,
                          fontWeight: isSelected ? "600" : "500",
                        },
                      ]}
                    >
                      {time.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: Colors.text }]}>
              Preferred time
            </Text>
            <View style={styles.timeCardsContainer}>
              {PREFERRED_TIMES.map((time) => {
                const isSelected = preferredTime === time.value;
                return (
                  <TouchableOpacity
                    key={time.value}
                    style={[
                      styles.timeCard,
                      {
                        backgroundColor: isSelected
                          ? isLight
                            ? "#E7FFC6"
                            : "rgba(16, 185, 129, 0.15)"
                          : isLight
                          ? "#FFFFFF"
                          : Colors.card,
                        borderColor: isSelected
                          ? isLight
                            ? "#007725"
                            : Colors.primary
                          : Colors.border,
                      },
                    ]}
                    onPress={() => setPreferredTime(time.value)}
                    activeOpacity={0.7}
                  >
                    <Ion
                      name={time.icon as any}
                      size={24}
                      color={
                        isSelected
                          ? isLight
                            ? "#007725"
                            : Colors.primary
                          : Colors.textSecondary
                      }
                      style={{ marginBottom: 8 }}
                    />
                    <Text
                      style={[
                        styles.timeCardText,
                        {
                          color: isSelected
                            ? isLight
                              ? "#007725"
                              : Colors.primary
                            : Colors.textSecondary,
                          fontWeight: isSelected ? "600" : "500",
                        },
                      ]}
                    >
                      {time.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            loading={loading}
            style={styles.actionButton}
          />
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backButton: {
    marginRight: 16,
    marginLeft: -8,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  header: {
    alignItems: "flex-start",
    marginTop: 8,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  pillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pillText: {
    fontSize: 15,
  },
  timeCardsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  timeCard: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  timeCardText: {
    fontSize: 14,
  },
  footer: {
    marginTop: 40,
    marginBottom: 20,
  },
  actionButton: {
    width: "100%",
  },
});
