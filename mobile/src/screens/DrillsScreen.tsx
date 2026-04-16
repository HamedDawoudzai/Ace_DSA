import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../services/api";
import { Drill, DrillCategory, UserProgress } from "../types";
import { MainStackParamList } from "../navigation/MainTabs";
import { useTheme } from "../context/ThemeContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  "Arrays & Hashing": "grid-outline",
  "Two Pointers": "git-compare-outline",
  "Sliding Window": "resize-outline",
  Stack: "layers-outline",
  "Binary Search": "search-outline",
  "Linked List": "link-outline",
  Trees: "leaf-outline",
  "Heap / Priority Queue": "triangle-outline",
  Backtracking: "return-up-back-outline",
  Tries: "text-outline",
  Graphs: "git-network-outline",
  "Advanced Graphs": "analytics-outline",
  "1-D Dynamic Programming": "trending-up-outline",
  "2-D Dynamic Programming": "apps-outline",
  Greedy: "flash-outline",
  Intervals: "time-outline",
  "Math & Geometry": "calculator-outline",
  "Bit Manipulation": "code-slash-outline",
};

type Phase = "welcome" | "letsBegin" | "drilling" | "complete";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function DrillsScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const [phase, setPhase] = useState<Phase>("welcome");
  const [categories, setCategories] = useState<DrillCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [drillQueue, setDrillQueue] = useState<Drill[]>([]);
  const [drillLoading, setDrillLoading] = useState(false);

  const welcomeAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef<Animated.Value[]>([]);
  const letsBeginAnim = useRef(new Animated.Value(0)).current;
  const completeAnim = useRef(new Animated.Value(0)).current;

  const fetchCategories = useCallback(async () => {
    try {
      setError(null);
      const { data } = await api.get<DrillCategory[]>("/drills/categories");
      setCategories(data);
    } catch {
      setError("Could not load categories. Pull down to retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (phase === "welcome" && categories.length > 0) {
      const totalCards = categories.length + 1;
      cardAnims.current = Array.from({ length: totalCards }, () => new Animated.Value(0));

      welcomeAnim.setValue(0);
      Animated.spring(welcomeAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();

      const stagger = Animated.stagger(
        50,
        cardAnims.current.map((anim) =>
          Animated.spring(anim, {
            toValue: 1,
            friction: 7,
            tension: 50,
            useNativeDriver: true,
          })
        )
      );
      setTimeout(() => stagger.start(), 200);
    }
  }, [phase, categories.length, welcomeAnim]);

  const fetchDrillsAndStart = useCallback(
    async (category: string | null) => {
      setDrillLoading(true);
      try {
        const url = category ? `/drills?category=${encodeURIComponent(category)}` : "/drills";
        const [drillsRes, progressRes] = await Promise.all([
          api.get<Drill[]>(url),
          api.get<UserProgress[]>("/me/progress"),
        ]);

        const completedIds = new Set(
          progressRes.data
            .filter((p) => p.completed_at !== null)
            .map((p) => p.drill_id)
        );
        const remaining = drillsRes.data.filter((d) => !completedIds.has(d.id));

        if (remaining.length === 0) {
          setDrillQueue([]);
          setPhase("complete");
          completeAnim.setValue(0);
          Animated.spring(completeAnim, {
            toValue: 1,
            friction: 6,
            tension: 40,
            useNativeDriver: true,
          }).start();
          return;
        }

        const shuffled = shuffle(remaining);
        setDrillQueue(shuffled);
        setPhase("drilling");
        navigation.navigate("DrillDetail", {
          drill: shuffled[0],
          fromQueue: true,
          drillQueue: shuffled,
          queueIndex: 0,
          selectedCategory: category,
        });
      } catch {
        setError("Could not load drills. Try again.");
        setPhase("welcome");
      } finally {
        setDrillLoading(false);
      }
    },
    [navigation, completeAnim]
  );

  const handleCategoryPress = useCallback(
    (category: string | null) => {
      setSelectedCategory(category);
      setPhase("letsBegin");
      letsBeginAnim.setValue(0);
      Animated.spring(letsBeginAnim, {
        toValue: 1,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        fetchDrillsAndStart(category);
      }, 1200);
    },
    [letsBeginAnim, fetchDrillsAndStart]
  );

  const resetToWelcome = useCallback(() => {
    setPhase("welcome");
    setSelectedCategory(null);
    setDrillQueue([]);
    setError(null);
    fetchCategories();
  }, [fetchCategories]);

  // When DrillsScreen regains focus while a session was active (user navigated
  // back via the header back button), reset to the category selector.
  useFocusEffect(
    useCallback(() => {
      if (phase === "drilling") {
        resetToWelcome();
      }
    }, [phase, resetToWelcome])
  );

  const allCategories = useMemo(() => {
    return [{ name: "Random", total: 0, completed: 0 }, ...categories];
  }, [categories]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error && phase === "welcome") {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="cloud-offline-outline" size={48} color={colors.textMuted} />
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>{error}</Text>
        <Pressable
          style={[styles.retryBtn, { backgroundColor: colors.accent }]}
          onPress={() => {
            setLoading(true);
            fetchCategories();
          }}
        >
          <Text style={[styles.retryText, { color: colors.accentText }]}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (phase === "welcome") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[
              styles.welcomeHeader,
              {
                opacity: welcomeAnim,
                transform: [
                  {
                    translateY: welcomeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={[styles.welcomeTitle, { color: colors.text }]}>
              What would you like{"\n"}to practice today?
            </Text>
          </Animated.View>

          <View style={styles.grid}>
            {allCategories.map((cat, index) => {
              const anim = cardAnims.current[index] || new Animated.Value(1);
              const isRandom = cat.name === "Random";
              return (
                <CategoryCard
                  key={cat.name}
                  name={cat.name}
                  icon={isRandom ? "shuffle-outline" : CATEGORY_ICONS[cat.name] || "help-outline"}
                  isRandom={isRandom}
                  anim={anim}
                  colors={colors}
                  isDark={isDark}
                  onPress={() => handleCategoryPress(isRandom ? null : cat.name)}
                />
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }

  if (phase === "letsBegin") {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Animated.View
          style={{
            opacity: letsBeginAnim,
            transform: [
              {
                translateY: letsBeginAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0],
                }),
              },
              {
                scale: letsBeginAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.8, 1.05, 1],
                }),
              },
            ],
          }}
        >
          <Text style={[styles.letsBeginText, { color: colors.accent }]}>Let's begin</Text>
          <Text style={[styles.letsBeginCategory, { color: colors.textSecondary }]}>
            {selectedCategory || "Random Mix"}
          </Text>
          {drillLoading && (
            <ActivityIndicator size="small" color={colors.accent} style={{ marginTop: 20 }} />
          )}
        </Animated.View>
      </View>
    );
  }

  if (phase === "complete") {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Animated.View
          style={[
            styles.completeCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: completeAnim,
              transform: [
                {
                  scale: completeAnim.interpolate({
                    inputRange: [0, 0.6, 1],
                    outputRange: [0.5, 1.08, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.completeIconCircle, { backgroundColor: colors.accentSubtle }]}>
            <Ionicons name="trophy" size={48} color={colors.accent} />
          </View>
          <Text style={[styles.completeTitle, { color: colors.text }]}>
            {selectedCategory ? "Category Complete!" : "All Done!"}
          </Text>
          <Text style={[styles.completeSubtitle, { color: colors.textSecondary }]}>
            {selectedCategory
              ? `You've completed all ${selectedCategory} problems.`
              : "You've completed every available problem. Amazing!"}
          </Text>
          <Pressable
            style={[styles.completeBtn, { backgroundColor: colors.accent }]}
            onPress={resetToWelcome}
          >
            <Text style={[styles.completeBtnText, { color: colors.accentText }]}>
              Back to Categories
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={[styles.center, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  );
}

interface CategoryCardProps {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  isRandom: boolean;
  anim: Animated.Value;
  colors: any;
  isDark: boolean;
  onPress: () => void;
}

function CategoryCard({ name, icon, isRandom, anim, colors, isDark, onPress }: CategoryCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const cardBg = isRandom
    ? isDark
      ? "rgba(45, 212, 191, 0.12)"
      : "rgba(245, 200, 66, 0.15)"
    : colors.surface;
  const borderCol = isRandom ? colors.accent : colors.border;

  return (
    <Animated.View
      style={[
        isRandom ? styles.randomCardWrapper : styles.cardWrapper,
        {
          opacity: anim,
          transform: [
            { scale: scaleAnim },
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Pressable
        style={[
          styles.card,
          isRandom && styles.randomCard,
          {
            backgroundColor: cardBg,
            borderColor: borderCol,
          },
        ]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View
          style={[
            styles.cardIconCircle,
            {
              backgroundColor: isRandom
                ? isDark
                  ? "rgba(45, 212, 191, 0.2)"
                  : "rgba(245, 200, 66, 0.25)"
                : colors.accentSubtle,
            },
          ]}
        >
          <Ionicons name={icon} size={isRandom ? 28 : 22} color={colors.accent} />
        </View>
        <Text
          style={[
            styles.cardName,
            isRandom && styles.randomCardName,
            { color: isRandom ? colors.accent : colors.text },
          ]}
          numberOfLines={2}
        >
          {name}
        </Text>
        {isRandom && (
          <Text style={[styles.randomSubtext, { color: colors.textMuted }]}>
            Practice from all categories
          </Text>
        )}
        <Ionicons
          name="chevron-forward"
          size={16}
          color={colors.textMuted}
          style={styles.cardChevron}
        />
      </Pressable>
    </Animated.View>
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
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  welcomeHeader: {
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: (SCREEN_WIDTH - 52) / 2,
    marginBottom: 12,
  },
  randomCardWrapper: {
    width: "100%",
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    minHeight: 100,
    justifyContent: "space-between",
  },
  randomCard: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 72,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  cardIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardName: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
  },
  randomCardName: {
    fontSize: 17,
    fontWeight: "800",
    marginLeft: 14,
    flex: 1,
  },
  randomSubtext: {
    fontSize: 12,
    marginLeft: 14,
    flex: 1,
    marginTop: 2,
  },
  cardChevron: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  letsBeginText: {
    fontSize: 36,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  letsBeginCategory: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
  completeCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 32,
    alignItems: "center",
    width: "100%",
    maxWidth: 340,
  },
  completeIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  completeSubtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  completeBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  completeBtnText: {
    fontSize: 15,
    fontWeight: "700",
  },
  errorText: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 20,
    lineHeight: 22,
  },
  retryBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  retryText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
