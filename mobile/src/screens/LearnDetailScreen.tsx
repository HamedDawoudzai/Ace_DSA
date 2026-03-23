import React from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MainStackParamList } from "../navigation/MainTabs";
import { getLearnTopic, LearnTrack } from "../data/learnTopics";
import { useTheme } from "../context/ThemeContext";

type LearnDetailRoute = RouteProp<MainStackParamList, "LearnDetail">;

export default function LearnDetailScreen() {
  const route = useRoute<LearnDetailRoute>();
  const { id, track } = route.params;
  const { colors } = useTheme();
  const navigation = useNavigation();

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
      <View style={[styles.topBar, { borderColor: colors.border }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={colors.textSecondary}
          />
          <Text style={[styles.backText, { color: colors.textSecondary }]}>
            Back
          </Text>
        </Pressable>
      </View>

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

      {topic.image ? (
        <View
          style={[
            styles.imageWrap,
            {
              borderColor: colors.border,
              backgroundColor: colors.surfaceAlt,
            },
          ]}
        >
          <View style={styles.imageInner}>
            <Image
              source={topic.image}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </View>
      ) : null}

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
  topBar: {
    borderBottomWidth: 1,
    paddingBottom: 12,
    marginBottom: 14,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backText: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
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
    marginBottom: 14,
  },
  imageWrap: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 18,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  imageInner: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  image: {
    width: "100%",
    height: "100%",
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

