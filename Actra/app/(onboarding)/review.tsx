import React, { useRef, useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { type Href, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import { Button } from "@/components/ui/button";
import { Ion } from "@/components/ui/icon";
import {
  screenGradientColors,
  ONBOARDING_GRADIENT_LOCATIONS,
  GREEN_ON_LIGHT,
  GREEN_SOLID,
  GREEN_TINT_LIGHT,
} from "@/constants/brand";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const scrollRef = useRef<ScrollView>(null);
  const modalInputRef = useRef<TextInput>(null);

  const isLight = activeTheme === "light";
  const gradientColors = screenGradientColors(isLight);
  const accentColor = isLight ? GREEN_ON_LIGHT : GREEN_SOLID;
  const accentSurface = isLight ? GREEN_TINT_LIGHT : "rgba(124, 232, 0, 0.14)";
  const screenBg = isLight ? "#FFFFFF" : "#0A0A0A";
  const cardBg = isLight ? "#FFFFFF" : Colors.card;
  const modalOverlay = isLight ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.7)";
  const modalBg = isLight ? "#FFFFFF" : "#1C1C1C";

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
    if (trimmed) updateTaskTitle(editingId, trimmed);
    setEditingId(null);
    setEditDraft("");
  };

  const nextManualId = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const openModal = () => {
    setNewTaskTitle("");
    setModalVisible(true);
    setTimeout(() => modalInputRef.current?.focus(), 100);
  };

  const closeModal = () => {
    setModalVisible(false);
    setNewTaskTitle("");
  };

  const submitNewTask = () => {
    const title = newTaskTitle.trim();
    if (!title) return;
    setTasks((prev) => [
      ...prev,
      { id: nextManualId(), title, source: "manual" },
    ]);
    closeModal();
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
  };

  const handleContinue = () => {
    router.replace("/(tabs)/home" as Href);
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
        { paddingTop: insets.top + (Platform.OS === "android" ? 10 : 0) },
      ]}
    >
      <StatusBar
        barStyle={isLight ? "dark-content" : "light-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Nav bar */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ion name="chevron-back" size={28} color={Colors.text} />
        </TouchableOpacity>
        <View
          style={[
            styles.progressTrack,
            {
              backgroundColor: isLight
                ? "rgba(0,0,0,0.1)"
                : "rgba(255,255,255,0.1)",
            },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              { width: "100%", backgroundColor: Colors.text },
            ]}
          />
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors.text }]}>
          Does this plan feel right?
        </Text>
        <Text style={[styles.subtitle, { color: Colors.textSecondary }]}>
          Tap any task to edit, remove what you don't need, or add your own.
        </Text>
      </View>

      {/* Task list */}
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <View style={styles.tasksContainer}>
          {tasks.map((task, index) => (
            <View
              key={task.id}
              style={[styles.taskCard, { backgroundColor: cardBg }]}
            >
              <View
                style={[styles.taskIndexBadge, { backgroundColor: accentSurface }]}
              >
                <Text style={[styles.taskIndexText, { color: accentColor }]}>
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
                  multiline={false}
                  numberOfLines={1}
                  textAlignVertical="center"
                />
              ) : (
                <TouchableOpacity
                  style={styles.taskTitleTouchable}
                  onPress={() => startEdit(task)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.taskTitle, { color: Colors.text }]}>
                    {task.title}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => removeTask(task.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ion
                  name="trash-outline"
                  size={20}
                  color={Colors.error}
                  style={{ opacity: 0.7 }}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Fixed footer */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 20), backgroundColor: screenBg },
        ]}
      >
        <Button
          title="Add Task"
          leading={
            <Ion
              name="add"
              size={24}
              color={isLight ? "#FFFFFF" : "#000000"}
            />
          }
          onPress={openModal}
          style={styles.addButton}
        />
        <Button
          title="Continue"
          onPress={handleContinue}
          style={styles.continueButton}
        />
      </View>

      {/* Add task modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlayWrap}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableOpacity
            style={[styles.modalBackdrop, { backgroundColor: modalOverlay }]}
            activeOpacity={1}
            onPress={closeModal}
          />
          <View style={[styles.modalSheet, { backgroundColor: modalBg }]}>
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, { color: Colors.text }]}>
              Add a task
            </Text>
            <TextInput
              ref={modalInputRef}
              style={[
                styles.modalInput,
                {
                  color: Colors.text,
                  backgroundColor: isLight ? "#F5F5F5" : "#2A2A2A",
                },
              ]}
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholder="What do you want to do?"
              placeholderTextColor={Colors.textSecondary}
              returnKeyType="done"
              onSubmitEditing={submitNewTask}
              multiline={false}
              autoCorrect
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalCancel, { borderColor: isLight ? "#E0E0E0" : "#333" }]}
                onPress={closeModal}
              >
                <Text style={[styles.modalCancelText, { color: Colors.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalAdd,
                  {
                    backgroundColor: accentColor,
                    opacity: newTaskTitle.trim() ? 1 : 0.4,
                  },
                ]}
                onPress={submitNewTask}
                disabled={!newTaskTitle.trim()}
              >
                <Text style={styles.modalAddText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  header: {
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 22,
    opacity: 0.7,
    textAlign: "left",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 16,
  },
  tasksContainer: {
    gap: 12,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  taskIndexBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
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
  taskTitleTouchable: {
    flex: 1,
    marginRight: 4,
  },
  taskInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    padding: 0,
    minHeight: 22,
    lineHeight: 20,
  },
  iconBtn: {
    padding: 4,
    marginLeft: 4,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 10,
  },
  addButton: {
    width: "100%",
  },
  continueButton: {
    width: "100%",
  },
  // Modal
  modalOverlayWrap: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(128,128,128,0.35)",
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  modalInput: {
    fontSize: 16,
    fontWeight: "400",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalAdd: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 100,
    alignItems: "center",
  },
  modalAddText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
});
