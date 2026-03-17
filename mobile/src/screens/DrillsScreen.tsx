import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import api from "../services/api";
import { Drill } from "../types";
import { MainStackParamList } from "../navigation/MainTabs";
import { useTheme } from "../context/ThemeContext";

export default function DrillsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { colors } = useTheme();
  const [drills, setDrills] = useState<Drill[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDrills = useCallback(async () => {
    try {
      setError(null);
      const { data } = await api.get<Drill[]>("/drills");
      setDrills(data);
    } catch {
      setError("Failed to load drills.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDrills();
  }, [fetchDrills]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDrills();
  };

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
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryBtn, { backgroundColor: colors.accent }]}
          onPress={fetchDrills}
        >
          <Text style={[styles.retryText, { color: colors.accentText }]}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={drills}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate("DrillDetail", { drill: item })}
            activeOpacity={0.8}
          >
            <Text style={[styles.category, { color: colors.accent }]}>
              {item.pattern_category}
            </Text>
            <Text style={[styles.prompt, { color: colors.text }]}>
              {item.prompt}
            </Text>
            <Text style={[styles.count, { color: colors.textMuted }]}>
              {item.choices.length} choices
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              No drills available yet.
            </Text>
          </View>
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
    padding: 24,
  },
  list: {
    padding: 16,
  },
  card: {
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
  },
  category: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  prompt: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  count: {
    fontSize: 13,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 12,
  },
  retryBtn: {
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  retryText: {
    fontWeight: "700",
  },
  emptyText: {
    fontSize: 16,
  },
});
