import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";
import { StatsResponse } from "../types";
import { useTheme } from "../context/ThemeContext";

export default function StatsScreen() {
  const { colors } = useTheme();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get<StatsResponse>("/me/stats");
      setStats(data);
    } catch {
      // silently fail for placeholder
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!stats || stats.patterns.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="stats-chart-outline" size={64} color={colors.textMuted} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          No Stats Yet
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          Complete some drills to see your stats here.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.summaryValue, { color: colors.accent }]}>
            {stats.total_attempts}
          </Text>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
            Attempts
          </Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.summaryValue, { color: colors.accent }]}>
            {stats.streak}
          </Text>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
            Day Streak
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        By Pattern
      </Text>

      <FlatList
        data={stats.patterns}
        keyExtractor={(item) => item.pattern}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchStats();
            }}
          />
        }
        renderItem={({ item }) => (
          <View
            style={[styles.patternRow, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.patternName, { color: colors.text }]}>
              {item.pattern}
            </Text>
            <Text style={[styles.patternCount, { color: colors.accent }]}>
              {item.total}
            </Text>
          </View>
        )}
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
  summaryRow: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: "800",
  },
  summaryLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  patternRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  patternName: {
    fontSize: 16,
    fontWeight: "600",
  },
  patternCount: {
    fontSize: 16,
    fontWeight: "700",
  },
});
