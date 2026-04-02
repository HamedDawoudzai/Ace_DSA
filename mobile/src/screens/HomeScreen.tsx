import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HomeCard from "../components/HomeCard";
import SpinningLogo from "../components/SpinningLogo";
import ThemeToggle from "../components/ThemeToggle";
import { MainStackParamList } from "../navigation/MainTabs";
import { useTheme } from "../context/ThemeContext";

function getGreeting(): { text: string; icon: keyof typeof Ionicons.glyphMap } {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good morning", icon: "sunny-outline" };
  if (h < 17) return { text: "Good afternoon", icon: "partly-sunny-outline" };
  return { text: "Good evening", icon: "moon-outline" };
}

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { colors } = useTheme();
  const { text: greetingText, icon: greetingIcon } = getGreeting();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greetingBlock}>
          <View style={styles.greetingRow}>
            <Text style={[styles.greeting, { color: colors.text }]}>
              {greetingText}
            </Text>
            <Ionicons name={greetingIcon} size={20} color={colors.accent} />
          </View>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>
            Let's practice some DSA today
          </Text>
        </View>
        <ThemeToggle />
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <SpinningLogo size={176} />
        <Text style={[styles.appName, { color: colors.accent }]}>Ace DSA</Text>
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
    paddingTop: 16,
    paddingBottom: 4,
  },
  greetingBlock: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  headerSub: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 3,
  },
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 8,
  },
  appName: {
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: -0.8,
    marginTop: 6,
  },
  cards: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
  },
});
