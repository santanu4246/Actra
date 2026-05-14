import React, { useEffect, useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Animated,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { type Href, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import { screenGradientColors, ONBOARDING_GRADIENT_LOCATIONS } from "@/constants/brand";

const GENERATING_STEPS = [
  "Analyzing your goal...",
  "Structuring daily milestones...",
  "Creating today's tasks...",
  "Finalizing your plan...",
];

export default function GeneratingScreen() {
  const router = useRouter();
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const insets = useSafeAreaInsets();

  const [stepIndex, setStepIndex] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const isLight = activeTheme === "light";

  const gradientColors = screenGradientColors(isLight);

  useEffect(() => {
    // Fade in text
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < GENERATING_STEPS.length - 1) {
          // Fade out, then change text, then fade in
          Animated.sequence([
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 1500);

    const startTime = Date.now();
    const duration = 6500;
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      setPercentage(Math.round(t * 100));
      if (t >= 1) {
        clearInterval(progressInterval);
      }
    }, 50);

    const completeTimeout = setTimeout(() => {
      setPercentage(100);
    }, duration);

    const navTimeout = setTimeout(() => {
      router.replace("/(onboarding)/review" as Href);
    }, duration + 350);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
      clearTimeout(completeTimeout);
      clearTimeout(navTimeout);
    };
  }, []);

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
      <View style={styles.container}>
        <Text style={[styles.percentageText, { color: Colors.text }]}>{percentage}%</Text>
        <Text style={[styles.title, { color: Colors.text }]}>
          Building your plan
        </Text>
        
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={isLight ? "#007725" : Colors.primaryLight} style={styles.loader} />
          <Animated.Text
            style={[
              styles.subtitle,
              { color: Colors.textSecondary, opacity: fadeAnim },
            ]}
          >
            {GENERATING_STEPS[stepIndex]}
          </Animated.Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  percentageText: {
    fontSize: 64,
    fontWeight: "700",
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  loaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loader: {
    marginRight: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    opacity: 0.8,
  },
});
