import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isDark ? colors.surface : colors.cardBackground,
          borderColor: isDark
            ? "rgba(45, 212, 191, 0.15)"
            : "transparent",
          borderWidth: isDark ? 1 : 0,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: isDark
              ? "rgba(45, 212, 191, 0.12)"
              : "rgba(0, 0, 0, 0.08)",
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={26}
          color={isDark ? colors.accent : "#000"}
        />
      </View>
      <View style={styles.textContainer}>
        <Text
          style={[styles.title, { color: isDark ? colors.text : "#000" }]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: isDark ? colors.textSecondary : "rgba(0,0,0,0.55)" },
          ]}
        >
          {subtitle}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={isDark ? colors.textMuted : "rgba(0,0,0,0.3)"}
      />
    </TouchableOpacity>
  );
}

export default memo(HomeCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 13,
    marginTop: 3,
    lineHeight: 18,
  },
});
