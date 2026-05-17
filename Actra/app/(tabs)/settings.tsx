import React, { useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import { Ion } from "@/components/ui/icon";

type SettingRowProps = {
  icon: any;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  isDestructive?: boolean;
  showChevron?: boolean;
  isLight: boolean;
  Colors: any;
};

function SettingRow({
  icon,
  title,
  subtitle,
  rightElement,
  onPress,
  isDestructive,
  showChevron = true,
  isLight,
  Colors,
}: SettingRowProps) {
  const content = (
    <View style={styles.rowInner}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: isDestructive ? "rgba(255, 59, 48, 0.1)" : isLight ? "#F3F4F8" : "#252528" },
        ]}
      >
        <Ion name={icon} size={20} color={isDestructive ? "#FF3B30" : Colors.text} />
      </View>
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.rowTitle,
            { color: isDestructive ? "#FF3B30" : Colors.text },
          ]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.rowSubtitle, { color: Colors.textSecondary }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {rightElement ? (
        rightElement
      ) : showChevron ? (
        <Ion name="chevron-forward" size={20} color={Colors.textSecondary} />
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.rowContainer}
        activeOpacity={0.7}
        onPress={onPress}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.rowContainer}>{content}</View>;
}

export default function SettingsScreen() {
  const Colors = useThemeColor();
  const { activeTheme, setTheme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const isLight = activeTheme === "light";

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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
        <Text style={[styles.title, { color: Colors.text }]}>Settings</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={[styles.card, { backgroundColor: isLight ? "#FFFFFF" : "#1E1E1E" }]}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileInitials}>S</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: Colors.text }]}>Santanu</Text>
              <Text style={[styles.profileEmail, { color: Colors.textSecondary }]}>
                santanu@example.com
              </Text>
            </View>
            <TouchableOpacity style={[styles.editButton, { backgroundColor: isLight ? "#F3F4F8" : "#252528" }]}>
              <Text style={[styles.editButtonText, { color: Colors.text }]}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.textSecondary }]}>
            PREFERENCES
          </Text>
          <View style={[styles.card, styles.sectionCard, { backgroundColor: isLight ? "#FFFFFF" : "#1E1E1E" }]}>
            <SettingRow
              icon="moon-outline"
              title="Dark Theme"
              subtitle="Use dark mode"
              showChevron={false}
              isLight={isLight}
              Colors={Colors}
              rightElement={
                <Switch
                  value={!isLight}
                  onValueChange={(val) => setTheme(val ? "dark" : "light")}
                  trackColor={{ false: "#767577", true: "#24bf55" }}
                  thumbColor={Platform.OS === "ios" ? undefined : "#f4f3f4"}
                />
              }
            />
            <View style={[styles.separator, { backgroundColor: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)" }]} />
            <SettingRow
              icon="notifications-outline"
              title="Push Notifications"
              subtitle="Stay on top of your tasks"
              showChevron={false}
              isLight={isLight}
              Colors={Colors}
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#767577", true: "#24bf55" }}
                  thumbColor={Platform.OS === "ios" ? undefined : "#f4f3f4"}
                />
              }
            />
          </View>
        </View>

        {/* Support & About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.textSecondary }]}>
            SUPPORT & ABOUT
          </Text>
          <View style={[styles.card, styles.sectionCard, { backgroundColor: isLight ? "#FFFFFF" : "#1E1E1E" }]}>
            <SettingRow
              icon="document-text-outline"
              title="Terms & Conditions"
              onPress={() => {}}
              isLight={isLight}
              Colors={Colors}
            />
            <View style={[styles.separator, { backgroundColor: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)" }]} />
            <SettingRow
              icon="shield-checkmark-outline"
              title="Privacy Policy"
              onPress={() => {}}
              isLight={isLight}
              Colors={Colors}
            />
            <View style={[styles.separator, { backgroundColor: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)" }]} />
            <SettingRow
              icon="star-outline"
              title="Rate the App"
              onPress={() => {}}
              isLight={isLight}
              Colors={Colors}
            />
            <View style={[styles.separator, { backgroundColor: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)" }]} />
            <SettingRow
              icon="mail-outline"
              title="Contact Us"
              onPress={() => {}}
              isLight={isLight}
              Colors={Colors}
            />
          </View>
        </View>

        {/* Danger Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.card,
              styles.logoutButton,
              { backgroundColor: isLight ? "#FFEBEB" : "rgba(255, 59, 48, 0.1)" },
            ]}
            activeOpacity={0.7}
            onPress={() => {}}
          >
            <Ion name="log-out-outline" size={20} color="#FF3B30" style={styles.logoutIcon} />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>App Version 1.0.0</Text>

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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  card: {
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 10,
    marginLeft: 8,
  },
  sectionCard: {
    paddingVertical: 8,
  },
  // Profile
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#24bf55",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileInitials: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: "500",
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  // Row
  rowContainer: {
    paddingHorizontal: 16,
  },
  rowInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  rowSubtitle: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: "500",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 60, // Align with text start
    marginRight: 16,
  },
  versionText: {
    textAlign: "center",
    marginTop: 32,
    fontSize: 13,
    fontWeight: "600",
    color: "#888888",
  },
  logoutButton: {
    flexDirection: "row",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "700",
  },
});
