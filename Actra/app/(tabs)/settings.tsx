import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { type Href, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import { Ion } from "@/components/ui/icon";
import { screenGradientColors, ONBOARDING_GRADIENT_LOCATIONS } from "@/constants/brand";

export default function SettingsScreen() {
  const router = useRouter();
  const Colors = useThemeColor();
  const { activeTheme, setTheme } = useThemeStore();
  const insets = useSafeAreaInsets();

  const isLight = activeTheme === "light";

  const gradientColors = screenGradientColors(isLight);

  const handleLogout = () => {
    router.replace("/" as Href);
  };

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
        },
      ]}
    >
      <StatusBar
        barStyle={isLight ? "dark-content" : "light-content"}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors.text }]}>Settings</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.textSecondary }]}>
            PREFERENCES
          </Text>
          
          <View
            style={[
              styles.card,
              {
                backgroundColor: isLight ? "#FFFFFF" : Colors.card,
                borderColor: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
              },
            ]}
          >
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View
                  style={[
                    styles.iconBg,
                    { backgroundColor: isLight ? "#F0F0F0" : "rgba(255,255,255,0.1)" },
                  ]}
                >
                  <Ion name="moon" size={20} color={isLight ? "#666666" : Colors.text} />
                </View>
                <Text style={[styles.rowText, { color: Colors.text }]}>Dark Mode</Text>
              </View>
              <Switch
                value={!isLight}
                onValueChange={(val) => setTheme(val ? "dark" : "light")}
                trackColor={{ false: "#D0D0D0", true: isLight ? "#007725" : Colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.divider, { backgroundColor: isLight ? "#F5F5F5" : Colors.border }]} />

            <TouchableOpacity style={styles.row} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <View
                  style={[
                    styles.iconBg,
                    { backgroundColor: isLight ? "#F0F0F0" : "rgba(255,255,255,0.1)" },
                  ]}
                >
                  <Ion name="notifications" size={20} color={isLight ? "#666666" : Colors.text} />
                </View>
                <Text style={[styles.rowText, { color: Colors.text }]}>Notifications</Text>
              </View>
              <Ion name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.textSecondary }]}>
            ACCOUNT
          </Text>
          
          <View
            style={[
              styles.card,
              {
                backgroundColor: isLight ? "#FFFFFF" : Colors.card,
                borderColor: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
              },
            ]}
          >
            <TouchableOpacity style={styles.row} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <View
                  style={[
                    styles.iconBg,
                    { backgroundColor: isLight ? "#F0F0F0" : "rgba(255,255,255,0.1)" },
                  ]}
                >
                  <Ion name="person" size={20} color={isLight ? "#666666" : Colors.text} />
                </View>
                <Text style={[styles.rowText, { color: Colors.text }]}>Edit Profile</Text>
              </View>
              <Ion name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: isLight ? "#F5F5F5" : Colors.border }]} />

            <TouchableOpacity style={styles.row} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <View
                  style={[
                    styles.iconBg,
                    { backgroundColor: isLight ? "#F0F0F0" : "rgba(255,255,255,0.1)" },
                  ]}
                >
                  <Ion name="flag" size={20} color={isLight ? "#666666" : Colors.text} />
                </View>
                <Text style={[styles.rowText, { color: Colors.text }]}>Change Goal</Text>
              </View>
              <Ion name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.logoutBtn,
            {
              backgroundColor: isLight ? "#FFFFFF" : Colors.card,
              borderColor: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
            },
          ]}
          activeOpacity={0.7}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutText, { color: Colors.error }]}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 8,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  rowText: {
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginLeft: 68,
  },
  logoutBtn: {
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
