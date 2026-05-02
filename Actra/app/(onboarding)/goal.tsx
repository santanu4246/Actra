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
import { type Href, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Ion } from "@/components/ui/icon";

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

export default function GoalSetupScreen() {
  const router = useRouter();
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const insets = useSafeAreaInsets();

  const [topic, setTopic] = useState("");
  const [dailyTime, setDailyTime] = useState<number>(60);
  const [preferredTime, setPreferredTime] = useState<string>("evening");
  const [loading, setLoading] = useState(false);

  const isLight = activeTheme === "light";

  const gradientColors = isLight
    ? (["#E0FDD2", "#FFFFFF", "#FFFFFF"] as const)
    : (["#0B2E1F", "#0A0A0A", "#0A0A0A"] as const);
  const gradientLocations = [0, 0.4, 1] as const;

  const handleContinue = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    // Simulate saving goal
    setTimeout(() => {
      setLoading(false);
      router.replace("/(onboarding)/generating" as Href);
    }, 600);
  };

  return (
    <LinearGradient
      colors={[...gradientColors]}
      locations={[...gradientLocations]}
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
            Set your goal
          </Text>
          <Text style={[styles.subtitle, { color: Colors.textSecondary }]}>
            What do you want to learn?
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Topic"
            placeholder="e.g., Learn React, DSA, Spanish"
            value={topic}
            onChangeText={setTopic}
            autoCapitalize="words"
          />

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
            style={[
              styles.actionButton,
              { opacity: !topic.trim() ? 0.5 : 1 },
            ]}
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
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.8,
  },
  formContainer: {
    flex: 1,
  },
  section: {
    marginTop: 24,
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
