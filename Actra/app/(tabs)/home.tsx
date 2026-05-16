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
import { TaskTickGreen, TaskTickBlue } from "@/components/ui/task-tick";
import {
  screenGradientColors,
  ONBOARDING_GRADIENT_LOCATIONS,
} from "@/constants/brand";

type TickVariant = "green" | "blue";

type Challenge = {
  id: string;
  title: string;
  boxColor?: string;
  tickVariant: TickVariant;
  completed: boolean;
};

const HOME_GREEN = "#24bf55";
const GREEN_TICK_BORDER = HOME_GREEN;
const BLUE_TICK_BORDER = "#3A85FF";

const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: "1",
    title: "Practice Sprint: answer 35 adaptive questions",
    tickVariant: "green",
    completed: false,
  },
  {
    id: "2",
    title: "Goal Builder: solve 28 weak-topic questions",
    boxColor: "#ffb75e",
    tickVariant: "blue",
    completed: false,
  },
  {
    id: "3",
    title: "Daily Wrap: complete 24 revision questions",
    tickVariant: "blue",
    completed: true,
  },
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

const ACHIEVEMENTS = [
  {
    id: "1",
    title: "7 Day Streak",
    subtitle: "Completed 7 days",
    image: require("../../assets/home/7daystreak.png"),
    barColor: "#FF6B6B",
  },
  {
    id: "2",
    title: "30 Day Streak",
    subtitle: "Completed 30 days",
    image: require("../../assets/home/30daystreak.png"),
    barColor: "#9D4EDD",
  },
  {
    id: "3",
    title: "50 Day Streak",
    subtitle: "Completed 50 days",
    image: require("../../assets/home/50daystreak.png"),
    barColor: "#FF6B6B",
  },
  {
    id: "4",
    title: "100 Day Streak",
    subtitle: "Completed 100 days",
    image: require("../../assets/home/100daystreak.png"),
    barColor: "#9D4EDD",
  },
];

export default function HomeScreen() {
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const insets = useSafeAreaInsets();

  const [challenges] = useState<Challenge[]>(INITIAL_CHALLENGES);

  const isLight = activeTheme === "light";
  const gradientColors = screenGradientColors(isLight);

  const borderColorFor = (c: Challenge) =>
    c.boxColor ?? (c.tickVariant === "green" ? GREEN_TICK_BORDER : BLUE_TICK_BORDER);

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
            <View style={[styles.streakBadgeBg, { top: -28, left: -20 }]}>
              <Text style={styles.streakBadgeText}>Daily Streak</Text>
            </View>
            
            <View style={styles.streakCountBg}>
              <Ion name="flash" size={12} color={HOME_GREEN} style={{ marginTop: 1 }} />
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
                <View style={styles.challengeCheckboxStack}>
                  <View
                    style={[
                      styles.challengeCheckbox,
                      { borderColor: borderColorFor(challenge) },
                    ]}
                  />
                  {challenge.completed ? (
                    <View
                      style={styles.taskTickOverBox}
                      pointerEvents="none"
                    >
                      {challenge.tickVariant === "green" ? (
                        <TaskTickGreen size={26} />
                      ) : (
                        <TaskTickBlue size={26} />
                      )}
                    </View>
                  ) : null}
                </View>

                <View style={styles.challengeInfo}>
                  <Text style={[styles.challengeTitle, { color: Colors.text }]}>
                    {challenge.title}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        
        {/* Achievements Section */}
        <View style={[styles.card, styles.achievementsSection, { backgroundColor: isLight ? "#FFFFFF" : "#1E1E1E" }]}>
          <View style={styles.achievementsHeader}>
            <Text style={[styles.achievementsTitle, { color: Colors.text }]}>
              Achievements
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.achievementsList}
          >
            {ACHIEVEMENTS.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <Image
                  source={achievement.image}
                  style={styles.achievementImage}
                  resizeMode="contain"
                  accessibilityIgnoresInvertColors
                />
                <Text style={[styles.achievementCardTitle, { color: Colors.text }]}>
                  {achievement.title}
                </Text>
                <Text style={styles.achievementSubtitle}>
                  {achievement.subtitle}
                </Text>
                <View
                  style={[
                    styles.achievementBar,
                    { backgroundColor: achievement.barColor },
                  ]}
                />
              </View>
            ))}
          </ScrollView>
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
    backgroundColor: HOME_GREEN,
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
    backgroundColor: "rgba(36, 191, 85, 0.16)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  streakCountText: {
    color: HOME_GREEN,
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
    backgroundColor: HOME_GREEN,
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
  challengeCheckboxStack: {
    width: 28,
    height: 28,
    marginRight: 14,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  taskTickOverBox: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  challengeCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  // Achievements Section
  achievementsSection: {
    marginTop: 16,
  },
  achievementsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  achievementsTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  achievementsList: {
    paddingBottom: 8,
  },
  achievementCard: {
    width: 136,
    alignItems: "flex-start",
    marginRight: 16,
    backgroundColor: "transparent",
  },
  achievementImage: {
    width: 110,
    height: 110,
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  achievementCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "left",
  },
  achievementSubtitle: {
    fontSize: 11,
    color: "#888888",
    textAlign: "left",
    marginBottom: 12,
  },
  achievementBar: {
    width: 50,
    height: 8,
    borderRadius: 4,
  },
});
