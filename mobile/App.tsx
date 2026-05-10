import React from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { enableScreens } from "react-native-screens";
import ErrorBoundary from "./src/components/ErrorBoundary";
import { AuthProvider } from "./src/context/AuthContext";
import { NetworkProvider } from "./src/context/NetworkContext";
import { NotificationProvider } from "./src/context/NotificationContext";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import ThemeToggle from "./src/components/ThemeToggle";
import RootNavigator from "./src/navigation/RootNavigator";

enableScreens(true);

function AppInner() {
  const { colors, isDark } = useTheme();

  const navTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.background,
          card: colors.headerBackground,
          text: colors.text,
          border: colors.border,
          primary: colors.accent,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.background,
          card: colors.headerBackground,
          text: colors.text,
          border: colors.border,
          primary: colors.accent,
        },
      };

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer theme={navTheme}>
        <StatusBar style={colors.statusBarStyle} />
        <RootNavigator />
      </NavigationContainer>
      {/* Global theme toggle — same position on every screen */}
      <View style={styles.overlayContainer} pointerEvents="box-none">
        <SafeAreaView pointerEvents="box-none">
          <View style={styles.overlayContent} pointerEvents="box-none">
            <ThemeToggle />
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  overlayContent: {
    alignItems: "flex-end",
    paddingRight: 24,
    paddingTop: 18,
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NetworkProvider>
          <NotificationProvider>
            <AuthProvider>
              <AppInner />
            </AuthProvider>
          </NotificationProvider>
        </NetworkProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
