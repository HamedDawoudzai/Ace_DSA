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
  getTopicImage,
  LearnTrack,
  DATA_STRUCTURE_TOPICS,
  ALGO_TOPICS,
} from "../data/learnTopics";
import { useTheme } from "../context/ThemeContext";
import LearnCodeBlock from "../components/LearnCodeBlock";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { markVisited } from "../services/learnProgress";

type LearnDetailRoute = RouteProp<MainStackParamList, "LearnDetail">;
type DetailNavigation = NativeStackNavigationProp<
  MainStackParamList,
  "LearnDetail"
>;

export default function LearnDetailScreen() {
  const route = useRoute<LearnDetailRoute>();
  const { id, track } = route.params;
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<DetailNavigation>();

  const topic = getLearnTopic(track as LearnTrack, id);

  const topicImageRaw = topic ? getTopicImage(topic, isDark) : undefined;

  const [imageAspectRatio, setImageAspectRatio] = React.useState(1.5);
  React.useEffect(() => {
    setImageAspectRatio(1.5);
  }, [topicImageRaw]);

  // Track visited progress
  const allTopics = React.useMemo(
    () =>
      (track === "data-structures" ? DATA_STRUCTURE_TOPICS : ALGO_TOPICS)
        .slice()
        .sort((a, b) => a.level - b.level),
    [track]
  );
  const [visitedIds, setVisitedIds] = React.useState<Set<string>>(new Set());
  React.useEffect(() => {
    if (!topic) return;
    markVisited(topic.id).then(setVisitedIds);
  }, [topic?.id]);

  const handleImageLoad = React.useCallback((e: any) => {
    const src = e?.nativeEvent?.source;
    const tgt = e?.nativeEvent?.target;
    const w: number = (src?.width > 0 ? src.width : tgt?.naturalWidth) ?? 0;
    const h: number =
      (src?.height > 0 ? src.height : tgt?.naturalHeight) ?? 0;
    if (w > 0 && h > 0) setImageAspectRatio(w / h);
  }, []);

  if (!topic) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Topic not found
        </Text>
      </View>
    );
  }

  const trackLabel =
    topic.track === "data-structures" ? "Data Structures" : "Algorithms";
  const topicImage = topicImageRaw;

  const renderParagraphs = (text: string) => {
    const parts = text.split(/\n\s*\n/).map((p) => p.trim());
    return parts
      .filter(Boolean)
      .map((p, idx) => (
        <Text
          key={`${topic.id}-para-${idx}`}
          style={[styles.sectionParagraph, { color: colors.textSecondary }]}
        >
          {p}
        </Text>
      ));
  };

  // Enhanced section header with icon glow pill
  const SectionHeader = ({
    icon,
    title,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
  }) => (
    <View style={styles.sectionHeader}>
      <View
        style={[
          styles.sectionIconWrap,
          {
            backgroundColor: colors.accentSubtle,
            shadowColor: colors.accent,
            shadowOpacity: isDark ? 0.45 : 0.12,
            shadowRadius: isDark ? 8 : 3,
            shadowOffset: { width: 0, height: 0 },
          },
        ]}
      >
        <Ionicons name={icon} size={15} color={colors.accent} />
      </View>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
    </View>
  );

  // Shared section card style
  const sectionCardStyle = [
    styles.sectionCard,
    {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      shadowColor: isDark ? colors.accent : "#000",
      shadowOpacity: isDark ? 0.08 : 0.05,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
  ] as const;

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

      {/* Progression bar */}
      <View style={styles.progressionWrap}>
        <Text style={[styles.progressionLabel, { color: colors.textMuted }]}>
          {track === "data-structures" ? "Data Structures" : "Algorithms"} Progress
          {"  "}
          <Text style={{ color: colors.accent, fontWeight: "800" }}>
            {visitedIds.size}/{allTopics.length}
          </Text>
        </Text>
        <View style={styles.progressionDotRow}>
          {allTopics.map((t, i) => {
            const isVisited = visitedIds.has(t.id);
            const isCurrent = t.id === id;
            return (
              <React.Fragment key={t.id}>
                {i > 0 && (
                  <View
                    style={[
                      styles.progressionLine,
                      {
                        backgroundColor: isVisited || visitedIds.has(allTopics[i - 1].id)
                          ? colors.accent
                          : colors.border,
                        opacity: isVisited ? 0.6 : 0.3,
                      },
                    ]}
                  />
                )}
                <View
                  style={[
                    styles.progressionDot,
                    {
                      backgroundColor: isVisited ? colors.accent : "transparent",
                      borderColor: isCurrent ? colors.accent : isVisited ? colors.accent : colors.border,
                      borderWidth: isCurrent ? 2.5 : 1.5,
                      shadowColor: colors.accent,
                      shadowOpacity: isCurrent ? 0.8 : isVisited ? 0.4 : 0,
                      shadowRadius: isCurrent ? 6 : 3,
                      shadowOffset: { width: 0, height: 0 },
                    },
                  ]}
                >
                  {isCurrent && (
                    <View
                      style={[
                        styles.progressionDotInner,
                        { backgroundColor: colors.accent },
                      ]}
                    />
                  )}
                </View>
              </React.Fragment>
            );
          })}
        </View>
        <View style={styles.progressionBarTrack}>
          <View
            style={[
              styles.progressionBarFill,
              {
                backgroundColor: colors.accent,
                width: `${Math.round((visitedIds.size / allTopics.length) * 100)}%`,
                shadowColor: colors.accent,
                shadowOpacity: 0.5,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 0 },
              },
            ]}
          />
        </View>
      </View>

      {/* Track + Step pill with accent glow */}
      <View
        style={[
          styles.trackPill,
          {
            backgroundColor: colors.accentSubtle,
            borderColor: colors.accent,
            shadowColor: colors.accent,
            shadowOpacity: isDark ? 0.35 : 0.15,
            shadowRadius: isDark ? 10 : 4,
            shadowOffset: { width: 0, height: 0 },
          },
        ]}
      >
        <Text style={[styles.trackText, { color: colors.textMuted }]}>
          {trackLabel}
        </Text>
        <Text
          style={[
            styles.levelText,
            { color: colors.accent, fontWeight: "800" },
          ]}
        >
          Step {topic.level}
        </Text>
      </View>

      <Text
        style={[
          styles.title,
          { color: colors.text },
          isDark && {
            textShadowColor: "rgba(13,217,196,0.2)",
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 8,
          },
        ]}
      >
        {topic.title}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {topic.subtitle}
      </Text>
      {topic.lastUpdated ? (
        <Text style={[styles.lastUpdated, { color: colors.textMuted }]}>
          Last updated {topic.lastUpdated}
        </Text>
      ) : null}

      {topicImage ? (
        <View style={[styles.imageWrap, { aspectRatio: imageAspectRatio }]}>
          <Image
            source={topicImage}
            style={styles.image}
            resizeMode="contain"
            onLoad={handleImageLoad}
          />
        </View>
      ) : null}

      {/* What It Does */}
      <View style={sectionCardStyle}>
        {/* Left accent strip */}
        <View
          style={[styles.cardAccentStrip, { backgroundColor: colors.accent }]}
        />
        <SectionHeader
          icon="information-circle-outline"
          title="What It Does"
        />
        <Text style={[styles.sectionLead, { color: colors.textSecondary }]}>
          {topic.summary}
        </Text>
      </View>

      {/* How It Is Used */}
      <View style={sectionCardStyle}>
        <View
          style={[styles.cardAccentStrip, { backgroundColor: colors.accent }]}
        />
        <SectionHeader
          icon="sparkles-outline"
          title="How It Is Used + Why It Helps"
        />
        <View>{renderParagraphs(topic.details)}</View>
      </View>

      {topic.detailSections && topic.detailSections.length > 0
        ? topic.detailSections.map((section, sIdx) => (
            <View
              key={`${topic.id}-detail-section-${sIdx}`}
              style={sectionCardStyle}
            >
              <View
                style={[
                  styles.cardAccentStrip,
                  { backgroundColor: colors.accent },
                ]}
              />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {section.title}
              </Text>
              <View>{renderParagraphs(section.body)}</View>
              {section.code ? (
                <LearnCodeBlock
                  code={section.code}
                  language={section.codeLanguage ?? "python"}
                />
              ) : null}
            </View>
          ))
        : null}

      {topic.track === "data-structures" && topic.generalUnderstanding ? (
        <View style={sectionCardStyle}>
          <View
            style={[styles.cardAccentStrip, { backgroundColor: colors.accent }]}
          />
          <SectionHeader icon="school-outline" title="General Understanding" />
          <View>{renderParagraphs(topic.generalUnderstanding)}</View>
        </View>
      ) : null}

      {topic.track === "data-structures" &&
      topic.teachingNotes &&
      topic.teachingNotes.length > 0 ? (
        <View style={sectionCardStyle}>
          <View
            style={[styles.cardAccentStrip, { backgroundColor: colors.accent }]}
          />
          <SectionHeader
            icon="bulb-outline"
            title="Teaching Notes (Interview Lens)"
          />
          {topic.teachingNotes.map((note, idx) => (
            <View
              key={`${topic.id}-teaching-note-${idx}`}
              style={styles.bulletRow}
            >
              <Text style={[styles.bulletDot, { color: colors.accent }]}>
                •
              </Text>
              <Text
                style={[styles.bulletText, { color: colors.textSecondary }]}
              >
                {note}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {topic.track === "data-structures" &&
      topic.leetcodeTactics &&
      topic.leetcodeTactics.length > 0 ? (
        <View style={sectionCardStyle}>
          <View
            style={[styles.cardAccentStrip, { backgroundColor: colors.accent }]}
          />
          <SectionHeader icon="rocket-outline" title="LeetCode Tactics" />
          {topic.leetcodeTactics.map((tactic, idx) => (
            <View key={`${topic.id}-tactic-${idx}`} style={styles.bulletRow}>
              <Text style={[styles.bulletDot, { color: colors.accent }]}>
                •
              </Text>
              <Text
                style={[styles.bulletText, { color: colors.textSecondary }]}
              >
                {tactic}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {topic.track === "data-structures" &&
      topic.relatedAlgorithmIds &&
      topic.relatedAlgorithmIds.length > 0 ? (
        <View style={sectionCardStyle}>
          <View
            style={[styles.cardAccentStrip, { backgroundColor: colors.accent }]}
          />
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
                    style={[
                      styles.algorithmChipText,
                      { color: colors.accent },
                    ]}
                    numberOfLines={1}
                  >
                    {algoTopic.title}
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={12}
                    color={colors.accent}
                  />
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
    paddingBottom: 48,
  },
  topBar: {
    borderBottomWidth: 1,
    paddingBottom: 12,
    marginBottom: 16,
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
  progressionWrap: {
    marginBottom: 18,
    paddingHorizontal: 2,
  },
  progressionLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  progressionDotRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    flexWrap: "nowrap",
  },
  progressionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  progressionDotInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  progressionLine: {
    flex: 1,
    height: 2,
    borderRadius: 1,
    minWidth: 2,
  },
  progressionBarTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(128,128,128,0.15)",
    overflow: "hidden",
  },
  progressionBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  trackPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 16,
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
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 5,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 6,
  },
  lastUpdated: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 16,
  },
  imageWrap: {
    width: "100%",
    marginBottom: 20,
    overflow: "hidden" as const,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  sectionCard: {
    marginTop: 14,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    paddingLeft: 20,
    overflow: "hidden",
  },
  cardAccentStrip: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  sectionIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    flex: 1,
  },
  sectionLead: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "700",
  },
  sectionParagraph: {
    fontSize: 14,
    lineHeight: 22,
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
