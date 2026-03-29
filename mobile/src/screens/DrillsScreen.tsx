import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import api from "../services/api";
import { Drill } from "../types";
import { MainStackParamList } from "../navigation/MainTabs";
import { useTheme } from "../context/ThemeContext";

const DrillCard = memo(function DrillCard({
  drill,
  onPress,
}: {
  drill: Drill;
  onPress: (d: Drill) => void;
}) {
  const { colors, isDark } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.22 : 0.07,
          shadowRadius: 8,
          elevation: 3,
        },
      ]}
      onPress={() => onPress(drill)}
      activeOpacity={0.8}
    >
      <View style={[styles.accentBar, { backgroundColor: colors.accent }]} />
      <View style={styles.cardTop}>
        <View
          style={[
            styles.categoryPill,
            {
              backgroundColor: isDark
                ? "rgba(45,212,191,0.12)"
                : "rgba(245,200,66,0.22)",
            },
          ]}
        >
          <Text style={[styles.category, { color: colors.accent }]}>
            {drill.pattern_category}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </View>
      <Text style={[styles.prompt, { color: colors.text }]}>{drill.prompt}</Text>
      <Text style={[styles.count, { color: colors.textMuted }]}>
        {drill.choices.length} answer choices
      </Text>
    </TouchableOpacity>
  );
});

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

  const onPressDrill = useCallback(
    (drill: Drill) => navigation.navigate("DrillDetail", { drill }),
    [navigation]
  );

  const refreshControl = useMemo(
    () => <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />,
    [refreshing]
  );

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
        refreshControl={refreshControl}
        renderItem={({ item }) => <DrillCard drill={item} onPress={onPressDrill} />}
        initialNumToRender={8}
        windowSize={7}
        removeClippedSubviews
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="code-slash-outline" size={48} color={colors.textMuted} />
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
    paddingTop: 20,
  },
  card: {
    borderRadius: 14,
    padding: 18,
    paddingLeft: 22,
    marginBottom: 14,
    overflow: "hidden",
  },
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  categoryPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  category: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  prompt: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 22,
  },
  count: {
    fontSize: 12,
    fontWeight: "500",
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
  emptyWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
  },
});
