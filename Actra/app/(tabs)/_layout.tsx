import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import { Ion } from "@/components/ui/icon";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HOME_GREEN = "#24bf55";

export default function TabsLayout() {
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const isLight = activeTheme === "light";
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Platform.OS === "ios" ? Math.max(insets.bottom, 16) : 24,
          left: 0,
          right: 0,
          marginHorizontal: 20,
          height: 68,
          borderRadius: 34,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 20,
          backgroundColor: isLight ? "#FFFFFF" : "#1C1C1C",
        },
        tabBarActiveTintColor: HOME_GREEN,
        tabBarInactiveTintColor: isLight ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.4)",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          paddingBottom: 10,
        },
        tabBarItemStyle: {
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ion name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="focus"
        options={{
          title: "Focus",
          tabBarIcon: ({ color, focused }) => (
            <Ion name={focused ? "aperture" : "aperture-outline"} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Ion name={focused ? "settings" : "settings-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
