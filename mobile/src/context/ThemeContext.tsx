import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Animated, StyleSheet, useColorScheme } from "react-native";
import * as storage from "../services/storage";

export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentText: string;
  accentSubtle: string;
  accentMedium: string;
  border: string;
  error: string;
  success: string;
  inputBackground: string;
  inputText: string;
  placeholderText: string;
  tabBar: string;
  tabBarBorder: string;
  headerBackground: string;
  headerText: string;
  cardBackground: string;
  segmentedBackground: string;
  statusBarStyle: "light" | "dark";
}

const lightColors: ThemeColors = {
  background: "#FAF9F7",
  surface: "#FFFFFF",
  surfaceAlt: "#F2F0EB",
  text: "#1A1A1A",
  textSecondary: "#6B6B6B",
  textMuted: "#9CA3AF",
  accent: "#F0A500",
  accentText: "#1A1A1A",
  accentSubtle: "rgba(240,165,0,0.10)",
  accentMedium: "rgba(240,165,0,0.18)",
  border: "#E8E4DD",
  error: "#EF4444",
  success: "#22C55E",
  inputBackground: "#F2F0EB",
  inputText: "#1A1A1A",
  placeholderText: "#9CA3AF",
  tabBar: "#FFFFFF",
  tabBarBorder: "#E8E4DD",
  headerBackground: "#FAF9F7",
  headerText: "#1A1A1A",
  cardBackground: "#F0A500",
  segmentedBackground: "#F2F0EB",
  statusBarStyle: "dark",
};

const darkColors: ThemeColors = {
  background: "#0A0A0A",
  surface: "#111111",
  surfaceAlt: "#181818",
  text: "#F2F2F2",
  textSecondary: "#C0C0C0",
  textMuted: "#848484",
  accent: "#0DD9C4",
  accentText: "#0A0A0A",
  accentSubtle: "rgba(13,217,196,0.10)",
  accentMedium: "rgba(13,217,196,0.18)",
  border: "#222222",
  error: "#F87171",
  success: "#34D399",
  inputBackground: "#111111",
  inputText: "#F2F2F2",
  placeholderText: "#686868",
  tabBar: "#0A0A0A",
  tabBarBorder: "#1E1E1E",
  headerBackground: "#0A0A0A",
  headerText: "#F0F0F0",
  cardBackground: "#111111",
  segmentedBackground: "#111111",
  statusBarStyle: "light",
};

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = "theme_mode";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const initialDark = systemScheme === "dark";
  const [isDark, setIsDark] = useState(initialDark);
  const [loaded, setLoaded] = useState(false);

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [overlayColor, setOverlayColor] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const saved = await storage.getItem(THEME_KEY);
      if (saved === "light" || saved === "dark") {
        setIsDark(saved === "dark");
      }
      setLoaded(true);
    })();
  }, []);

  const toggle = useCallback(async () => {
    const next = !isDark;
    const nextColors = next ? darkColors : lightColors;
    setOverlayColor(nextColors.background);
    overlayOpacity.setValue(0);

    Animated.timing(overlayOpacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setIsDark(next);
      storage.setItem(THEME_KEY, next ? "dark" : "light");

      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(() => {
        setOverlayColor(null);
      });
    });
  }, [isDark, overlayOpacity]);

  const colors = isDark ? darkColors : lightColors;

  if (!loaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ colors, isDark, toggle }}>
      {children}
      {overlayColor !== null && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: overlayColor, opacity: overlayOpacity, zIndex: 9999 },
          ]}
        />
      )}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
