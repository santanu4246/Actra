import React, { useState } from "react";
import {
  Platform,
  Pressable,
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
import { SparkIcon } from "@/components/ui/task-tick";

type TickVariant = "green" | "blue";

type Challenge = {
  id: string;
  title: string;
  boxColor?: string;
  tickVariant: TickVariant;
  completed: boolean;
};

const HOME_GREEN = "#24bf55";
const BLUE_TICK_BORDER = "#3A85FF";

/** Per-task neon accent (left glow + checkbox frame). */
const taskAccentFor = (c: Challenge) =>
  c.boxColor ?? (c.tickVariant === "green" ? "#7CE800" : BLUE_TICK_BORDER);

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
    barColor: "#FFB75E",
  },
  {
    id: "2",
    title: "30 Day Streak",
    subtitle: "Completed 30 days",
    image: require("../../assets/home/30daystreak.png"),
    barColor: "#FFB75E",
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
    barColor: "#FF6B6B",
  },
];

export default function HomeScreen() {
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const insets = useSafeAreaInsets();

  const [challenges] = useState<Challenge[]>(INITIAL_CHALLENGES);

  const isLight = activeTheme === "light";

  const streakDashBorderCompleted = "#000000";
  const streakDashBorderToday = "#000000";

  return (
    <View
      style={[
        styles.safeArea,
        {
          backgroundColor: isLight ? "#F7F8FA" : "#0F0F0F",
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
            Good Morning Santanu! 🌻
          </Text>
          <Text style={[styles.title, { color: Colors.text }]}>
            Today's Plan
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.headerNotifyBtn,
            {
              backgroundColor: isLight ? "#E8EBF0" : "rgba(255,255,255,0.12)",
            },
            pressed && styles.headerNotifyBtnPressed,
          ]}
          onPress={() => {}}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          <Ion name="notifications-outline" size={26} color={Colors.text} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Streak Card */}
        <View style={[styles.card, styles.streakCard, { backgroundColor: isLight ? "#FFFFFF" : "#1E1E1E" }]}>
          <View style={styles.streakTopRow}>
            <View style={styles.streakTitles}>
              <Text style={[styles.streakTitle, { color: Colors.text }]}>Daily streak</Text>
              <Text style={[styles.streakSubtitle, { color: Colors.textSecondary }]}>
                Hit each day to keep the chain
              </Text>
            </View>
            <LinearGradient
              colors={["#7CE800", HOME_GREEN]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.streakCountPill}
            >
              <SparkIcon size={18} color="#1E1E1E" />
              <Text style={styles.streakCountNumber}>6</Text>
            </LinearGradient>
          </View>

          <View
            style={[
              styles.daysRow,
              styles.daysRowBelow,
              {
                borderTopColor: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)",
              },
            ]}
          >
            {DAYS.map((day) => (
              <View key={day.id} style={styles.dayCol}>
                {day.status === "completed" ? (
                  <LinearGradient
                    colors={["#7CE800", HOME_GREEN]}
                    start={{ x: 0.2, y: 0.2 }}
                    end={{ x: 0.8, y: 0.8 }}
                    style={[
                      styles.dayCircleCompleted,
                      { borderColor: streakDashBorderCompleted },
                    ]}
                  >
                    <SparkIcon size={15} color="#1E1E1E" />
                  </LinearGradient>
                ) : day.status === "today" ? (
                  <View
                    style={[
                      styles.dayCircleToday,
                      { borderColor: streakDashBorderToday },
                    ]}
                  >
                    {/* Dark empty circle with dashed border */}
                  </View>
                ) : (
                  <View style={styles.dayCircleFuture} />
                )}
                <Text style={[
                  styles.dayLabel,
                  { color: isLight ? Colors.text : "#FFFFFF" },
                ]}>
                  {day.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tasks card */}
        <View
          style={[
            styles.card,
            styles.tasksCard,
            { backgroundColor: isLight ? "#FFFFFF" : "#1E1E1E", marginTop: 16 },
          ]}
        >
          <View style={styles.challengesHeader}>
            <View>
              <Text style={[styles.challengesTitle, { color: Colors.text }]}>
                Tasks
              </Text>
              <Text style={[styles.challengesSubtitle, { color: Colors.textSecondary }]}>
                Tap to jump in when you are ready
              </Text>
            </View>
          </View>

          <View style={styles.challengesList}>
            {challenges.map((challenge) => {
              const accent = taskAccentFor(challenge);
              return (
                <View
                  key={challenge.id}
                  style={[
                    styles.challengeRow,
                    isLight ? styles.challengeRowLight : styles.challengeRowDark,
                    { borderLeftColor: accent },
                  ]}
                >
                  <View style={styles.challengeCheckboxStack}>
                    <View
                      style={[
                        styles.challengeCheckbox,
                        { borderColor: accent },
                      ]}
                    />
                    {challenge.completed ? (
                      <View style={styles.taskTickOverBox} pointerEvents="none">
                        <View style={styles.taskCheckWide}>
                          <Ion name="checkmark" size={18} color={accent} />
                        </View>
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.challengeInfo}>
                    <Text
                      style={[
                        styles.challengeTitle,
                        { color: Colors.text },
                        challenge.completed && styles.challengeTitleDone,
                      ]}
                    >
                      {challenge.title}
                    </Text>
                  </View>
                </View>
              );
            })}
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
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 12,
  },
  headerNotifyBtn: {
    marginTop: 2,
    padding: 8,
    borderRadius: 14,
  },
  headerNotifyBtnPressed: {
    opacity: 0.55,
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
  streakCard: {
    paddingVertical: 12,
  },
  streakTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  streakTitles: {
    flex: 1,
    paddingRight: 12,
  },
  streakTitle: {
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  streakSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16,
  },
  streakCountPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },
  streakCountNumber: {
    color: "#1E1E1E",
    fontSize: 17,
    fontWeight: "900",
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  daysRowBelow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  dayCol: {
    alignItems: "center",
    gap: 2,
  },
  dayCircleCompleted: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  dayCircleToday: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#2A2A2A",
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  dayCircleFuture: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#333333",
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 0,
  },
  tasksCard: {
    paddingVertical: 18,
  },
  // Tasks card header
  challengesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  challengesTitle: {
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  challengesSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    lineHeight: 16,
  },
  challengesList: {
    gap: 10,
  },
  challengeRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderLeftWidth: 4,
    overflow: "hidden",
  },
  challengeRowLight: {
    backgroundColor: "#F3F4F8",
  },
  challengeRowDark: {
    backgroundColor: "#252528",
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
  taskCheckWide: {
    transform: [{ scaleX: 1.22 }],
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
    lineHeight: 21,
  },
  challengeTitleDone: {
    opacity: 0.55,
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
