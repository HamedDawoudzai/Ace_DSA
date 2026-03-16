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

export default function StatsScreen() {
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
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F5C842" />
      </View>
    );
  }

  if (!stats || stats.patterns.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="stats-chart-outline" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>No Stats Yet</Text>
        <Text style={styles.emptySubtitle}>
          Complete some drills to see your stats here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{stats.total_attempts}</Text>
          <Text style={styles.summaryLabel}>Attempts</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{stats.streak}</Text>
          <Text style={styles.summaryLabel}>Day Streak</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>By Pattern</Text>

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
          <View style={styles.patternRow}>
            <Text style={styles.patternName}>{item.pattern}</Text>
            <Text style={styles.patternCount}>{item.total}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E1DAC9",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E1DAC9",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#777",
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
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#F5C842",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  patternName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  patternCount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F5C842",
  },
});
