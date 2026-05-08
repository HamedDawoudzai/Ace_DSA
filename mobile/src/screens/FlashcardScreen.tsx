import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { MainStackParamList } from "../navigation/MainTabs";
import {
  DATA_STRUCTURE_TOPICS,
  ALGO_TOPICS,
  COMPLEXITY_TOPICS,
  LearnTopic,
  getTopicImage,
} from "../data/learnTopics";
export default function FlashcardScreen() {
  const route = useRoute<RouteProp<MainStackParamList, "Flashcard">>();
  const navigation = useNavigation<any>();
  const { track } = route.params;
  const { colors, isDark } = useTheme();

  const topics: LearnTopic[] = (
    track === "data-structures"
      ? DATA_STRUCTURE_TOPICS
      : track === "algorithms"
      ? ALGO_TOPICS
      : COMPLEXITY_TOPICS
  )
    .slice()
    .sort((a, b) => a.level - b.level);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Scale-based flip: 1→0 (disappear) swap content, 0→1 (reappear)
  const scaleX = useRef(new Animated.Value(1)).current;
  // Entrance slide-up per card
  const entranceY = useRef(new Animated.Value(20)).current;
  const entranceOpacity = useRef(new Animated.Value(0)).current;

  const topic = topics[currentIndex];
  const topicImage = getTopicImage(topic, isDark);

  const trackLabel =
    track === "data-structures"
      ? "Data Structures"
      : track === "algorithms"
      ? "Algorithms"
      : "Complexity";

  // Always start on the question (front) side when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setIsFlipped(false);
    }, [])
  );

  // Run entrance animation whenever currentIndex changes
  useEffect(() => {
    entranceY.setValue(20);
    entranceOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(entranceY, {
        toValue: 0,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(entranceOpacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex]);

  const doFlip = useCallback(() => {
    Animated.timing(scaleX, {
      toValue: 0,
      duration: 130,
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped((f) => !f);
      Animated.timing(scaleX, {
        toValue: 1,
        duration: 130,
        useNativeDriver: true,
      }).start();
    });
  }, [scaleX]);

  const goTo = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= topics.length) return;
      Animated.timing(scaleX, {
        toValue: 0,
        duration: 110,
        useNativeDriver: true,
      }).start(() => {
        setIsFlipped(false);
        setCurrentIndex(idx);
        Animated.timing(scaleX, {
          toValue: 1,
          duration: 130,
          useNativeDriver: true,
        }).start();
      });
    },
    [scaleX, topics.length]
  );

  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= topics.length - 1;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
          <Text style={[styles.backText, { color: colors.textSecondary }]}>
            Back
          </Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {trackLabel}
          </Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>
            Flashcards
          </Text>
        </View>
        <View style={{ width: 42 }} />
      </View>

      {/* ── Progress bar ── */}
      <View style={styles.progressRow}>
        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.accent,
                width: `${((currentIndex + 1) / topics.length) * 100}%`,
                shadowColor: colors.accent,
                shadowOpacity: 0.4,
                shadowRadius: 3,
                shadowOffset: { width: 0, height: 0 },
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.textMuted }]}>
          {currentIndex + 1}/{topics.length}
        </Text>
      </View>

      {/* ── Topic image ── */}
      {topicImage && (
        <View style={styles.topicImageWrap}>
          <Image
            source={topicImage}
            style={styles.topicImage}
            resizeMode="contain"
          />
        </View>
      )}

      {/* ── Card ── */}
      <View style={styles.cardArea}>
        <Animated.View
          style={{
            opacity: entranceOpacity,
            transform: [{ translateY: entranceY }, { scaleX }],
          }}
        >
          <Pressable
            onPress={doFlip}
            style={[
              styles.card,
              {
                backgroundColor: isFlipped
                  ? isDark
                    ? "rgba(13,217,196,0.07)"
                    : "rgba(240,165,0,0.07)"
                  : colors.surface,
                borderColor: colors.accent,
                shadowColor: colors.accent,
                shadowOpacity: isDark ? 0.22 : 0.13,
                shadowRadius: 18,
                shadowOffset: { width: 0, height: 5 },
                elevation: 8,
              },
            ]}
          >
            {/* Top accent strip */}
            <View
              style={[styles.cardAccentStrip, { backgroundColor: colors.accent }]}
            />

            {!isFlipped ? (
              /* ── Front ── */
              <View style={styles.face}>
                <View
                  style={[
                    styles.stepPill,
                    {
                      backgroundColor: colors.accentSubtle,
                      borderColor: colors.accent,
                    },
                  ]}
                >
                  <Text style={[styles.stepPillText, { color: colors.accent }]}>
                    Step {topic.level}
                  </Text>
                </View>
                <View style={styles.frontBody}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    {topic.title}
                  </Text>
                  <Text
                    style={[
                      styles.cardSubtitle,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {topic.subtitle}
                  </Text>
                </View>
                <View style={styles.hint}>
                  <Ionicons
                    name="sync-outline"
                    size={14}
                    color={colors.textMuted}
                  />
                  <Text style={[styles.hintText, { color: colors.textMuted }]}>
                    Tap to reveal answer
                  </Text>
                </View>
              </View>
            ) : (
              /* ── Back ── */
              <View style={styles.face}>
                <Text
                  style={[styles.backSectionLabel, { color: colors.textMuted }]}
                >
                  Summary
                </Text>
                <ScrollView
                  style={styles.backScroll}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={[styles.backSummary, { color: colors.text }]}>
                    {topic.summary}
                  </Text>
                  {topic.details ? (
                    <>
                      <Text
                        style={[
                          styles.backSectionLabel,
                          { color: colors.textMuted, marginTop: 18 },
                        ]}
                      >
                        Key Points
                      </Text>
                      <Text
                        style={[
                          styles.backDetails,
                          { color: colors.textSecondary },
                        ]}
                        numberOfLines={6}
                      >
                        {topic.details.split("\n\n")[0]}
                      </Text>
                    </>
                  ) : null}
                </ScrollView>
                <View style={styles.hint}>
                  <Ionicons
                    name="sync-outline"
                    size={14}
                    color={colors.textMuted}
                  />
                  <Text style={[styles.hintText, { color: colors.textMuted }]}>
                    Tap to see question
                  </Text>
                </View>
              </View>
            )}
          </Pressable>
        </Animated.View>
      </View>

      {/* ── Nav buttons ── */}
      <View style={styles.navRow}>
        <Pressable
          style={({ pressed }) => [
            styles.navBtn,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: isFirst ? 0.28 : pressed ? 0.7 : 1,
            },
          ]}
          onPress={() => goTo(currentIndex - 1)}
          disabled={isFirst}
        >
          <Ionicons name="arrow-back" size={22} color={colors.accent} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.flipBtn,
            { backgroundColor: colors.accent, opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={doFlip}
        >
          <Ionicons name="sync-outline" size={18} color={colors.accentText} />
          <Text style={[styles.flipBtnText, { color: colors.accentText }]}>
            {isFlipped ? "Front" : "Flip"}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.navBtn,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: isLast ? 0.28 : pressed ? 0.7 : 1,
            },
          ]}
          onPress={() => goTo(currentIndex + 1)}
          disabled={isLast}
        >
          <Ionicons name="arrow-forward" size={22} color={colors.accent} />
        </Pressable>
      </View>

      {/* ── Dot indicators ── */}
      <View style={styles.dotRow}>
        {topics.map((_, i) => (
          <Pressable key={i} onPress={() => goTo(i)} hitSlop={8}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === currentIndex ? colors.accent : colors.border,
                  width: i === currentIndex ? 20 : 7,
                },
              ]}
            />
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 6,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: 64,
  },
  backText: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { fontSize: 16, fontWeight: "800" },
  headerSub: { fontSize: 11, fontWeight: "500", marginTop: 1 },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 14,
  },
  progressTrack: { flex: 1, height: 4, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2 },
  progressText: {
    fontSize: 12,
    fontWeight: "700",
    minWidth: 34,
    textAlign: "right",
  },

  topicImageWrap: {
    height: 160,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  topicImage: {
    width: "100%",
    height: "100%",
  },

  cardArea: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  card: {
    width: "100%",
    minHeight: 310,
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 24,
    paddingTop: 18,
    overflow: "hidden",
  },
  cardAccentStrip: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  face: { flex: 1, minHeight: 260 },
  stepPill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 18,
  },
  stepPillText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.3 },
  frontBody: { flex: 1, justifyContent: "center", paddingBottom: 8 },
  cardTitle: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 12,
    lineHeight: 36,
  },
  cardSubtitle: { fontSize: 15, lineHeight: 23, fontWeight: "500" },
  hint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    justifyContent: "center",
    paddingTop: 14,
  },
  hintText: { fontSize: 12, fontWeight: "600" },

  backSectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  backScroll: { flex: 1 },
  backSummary: {
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 26,
    marginBottom: 4,
  },
  backDetails: { fontSize: 14, lineHeight: 22 },

  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
  },
  navBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  flipBtn: {
    flex: 1,
    maxWidth: 160,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
  },
  flipBtnText: { fontSize: 16, fontWeight: "700" },

  dotRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    paddingBottom: 16,
  },
  dot: { height: 6, borderRadius: 3 },
});
