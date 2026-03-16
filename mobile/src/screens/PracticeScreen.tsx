import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PracticeScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="code-slash-outline" size={64} color="#ccc" />
      <Text style={styles.title}>Practice DSA</Text>
      <Text style={styles.subtitle}>
        Timed practice sessions and mock interviews are coming soon.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E1DAC9",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 15,
    color: "#777",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
});
