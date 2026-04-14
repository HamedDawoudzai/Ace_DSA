import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import api from "../services/api";
import { StatsResponse, CategoryStats } from "../types";
import { useTheme } from "../context/ThemeContext";
import { DATA_STRUCTURE_TOPICS, ALGO_TOPICS } from "../data/learnTopics";
import { getVisitedIds } from "../services/learnProgress";

const RING_SIZE = 160;
const STROKE_WIDTH = 14;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ProgressRing({
  percent,
  accentColor,
  trackColor,
}: {
  percent: number;
  accentColor: string;
  trackColor: string;
}) {
  const strokeDashoffset = CIRCUMFERENCE * (1 - percent / 100);

  return (
    <Svg width={RING_SIZE} height={RING_SIZE}>
      <Circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RADIUS}
        stroke={trackColor}
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />
      <Circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RADIUS}
        stroke={accentColor}
        strokeWidth={STROKE_WIDTH}
        fill="none"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        rotation="-90"
        origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
      />
    </Svg>
  );
}

// ─── DS / Algo Progression Timeline ──────────────────────────────────────────

const DS_TOPICS = DATA_STRUCTURE_TOPICS.slice().sort((a, b) => a.level - b.level);
const ALGO_TOPICS_SORTED = ALGO_TOPICS.slice().sort((a, b) => a.level - b.level);

function ProgressionTimeline({
  topics,
  visitedIds,
  label,
}: {
  topics: typeof DS_TOPICS;
  visitedIds: Set<string>;
  label: string;
}) {
  const { colors, isDark } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const visited = topics.filter((t) => visitedIds.has(t.id)).length;

  return (
    <View
      style={[
        timelineStyles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: isDark ? colors.accent : "#000",
          shadowOpacity: isDark ? 0.08 : 0.05,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 3 },
          elevation: 3,
        },
      ]}
    >
      <Pressable
        onPress={() => setExpanded((v) => !v)}
        style={timelineStyles.header}
      >
        <View style={timelineStyles.headerLeft}>
          <View
            style={[
              timelineStyles.iconBox,
              { backgroundColor: colors.accentSubtle },
            ]}
          >
            <Ionicons
              name={label === "Data Structures" ? "layers-outline" : "git-branch-outline"}
              size={16}
              color={colors.accent}
            />
          </View>
          <View>
            <Text style={[timelineStyles.cardTitle, { color: colors.text }]}>
              {label}
            </Text>
            <Text style={[timelineStyles.cardSub, { color: colors.textMuted }]}>
              {visited}/{topics.length} visited
            </Text>
          </View>
        </View>
        <View style={[timelineStyles.progressPill, { backgroundColor: colors.accentSubtle, borderColor: colors.accent }]}>
          <Text style={[timelineStyles.progressPillText, { color: colors.accent }]}>
            {Math.round((visited / topics.length) * 100)}%
          </Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.textMuted}
          style={{ marginLeft: 8 }}
        />
      </Pressable>

      {expanded && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={timelineStyles.dotScroll}
        >
          {topics.map((topic, i) => {
            const isVisited = visitedIds.has(topic.id);
            const prevVisited = i > 0 && visitedIds.has(topics[i - 1].id);
            return (
              <View key={topic.id} style={timelineStyles.dotItem}>
                {/* Connector line */}
                {i > 0 && (
                  <View
                    style={[
                      timelineStyles.connectorLine,
                      {
                        backgroundColor:
                          isVisited && prevVisited
                            ? colors.accent
                            : colors.border,
                        opacity: isVisited && prevVisited ? 0.7 : 0.4,
                      },
                    ]}
                  />
                )}
                {/* Dot */}
                <View style={timelineStyles.dotCol}>
                  <View
                    style={[
                      timelineStyles.dot,
                      {
                        backgroundColor: isVisited ? colors.accent : "transparent",
                        borderColor: isVisited ? colors.accent : colors.border,
                        shadowColor: colors.accent,
                        shadowOpacity: isVisited ? 0.6 : 0,
                        shadowRadius: 5,
                        shadowOffset: { width: 0, height: 0 },
                      },
                    ]}
                  >
                    {isVisited && (
                      <Ionicons name="checkmark" size={9} color={colors.accentText} />
                    )}
                  </View>
                  <Text
                    style={[timelineStyles.dotLabel, { color: isVisited ? colors.accent : colors.textMuted }]}
                    numberOfLines={2}
                  >
                    {topic.title}
                  </Text>
                  <Text style={[timelineStyles.dotStep, { color: colors.border }]}>
                    {topic.level}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const timelineStyles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 10,
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  cardSub: {
    fontSize: 12,
    marginTop: 1,
  },
  progressPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  progressPillText: {
    fontSize: 12,
    fontWeight: "800",
  },
  dotScroll: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: "flex-start",
  },
  dotItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  connectorLine: {
    width: 24,
    height: 2,
    borderRadius: 1,
    marginTop: -28,
  },
  dotCol: {
    alignItems: "center",
    width: 60,
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  dotLabel: {
    fontSize: 9,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.1,
    lineHeight: 12,
  },
  dotStep: {
    fontSize: 9,
    fontWeight: "700",
    marginTop: 3,
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function StatsScreen() {
  const { colors, isDark } = useTheme();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [visitedIds, setVisitedIds] = useState<Set<string>>(new Set());

  const handleResetProgress = useCallback(() => {
    Alert.alert(
      "Reset Progress",
      "This will erase all your progress and attempt history. This cannot be undone. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            setResetting(true);
            try {
              await api.delete("/me/stats/reset");
              await fetchStatsInner();
            } catch {
              setError("Failed to reset progress.");
            } finally {
              setResetting(false);
            }
          },
        },
      ]
    );
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const { data } = await api.get<StatsResponse>("/me/stats");
      setStats(data);
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to load stats. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const fetchStatsInner = fetchStats;

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Reload visited IDs every time this tab comes into focus
  useFocusEffect(
    useCallback(() => {
      getVisitedIds().then(setVisitedIds);
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStats();
    getVisitedIds().then(setVisitedIds);
  }, [fetchStats]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="cloud-offline-outline" size={64} color={colors.error} />
        <Text style={[styles.errorTitle, { color: colors.text }]}>
          Something went wrong
        </Text>
        <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
          {error}
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.accent }]}
          onPress={() => {
            setLoading(true);
            fetchStats();
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name="refresh-outline"
            size={18}
            color={colors.accentText}
          />
          <Text style={[styles.retryText, { color: colors.accentText }]}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!stats || stats.categories.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons
          name="stats-chart-outline"
          size={64}
          color={colors.textMuted}
        />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          No Stats Yet
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          Complete some drills to see your stats here.
        </Text>
      </View>
    );
  }

  const completionPercent =
    stats.total_problems > 0
      ? Math.round((stats.total_completed / stats.total_problems) * 100)
      : 0;

  const cardShadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.2 : 0.06,
    shadowRadius: 6,
    elevation: 2,
  };

  const renderHeader = () => (
    <>
      <View style={styles.summaryRow}>
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: colors.surface },
            cardShadow,
          ]}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={26}
            color={colors.accent}
            style={styles.summaryIcon}
          />
          <Text style={[styles.summaryValue, { color: colors.accent }]}>
            {stats.total_completed}/{stats.total_problems}
          </Text>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
            Completed
          </Text>
        </View>
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: colors.surface },
            cardShadow,
          ]}
        >
          <Ionicons
            name="flame-outline"
            size={26}
            color={colors.accent}
            style={styles.summaryIcon}
          />
          <Text style={[styles.summaryValue, { color: colors.accent }]}>
            {stats.streak}
          </Text>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
            Day Streak
          </Text>
        </View>
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: colors.surface },
            cardShadow,
          ]}
        >
          <Ionicons
            name="flash-outline"
            size={26}
            color={colors.accent}
            style={styles.summaryIcon}
          />
          <Text style={[styles.summaryValue, { color: colors.accent }]}>
            {stats.total_attempts}
          </Text>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
            Attempts
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.progressSection,
          { backgroundColor: colors.surface },
          cardShadow,
        ]}
      >
        <ProgressRing
          percent={completionPercent}
          accentColor={colors.accent}
          trackColor={colors.border}
        />
        <View style={styles.progressLabel}>
          <Text style={[styles.progressPercent, { color: colors.accent }]}>
            {completionPercent}%
          </Text>
          <Text
            style={[styles.progressSubtext, { color: colors.textSecondary }]}
          >
            Complete
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Learning Progression
        </Text>
      </View>

      <ProgressionTimeline
        topics={DS_TOPICS}
        visitedIds={visitedIds}
        label="Data Structures"
      />
      <ProgressionTimeline
        topics={ALGO_TOPICS_SORTED}
        visitedIds={visitedIds}
        label="Algorithms"
      />

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          By Category
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.resetBtn,
            {
              backgroundColor: isDark
                ? "rgba(248,113,113,0.08)"
                : "rgba(239,68,68,0.07)",
              borderColor: isDark
                ? "rgba(248,113,113,0.18)"
                : "rgba(239,68,68,0.15)",
              opacity: pressed ? 0.7 : resetting ? 0.5 : 1,
            },
          ]}
          onPress={handleResetProgress}
          disabled={resetting}
        >
          {resetting ? (
            <ActivityIndicator size={14} color={colors.error} />
          ) : (
            <Ionicons name="trash-outline" size={14} color={colors.error} />
          )}
          <Text style={[styles.resetBtnText, { color: colors.error }]}>
            Reset
          </Text>
        </Pressable>
      </View>
    </>
  );

  const renderCategoryRow = ({ item }: { item: CategoryStats }) => {
    const ratio = item.total > 0 ? item.completed / item.total : 0;

    return (
      <View
        style={[
          styles.categoryRow,
          {
            backgroundColor: colors.surface,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: isDark ? 0.15 : 0.05,
            shadowRadius: 4,
            elevation: 1,
          },
        ]}
      >
        <View style={styles.categoryHeader}>
          <Text style={[styles.categoryName, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text
            style={[styles.categoryCount, { color: colors.textSecondary }]}
          >
            {item.completed}/{item.total}
          </Text>
        </View>
        <View
          style={[styles.progressBarTrack, { backgroundColor: colors.border }]}
        >
          <View
            style={[
              styles.progressBarFill,
              {
                backgroundColor: colors.accent,
                width: `${Math.round(ratio * 100)}%`,
              },
            ]}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={stats.categories}
        keyExtractor={(item) => item.name}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.list}
        renderItem={renderCategoryRow}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 16,
  },
  errorMessage: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
    paddingHorizontal: 24,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    fontSize: 16,
    fontWeight: "700",
  },
  summaryRow: {
    flexDirection: "row",
    padding: 16,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  summaryIcon: {
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: "800",
  },
  summaryLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  progressSection: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  progressLabel: {
    alignItems: "flex-start",
  },
  progressPercent: {
    fontSize: 42,
    fontWeight: "800",
  },
  progressSubtext: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: "700",
  },
  list: {
    paddingBottom: 32,
  },
  categoryRow: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
    minWidth: 0,
  },
});
