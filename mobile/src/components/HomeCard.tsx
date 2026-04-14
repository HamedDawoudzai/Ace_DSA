import React, { memo, useRef } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

interface Props {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

function HomeCard({ title, subtitle, icon, onPress }: Props) {
  const { colors, isDark } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const arrowTranslate = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      friction: 8,
      tension: 120,
      useNativeDriver: true,
    }).start();
    Animated.spring(arrowTranslate, {
      toValue: 5,
      friction: 6,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
    Animated.spring(arrowTranslate, {
      toValue: 0,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  // Subtle inner border: bright in dark mode, dark in light mode
  const innerBorderColor = isDark
    ? "rgba(255,255,255,0.06)"
    : "rgba(0,0,0,0.04)";

  // Shadow tinted with accent in dark mode for the glow effect
  const shadowColor = isDark ? colors.accent : "#000";
  const shadowOpacity = isDark ? 0.18 : 0.08;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor,
            shadowOpacity,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 6 },
            elevation: 6,
          },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Left accent border strip */}
        <View style={[styles.accentBar, { backgroundColor: colors.accent }]} />

        {/* Subtle inner border overlay */}
        <View
          style={[styles.innerBorder, { borderColor: innerBorderColor }]}
          pointerEvents="none"
        />

        <View
          style={[styles.iconCircle, { backgroundColor: colors.accentSubtle }]}
        >
          <Ionicons name={icon} size={24} color={colors.accent} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        </View>
        <Animated.View
          style={[
            styles.arrowCircle,
            { backgroundColor: colors.accentSubtle },
            { transform: [{ translateX: arrowTranslate }] },
          ]}
        >
          <Ionicons name="arrow-forward" size={15} color={colors.accent} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export default memo(HomeCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    gap: 14,
    overflow: "hidden",
  },
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  innerBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    borderWidth: 1,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 3,
    letterSpacing: -0.1,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  arrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
});
