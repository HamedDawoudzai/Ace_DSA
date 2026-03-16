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

export default function DrillsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
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
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F5C842" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchDrills}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={drills}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("DrillDetail", { drill: item })}
            activeOpacity={0.8}
          >
            <Text style={styles.category}>{item.pattern_category}</Text>
            <Text style={styles.prompt} numberOfLines={2}>
              {item.prompt}
            </Text>
            <Text style={styles.count}>
              {item.choices.length} choices
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No drills available yet.</Text>
          </View>
        }
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
    padding: 24,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
  },
  category: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F5C842",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  prompt: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  count: {
    fontSize: 13,
    color: "#888",
  },
  errorText: {
    fontSize: 16,
    color: "#c00",
    marginBottom: 12,
  },
  retryBtn: {
    backgroundColor: "#F5C842",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  retryText: {
    fontWeight: "700",
    color: "#000",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});
