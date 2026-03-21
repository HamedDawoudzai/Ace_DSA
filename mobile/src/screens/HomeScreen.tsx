import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import HomeCard from "../components/HomeCard";
import SpinningLogo from "../components/SpinningLogo";
import ThemeToggle from "../components/ThemeToggle";
import { MainStackParamList } from "../navigation/MainTabs";
import { useTheme } from "../context/ThemeContext";

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.topBar}>
        <View style={styles.topBarSpacer} />
        <ThemeToggle />
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <SpinningLogo size={200} />
        </View>

        <Text style={[styles.title, { color: colors.accent }]}>Ace DSA</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          What do you want to do today?
        </Text>

        <View style={styles.cards}>
          <HomeCard
            title="Learn About DSA"
            subtitle="Understand patterns and concepts"
            icon="book"
            onPress={() => navigation.navigate("Learn")}
          />
          <View style={styles.spacer} />
          <HomeCard
            title="Practice DSA"
            subtitle="Drill problems and sharpen your skills"
            icon="bulb"
            onPress={() => navigation.navigate("Drills")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  topBarSpacer: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 38,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 36,
    fontWeight: "500",
  },
  cards: {},
  spacer: {
    height: 16,
  },
});
