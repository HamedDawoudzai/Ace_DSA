import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Animated } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HomeCard from "../components/HomeCard";
import SpinningLogo from "../components/SpinningLogo";
import ThemeToggle from "../components/ThemeToggle";
import { MainStackParamList } from "../navigation/MainTabs";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";
import { StatsResponse } from "../types";

function getGreeting(): { text: string; icon: keyof typeof Ionicons.glyphMap } {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good morning", icon: "sunny-outline" };
  if (h < 17) return { text: "Good afternoon", icon: "partly-sunny-outline" };
  return { text: "Good evening", icon: "moon-outline" };
}

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { colors, isDark } = useTheme();
  const { text: greetingText, icon: greetingIcon } = getGreeting();

  const [streak, setStreak] = useState<number | null>(null);
  const [completed, setCompleted] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  // Greeting fade-in + slide-up on mount
  const greetingOpacity = useRef(new Animated.Value(0)).current;
  const greetingTranslateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(greetingOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(greetingTranslateY, {
        toValue: 0,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Refresh stats whenever this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      api.get<StatsResponse>("/me/stats").then(({ data }) => {
        setStreak(data.streak);
        setCompleted(data.total_completed);
        setTotal(data.total_problems);
      }).catch(() => {
        // Silently ignore — stats pills just won't show
      });
    }, [])
  );

  const showStats = streak !== null;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Animated.View
          style={[
            styles.greetingBlock,
            {
              opacity: greetingOpacity,
              transform: [{ translateY: greetingTranslateY }],
            },
          ]}
        >
          <View style={styles.greetingRow}>
            <Text
              style={[
                styles.greeting,
                { color: colors.text },
                isDark && {
                  textShadowColor: "rgba(13,217,196,0.25)",
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 10,
                },
              ]}
            >
              {greetingText}
            </Text>
            <Ionicons name={greetingIcon} size={22} color={colors.accent} />
          </View>
          <Text
            style={[
              styles.headerSub,
              { color: colors.textMuted, letterSpacing: 0.15 },
            ]}
          >
            Let's practice some DSA today
          </Text>

          {/* Streak + progress pills */}
          {showStats && (
            <View style={styles.pillsRow}>
              {(streak ?? 0) > 0 && (
                <View
                  style={[
                    styles.pill,
                    {
                      backgroundColor: colors.accentSubtle,
                      borderColor: colors.accent,
                    },
                  ]}
                >
                  <Ionicons name="flame" size={13} color={colors.accent} />
                  <Text style={[styles.pillText, { color: colors.accent }]}>
                    {streak} day streak
                  </Text>
                </View>
              )}
              {completed !== null && total !== null && total > 0 && (
                <View
                  style={[
                    styles.pill,
                    {
                      backgroundColor: isDark
                        ? "rgba(52,211,153,0.10)"
                        : "rgba(34,197,94,0.09)",
                      borderColor: isDark
                        ? "rgba(52,211,153,0.35)"
                        : "rgba(34,197,94,0.3)",
                    },
                  ]}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={13}
                    color={colors.success}
                  />
                  <Text style={[styles.pillText, { color: colors.success }]}>
                    {completed}/{total} solved
                  </Text>
                </View>
              )}
            </View>
          )}
        </Animated.View>
        <ThemeToggle />
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <SpinningLogo size={176} />
        <Text
          style={[
            styles.appName,
            { color: colors.accent },
            isDark && {
              textShadowColor: "rgba(13,217,196,0.35)",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 16,
            },
          ]}
        >
          Ace DSA
        </Text>
      </View>

      {/* Cards */}
      <View style={styles.cards}>
        <HomeCard
          title="Learn About DSA"
          subtitle="Understand patterns and concepts"
          icon="book-outline"
          onPress={() => navigation.navigate("Learn")}
        />
        <HomeCard
          title="Practice Drills"
          subtitle="Drill problems and sharpen your skills"
          icon="flash-outline"
          onPress={() => navigation.navigate("Drills")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 4,
  },
  greetingBlock: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 5,
  },
  pillsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    flexWrap: "wrap",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "700",
  },
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 8,
  },
  appName: {
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: -1,
    marginTop: 10,
  },
  cards: {
    paddingHorizontal: 24,
    paddingBottom: 36,
    gap: 14,
  },
});
