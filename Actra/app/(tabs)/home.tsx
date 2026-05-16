import React, { useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import { Ion } from "@/components/ui/icon";
import {
  screenGradientColors,
  ONBOARDING_GRADIENT_LOCATIONS,
  GREEN_SOLID,
} from "@/constants/brand";

const INITIAL_CHALLENGES = [
  { id: "1", title: "Answer 10 Questions", progress: 3, total: 10, color: "#10B981", completed: false },
  { id: "2", title: "Answer 10 Questions", progress: 3, total: 10, color: GREEN_SOLID, completed: false },
  { id: "3", title: "Answer 10 Questions", progress: 10, total: 10, color: "#3B82F6", completed: true },
];

const DAYS = [
  { id: "mon", label: "Mon", status: "completed" },
  { id: "tue", label: "Tue", status: "completed" },
  { id: "wed", label: "Wed", status: "completed" },
  { id: "thu", label: "Today", status: "today" },
  { id: "fri", label: "Fri", status: "future" },
  { id: "sat", label: "Sat", status: "future" },
  { id: "sun", label: "Sun", status: "future" },
];

export default function HomeScreen() {
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const insets = useSafeAreaInsets();

  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);

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
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <StatusBar
        barStyle={isLight ? "dark-content" : "light-content"}
        backgroundColor="transparent"
        translucent
      />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.greetingText, { color: Colors.textSecondary }]}>
            Goodmorning Santanu! 🌻
          </Text>
          <Text style={[styles.title, { color: Colors.text }]}>
            Today's Plan
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Streak Card */}
        <View style={[styles.card, { backgroundColor: isLight ? "#FFFFFF" : "#1E1E1E", paddingTop: 12, paddingBottom: 16 }]}>
          <View style={styles.streakHeader}>
            <LinearGradient
              colors={["#9EFA3A", GREEN_SOLID]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.streakBadgeBg, { top: -28, left: -20 }]}
            >
              <Text style={styles.streakBadgeText}>Daily Streak</Text>
            </LinearGradient>
            
            <View style={styles.streakCountBg}>
              <Ion name="flash" size={12} color={GREEN_SOLID} style={{ marginTop: 1 }} />
              <Text style={styles.streakCountText}>6</Text>
            </View>
          </View>

          <View style={styles.daysRow}>
            {DAYS.map((day) => (
              <View key={day.id} style={styles.dayCol}>
                {day.status === "completed" ? (
                  <View style={styles.dayCircleCompleted}>
                    <Ion name="flash" size={12} color="#1E1E1E" />
                  </View>
                ) : day.status === "today" ? (
                  <View style={styles.dayCircleToday}>
                    {/* Wavy outer edge simulation can be complex, using a dotted border or plain style for now */}
                  </View>
                ) : (
                  <View style={styles.dayCircleFuture} />
                )}
                <Text style={[
                  styles.dayLabel,
                  { color: day.status === "future" ? Colors.textSecondary : Colors.text }
                ]}>
                  {day.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tasks card */}
        <View style={[styles.card, styles.tasksCard, { backgroundColor: isLight ? "#FFFFFF" : "#1E1E1E", marginTop: 16 }]}>
          <Image
            source={require("../../assets/home/taskleftimg.png")}
            style={styles.tasksCardImage}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
          <View style={styles.challengesHeader}>
            <Text style={[styles.challengesTitle, { color: Colors.text }]}>
              Tasks
            </Text>
          </View>

          <View style={styles.challengesList}>
            {challenges.map((challenge, index) => (
              <View key={challenge.id} style={[styles.challengeRow, index > 0 && styles.challengeRowMargin]}>
                <View style={[styles.challengeCheckbox, { borderColor: challenge.color }]}>
                  {challenge.completed && (
                    <Ion name="checkmark" size={14} color={challenge.color} />
                  )}
                </View>
                
                <View style={styles.challengeInfo}>
                  <Text style={[styles.challengeTitle, { color: Colors.text }]}>
                    {challenge.title}
                  </Text>
                  <View style={styles.progressRow}>
                    <View style={styles.progressBarBg}>
                      <View 
                        style={[
                          styles.progressBarFill, 
                          { 
                            backgroundColor: challenge.color, 
                            width: `${(challenge.progress / challenge.total) * 100}%` 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {challenge.progress}/{challenge.total}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
        
        {/* Padding for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  tasksCard: {
    position: "relative",
    overflow: "hidden",
  },
  tasksCardImage: {
    position: "absolute",
    right: -45,
    top: -10,
    width: 100,
    height: 100,
  },
  // Streak Card
  streakHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 12,
    position: "relative",
  },
  streakBadgeBg: {
    position: "absolute",
    left: -20,
    top: -36,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    zIndex: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  streakBadgeText: {
    color: "#1E1E1E",
    fontWeight: "800",
    fontSize: 12,
  },
  streakCountBg: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(124, 232, 0, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  streakCountText: {
    color: GREEN_SOLID,
    fontWeight: "800",
    fontSize: 14,
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayCol: {
    alignItems: "center",
    gap: 4,
  },
  dayCircleCompleted: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: GREEN_SOLID,
    justifyContent: "center",
    alignItems: "center",
  },
  dayCircleToday: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#333333",
    borderWidth: 2,
    borderColor: "#444444",
    borderStyle: "dashed",
  },
  dayCircleFuture: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#333333",
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: "600",
  },
  // Tasks card header
  challengesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingRight: 72,
  },
  challengesTitle: {
    fontSize: 22,
    fontWeight: "900",
  },
  challengesList: {
    gap: 0,
  },
  challengeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  challengeRowMargin: {
    marginTop: 24,
  },
  challengeCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: "#333333",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#888888",
    width: 36,
  },
});
