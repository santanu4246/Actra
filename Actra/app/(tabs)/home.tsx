import React, { useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import { Ion } from "@/components/ui/icon";

const INITIAL_TASKS = [
  { id: "1", title: "Watch React Hooks video", completed: false },
  { id: "2", title: "Build a simple counter component", completed: false },
  { id: "3", title: "Practice passing props", completed: false },
  { id: "4", title: "Quick quiz: dependency arrays", completed: false },
];

export default function HomeScreen() {
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const insets = useSafeAreaInsets();

  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const isLight = activeTheme === "light";

  const gradientColors = isLight
    ? (["#E0FDD2", "#FFFFFF", "#FFFFFF"] as const)
    : (["#0B2E1F", "#0A0A0A", "#0A0A0A"] as const);
  const gradientLocations = [0, 0.4, 1] as const;

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = completedCount / tasks.length;

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
      <View style={styles.header}>
        <View>
          <Text style={[styles.dateText, { color: Colors.textSecondary }]}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </Text>
          <Text style={[styles.title, { color: Colors.text }]}>
            Today's Plan
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.profileBtn,
            { backgroundColor: isLight ? "#FFFFFF" : Colors.card },
          ]}
        >
          <Ion
            name="person-outline"
            size={20}
            color={isLight ? "#111111" : Colors.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.progressCard,
            {
              backgroundColor: isLight ? "#FFFFFF" : Colors.card,
              borderColor: isLight
                ? "rgba(0,0,0,0.05)"
                : "rgba(255,255,255,0.05)",
            },
          ]}
        >
          <View style={styles.progressHeader}>
            <Text style={[styles.progressTitle, { color: Colors.text }]}>
              Learn React
            </Text>
            <Text style={[styles.progressText, { color: Colors.textSecondary }]}>
              {completedCount} of {tasks.length} done
            </Text>
          </View>
          <View
            style={[
              styles.progressBarBg,
              { backgroundColor: isLight ? "#F0F0F0" : "rgba(255,255,255,0.1)" },
            ]}
          >
            <View
              style={[
                styles.progressBarFill,
                {
                  backgroundColor: isLight ? "#007725" : Colors.primary,
                  width: `${progress * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.tasksContainer}>
          <Text style={[styles.sectionTitle, { color: Colors.text }]}>
            Your tasks
          </Text>
          
          {tasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={[
                styles.taskCard,
                {
                  backgroundColor: isLight ? "#FFFFFF" : Colors.card,
                  borderColor: isLight
                    ? "rgba(0,0,0,0.05)"
                    : "rgba(255,255,255,0.05)",
                  opacity: task.completed ? 0.6 : 1,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => toggleTask(task.id)}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: task.completed
                      ? isLight
                        ? "#007725"
                        : Colors.primary
                      : isLight
                      ? "#D0D0D0"
                      : Colors.border,
                    backgroundColor: task.completed
                      ? isLight
                        ? "#007725"
                        : Colors.primary
                      : "transparent",
                  },
                ]}
              >
                {task.completed && (
                  <Ion name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text
                style={[
                  styles.taskTitle,
                  {
                    color: Colors.text,
                    textDecorationLine: task.completed ? "line-through" : "none",
                  },
                ]}
              >
                {task.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
    paddingBottom: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  progressCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  tasksContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  taskTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
});
