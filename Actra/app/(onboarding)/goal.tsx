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
import { screenGradientColors, SCREEN_GRADIENT_LOCATIONS } from "@/constants/brand";

export default function GoalSetupScreen() {
  const router = useRouter();
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const insets = useSafeAreaInsets();

  const [topic, setTopic] = useState("");

  const isLight = activeTheme === "light";

  const gradientColors = screenGradientColors(isLight);

  const handleContinue = () => {
    if (!topic.trim()) return;
    router.push({ pathname: "/(onboarding)/goal-time", params: { topic } } as any);
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ion name="chevron-back" size={28} color={Colors.text} />
        </TouchableOpacity>
        <View style={[styles.progressTrack, { backgroundColor: isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)" }]}>
          <View style={[styles.progressFill, { width: "33%", backgroundColor: Colors.text }]} />
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
            style={{ textAlign: "center" }}
          />
        </View>

        <View style={styles.footer}>
          <Button
            title="Continue"
            onPress={handleContinue}
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
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 0,
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
    paddingTop: 16,
    paddingBottom: 8,
  },
  header: {
    alignItems: "flex-start",
    marginTop: 0,
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
  },
  footer: {
    marginTop: "auto",
    marginBottom: 8,
  },
  actionButton: {
    width: "100%",
  },
});
