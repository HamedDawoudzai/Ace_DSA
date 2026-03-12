import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  ImageStyle,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import {
  ALGO_TOPICS,
  DATA_STRUCTURE_TOPICS,
  getAlgorithmTopic,
  getTopicImage,
  LearnTopic,
  LearnTrack,
} from "../data/learnTopics";
import { MainStackParamList } from "../navigation/MainTabs";

type Nav = NativeStackNavigationProp<MainStackParamList, "Learn">;

export default function LearnScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<Nav>();
  const [track, setTrack] = useState<LearnTrack>("data-structures");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const topics = useMemo<LearnTopic[]>(() => {
    const src =
      track === "data-structures" ? DATA_STRUCTURE_TOPICS : ALGO_TOPICS;
    return [...src].sort((a, b) => a.level - b.level);
  }, [track]);
  const imageBackdrop = isDark ? "#060B16" : "#F7F2E8";
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
      <View style={styles.header}>
        <Ionicons name="book-outline" size={24} color={colors.accent} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Learn Data Structures & Algorithms
        </Text>
      </View>

      <View
        style={[
          styles.segment,
          {
            backgroundColor: colors.segmentedBackground || colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Pressable
          style={[
            styles.segmentItem,
            track === "data-structures" && {
              backgroundColor: colors.surface,
            },
          ]}
          onPress={() => setTrack("data-structures")}
        >
          <Text
            style={[
              styles.segmentLabel,
              {
                color:
                  track === "data-structures"
                    ? colors.text
                    : colors.textSecondary,
              },
            ]}
          >
            Data Structures
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.segmentItem,
            track === "algorithms" && {
              backgroundColor: colors.surface,
            },
          ]}
          onPress={() => setTrack("algorithms")}
        >
          <Text
            style={[
              styles.segmentLabel,
              {
                color:
                  track === "algorithms" ? colors.text : colors.textSecondary,
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
        renderItem={({ item }) => {
          const cardImage = getTopicImage(item, isDark);
          return (
          <Pressable
            onPress={() =>
              navigation.navigate("LearnDetail", {
                id: item.id,
                track: item.track,
              })
            }
            onHoverIn={() => setHoveredId(item.id)}
            onHoverOut={() => setHoveredId((cur) => (cur === item.id ? null : cur))}
            style={({ pressed }) => {
              const isHovered = hoveredId === item.id;
              return [
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: isHovered ? colors.accent : colors.border,
                  // Avoid scaling on hover (can cause overlapping on web).
                  transform: [{ scale: pressed ? 0.996 : 1 }],
                  zIndex: isHovered ? 10 : 1,
                },
                isHovered && {
                  shadowColor: colors.accent,
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.18,
                  shadowRadius: 18,
                  elevation: 10,
                },
              ];
            }}
          >
            <View
              style={[
                styles.accentBar,
                {
                  backgroundColor:
                    item.track === "data-structures"
                      ? colors.accent
                      : colors.textSecondary,
                },
              ]}
            />
            {cardImage ? (
              <View
                style={[
                  styles.imageWrap,
                  {
                    backgroundColor: imageBackdrop,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={[styles.imageInner, { backgroundColor: imageBackdrop }]}>
                  <Image
                    source={cardImage}
                    style={[
                      styles.image,
                      item.track === "data-structures"
                        ? dsImageStyleById[item.id] ?? styles.dataStructureImage
                        : styles.algorithmImage,
                    ]}
                    resizeMode="contain"
                  />
                </View>
                <View
                  style={[
                    styles.imageBadge,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                >
                  <Text style={[styles.imageBadgeText, { color: colors.text }]}>
                    Step {item.level}
                  </Text>
                </View>
              </View>
            ) : null}
            <View style={styles.cardHeader}>
              <Text style={[styles.step, { color: colors.textMuted }]}>
                {item.track === "data-structures"
                  ? "Data Structure"
                  : "Algorithm"}
              </Text>
              <Text
                style={[
                  styles.badge,
                  {
                    color: colors.accentText,
                    backgroundColor: colors.accent,
                    borderColor: colors.accent,
                  },
                ]}
              >
                {item.track === "data-structures" ? "DS" : "Algo"}
              </Text>
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {item.title}
            </Text>
            <Text
              style={[styles.cardSubtitle, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {item.subtitle}
            </Text>
            <Text style={[styles.summaryText, { color: colors.textSecondary }]} numberOfLines={2}>
              {item.summary}
            </Text>
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
                          color: colors.text,
                          backgroundColor: colors.surfaceAlt,
                          borderColor: colors.border,
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
            <View style={styles.footerRow}>
              <Text style={[styles.footerText, { color: colors.textMuted }]}>
                Tap to open guide
              </Text>
              <Ionicons name="arrow-forward-circle" size={18} color={colors.accent} />
            </View>
          </Pressable>
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
  },
  segment: {
    flexDirection: "row",
    marginHorizontal: 20,
    borderRadius: 999,
    padding: 4,
    marginBottom: 8,
    borderWidth: 1,
  },
  segmentItem: {
    flex: 1,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
  },
  segmentLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 22,
    padding: 16,
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
  imageWrap: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    marginBottom: 12,
    height: 196,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: 4,
  },
  imageInner: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
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
  imageBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderWidth: 1,
  },
  imageBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    alignItems: "center",
  },
  step: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.9,
  },
  badge: {
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 19,
  },
  relatedPreviewWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  relatedPreviewChip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: "700",
    overflow: "hidden",
    maxWidth: 240,
  },
  footerRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(148,163,184,0.25)",
  },
  footerText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
