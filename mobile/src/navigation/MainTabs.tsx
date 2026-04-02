import React from "react";
import { createBottomTabNavigator, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
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
        headerTintColor: colors.accent,
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: "700", fontSize: 17 },
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

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab() {
  const { signOut } = useAuth();
  const { colors, isDark, toggle } = useTheme();

  return (
    <SafeAreaView
      style={[profileStyles.container, { backgroundColor: colors.background }]}
    >
      <View style={profileStyles.inner}>
        {/* Logo */}
        <View style={profileStyles.logoArea}>
          <SpinningLogo size={90} />
          <Text style={[profileStyles.title, { color: colors.accent }]}>
            Ace DSA
          </Text>
          <Text style={[profileStyles.tagline, { color: colors.textMuted }]}>
            Sharpen your skills daily
          </Text>
        </View>

        {/* Appearance section */}
        <Text style={[profileStyles.sectionLabel, { color: colors.textMuted }]}>
          APPEARANCE
        </Text>
        <Pressable
          style={[
            profileStyles.row,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={toggle}
        >
          <View
            style={[
              profileStyles.rowIcon,
              { backgroundColor: colors.accentSubtle },
            ]}
          >
            <Ionicons
              name={isDark ? "moon" : "sunny"}
              size={20}
              color={colors.accent}
            />
          </View>
          <Text style={[profileStyles.rowLabel, { color: colors.text }]}>
            {isDark ? "Dark Mode" : "Light Mode"}
          </Text>
          {/* Toggle track */}
          <View
            style={[
              profileStyles.track,
              {
                backgroundColor: isDark
                  ? colors.accentMedium
                  : colors.accentSubtle,
              },
            ]}
          >
            <View
              style={[
                profileStyles.thumb,
                {
                  backgroundColor: colors.accent,
                  alignSelf: isDark ? "flex-end" : "flex-start",
                },
              ]}
            />
          </View>
        </Pressable>

        <View style={profileStyles.spacer} />

        {/* Sign out */}
        <Pressable
          style={[
            profileStyles.signOutBtn,
            {
              backgroundColor: isDark
                ? "rgba(248,113,113,0.08)"
                : "rgba(239,68,68,0.07)",
              borderColor: isDark
                ? "rgba(248,113,113,0.18)"
                : "rgba(239,68,68,0.15)",
            },
          ]}
          onPress={signOut}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={[profileStyles.signOutText, { color: colors.error }]}>
            Sign Out
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const profileStyles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  logoArea: { alignItems: "center", marginBottom: 36 },
  title: { fontSize: 26, fontWeight: "900", marginTop: 6, letterSpacing: -0.4 },
  tagline: { fontSize: 13, marginTop: 4, fontWeight: "500" },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    marginBottom: 10,
    marginLeft: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { flex: 1, fontSize: 16, fontWeight: "600" },
  track: {
    width: 46,
    height: 26,
    borderRadius: 13,
    padding: 3,
    justifyContent: "center",
  },
  thumb: { width: 20, height: 20, borderRadius: 10 },
  spacer: { flex: 1 },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    marginBottom: 32,
  },
  signOutText: { fontSize: 16, fontWeight: "700" },
});

// ─── Custom Tab Bar ────────────────────────────────────────────────────────────

const TAB_CONFIG: Record<
  string,
  {
    label: string;
    active: keyof typeof Ionicons.glyphMap;
    inactive: keyof typeof Ionicons.glyphMap;
  }
> = {
  HomeTab: { label: "Home", active: "home", inactive: "home-outline" },
  StatsTab: {
    label: "Stats",
    active: "stats-chart",
    inactive: "stats-chart-outline",
  },
  ProfileTab: { label: "Profile", active: "person", inactive: "person-outline" },
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        tabStyles.bar,
        {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const cfg = TAB_CONFIG[route.name];

        const onPress = () => {
          if (!isFocused) {
            navigation.navigate(route.name as never);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={tabStyles.item}
            android_ripple={{ color: "transparent" }}
          >
            <View
              style={[
                tabStyles.pill,
                isFocused && { backgroundColor: colors.accentSubtle },
              ]}
            >
              <Ionicons
                name={isFocused ? cfg.active : cfg.inactive}
                size={22}
                color={isFocused ? colors.accent : colors.textMuted}
              />
            </View>
            <Text
              style={[
                tabStyles.label,
                {
                  color: isFocused ? colors.accent : colors.textMuted,
                  fontWeight: isFocused ? "700" : "500",
                },
              ]}
            >
              {cfg.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 24 : 10,
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  pill: {
    width: 52,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.1,
  },
});

// ─── Main Tabs ─────────────────────────────────────────────────────────────────

export default function MainTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen
        name="StatsTab"
        component={StatsScreen}
        options={{
          headerShown: true,
          headerTitle: "My Stats",
          headerStyle: { backgroundColor: colors.headerBackground },
          headerTintColor: colors.accent,
          headerTitleStyle: { fontWeight: "700", fontSize: 17 },
          headerShadowVisible: false,
        }}
      />
      <Tab.Screen name="ProfileTab" component={ProfileTab} />
    </Tab.Navigator>
  );
}
