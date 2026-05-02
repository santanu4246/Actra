import React, { useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { type Href, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import { Ion } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

const MOCK_GENERATED_TASKS = [
  { id: "1", title: "Watch React Hooks video" },
  { id: "2", title: "Build a simple counter component" },
  { id: "3", title: "Practice passing props" },
];

export default function ReviewTasksScreen() {
  const router = useRouter();
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const insets = useSafeAreaInsets();

  const [tasks, setTasks] = useState(MOCK_GENERATED_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const isLight = activeTheme === "light";

  const gradientColors = isLight
    ? (["#E0FDD2", "#FFFFFF", "#FFFFFF"] as const)
    : (["#0B2E1F", "#0A0A0A", "#0A0A0A"] as const);
  const gradientLocations = [0, 0.4, 1] as const;

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) {
      setIsAdding(false);
      return;
    }
    setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), title: newTaskTitle.trim() },
    ]);
    setNewTaskTitle("");
    setIsAdding(false);
  };

  const handleContinue = () => {
    // Navigate to the generating screen
    router.replace("/(tabs)/home" as Href);
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
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors.text }]}>
          Review your plan
        </Text>
        <Text style={[styles.subtitle, { color: Colors.textSecondary }]}>
          Here's what we suggest for today. Add or remove tasks as needed.
        </Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tasksContainer}>
          {tasks.map((task) => (
            <View
              key={task.id}
              style={[
                styles.taskCard,
                {
                  backgroundColor: isLight ? "#FFFFFF" : Colors.card,
                  borderColor: isLight
                    ? "rgba(0,0,0,0.05)"
                    : "rgba(255,255,255,0.05)",
                },
              ]}
            >
              <View style={styles.taskIconBg}>
                <Ion
                  name="ellipse-outline"
                  size={20}
                  color={isLight ? "#D0D0D0" : Colors.border}
                />
              </View>
              <Text style={[styles.taskTitle, { color: Colors.text }]}>
                {task.title}
              </Text>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeTask(task.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ion
                  name="close-circle"
                  size={22}
                  color={isLight ? "#A0A0A0" : Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          ))}

          {isAdding ? (
            <View
              style={[
                styles.taskCard,
                {
                  backgroundColor: isLight ? "#FFFFFF" : Colors.card,
                  borderColor: isLight ? "#007725" : Colors.primary,
                },
              ]}
            >
              <View style={styles.taskIconBg}>
                <Ion
                  name="ellipse-outline"
                  size={20}
                  color={isLight ? "#D0D0D0" : Colors.border}
                />
              </View>
              <TextInput
                style={[styles.taskInput, { color: Colors.text }]}
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                placeholder="What else do you want to do?"
                placeholderTextColor={Colors.textSecondary}
                autoFocus
                onSubmitEditing={addTask}
                onBlur={addTask}
                returnKeyType="done"
              />
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.addBtn,
                {
                  borderColor: isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
                  borderStyle: "dashed",
                },
              ]}
              onPress={() => setIsAdding(true)}
            >
              <Ion
                name="add"
                size={20}
                color={isLight ? "#666666" : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.addBtnText,
                  { color: isLight ? "#666666" : Colors.textSecondary },
                ]}
              >
                Add a custom task
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Looks Good"
          onPress={handleContinue}
          style={styles.actionButton}
        />
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
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
  },
  tasksContainer: {
    gap: 12,
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
  taskIconBg: {
    marginRight: 12,
  },
  taskTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  taskInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    padding: 0,
  },
  removeBtn: {
    marginLeft: 8,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
    marginTop: 4,
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  actionButton: {
    width: "100%",
  },
});
