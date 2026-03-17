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
  background: "#E1DAC9",
  surface: "#fff",
  surfaceAlt: "#D5CDB8",
  text: "#222",
  textSecondary: "#555",
  textMuted: "#888",
  accent: "#F5C842",
  accentText: "#000",
  border: "#eee",
  error: "#F44336",
  success: "#4CAF50",
  inputBackground: "#fff",
  inputText: "#000",
  placeholderText: "#999",
  tabBar: "#fff",
  tabBarBorder: "#eee",
  headerBackground: "#E1DAC9",
  headerText: "#333",
  cardBackground: "#F5C842",
  segmentedBackground: "#D5CDB8",
  statusBarStyle: "dark",
};

const darkColors: ThemeColors = {
  background: "#0B1121",
  surface: "#151B2E",
  surfaceAlt: "#1C2440",
  text: "#E2E8F0",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  accent: "#2DD4BF",
  accentText: "#0B1121",
  border: "#1E293B",
  error: "#EF4444",
  success: "#22C55E",
  inputBackground: "#151B2E",
  inputText: "#E2E8F0",
  placeholderText: "#64748B",
  tabBar: "#0B1121",
  tabBarBorder: "#1E293B",
  headerBackground: "#0B1121",
  headerText: "#E2E8F0",
  cardBackground: "#151B2E",
  segmentedBackground: "#1C2440",
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
