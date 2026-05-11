import { useThemeColor, useIsLightTheme } from "@/hooks/useThemeColor";
import { Ion } from "@/components/ui/icon";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { type Href, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GREEN_ALPHA,
  GREEN_ALPHA_MEDIUM,
  GREEN_ALPHA_SOFT,
  GREEN_ON_LIGHT,
  GREEN_SOLID,
  GREEN_TINT_LIGHT,
  screenGradientColors,
  SCREEN_GRADIENT_LOCATIONS,
} from "@/constants/brand";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const WELCOME_IMAGES = {
  img1: require("../../assets/welcomScreen/img1.png"),
  img2: require("../../assets/welcomScreen/img2.png"),
  img3: require("../../assets/welcomScreen/img3.png"),
} as const;

type WelcomeSlideCopy = {
  id: string;
  badgeText: string;
  headline: string;
  subtext: string;
};

type Slide =
  | (WelcomeSlideCopy & {
      widget: "welcomeImage";
      imageKey: keyof typeof WELCOME_IMAGES;
    })
  | (WelcomeSlideCopy & {
      widget: "goalSetup" | "tasks" | "remind";
    });

const slides: Slide[] = [
  {
    id: "1",
    badgeText: "Reminders",
    headline: "Timely pings so learning never fades",
    subtext:
      "Choose your skill, how long you practice, and the part of day that suits you best. Alerts show the precise next step so nothing stays vague.",
    widget: "welcomeImage" as const,
    imageKey: "img1" as const,
  },
  {
    id: "2",
    badgeText: "Focus",
    headline: "A short list that earns your attention",
    subtext:
      "Each day brings 3 to 4 scoped moves aligned with how you actually work. Narrow focus beats juggling everything at once and keeps traction honest.",
    widget: "welcomeImage" as const,
    imageKey: "img2" as const,
  },
  {
    id: "3",
    badgeText: "Victory",
    headline: "Progress big enough for a trophy moment",
    subtext:
      "Celebrate real finishes, move on when you skip, and wake to a fresh plan. Confidence grows when every small win stays visible.",
    widget: "welcomeImage" as const,
    imageKey: "img3" as const,
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const Colors = useThemeColor();
  const isLight = useIsLightTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  const [fontsLoaded] = useFonts({
    DarkByte: require("../../assets/DarkByte.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== activeIndex) {
      setActiveIndex(roundIndex);
    }
  };

  const gradientColors = screenGradientColors(isLight);

  const cardSurface = (light: boolean) =>
    ({
      backgroundColor: light ? "#FFFFFF" : Colors.card,
      shadowColor: light ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.5)",
      shadowOpacity: 1,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
      elevation: 12,
      borderColor: light
        ? "rgba(0,0,0,0.05)"
        : "rgba(255,255,255,0.05)",
    }) as const;

  const renderWidget = (item: Slide, light: boolean) => {
    switch (item.widget) {
      case "welcomeImage": {
        const source = WELCOME_IMAGES[item.imageKey];
        return (
          <View style={styles.welcomeImageWrap}>
            <Image
              source={source}
              style={styles.welcomeImage}
              resizeMode="contain"
            />
          </View>
        );
      }
      case "goalSetup":
        return (
          <View style={[styles.widgetCard, cardSurface(light)]}>
            <View style={styles.widgetHeader}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={[
                    styles.widgetIconBg,
                    {
                      backgroundColor: light
                        ? GREEN_TINT_LIGHT
                        : GREEN_ALPHA,
                    },
                  ]}
                >
                  <Ion
                    name="flag"
                    size={24}
                    color={light ? GREEN_ON_LIGHT : GREEN_SOLID}
                  />
                </View>
                <Text
                  style={[
                    styles.widgetTitle,
                    { color: light ? "#666666" : Colors.textSecondary },
                  ]}
                >
                  Your topic
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.widgetValue,
                { color: light ? "#111111" : Colors.text },
              ]}
              numberOfLines={2}
            >
              Learn React
            </Text>
            <View
              style={[
                styles.widgetFooter,
                { borderTopColor: light ? "#F5F5F5" : Colors.border },
              ]}
            >
              <View style={styles.metaChip}>
                <Ion
                  name="time-outline"
                  size={16}
                  color={GREEN_SOLID}
                />
                <Text
                  style={[
                    styles.metaChipText,
                    { color: GREEN_SOLID },
                  ]}
                >
                  60 min / day
                </Text>
              </View>
              <View
                style={[
                  styles.metaChip,
                  {
                    marginLeft: 8,
                    backgroundColor: light
                      ? "rgba(0,0,0,0.04)"
                      : "rgba(255,255,255,0.06)",
                  },
                ]}
              >
                <Ion
                  name="moon-outline"
                  size={16}
                  color={light ? "#666666" : Colors.textSecondary}
                />
                <Text
                  style={[
                    styles.metaChipText,
                    { color: light ? "#666666" : Colors.textSecondary },
                  ]}
                >
                  Evening
                </Text>
              </View>
            </View>
          </View>
        );
      case "tasks":
        return (
          <View style={[styles.widgetCard, cardSurface(light)]}>
            <View style={[styles.widgetHeader, { marginBottom: 16 }]}>
              <Text
                style={[
                  styles.widgetTitle,
                  {
                    color: light ? "#111111" : Colors.text,
                    fontSize: 18,
                    fontWeight: "700",
                  },
                ]}
              >
                {"Today's tasks"}
              </Text>
              <Ion
                name="sparkles"
                size={22}
                color={light ? "#A0A0A0" : Colors.textSecondary}
              />
            </View>
            {[
              "Watch hooks video",
              "Build a component",
              "Practice props",
              "Quick quiz: dependency arrays",
            ].map((title, i) => (
              <View key={title} style={styles.taskRow}>
                <View
                  style={[
                    styles.taskCheckbox,
                    {
                      borderColor: light ? "#D0D0D0" : Colors.border,
                      backgroundColor:
                        i === 0 ? GREEN_SOLID : "transparent",
                    },
                  ]}
                >
                  {i === 0 ? (
                    <Ion name="checkmark" size={14} color="#FFFFFF" />
                  ) : null}
                </View>
                <Text
                  style={[
                    styles.taskTitle,
                    {
                      color: light ? "#111111" : Colors.text,
                      opacity: i === 0 ? 0.45 : 1,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {title}
                </Text>
              </View>
            ))}
          </View>
        );
      case "remind":
        return (
          <View style={[styles.widgetCard, cardSurface(light)]}>
            <View
              style={[
                styles.widgetHeader,
                { alignItems: "center", marginBottom: 16 },
              ]}
            >
              <View
                style={[
                  styles.widgetIconBg,
                  {
                    backgroundColor: light
                      ? GREEN_TINT_LIGHT
                      : GREEN_ALPHA,
                    borderRadius: 14,
                    width: 48,
                    height: 48,
                  },
                ]}
              >
                <Ion
                  name="notifications"
                  size={24}
                  color={light ? GREEN_ON_LIGHT : GREEN_SOLID}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.widgetTitle,
                    {
                      color: light ? "#111111" : Colors.text,
                      fontSize: 17,
                      marginBottom: 4,
                      fontWeight: "700",
                    },
                  ]}
                >
                  Smart nudge
                </Text>
                <Text
                  style={[
                    styles.widgetSubTitle,
                    {
                      color: light ? "#666666" : Colors.textSecondary,
                      fontSize: 14,
                    },
                  ]}
                >
                  At your preferred time
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.notifyBubble,
                {
                  backgroundColor: light ? "#F5F5F5" : "rgba(255,255,255,0.06)",
                  borderColor: light
                    ? "rgba(0,0,0,0.06)"
                    : "rgba(255,255,255,0.08)",
                },
              ]}
            >
              <Text
                style={[
                  styles.notifyBubbleText,
                  { color: light ? "#111111" : Colors.text },
                ]}
              >
                Start your React practice 💡
              </Text>
            </View>
            <View style={styles.adaptRow}>
              <Ion
                name="git-branch-outline"
                size={18}
                color={GREEN_SOLID}
              />
              <Text
                style={[
                  styles.adaptRowText,
                  { color: light ? "#666666" : Colors.textSecondary },
                ]}
              >
                Plans adapt when you complete or skip — fresh tasks every day.
              </Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const renderItem = ({ item }: ListRenderItemInfo<Slide>) => (
    <View style={styles.slideContainer}>
      <View style={styles.widgetContainer}>
        {renderWidget(item, isLight)}
      </View>
      <View style={styles.contentContainer}>
        <View
          style={[styles.badge, isLight ? styles.badgeLight : styles.badgeDark]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: isLight ? GREEN_ON_LIGHT : GREEN_SOLID },
            ]}
          >
            {item.badgeText}
          </Text>
        </View>

        <Text
          style={[
            styles.headline,
            { color: isLight ? "#111111" : Colors.text },
          ]}
        >
          {item.headline}
        </Text>

        <Text
          style={[
            styles.subtext,
            { color: isLight ? "#666666" : Colors.textSecondary },
          ]}
        >
          {item.subtext}
        </Text>
      </View>
    </View>
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={[...gradientColors]}
      locations={[...SCREEN_GRADIENT_LOCATIONS]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradientRoot}
      onLayout={onLayoutRootView}
    >
      <StatusBar
        barStyle={isLight ? "dark-content" : "light-content"}
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <Text
            style={[
              styles.logoText,
              { color: isLight ? "#000000" : Colors.text },
            ]}
          >
            Actra
          </Text>
        </View>

        <FlatList
          data={slides}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={styles.list}
        />

        <View
          style={[
            styles.footerContainer,
            { paddingBottom: Math.max(insets.bottom, 24) },
          ]}
        >
          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: isLight
                      ? "#E0E0E0"
                      : "rgba(255,255,255,0.25)",
                  },
                  index === activeIndex && [
                    styles.activeDot,
                    {
                      backgroundColor: GREEN_SOLID,
                    },
                  ],
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/login",
                params: { mode: "signup" },
              } as unknown as Href)
            }
          >
            <View
              style={[
                styles.getStartedButton,
                isLight
                  ? styles.getStartedButtonLight
                  : styles.getStartedButtonDark,
              ]}
            >
              <View style={styles.innerHighlight} />
              <Text
                style={[
                  styles.getStartedText,
                  { color: isLight ? "#FFFFFF" : "#000000" },
                ]}
              >
                Get Started
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.signInButton,
              isLight ? styles.signInButtonLight : styles.signInButtonDark,
            ]}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/login",
                params: { mode: "login" },
              } as unknown as Href)
            }
          >
            <Text
              style={[
                styles.signInText,
                { color: isLight ? "#000000" : Colors.text },
              ]}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientRoot: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    marginTop: 8,
    height: 40,
    justifyContent: "center",
  },
  logoText: {
    fontFamily: "DarkByte",
    fontSize: 26,
    letterSpacing: 2,
  },
  list: {
    flex: 1,
    width: "100%",
  },
  slideContainer: {
    width,
    flex: 1,
    justifyContent: "center",
    paddingBottom: 24,
  },
  widgetContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  welcomeImageWrap: {
    flex: 1,
    width: width - 48,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 340,
  },
  welcomeImage: {
    width: "100%",
    height: 400,
  },
  widgetCard: {
    width: width - 48,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
  },
  widgetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  widgetIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  widgetValue: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 24,
    letterSpacing: -1,
  },
  widgetFooter: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    paddingTop: 16,
    borderTopWidth: 1,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
    gap: 6,
    backgroundColor: GREEN_ALPHA_SOFT,
  },
  metaChipText: {
    fontSize: 14,
    fontWeight: "600",
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  taskCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  taskTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
  widgetSubTitle: {
    fontSize: 14,
    marginTop: 2,
  },
  notifyBubble: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  notifyBubbleText: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 21,
  },
  adaptRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  adaptRowText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
  },
  contentContainer: {
    width: "100%",
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 16,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 14,
  },
  badgeLight: {
    backgroundColor: GREEN_TINT_LIGHT,
  },
  badgeDark: {
    backgroundColor: GREEN_ALPHA_MEDIUM,
  },
  badgeText: {
    fontWeight: "600",
    fontSize: 13,
  },
  headline: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 30,
    ...Platform.select({
      android: { includeFontPadding: false },
    }),
  },
  subtext: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  footerContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 8,
  },
  pagination: {
    flexDirection: "row",
    marginBottom: 22,
    gap: 8,
  },
  dot: {
    width: 24,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 28,
  },
  getStartedButton: {
    width: width - 48,
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
    marginBottom: 12,
    position: "relative",
    overflow: "hidden",
  },
  getStartedButtonLight: {
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#222222",
  },
  getStartedButtonDark: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
  },
  innerHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: "600",
  },
  signInButton: {
    width: width - 48,
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
  },
  signInButtonLight: {
    backgroundColor: "#F0F0F0",
  },
  signInButtonDark: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  signInText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
