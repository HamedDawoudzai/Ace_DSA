import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
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
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.card, { backgroundColor: colors.surface }]}
            onPress={() =>
              navigation.navigate("LearnDetail", {
                id: item.id,
                track: item.track,
              })
            }
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.step, { color: colors.textMuted }]}>
                Step {item.level}
              </Text>
              <Text style={[styles.badge, { color: colors.accent }]}>
                {item.track === "data-structures" ? "DS" : "Algo"}
              </Text>
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {item.title}
            </Text>
            <Text
              style={[styles.cardSubtitle, { color: colors.textSecondary }]}
            >
              {item.subtitle}
            </Text>
          </TouchableOpacity>
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
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  step: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  badge: {
    fontSize: 12,
    fontWeight: "700",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
  },
});
