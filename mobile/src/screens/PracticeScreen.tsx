import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function PracticeScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Ionicons name="code-slash-outline" size={64} color={colors.textMuted} />
      <Text style={[styles.title, { color: colors.text }]}>Practice DSA</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Timed practice sessions and mock interviews are coming soon.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
});
