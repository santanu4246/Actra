import React, { useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { type Href, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import { Button } from "@/components/ui/button";
import { Ion } from "@/components/ui/icon";
import { screenGradientColors, ONBOARDING_GRADIENT_LOCATIONS, SCREEN_GRADIENT_TOP } from "@/constants/brand";
import { useOnboardingStore } from "@/store/onboarding-store";

const FREQUENCIES = [
  { id: "daily", label: "Daily" },
  { id: "three_days", label: "3 days a week" },
  { id: "weekend", label: "Weekend" },
];

export default function GoalFrequencyScreen() {
  const router = useRouter();
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const setOnboarding = useOnboardingStore((s) => s.set);

  const [frequency, setFrequency] = useState<string>("");

  const isLight = activeTheme === "light";

  const gradientColors = screenGradientColors(isLight);

  const handleContinue = async () => {
    if (!frequency || loading) return;
    setOnboarding({ frequency });
    router.replace("/(onboarding)/generating" as Href);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <LinearGradient
      colors={[...gradientColors]}
      locations={[...ONBOARDING_GRADIENT_LOCATIONS]}
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
      <View style={styles.container}>
        <View style={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: Colors.text }]}>
              How often do you want to practice?
            </Text>
          </View>

          <View style={styles.formContainer}>
            {FREQUENCIES.map((freq) => {
              const isSelected = frequency === freq.id;
              return (
                <TouchableOpacity
                  key={freq.id}
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor: isSelected 
                        ? "#239fba"
                        : (isLight ? "#F9F9F9" : "#1C1C1C"),
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      overflow: "hidden",
                    },
                  ]}
                  onPress={() => setFrequency(freq.id)}
                  activeOpacity={0.7}
                >
                  {isSelected && <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, backgroundColor: "rgba(255, 255, 255, 0.25)", pointerEvents: "none" }} />}
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: isSelected ? "#000000" : Colors.text,
                        fontWeight: "500",
                      },
                    ]}
                  >
                    {freq.label}
                  </Text>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: isSelected ? "rgba(255, 255, 255, 0.2)" : (isLight ? "#E5E5EA" : "rgba(255,255,255,0.1)"),
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {isSelected && (
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: "#FFFFFF",
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.footer}>
            <Button
              title="Continue"
              onPress={handleContinue}
              style={{ ...styles.actionButton, opacity: !frequency ? 0.5 : 1 }}
            />
          </View>
        </View>
      </View>
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
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 40,
    gap: 12,
  },
  optionCard: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  optionText: {
    fontSize: 16,
  },
  footer: {
    marginTop: "auto",
    marginBottom: 8,
  },
  actionButton: {
    width: "100%",
  },
});