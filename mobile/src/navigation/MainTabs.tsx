import React, { useRef, useEffect } from "react";
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  Platform,
  Animated,
} from "react-native";

import HomeScreen from "../screens/HomeScreen";
import DrillsScreen from "../screens/DrillsScreen";
import DrillDetailScreen from "../screens/DrillDetailScreen";
import LearnScreen from "../screens/LearnScreen";
import LearnDetailScreen from "../screens/LearnDetailScreen";
import PracticeScreen from "../screens/PracticeScreen";
import StatsScreen from "../screens/StatsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import FlashcardScreen from "../screens/FlashcardScreen";
import { useTheme } from "../context/ThemeContext";
import { Drill } from "../types";
import { LearnTrack } from "../data/learnTopics";
export type MainStackParamList = {
  Home: undefined;
  Learn: undefined;
  LearnDetail: { id: string; track: "data-structures" | "algorithms" | "complexity" };
  Drills: { advance?: boolean } | undefined;
  DrillDetail: { drill: Drill; fromQueue?: boolean; drillQueue?: Drill[]; queueIndex?: number; selectedCategory?: string | null };
  Practice: undefined;
  Flashcard: { track: LearnTrack };
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
      <Stack.Screen
        name="Flashcard"
        component={FlashcardScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export type TabParamList = {
  HomeTab: undefined;
  StatsTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

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
  ProfileTab: {
    label: "Profile",
    active: "person",
    inactive: "person-outline",
  },
};

const TAB_COUNT = Object.keys(TAB_CONFIG).length;

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors, isDark } = useTheme();

  // Per-tab spring scale for the active pill indicator
  const pillScales = useRef(
    Array.from({ length: TAB_COUNT }, (_, i) =>
      new Animated.Value(state.index === i ? 1.1 : 1.0)
    )
  ).current;

  // Per-tab icon opacity for cross-fade feel
  const iconOpacities = useRef(
    Array.from({ length: TAB_COUNT }, (_, i) =>
      new Animated.Value(state.index === i ? 1.0 : 0.55)
    )
  ).current;

  useEffect(() => {
    pillScales.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: state.index === index ? 1.1 : 1.0,
        friction: 5,
        tension: 160,
        useNativeDriver: true,
      }).start();
    });
    iconOpacities.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: state.index === index ? 1.0 : 0.55,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });
  }, [state.index]);

  // Semi-transparent frosted-glass style background
  const tabBarBg = isDark
    ? "rgba(10, 10, 10, 0.95)"
    : "rgba(255, 255, 255, 0.93)";

  return (
    <View
      style={[
        tabStyles.bar,
        {
          backgroundColor: tabBarBg,
          borderTopColor: colors.tabBarBorder,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const cfg = TAB_CONFIG[route.name];
        const pillScale = pillScales[index];
        const iconOpacity = iconOpacities[index];

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
            <Animated.View
              style={[
                tabStyles.pill,
                isFocused && {
                  backgroundColor: colors.accentSubtle,
                  // Accent glow on active pill in dark mode
                  ...(isDark && {
                    shadowColor: colors.accent,
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 0 },
                  }),
                },
                { transform: [{ scale: pillScale }] },
              ]}
            >
              <Animated.View style={{ opacity: iconOpacity }}>
                <Ionicons
                  name={isFocused ? cfg.active : cfg.inactive}
                  size={22}
                  color={isFocused ? colors.accent : colors.textMuted}
                />
              </Animated.View>
            </Animated.View>
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
    width: 54,
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
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
