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
import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import { Button } from "@/components/ui/button";
import { Ion } from "@/components/ui/icon";
import { screenGradientColors, ONBOARDING_GRADIENT_LOCATIONS, SCREEN_GRADIENT_TOP } from "@/constants/brand";

const OPTIONS = [
  { id: "slow", label: "Slow and steady" },
  { id: "balanced", label: "Balanced" },
  { id: "challenge", label: "Challenge me" },
];

export default function DifficultyScreen() {
  const router = useRouter();
  const { age, topic, focus } = useLocalSearchParams<{ age: string, topic: string, focus: string }>();
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const insets = useSafeAreaInsets();

  const [difficulty, setDifficulty] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const isLight = activeTheme === "light";

  const gradientColors = screenGradientColors(isLight);

  const handleContinue = async () => {
    if (!difficulty || loading) return;
    router.push({ pathname: "/(onboarding)/goal-time", params: { age, topic, focus, difficulty } } as any);
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
          <View style={[styles.progressFill, { width: "66%", backgroundColor: Colors.text }]} />
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: Colors.text }]}>
              How should Actra increase difficulty?
            </Text>
          </View>

          <View style={styles.formContainer}>
            {OPTIONS.map((opt) => {
              const isSelected = difficulty === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
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
                  onPress={() => setDifficulty(opt.id)}
                  activeOpacity={0.7}
                >
                  {isSelected && <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, backgroundColor: "rgba(255, 255, 255, 0.25)", pointerEvents: "none" }} />}
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: isSelected ? "#FFFFFF" : Colors.text,
                        fontWeight: isSelected ? "700" : "500",
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.footer}>
            <Button
              title="Continue"
              onPress={handleContinue}
              loading={loading}
              style={{ ...styles.actionButton, opacity: !difficulty ? 0.5 : 1 }}
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