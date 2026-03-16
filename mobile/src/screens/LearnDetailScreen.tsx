import React from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { MainStackParamList } from "../navigation/MainTabs";
import { getLearnTopic, LearnTrack } from "../data/learnTopics";
import { useTheme } from "../context/ThemeContext";

type LearnDetailRoute = RouteProp<MainStackParamList, "LearnDetail">;

export default function LearnDetailScreen() {
  const route = useRoute<LearnDetailRoute>();
  const { id, track } = route.params;
  const { colors } = useTheme();

  const topic = getLearnTopic(track as LearnTrack, id);

  if (!topic) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Topic not found</Text>
      </View>
    );
  }

  const trackLabel =
    topic.track === "data-structures" ? "Data Structures" : "Algorithms";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View
        style={[
          styles.trackPill,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.trackText, { color: colors.textMuted }]}>
          {trackLabel}
        </Text>
        <Text style={[styles.levelText, { color: colors.accent }]}>
          Step {topic.level}
        </Text>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{topic.title}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {topic.subtitle}
      </Text>

      {/* Placeholder for future diagram / image */}
      <View
        style={[
          styles.diagramPlaceholder,
          { borderColor: colors.border, backgroundColor: colors.surfaceAlt },
        ]}
      >
        <Text style={[styles.diagramText, { color: colors.textMuted }]}>
          Diagram coming soon
        </Text>
      </View>

      <Text style={[styles.summary, { color: colors.text }]}>{topic.summary}</Text>
      <Text style={[styles.details, { color: colors.textSecondary }]}>
        {topic.details}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  trackPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 14,
    gap: 8,
  },
  trackText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  levelText: {
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 18,
  },
  diagramPlaceholder: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    minHeight: 120,
  },
  diagramText: {
    fontSize: 12,
  },
  summary: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
  },
  details: {
    fontSize: 14,
    lineHeight: 22,
  },
});

