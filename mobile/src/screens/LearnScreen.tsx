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
  LearnTopic,
  LearnTrack,
} from "../data/learnTopics";
import { MainStackParamList } from "../navigation/MainTabs";

type Nav = NativeStackNavigationProp<MainStackParamList, "Learn">;

export default function LearnScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<Nav>();
  const [track, setTrack] = useState<LearnTrack>("data-structures");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const topics = useMemo<LearnTopic[]>(() => {
    const src =
      track === "data-structures" ? DATA_STRUCTURE_TOPICS : ALGO_TOPICS;
    return [...src].sort((a, b) => a.level - b.level);
  }, [track]);

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
          { backgroundColor: colors.segmentedBackground || colors.surface },
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
        renderItem={({ item }) => (
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
                  transform: [{ scale: pressed ? 0.995 : 1 }],
                  zIndex: isHovered ? 10 : 1,
                },
                isHovered && {
                  shadowColor: colors.accent,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.12,
                  shadowRadius: 12,
                  elevation: 6,
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
            {item.image ? (
              <View
                style={[
                  styles.imageWrap,
                  {
                    backgroundColor: colors.surfaceAlt,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.imageInner}>
                  <Image
                    source={item.image}
                    style={[
                      styles.image,
                      item.track === "data-structures"
                        ? styles.dataStructureImage
                        : styles.algorithmImage,
                    ]}
                    resizeMode="contain"
                  />
                </View>
                <View style={[styles.imageBadge, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.imageBadgeText, { color: colors.accent }]}>
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
                    color: colors.accent,
                    backgroundColor: colors.surfaceAlt,
                    borderColor: colors.border,
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
            <View style={styles.footerRow}>
              <Text style={[styles.footerText, { color: colors.textMuted }]}>
                Tap to open guide
              </Text>
              <Ionicons name="arrow-forward-circle" size={18} color={colors.accent} />
            </View>
          </Pressable>
        )}
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
    paddingTop: 16,
    paddingBottom: 8,
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  segment: {
    flexDirection: "row",
    marginHorizontal: 20,
    borderRadius: 999,
    padding: 4,
    marginBottom: 4,
  },
  segmentItem: {
    flex: 1,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
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
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
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
    marginBottom: 10,
    height: 176,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: 8,
  },
  imageInner: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.28)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  dataStructureImage: {
    transform: [{ scale: 0.96 }],
  } as ImageStyle,
  algorithmImage: {
    transform: [{ scale: 0.92 }],
  } as ImageStyle,
  imageBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  imageBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    alignItems: "center",
  },
  step: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  badge: {
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: 12,
    lineHeight: 18,
  },
  footerRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
