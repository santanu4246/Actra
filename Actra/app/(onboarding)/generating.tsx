import React, { useEffect, useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { type Href, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import { Ion } from "@/components/ui/icon";
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
  const fadeAnim = useState(new Animated.Value(0))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];

  const isLight = activeTheme === "light";

  const gradientColors = screenGradientColors(isLight);

  useEffect(() => {
    // Fade in text
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Pulse animation for the icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

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

    const timeout = setTimeout(() => {
      router.replace("/(onboarding)/review" as Href);
    }, 6500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
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
        <View style={styles.iconContainer}>
          <Animated.View
            style={[
              styles.iconBg,
              {
                backgroundColor: isLight
                  ? "#E7FFC6"
                  : "rgba(16, 185, 129, 0.15)",
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Ion
              name="sparkles"
              size={48}
              color={isLight ? "#007725" : Colors.primaryLight}
            />
          </Animated.View>
        </View>

        <Text style={[styles.title, { color: Colors.text }]}>
          Building your plan
        </Text>
        
        <Animated.Text
          style={[
            styles.subtitle,
            { color: Colors.textSecondary, opacity: fadeAnim },
          ]}
        >
          {GENERATING_STEPS[stepIndex]}
        </Animated.Text>
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
  iconContainer: {
    marginBottom: 32,
  },
  iconBg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    opacity: 0.8,
  },
});
