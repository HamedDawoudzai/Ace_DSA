import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
} from "react-native";

import HomeScreen from "../screens/HomeScreen";
import DrillsScreen from "../screens/DrillsScreen";
import DrillDetailScreen from "../screens/DrillDetailScreen";
import LearnScreen from "../screens/LearnScreen";
import LearnDetailScreen from "../screens/LearnDetailScreen";
import PracticeScreen from "../screens/PracticeScreen";
import StatsScreen from "../screens/StatsScreen";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import SpinningLogo from "../components/SpinningLogo";
import { Drill } from "../types";

export type MainStackParamList = {
  Home: undefined;
  Learn: undefined;
  LearnDetail: { id: string; track: "data-structures" | "algorithms" };
  Drills: undefined;
  DrillDetail: { drill: Drill };
  Practice: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

function HomeStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBackground },
        headerTintColor: colors.headerText,
        headerShadowVisible: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Learn"
        component={LearnScreen}
        options={{ title: "Learn DSA" }}
      />
      <Stack.Screen
        name="LearnDetail"
        component={LearnDetailScreen}
        options={{ title: "Learn" }}
      />
      <Stack.Screen
        name="Drills"
        component={DrillsScreen}
        options={{ title: "Practice Drills" }}
      />
      <Stack.Screen
        name="DrillDetail"
        component={DrillDetailScreen}
        options={{ title: "Drill" }}
      />
      <Stack.Screen name="Practice" component={PracticeScreen} />
    </Stack.Navigator>
  );
}

export type TabParamList = {
  HomeTab: undefined;
  StatsTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

function ProfileTab() {
  const { signOut } = useAuth();
  const { colors, isDark, toggle } = useTheme();

  return (
    <SafeAreaView
      style={[profileStyles.container, { backgroundColor: colors.background }]}
    >
      <View style={profileStyles.inner}>
        <View style={profileStyles.logoArea}>
          <SpinningLogo size={100} />
          <Text style={[profileStyles.title, { color: colors.accent }]}>
            Ace DSA
          </Text>
        </View>

        <Text style={[profileStyles.sectionLabel, { color: colors.textMuted }]}>
          APPEARANCE
        </Text>
        <TouchableOpacity
          style={[
            profileStyles.themeToggleRow,
            {
              backgroundColor: colors.surface,
              borderColor: isDark
                ? "rgba(45,212,191,0.12)"
                : "rgba(0,0,0,0.06)",
            },
          ]}
          onPress={toggle}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isDark ? "moon" : "sunny"}
            size={22}
            color={colors.accent}
          />
          <Text
            style={[profileStyles.themeToggleText, { color: colors.text }]}
          >
            {isDark ? "Dark Mode" : "Light Mode"}
          </Text>
          <View
            style={[
              profileStyles.toggleTrack,
              {
                backgroundColor: isDark
                  ? "rgba(45, 212, 191, 0.25)"
                  : "rgba(245, 200, 66, 0.35)",
              },
            ]}
          >
            <View
              style={[
                profileStyles.toggleThumb,
                {
                  backgroundColor: colors.accent,
                  alignSelf: isDark ? "flex-end" : "flex-start",
                },
              ]}
            />
          </View>
        </TouchableOpacity>

        <View style={profileStyles.spacer} />

        <TouchableOpacity
          style={[
            profileStyles.signOutBtn,
            {
              backgroundColor: isDark
                ? "rgba(239, 68, 68, 0.1)"
                : "rgba(244, 67, 54, 0.08)",
              borderColor: isDark
                ? "rgba(239, 68, 68, 0.2)"
                : "rgba(244, 67, 54, 0.15)",
            },
          ]}
          onPress={signOut}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color={colors.error} />
          <Text style={[profileStyles.signOutText, { color: colors.error }]}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  logoArea: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    marginTop: 4,
    letterSpacing: 0.5,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 10,
    marginLeft: 4,
  },
  themeToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  themeToggleText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 3,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  spacer: {
    flex: 1,
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    marginBottom: 32,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export default function MainTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="StatsTab"
        component={StatsScreen}
        options={{
          tabBarLabel: "Stats",
          headerShown: true,
          headerTitle: "My Stats",
          headerStyle: { backgroundColor: colors.headerBackground },
          headerTintColor: colors.headerText,
          headerShadowVisible: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileTab}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
