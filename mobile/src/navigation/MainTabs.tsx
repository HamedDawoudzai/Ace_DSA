import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import DrillsScreen from "../screens/DrillsScreen";
import DrillDetailScreen from "../screens/DrillDetailScreen";
import LearnScreen from "../screens/LearnScreen";
import PracticeScreen from "../screens/PracticeScreen";
import StatsScreen from "../screens/StatsScreen";
import { useAuth } from "../context/AuthContext";
import { Drill } from "../types";

export type MainStackParamList = {
  Home: undefined;
  Learn: undefined;
  Drills: undefined;
  DrillDetail: { drill: Drill };
  Practice: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#E1DAC9" },
        headerTintColor: "#333",
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Learn" component={LearnScreen} />
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

  return (
    <TouchableOpacity style={profileStyles.container} onPress={signOut}>
      <Ionicons name="log-out-outline" size={32} color="#F44336" />
      <Text style={profileStyles.text}>Sign Out</Text>
    </TouchableOpacity>
  );
}

const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E1DAC9",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#F44336",
    marginTop: 8,
  },
});

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#F5C842",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: { backgroundColor: "#fff", borderTopColor: "#eee" },
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
          headerStyle: { backgroundColor: "#E1DAC9" },
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
