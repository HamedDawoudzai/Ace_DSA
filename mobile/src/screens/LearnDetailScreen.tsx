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
import {
  getAlgorithmTopic,
  getLearnTopic,
  LearnTrack,
} from "../data/learnTopics";
import { useTheme } from "../context/ThemeContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type LearnDetailRoute = RouteProp<MainStackParamList, "LearnDetail">;
type DetailNavigation = NativeStackNavigationProp<MainStackParamList, "LearnDetail">;

export default function LearnDetailScreen() {
  const route = useRoute<LearnDetailRoute>();
  const { id, track } = route.params;
  const { colors } = useTheme();
  const navigation = useNavigation<DetailNavigation>();

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
          <View style={[styles.imageCaption, { backgroundColor: colors.surface }]}>
            <Text style={[styles.imageCaptionText, { color: colors.textMuted }]}>
              Visual reference
            </Text>
          </View>
        </View>
      ) : null}

      <View
        style={[
          styles.sectionCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>What It Does</Text>
        <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>
          {topic.summary}
        </Text>
      </View>

      <View
        style={[
          styles.sectionCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          How It Is Used + Why It Helps
        </Text>
        <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>
          {topic.details}
        </Text>
      </View>

      {topic.track === "data-structures" && topic.generalUnderstanding ? (
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            General Understanding
          </Text>
          <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>
            {topic.generalUnderstanding}
          </Text>
        </View>
      ) : null}

      {topic.track === "data-structures" &&
      topic.leetcodeTactics &&
      topic.leetcodeTactics.length > 0 ? (
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            LeetCode Tactics
          </Text>
          {topic.leetcodeTactics.map((tactic, idx) => (
            <View key={`${topic.id}-tactic-${idx}`} style={styles.bulletRow}>
              <Text style={[styles.bulletDot, { color: colors.accent }]}>•</Text>
              <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
                {tactic}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {topic.track === "data-structures" &&
      topic.relatedAlgorithmIds &&
      topic.relatedAlgorithmIds.length > 0 ? (
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Algorithms With This Data Structure
          </Text>
          <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
            Tap an algorithm to open its dedicated guide.
          </Text>
          <View style={styles.algorithmWrap}>
            {topic.relatedAlgorithmIds.map((algoId) => {
              const algoTopic = getAlgorithmTopic(algoId);
              if (!algoTopic) return null;
              return (
                <Pressable
                  key={`${topic.id}-${algoId}`}
                  onPress={() =>
                    navigation.navigate("LearnDetail", {
                      id: algoTopic.id,
                      track: "algorithms",
                    })
                  }
                  style={[
                    styles.algorithmChip,
                    {
                      backgroundColor: colors.surfaceAlt,
                      borderColor: colors.accent,
                    },
                  ]}
                >
                  <Text
                    style={[styles.algorithmChipText, { color: colors.accent }]}
                    numberOfLines={1}
                  >
                    {algoTopic.title}
                  </Text>
                  <Ionicons name="arrow-forward" size={12} color={colors.accent} />
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}
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
    minHeight: 260,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    position: "relative",
  },
  imageInner: {
    width: "100%",
    aspectRatio: 1.8,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageCaption: {
    position: "absolute",
    right: 10,
    top: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  imageCaptionText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  sectionCard: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 22,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 6,
  },
  bulletDot: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: "800",
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
  },
  sectionHint: {
    fontSize: 12,
    marginBottom: 10,
  },
  algorithmWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  algorithmChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    maxWidth: "100%",
  },
  algorithmChipText: {
    fontSize: 12,
    fontWeight: "700",
  },
});

