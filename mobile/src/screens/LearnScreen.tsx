import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  ImageStyle,
  Animated,
  TextInput,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import {
  ALGO_TOPICS,
  COMPLEXITY_TOPICS,
  DATA_STRUCTURE_TOPICS,
  getAlgorithmTopic,
  getTopicImage,
  LearnTopic,
  LearnTrack,
} from "../data/learnTopics";
import { MainStackParamList } from "../navigation/MainTabs";

type Nav = NativeStackNavigationProp<MainStackParamList, "Learn">;

const ALL_TOPICS_FOR_SEARCH = [
  ...DATA_STRUCTURE_TOPICS,
  ...ALGO_TOPICS,
  ...COMPLEXITY_TOPICS,
];

// ─── Pulsing chevron for "Tap to open guide" ─────────────────────────────────
function PulsingArrow({ color }: { color: string }) {
  const pulseX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseX, {
          toValue: 4,
          duration: 550,
          useNativeDriver: true,
        }),
        Animated.timing(pulseX, {
          toValue: 0,
          duration: 550,
          useNativeDriver: true,
        }),
        Animated.delay(900),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateX: pulseX }] }}>
      <Ionicons name="chevron-forward-circle" size={20} color={color} />
    </Animated.View>
  );
}

// ─── Staggered entrance wrapper ───────────────────────────────────────────────
function AnimatedLearnCard({
  index,
  itemId,
  children,
}: {
  index: number;
  itemId: string;
  children: React.ReactNode;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(28)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(28);

    const anim = Animated.sequence([
      Animated.delay(index * 80),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 55,
          useNativeDriver: true,
        }),
      ]),
    ]);
    anim.start();
    return () => anim.stop();
  }, [itemId]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function LearnScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<Nav>();
  const [track, setTrack] = useState<LearnTrack>("data-structures");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [segmentWidth, setSegmentWidth] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Complexity=0, DataStructures=1, Algorithms=2
  const trackToSlot = (t: LearnTrack) =>
    t === "complexity" ? 0 : t === "data-structures" ? 1 : 2;

  const pillX = useRef(new Animated.Value(0)).current;

  // Snap pill to correct slot once we know the container width
  React.useEffect(() => {
    if (segmentWidth <= 0) return;
    const pillWidth = (segmentWidth - 8) / 3;
    pillX.setValue(trackToSlot(track) * pillWidth);
  }, [segmentWidth]);

  const handleTrackChange = useCallback(
    (newTrack: LearnTrack) => {
      if (newTrack === track) return;
      setTrack(newTrack);
      if (segmentWidth > 0) {
        const pillWidth = (segmentWidth - 8) / 3;
        const targetX =
          newTrack === "complexity"
            ? 0
            : newTrack === "data-structures"
            ? pillWidth
            : pillWidth * 2;
        Animated.spring(pillX, {
          toValue: targetX,
          friction: 7,
          tension: 120,
          useNativeDriver: true,
        }).start();
      }
    },
    [track, segmentWidth, pillX]
  );

  const trackTopics = useMemo<LearnTopic[]>(() => {
    const src =
      track === "data-structures"
        ? DATA_STRUCTURE_TOPICS
        : track === "algorithms"
        ? ALGO_TOPICS
        : COMPLEXITY_TOPICS;
    return [...src].sort((a, b) => a.level - b.level);
  }, [track]);

  const topics = useMemo<LearnTopic[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return trackTopics;
    return ALL_TOPICS_FOR_SEARCH.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q)
    ).sort((a, b) => a.level - b.level);
  }, [searchQuery, trackTopics]);

  const isSearching = searchQuery.trim().length > 0;

  const dsImageStyleById: Record<string, ImageStyle> = useMemo(
    () => ({
      "ds-stacks": styles.stackImageFit,
      "ds-trees": styles.treeImageFit,
      "ds-bsts": styles.bstImageFit,
    }),
    []
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="book-outline" size={22} color={colors.accent} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Learn DSA
        </Text>
        <View style={{ flex: 1 }} />
        <Pressable
          style={({ pressed }) => [
            styles.flashcardBtn,
            {
              backgroundColor: colors.accentSubtle,
              borderColor: colors.accent,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          onPress={() => navigation.navigate("Flashcard", { track })}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Ionicons name="layers-outline" size={15} color={colors.accent} />
          <Text style={[styles.flashcardBtnText, { color: colors.accent }]}>
            Cards
          </Text>
        </Pressable>
      </View>

      {/* Search bar */}
      <View
        style={[
          styles.searchWrap,
          {
            backgroundColor: colors.surface,
            borderColor: isSearching ? colors.accent : colors.border,
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={16}
          color={isSearching ? colors.accent : colors.textMuted}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search topics..."
          placeholderTextColor={colors.placeholderText}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {isSearching && (
          <Pressable
            onPress={() => setSearchQuery("")}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={17} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Segmented control — hidden while searching */}
      {isSearching && (
        <Text style={[styles.searchResultsLabel, { color: colors.textMuted }]}>
          {topics.length} result{topics.length !== 1 ? "s" : ""} across all tracks
        </Text>
      )}
      <View
        style={[
          styles.segment,
          { display: isSearching ? "none" : "flex" },
          {
            backgroundColor: colors.segmentedBackground,
            borderColor: colors.border,
          },
        ]}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          if (w !== segmentWidth) setSegmentWidth(w);
        }}
      >
        {segmentWidth > 0 && (
          <Animated.View
            style={[
              styles.segmentPill,
              {
                width: (segmentWidth - 8) / 3,
                backgroundColor: colors.surface,
                shadowColor: colors.accent,
                shadowOpacity: 0.15,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
                elevation: 3,
                transform: [{ translateX: pillX }],
              },
            ]}
            pointerEvents="none"
          />
        )}
        <Pressable
          style={styles.segmentItem}
          onPress={() => handleTrackChange("complexity")}
        >
          <Text
            style={[
              styles.segmentLabel,
              {
                color:
                  track === "complexity" ? colors.accent : colors.textSecondary,
                fontWeight: track === "complexity" ? "700" : "500",
              },
            ]}
          >
            Complexity
          </Text>
        </Pressable>
        <Pressable
          style={styles.segmentItem}
          onPress={() => handleTrackChange("data-structures")}
        >
          <Text
            style={[
              styles.segmentLabel,
              {
                color:
                  track === "data-structures"
                    ? colors.accent
                    : colors.textSecondary,
                fontWeight: track === "data-structures" ? "700" : "500",
              },
            ]}
          >
            Data Structures
          </Text>
        </Pressable>
        <Pressable
          style={styles.segmentItem}
          onPress={() => handleTrackChange("algorithms")}
        >
          <Text
            style={[
              styles.segmentLabel,
              {
                color:
                  track === "algorithms" ? colors.accent : colors.textSecondary,
                fontWeight: track === "algorithms" ? "700" : "500",
              },
            ]}
          >
            Algorithms
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={topics}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => {
          const cardImage = getTopicImage(item, isDark);
          return (
            <AnimatedLearnCard index={index} itemId={item.id}>
              <Pressable
                onPress={() =>
                  navigation.navigate("LearnDetail", {
                    id: item.id,
                    track: item.track,
                  })
                }
                onHoverIn={() => setHoveredId(item.id)}
                onHoverOut={() =>
                  setHoveredId((cur) => (cur === item.id ? null : cur))
                }
                style={({ pressed }) => {
                  const isHovered = hoveredId === item.id;
                  const cardBg = isDark ? "#141414" : "#FFFEFB";
                  return [
                    styles.card,
                    {
                      backgroundColor: cardBg,
                      borderColor: isHovered
                        ? colors.accent
                        : "rgba(13,217,196,0.18)",
                      transform: [{ scale: pressed ? 0.996 : 1 }],
                      zIndex: isHovered ? 10 : 1,
                      shadowColor: colors.accent,
                      shadowOpacity: isHovered ? 0.25 : 0.10,
                      shadowRadius: isHovered ? 20 : 16,
                      shadowOffset: { width: 0, height: isHovered ? 8 : 4 },
                      elevation: isHovered ? 10 : 4,
                    },
                  ];
                }}
              >
                {/* Top accent bar */}
                <View
                  style={[
                    styles.accentBar,
                    { backgroundColor: colors.accent },
                  ]}
                />

                {/* Glowing Step badge — top-right of card, above image */}
                <View
                  style={[
                    styles.stepBadge,
                    {
                      backgroundColor: colors.accentSubtle,
                      borderColor: colors.accent,
                      shadowColor: colors.accent,
                      shadowOpacity: 0.8,
                      shadowRadius: 12,
                      shadowOffset: { width: 0, height: 0 },
                      elevation: 6,
                    },
                  ]}
                >
                  <Text
                    style={[styles.stepBadgeText, { color: colors.accent }]}
                  >
                    Step {item.level}
                  </Text>
                </View>

                {cardImage ? (
                  <View
                    style={[
                      styles.imageWrap,
                      {
                        backgroundColor: "transparent",
                        borderColor: "transparent",
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.imageInner,
                        { backgroundColor: "transparent" },
                      ]}
                    >
                      <Image
                        source={cardImage}
                        style={[
                          styles.image,
                          item.track === "data-structures"
                            ? dsImageStyleById[item.id] ??
                              styles.dataStructureImage
                            : styles.algorithmImage,
                        ]}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                ) : null}

                {/* Card header: category label + DS/Algo badge */}
                <View style={styles.cardHeader}>
                  <Text style={[styles.step, { color: colors.accent }]}>
                    {item.track === "data-structures"
                      ? "Data Structure"
                      : item.track === "algorithms"
                      ? "Algorithm"
                      : "Complexity"}
                  </Text>
                  <Text
                    style={[
                      styles.badge,
                      {
                        color: colors.accentText,
                        backgroundColor: colors.accent,
                        borderColor: colors.accent,
                        shadowColor: colors.accent,
                        shadowOpacity: isDark ? 0.5 : 0.2,
                        shadowRadius: isDark ? 8 : 3,
                        shadowOffset: { width: 0, height: 0 },
                      },
                    ]}
                  >
                    {item.track === "data-structures"
                      ? "DS"
                      : item.track === "algorithms"
                      ? "Algo"
                      : "Big O"}
                  </Text>
                </View>

                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.cardSubtitle,
                    { color: colors.textSecondary },
                  ]}
                  numberOfLines={2}
                >
                  {item.subtitle}
                </Text>
                <Text
                  style={[styles.summaryText, { color: colors.textSecondary }]}
                  numberOfLines={2}
                >
                  {item.summary}
                </Text>

                {/* Pattern/related algorithm tags */}
                {item.track === "data-structures" &&
                item.relatedAlgorithmIds &&
                item.relatedAlgorithmIds.length > 0 ? (
                  <View style={styles.relatedPreviewWrap}>
                    {item.relatedAlgorithmIds.slice(0, 3).map((algoId) => {
                      const algo = getAlgorithmTopic(algoId);
                      if (!algo) return null;
                      return (
                        <Text
                          key={`${item.id}-${algoId}`}
                          style={[
                            styles.relatedPreviewChip,
                            {
                              color: colors.accent,
                              backgroundColor: colors.accentSubtle,
                              borderColor: colors.accent,
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {algo.title}
                        </Text>
                      );
                    })}
                  </View>
                ) : null}

                {/* Tap to open guide footer */}
                <View
                  style={[
                    styles.footerRow,
                    {
                      borderTopColor: isDark
                        ? "rgba(13,217,196,0.20)"
                        : "rgba(240,165,0,0.22)",
                    },
                  ]}
                >
                  <Text
                    style={[styles.footerText, { color: colors.accent }]}
                  >
                    Tap to open guide
                  </Text>
                  <PulsingArrow color={colors.accent} />
                </View>
              </Pressable>
            </AnimatedLearnCard>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  flashcardBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  flashcardBtnText: {
    fontSize: 12,
    fontWeight: "700",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    paddingVertical: 0,
  },
  searchResultsLabel: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 20,
    paddingBottom: 6,
    letterSpacing: 0.2,
  },
  segment: {
    flexDirection: "row",
    marginHorizontal: 20,
    borderRadius: 999,
    padding: 4,
    marginBottom: 8,
    borderWidth: 1,
    position: "relative",
  },
  segmentPill: {
    position: "absolute",
    top: 4,
    left: 4,
    bottom: 4,
    borderRadius: 999,
  },
  segmentItem: {
    flex: 1,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    zIndex: 1,
  },
  segmentLabel: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    paddingTop: 18,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  // Glowing Step badge — sits in top-right of card
  stepBadge: {
    position: "absolute",
    top: 10,
    right: 12,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    zIndex: 10,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  imageWrap: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    marginBottom: 14,
    height: 186,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: 4,
  },
  imageInner: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  dataStructureImage: {
    transform: [{ scale: 1 }, { scaleX: 1.06 }],
  } as ImageStyle,
  stackImageFit: {
    transform: [{ scale: 0.9 }, { scaleX: 1.04 }],
  } as ImageStyle,
  treeImageFit: {
    transform: [{ scale: 0.9 }, { scaleX: 1.04 }],
  } as ImageStyle,
  bstImageFit: {
    transform: [{ scale: 0.9 }, { scaleX: 1.04 }],
  } as ImageStyle,
  algorithmImage: {
    transform: [{ scale: 1 }, { scaleX: 1.06 }],
  } as ImageStyle,
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    alignItems: "center",
  },
  step: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2,
    opacity: 0.85,
  },
  badge: {
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 22,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 22,
    fontWeight: "400",
  },
  relatedPreviewWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  relatedPreviewChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: "600",
    overflow: "hidden",
    maxWidth: 240,
  },
  footerRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
