import React, { useState, useEffect, useRef } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { type Href, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/store/theme-store";
import * as Haptics from "expo-haptics";
import { Button } from "@/components/ui/button";
import { Ion } from "@/components/ui/icon";
import { screenGradientColors, ONBOARDING_GRADIENT_LOCATIONS } from "@/constants/brand";
import { useOnboardingStore } from "@/store/onboarding-store";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const ITEM_HEIGHT = 50;
const HOURS = Array.from({ length: 13 }, (_, i) => ({ label: `${i} hr`, value: i }));
const MINUTES = Array.from({ length: 12 }, (_, i) => ({ label: `${i * 5} min`, value: i * 5 }));

function WheelColumn({ data, value, onChange }: { data: {label: string, value: any}[], value: any, onChange: (v: any) => void }) {
  const isLight = useThemeStore().activeTheme === "light";
  const Colors = useThemeColor();
  const flatListRef = useRef<any>(null);
  
  const initialIndex = Math.max(0, data.findIndex(d => d.value === value));
  
  const scrollY = useRef(new Animated.Value(initialIndex * ITEM_HEIGHT)).current;
  
  const paddedData = [
    { value: 'pad1', label: '' },
    { value: 'pad2', label: '' },
    ...data,
    { value: 'pad3', label: '' },
    { value: 'pad4', label: '' },
  ];

  useEffect(() => {
    let lastIndex = initialIndex;
    const id = scrollY.addListener(({ value }) => {
      const index = Math.round(value / ITEM_HEIGHT);
      if (index !== lastIndex && index >= 0 && index < data.length) {
        lastIndex = index;
        Haptics.selectionAsync().catch(() => {});
      }
    });
    return () => scrollY.removeListener(id);
  }, [data.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: initialIndex * ITEM_HEIGHT, animated: false });
    }, 50);
    return () => clearTimeout(timer);
  }, [initialIndex]);

  const handleMomentumScrollEnd = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    if (index >= 0 && index < data.length) {
      onChange(data[index].value);
    }
  };

  const handleScrollEndDrag = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    if (index >= 0 && index < data.length) {
      onChange(data[index].value);
    }
  };

  return (
    <View style={{ height: ITEM_HEIGHT * 5, flex: 1, alignItems: 'center' }}>
      <AnimatedFlatList
        ref={flatListRef}
        data={paddedData}
        keyExtractor={(item: any, idx: number) => item.value.toString() + idx}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScrollEndDrag={handleScrollEndDrag}
        scrollEventThrottle={16}
        getItemLayout={(_: any, index: number) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
        renderItem={({ item, index }: any) => {
          const isPadding = item.value.toString().startsWith('pad');
          if (isPadding) {
             return <View style={{ height: ITEM_HEIGHT }} />;
          }

          const centerScrollY = (index - 2) * ITEM_HEIGHT;
          const inputRange = [
            centerScrollY - 2 * ITEM_HEIGHT,
            centerScrollY - 1 * ITEM_HEIGHT,
            centerScrollY,
            centerScrollY + 1 * ITEM_HEIGHT,
            centerScrollY + 2 * ITEM_HEIGHT,
          ];

          const rotateX = scrollY.interpolate({
            inputRange,
            outputRange: ['-50deg', '-25deg', '0deg', '25deg', '50deg'],
            extrapolate: 'clamp',
          });

          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.75, 0.85, 1.05, 0.85, 0.75],
            extrapolate: 'clamp',
          });

          const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [0.2, 0.4, 1, 0.4, 0.2],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View style={{ 
              height: ITEM_HEIGHT, 
              justifyContent: 'center', 
              alignItems: 'center',
              opacity,
              transform: [{ perspective: 600 }, { rotateX }, { scale }]
            }}>
              <Text style={{ 
                fontSize: 24, 
                fontWeight: '500',
                color: Colors.text,
              }}>
                {item.label}
              </Text>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

export default function GoalTimeScreen() {
  const router = useRouter();
  const Colors = useThemeColor();
  const { activeTheme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const setOnboarding = useOnboardingStore((s) => s.set);

  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(0);

  const isLight = activeTheme === "light";

  const gradientColors = screenGradientColors(isLight);

  const isTimeUnset = hours === 0 && minutes === 0;

  const handleContinue = () => {
    if (isTimeUnset) return;
    setOnboarding({ hours, minutes });
    router.push("/(onboarding)/goal-frequency" as Href);
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
        <TouchableOpacity onPress={handleBack} style={styles.backButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ion name="chevron-back" size={28} color={Colors.text} />
        </TouchableOpacity>
        <View style={[styles.progressTrack, { backgroundColor: isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)" }]}>
          <View style={[styles.progressFill, { width: "83%", backgroundColor: Colors.text }]} />
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: Colors.text }]}>
              How much time do you want to give each day?
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', height: ITEM_HEIGHT * 5, width: '100%', position: 'relative' }}>
              <View style={{
                position: 'absolute',
                top: ITEM_HEIGHT * 2,
                height: ITEM_HEIGHT,
                left: 20,
                right: 20,
                backgroundColor: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.08)',
                borderRadius: 12,
              }} />
              <WheelColumn data={HOURS} value={hours} onChange={setHours} />
              <WheelColumn data={MINUTES} value={minutes} onChange={setMinutes} />
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              title="Continue"
              onPress={handleContinue}
              style={{ ...styles.actionButton, opacity: isTimeUnset ? 0.5 : 1 }}
            />
          </View>
        </View>
      </View>
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
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 40,
  },
  footer: {
    marginTop: "auto",
    marginBottom: 8,
  },
  actionButton: {
    width: "100%",
  },
});