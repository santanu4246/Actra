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
  Alert,
  ActionSheetIOS,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { type Href, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import { Button } from "@/components/ui/button";
import { Ion } from "@/components/ui/icon";
import { screenGradientColors, SCREEN_GRADIENT_LOCATIONS } from "@/constants/brand";

type TaskSource = "generated" | "manual";

type Task = {
  id: string;
  title: string;
  source: TaskSource;
};

const MOCK_GENERATED_TASKS: Task[] = [
  { id: "1", title: "Watch React Hooks video", source: "generated" },
  { id: "2", title: "Build a simple counter component", source: "generated" },
  { id: "3", title: "Practice passing props", source: "generated" },
];

export default function ReviewTasksScreen() {
  const router = useRouter();
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const insets = useSafeAreaInsets();

  const [tasks, setTasks] = useState<Task[]>(MOCK_GENERATED_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const isLight = activeTheme === "light";

  const gradientColors = screenGradientColors(isLight);

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditDraft("");
    }
  };

  const updateTaskTitle = (id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: trimmed } : t))
    );
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditDraft(task.title);
  };

  const commitEdit = () => {
    if (!editingId) return;
    const trimmed = editDraft.trim();
    if (trimmed) {
      updateTaskTitle(editingId, trimmed);
    }
    setEditingId(null);
    setEditDraft("");
  };

  const nextManualId = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const duplicateTask = (task: Task) => {
    setTasks((prev) => [
      ...prev,
      {
        id: nextManualId(),
        title: task.title,
        source: "manual",
      },
    ]);
  };

  const showTaskOptions = (task: Task) => {
    if (Platform.OS === "ios") {
      const options = ["Edit title", "Duplicate", "Delete", "Cancel"];
      const cancelButtonIndex = 3;
      const destructiveButtonIndex = 2;

      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          destructiveButtonIndex,
        },
        (buttonIndex) => {
          if (buttonIndex === cancelButtonIndex) return;
          if (buttonIndex === 0) startEdit(task);
          else if (buttonIndex === 1) duplicateTask(task);
          else if (buttonIndex === 2) removeTask(task.id);
        }
      );
      return;
    }

    const buttons: {
      text: string;
      style?: "cancel" | "destructive" | "default";
      onPress?: () => void;
    }[] = [
      { text: "Edit title", onPress: () => startEdit(task) },
      { text: "Duplicate", onPress: () => duplicateTask(task) },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => removeTask(task.id),
      },
      { text: "Cancel", style: "cancel" },
    ];
    Alert.alert("Task options", task.title, buttons);
  };

  const submitNewTask = () => {
    const title = newTaskTitle.trim();
    if (!title) return;
    setTasks((prev) => [
      ...prev,
      {
        id: nextManualId(),
        title,
        source: "manual",
      },
    ]);
    setNewTaskTitle("");
  };

  const handleContinue = () => {
    router.replace("/(tabs)/home" as Href);
  };

  const moreIconColor = isLight ? "#666666" : Colors.textSecondary;

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
          Tune today’s lineup: edit titles, duplicate, or delete tasks. Keep
          adding your own steps until everything feels right.
        </Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.tasksContainer}>
          {tasks.map((task, index) => (
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
              <View
                style={[
                  styles.taskIndexBadge,
                  {
                    backgroundColor: isLight
                      ? "rgba(0,119,37,0.08)"
                      : "rgba(16, 185, 129, 0.12)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.taskIndexText,
                    { color: isLight ? "#007725" : Colors.primary },
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
              {editingId === task.id ? (
                <TextInput
                  style={[styles.taskInput, { color: Colors.text }]}
                  value={editDraft}
                  onChangeText={setEditDraft}
                  autoFocus
                  onSubmitEditing={commitEdit}
                  onBlur={commitEdit}
                  returnKeyType="done"
                />
              ) : (
                <Text style={[styles.taskTitle, { color: Colors.text }]}>
                  {task.title}
                </Text>
              )}
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => showTaskOptions(task)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel="More options"
              >
                <Ion
                  name="ellipsis-horizontal"
                  size={22}
                  color={moreIconColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => removeTask(task.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel="Delete task"
              >
                <Ion
                  name="trash-outline"
                  size={20}
                  color={Colors.error}
                />
              </TouchableOpacity>
            </View>
          ))}

          <View
            style={[
              styles.taskCard,
              styles.composerCard,
              {
                backgroundColor: isLight ? "#FFFFFF" : Colors.card,
                borderColor: isLight ? "#007725" : Colors.primary,
              },
            ]}
          >
            <View
              style={[
                styles.taskIndexBadge,
                {
                  backgroundColor: isLight
                    ? "rgba(0,119,37,0.08)"
                    : "rgba(16, 185, 129, 0.12)",
                },
              ]}
            >
              <Ion
                name="add"
                size={18}
                color={isLight ? "#007725" : Colors.primary}
              />
            </View>
            <TextInput
              style={[styles.taskInput, { color: Colors.text }]}
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholder="Add a custom task (unlimited)…"
              placeholderTextColor={Colors.textSecondary}
              onSubmitEditing={submitNewTask}
              returnKeyType="done"
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[
                styles.addInlineBtn,
                {
                  backgroundColor: isLight ? "#007725" : Colors.primary,
                  opacity: newTaskTitle.trim() ? 1 : 0.45,
                },
              ]}
              onPress={submitNewTask}
              disabled={!newTaskTitle.trim()}
              accessibilityLabel="Add task"
            >
              <Ion name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 20) },
        ]}
      >
        <Button
          title="Continue"
          onPress={handleContinue}
          style={styles.footerButton}
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
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 12,
    letterSpacing: -0.5,
    textAlign: "center",
    alignSelf: "stretch",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 23,
    opacity: 0.85,
    textAlign: "center",
    alignSelf: "center",
    maxWidth: 340,
    paddingHorizontal: 4,
  },
  tasksContainer: {
    gap: 12,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  taskIndexBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  taskIndexText: {
    fontSize: 14,
    fontWeight: "700",
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
    minHeight: 22,
  },
  iconBtn: {
    padding: 4,
    marginLeft: 4,
  },
  composerCard: {
    marginTop: 4,
  },
  addInlineBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: "transparent",
  },
  footerButton: {
    alignSelf: "stretch",
    width: "100%",
  },
});
