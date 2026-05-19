import React, { useState } from "react";
import {
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
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
} from "@/constants/brand";
import { useOnboardingStore } from "@/store/onboarding-store";

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toDateString(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type PickerTarget = "start" | "end" | null;

export default function PlanDatesScreen() {
  const router = useRouter();
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const setOnboarding = useOnboardingStore((s) => s.set);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [startDate, setStartDate] = useState<Date>(today);
  const [endDate, setEndDate] = useState<Date>(addDays(today, 28));
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);
  const [tempDate, setTempDate] = useState<Date>(today);
  const [error, setError] = useState<string | null>(null);

  const isLight = activeTheme === "light";
  const gradientColors = screenGradientColors(isLight);

  const openPicker = (target: PickerTarget) => {
    setTempDate(target === "start" ? startDate : endDate);
    setPickerTarget(target);
    setError(null);
  };

  const confirmPicker = () => {
    if (pickerTarget === "start") {
      setStartDate(tempDate);
      if (tempDate > endDate) setEndDate(addDays(tempDate, 28));
    } else {
      if (tempDate < startDate) {
        setError("End date must be on or after the start date.");
        setPickerTarget(null);
        return;
      }
      setEndDate(tempDate);
    }
    setPickerTarget(null);
  };

  const handleContinue = () => {
    if (endDate < startDate) {
      setError("End date must be on or after the start date.");
      return;
    }
    setOnboarding({
      planStartDate: startDate.toISOString(),
      planEndDate: endDate.toISOString(),
    });
    router.replace("/(onboarding)/generating" as Href);
  };

  const rowBg = isLight ? "#F9F9F9" : "#1C1C1C";

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

      <View style={styles.navHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
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

      <View style={styles.container}>
        <View style={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: Colors.text }]}>
              When do you want to run this plan?
            </Text>
          </View>

          <View style={styles.formContainer}>
            <TouchableOpacity
              style={[styles.dateRow, { backgroundColor: rowBg }]}
              onPress={() => openPicker("start")}
              activeOpacity={0.7}
            >
              <View>
                <Text style={[styles.dateLabel, { color: Colors.text + "88" }]}>
                  Start date
                </Text>
                <Text style={[styles.dateValue, { color: Colors.text }]}>
                  {toDateString(startDate)}
                </Text>
              </View>
              <Ion name="calendar-outline" size={22} color={Colors.text + "88"} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dateRow, { backgroundColor: rowBg }]}
              onPress={() => openPicker("end")}
              activeOpacity={0.7}
            >
              <View>
                <Text style={[styles.dateLabel, { color: Colors.text + "88" }]}>
                  End date
                </Text>
                <Text style={[styles.dateValue, { color: Colors.text }]}>
                  {toDateString(endDate)}
                </Text>
              </View>
              <Ion name="calendar-outline" size={22} color={Colors.text + "88"} />
            </TouchableOpacity>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
          </View>

          <View style={styles.footer}>
            <Button
              title="Continue"
              onPress={handleContinue}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>

      {/* iOS modal picker */}
      {Platform.OS === "ios" && pickerTarget !== null && (
        <Modal transparent animationType="slide">
          <View style={styles.iosPickerBackdrop}>
            <View
              style={[
                styles.iosPickerContainer,
                { backgroundColor: isLight ? "#F2F2F7" : "#1C1C1E" },
              ]}
            >
              <View style={styles.iosPickerToolbar}>
                <TouchableOpacity onPress={() => setPickerTarget(null)}>
                  <Text style={[styles.iosPickerBtn, { color: "#8E8E93" }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmPicker}>
                  <Text style={[styles.iosPickerBtn, { color: "#239fba" }]}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                minimumDate={pickerTarget === "end" ? startDate : today}
                onChange={(_e, date) => date && setTempDate(date)}
                style={{ width: "100%" }}
                textColor={isLight ? "#000" : "#fff"}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Android inline picker */}
      {Platform.OS === "android" && pickerTarget !== null && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          minimumDate={pickerTarget === "end" ? startDate : today}
          onChange={(_e, date) => {
            setPickerTarget(null);
            if (date) {
              if (pickerTarget === "start") {
                setStartDate(date);
                if (date > endDate) setEndDate(addDays(date, 28));
              } else {
                if (date < startDate) {
                  setError("End date must be on or after the start date.");
                } else {
                  setEndDate(date);
                }
              }
            }
          }}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backButton: { marginRight: 16, marginLeft: -8 },
  progressTrack: { flex: 1, height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  container: { flex: 1 },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  header: { alignItems: "flex-start", marginBottom: 32 },
  title: { fontSize: 30, fontWeight: "700", letterSpacing: -0.5 },
  formContainer: { flex: 1, justifyContent: "center", paddingBottom: 40, gap: 12 },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  dateLabel: { fontSize: 12, fontWeight: "500", marginBottom: 4 },
  dateValue: { fontSize: 16, fontWeight: "600" },
  errorText: { color: "#FF3B30", fontSize: 14, marginTop: 4 },
  footer: { marginTop: "auto", marginBottom: 8 },
  actionButton: { width: "100%" },
  iosPickerBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  iosPickerContainer: { borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingBottom: 24 },
  iosPickerToolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iosPickerBtn: { fontSize: 17, fontWeight: "600" },
});
