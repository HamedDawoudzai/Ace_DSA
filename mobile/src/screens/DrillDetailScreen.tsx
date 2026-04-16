import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
  Modal,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import api from "../services/api";
import { AttemptRequest, Drill } from "../types";
import { MainStackParamList } from "../navigation/MainTabs";
import { useTheme } from "../context/ThemeContext";

type Step = "approach" | "complexity" | "complete";

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
  easy: { bg: "rgba(34,197,94,0.15)", text: "#22C55E" },
  medium: { bg: "rgba(249,115,22,0.15)", text: "#F97316" },
  hard: { bg: "rgba(239,68,68,0.15)", text: "#EF4444" },
};

const LETTERS = ["A", "B", "C", "D"];
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CONFETTI_COLORS = [
  "#0DD9C4", "#FF6B6B", "#FFE66D", "#A78BFA",
  "#34D399", "#FB923C", "#60A5FA", "#F472B6",
];
const PARTICLE_COUNT = 26;

export default function DrillDetailScreen() {
  const route = useRoute<RouteProp<MainStackParamList, "DrillDetail">>();
  const navigation = useNavigation<any>();
  const {
    drill: paramDrill,
    drillQueue = [],
    queueIndex = 0,
  } = route.params;
  const { colors, isDark } = useTheme();

  // ── Queue state ──────────────────────────────────────────────────────────────
  const queue: Drill[] = drillQueue.length > 0 ? drillQueue : [paramDrill];
  const [currentIndex, setCurrentIndex] = useState(queueIndex);
  const drill = queue[currentIndex] ?? paramDrill;
  const totalDrills = queue.length;
  const isLastDrill = currentIndex >= totalDrills - 1;

  // ── Per-drill question state ─────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("approach");
  const [approachSelected, setApproachSelected] = useState<number | null>(null);
  const [approachDisabled, setApproachDisabled] = useState<Set<number>>(new Set());
  const [approachCorrect, setApproachCorrect] = useState(false);
  const [showApproachHint, setShowApproachHint] = useState(false);

  const [complexitySelected, setComplexitySelected] = useState<number | null>(null);
  const [complexityDisabled, setComplexityDisabled] = useState<Set<number>>(new Set());
  const [complexityCorrect, setComplexityCorrect] = useState(false);
  const [showComplexityHint, setShowComplexityHint] = useState(false);
  const [showExplainModal, setShowExplainModal] = useState(false);

  // ── All-complete state ───────────────────────────────────────────────────────
  const [allComplete, setAllComplete] = useState(false);
  const allCompleteAnim = useRef(new Animated.Value(0)).current;

  // ── Wrong answers tracker ────────────────────────────────────────────────────
  type WrongEntry = {
    drill: Drill;
    step: "approach" | "complexity";
    chosenOption: number;
    correctOption: number;
  };
  const [wrongAnswers, setWrongAnswers] = useState<WrongEntry[]>([]);
  const [reviewOpen, setReviewOpen] = useState(false);

  const hasWrongApproach = approachDisabled.size > 0;
  const hasWrongComplexity = complexityDisabled.size > 0;
  const showExplainButton =
    (step === "approach" && hasWrongApproach) ||
    (step === "complexity" && hasWrongComplexity) ||
    step === "complete";

  // ── Animations ───────────────────────────────────────────────────────────────
  const slideOut = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(0)).current;
  const hintAnim = useRef(new Animated.Value(0)).current;
  const celebrationScale = useRef(new Animated.Value(0)).current;
  const celebrationRotate = useRef(new Animated.Value(0)).current;
  const entranceAnim = useRef(new Animated.Value(0)).current;

  // ── Confetti particles (created once, reused on repeat) ──────────────────────
  const confettiParticles = useRef(
    Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle =
        (i / PARTICLE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      return {
        x: new Animated.Value(0),
        y: new Animated.Value(0),
        opacity: new Animated.Value(0),
        scale: new Animated.Value(0),
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 8 + (i % 4) * 3,
        distance: 70 + (i % 7) * 22,
        angle,
      };
    })
  ).current;

  // Entrance animation fires each time currentIndex changes (new drill)
  useEffect(() => {
    entranceAnim.setValue(0);
    Animated.spring(entranceAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  // Individual drill complete animation
  useEffect(() => {
    if (step === "complete") {
      celebrationScale.setValue(0);
      celebrationRotate.setValue(0);
      Animated.parallel([
        Animated.spring(celebrationScale, {
          toValue: 1,
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(celebrationRotate, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [step]);

  // All-complete confetti burst
  useEffect(() => {
    if (!allComplete) return;

    allCompleteAnim.setValue(0);
    Animated.spring(allCompleteAnim, {
      toValue: 1,
      friction: 6,
      tension: 50,
      useNativeDriver: true,
    }).start();

    confettiParticles.forEach((p, i) => {
      p.x.setValue(0);
      p.y.setValue(0);
      p.opacity.setValue(0);
      p.scale.setValue(0);
      const dx = Math.cos(p.angle) * p.distance;
      const dy = Math.sin(p.angle) * p.distance - 20;

      Animated.sequence([
        Animated.delay(i * 28),
        Animated.parallel([
          Animated.spring(p.scale, {
            toValue: 1,
            friction: 5,
            tension: 120,
            useNativeDriver: true,
          }),
          Animated.timing(p.opacity, {
            toValue: 1,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(p.x, {
            toValue: dx,
            duration: 780,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(p.y, {
            toValue: dy,
            duration: 780,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(p.opacity, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [allComplete]);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const transitionToStep = useCallback(
    (nextStep: Step) => {
      slideOut.setValue(0);
      Animated.timing(slideOut, {
        toValue: 1,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        setStep(nextStep);
        hintAnim.setValue(0);
        slideIn.setValue(0);
        Animated.spring(slideIn, {
          toValue: 1,
          friction: 8,
          tension: 45,
          useNativeDriver: true,
        }).start();
      });
    },
    [slideOut, slideIn, hintAnim]
  );

  const resetDrillState = useCallback(() => {
    setStep("approach");
    setApproachSelected(null);
    setApproachDisabled(new Set());
    setApproachCorrect(false);
    setShowApproachHint(false);
    setComplexitySelected(null);
    setComplexityDisabled(new Set());
    setComplexityCorrect(false);
    setShowComplexityHint(false);
    slideOut.setValue(0);
    slideIn.setValue(0);
  }, [slideOut, slideIn]);

  const handleNextProblem = useCallback(() => {
    resetDrillState();
    setCurrentIndex((prev) => prev + 1);
  }, [resetDrillState]);

  const handleRepeat = useCallback(() => {
    setAllComplete(false);
    setCurrentIndex(0);
    setWrongAnswers([]);
    setReviewOpen(false);
    resetDrillState();
  }, [resetDrillState]);

  const animateHint = useCallback(() => {
    hintAnim.setValue(0);
    Animated.spring(hintAnim, {
      toValue: 1,
      friction: 7,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, [hintAnim]);

  const postAttempt = async (body: AttemptRequest) => {
    try {
      await api.post("/attempts", body);
    } catch {}
  };

  const handleApproachSelect = (index: number) => {
    if (approachDisabled.has(index) || approachCorrect) return;
    setApproachSelected(index);
    const isCorrect = index === drill.correct_option;
    postAttempt({
      drill_id: drill.id,
      chosen_option: index,
      is_correct: isCorrect,
      completed: false,
    });
    if (isCorrect) {
      setApproachCorrect(true);
      setShowApproachHint(false);
      setTimeout(() => transitionToStep("complexity"), 1000);
    } else {
      setShowApproachHint(true);
      setApproachDisabled((prev) => {
        const next = new Set(prev).add(index);
        // Record only the FIRST wrong pick for this drill+step
        if (prev.size === 0) {
          setWrongAnswers((w) => [
            ...w,
            {
              drill,
              step: "approach",
              chosenOption: index,
              correctOption: drill.correct_option,
            },
          ]);
        }
        return next;
      });
      animateHint();
    }
  };

  const handleComplexitySelect = (index: number) => {
    if (complexityDisabled.has(index) || complexityCorrect) return;
    setComplexitySelected(index);
    const isCorrect = index === drill.correct_complexity_option;
    if (isCorrect) {
      setComplexityCorrect(true);
      setShowComplexityHint(false);
      postAttempt({
        drill_id: drill.id,
        chosen_option: approachSelected!,
        is_correct: true,
        complexity_chosen: index,
        complexity_correct: true,
        completed: true,
      });
      setTimeout(() => transitionToStep("complete"), 1000);
    } else {
      setShowComplexityHint(true);
      setComplexityDisabled((prev) => new Set(prev).add(index));
      animateHint();
      postAttempt({
        drill_id: drill.id,
        chosen_option: approachSelected!,
        is_correct: true,
        complexity_chosen: index,
        complexity_correct: false,
        completed: false,
      });
    }
  };

  // ── Slide styles ─────────────────────────────────────────────────────────────
  const diffColors = DIFFICULTY_COLORS[drill.difficulty] || DIFFICULTY_COLORS.easy;

  const slideOutTranslateX = slideOut.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SCREEN_WIDTH * 0.3],
  });
  const slideOutOpacity = slideOut.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const slideInTranslateX = slideIn.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_WIDTH * 0.3, 0],
  });
  const slideInOpacity = slideIn.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.5, 1],
  });

  const currentSlideStyle =
    step === "approach"
      ? {
          opacity: entranceAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
          transform: [
            {
              translateY: entranceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }
      : {
          opacity: slideInOpacity,
          transform: [{ translateX: slideInTranslateX }],
        };

  // ── All-complete screen ───────────────────────────────────────────────────────
  if (allComplete) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Confetti particles burst from centre */}
        <View style={styles.confettiOrigin} pointerEvents="none">
          {confettiParticles.map((p, i) => (
            <Animated.View
              key={i}
              style={{
                position: "absolute",
                width: p.size,
                height: p.size,
                borderRadius: p.size / 2,
                backgroundColor: p.color,
                marginLeft: -p.size / 2,
                marginTop: -p.size / 2,
                transform: [
                  { translateX: p.x },
                  { translateY: p.y },
                  { scale: p.scale },
                ],
                opacity: p.opacity,
              }}
            />
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.allCompleteContent}>
          <Animated.View
            style={[
              styles.allCompleteCard,
              {
                backgroundColor: colors.surface,
                borderColor: isDark
                  ? "rgba(13,217,196,0.28)"
                  : "rgba(240,165,0,0.28)",
                opacity: allCompleteAnim,
                transform: [
                  {
                    scale: allCompleteAnim.interpolate({
                      inputRange: [0, 0.6, 1],
                      outputRange: [0.7, 1.04, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Trophy */}
            <View
              style={[
                styles.allCompleteTrophy,
                {
                  backgroundColor: isDark
                    ? "rgba(13,217,196,0.12)"
                    : "rgba(240,165,0,0.10)",
                },
              ]}
            >
              <Text style={{ fontSize: 56 }}>🏆</Text>
            </View>

            <Text style={[styles.allCompleteTitle, { color: colors.text }]}>
              Session Complete!
            </Text>
            <Text
              style={[
                styles.allCompleteSubtitle,
                { color: colors.textSecondary },
              ]}
            >
              You crushed all {totalDrills} question
              {totalDrills !== 1 ? "s" : ""}!
            </Text>

            <View
              style={[
                styles.allCompleteDivider,
                { backgroundColor: colors.border },
              ]}
            />

            {/* Repeat */}
            <Pressable
              style={({ pressed }) => [
                styles.allCompleteBtn,
                { backgroundColor: colors.accent, opacity: pressed ? 0.85 : 1 },
              ]}
              onPress={handleRepeat}
            >
              <Ionicons name="refresh-outline" size={20} color={colors.accentText} />
              <Text
                style={[styles.allCompleteBtnText, { color: colors.accentText }]}
              >
                Repeat Session
              </Text>
            </Pressable>

            {/* New Category */}
            <Pressable
              style={({ pressed }) => [
                styles.allCompleteOutlineBtn,
                {
                  borderColor: colors.accent,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={() => navigation.navigate("Drills")}
            >
              <Ionicons name="apps-outline" size={20} color={colors.accent} />
              <Text
                style={[
                  styles.allCompleteOutlineBtnText,
                  { color: colors.accent },
                ]}
              >
                New Category
              </Text>
            </Pressable>

            {/* Home */}
            <Pressable
              style={({ pressed }) => [
                styles.allCompleteGhostBtn,
                { opacity: pressed ? 0.6 : 1 },
              ]}
              onPress={() => navigation.navigate("Home")}
            >
              <Ionicons name="home-outline" size={18} color={colors.textMuted} />
              <Text
                style={[
                  styles.allCompleteGhostBtnText,
                  { color: colors.textMuted },
                ]}
              >
                Home
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // ── Normal drill screen ───────────────────────────────────────────────────────
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Progress bar (only when there are multiple drills in the queue) */}
      {totalDrills > 1 && (
        <View style={styles.progressRow}>
          <View
            style={[styles.progressTrack, { backgroundColor: colors.border }]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.accent,
                  width: `${((currentIndex + 1) / totalDrills) * 100}%`,
                  shadowColor: colors.accent,
                  shadowOpacity: 0.4,
                  shadowRadius: 3,
                  shadowOffset: { width: 0, height: 0 },
                },
              ]}
            />
          </View>
          <Text style={[styles.progressLabel, { color: colors.textMuted }]}>
            {currentIndex + 1} / {totalDrills}
          </Text>
        </View>
      )}

      <Animated.View style={currentSlideStyle}>
        {/* ── Approach step ── */}
        {step === "approach" && (
          <View>
            <View style={styles.headerRow}>
              <View
                style={[
                  styles.categoryPill,
                  { backgroundColor: colors.accentSubtle },
                ]}
              >
                <Text
                  style={[styles.categoryText, { color: colors.accent }]}
                >
                  {drill.pattern_category}
                </Text>
              </View>
              <View
                style={[
                  styles.difficultyBadge,
                  { backgroundColor: diffColors.bg },
                ]}
              >
                <Text
                  style={[styles.difficultyText, { color: diffColors.text }]}
                >
                  {drill.difficulty}
                </Text>
              </View>
            </View>

            <Text style={[styles.prompt, { color: colors.text }]}>
              {drill.prompt}
            </Text>

            <ExampleIOBlock
              exampleInput={drill.example_input ?? ""}
              exampleOutput={drill.example_output ?? ""}
              colors={colors}
              isDark={isDark}
            />

            <Text
              style={[styles.sectionLabel, { color: colors.textSecondary }]}
            >
              Choose the optimal approach
            </Text>

            {drill.choices.map((choice, i) => (
              <ChoiceCard
                key={`${drill.id}-a${i}`}
                text={choice}
                index={i}
                onSelect={handleApproachSelect}
                selectedIndex={approachSelected}
                disabledSet={approachDisabled}
                correctIndex={drill.correct_option}
                isStepCorrect={approachCorrect}
                colors={colors}
                isDark={isDark}
              />
            ))}

            {approachCorrect && (
              <View
                style={[
                  styles.correctBanner,
                  {
                    backgroundColor: isDark
                      ? "rgba(34,197,94,0.10)"
                      : "rgba(34,197,94,0.08)",
                    borderColor: isDark
                      ? "rgba(52,211,153,0.3)"
                      : "rgba(34,197,94,0.25)",
                  },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={colors.success}
                />
                <Text
                  style={[
                    styles.correctBannerText,
                    { color: colors.success },
                  ]}
                >
                  Correct! Moving on...
                </Text>
              </View>
            )}

            {showApproachHint && !approachCorrect && (
              <Animated.View
                style={{
                  opacity: hintAnim,
                  transform: [
                    {
                      translateY: hintAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-10, 0],
                      }),
                    },
                  ],
                }}
              >
                <HintCard text={drill.hint} isDark={isDark} />
              </Animated.View>
            )}

            {showExplainButton &&
              step === "approach" &&
              drill.explanation !== "" && (
                <ExplainButton
                  colors={colors}
                  isDark={isDark}
                  onPress={() => setShowExplainModal(true)}
                />
              )}
          </View>
        )}

        {/* ── Complexity step ── */}
        {step === "complexity" && (
          <View>
            <ExampleIOBlock
              exampleInput={drill.example_input ?? ""}
              exampleOutput={drill.example_output ?? ""}
              colors={colors}
              isDark={isDark}
            />
            <View
              style={[
                styles.referenceCard,
                {
                  backgroundColor: isDark
                    ? "rgba(13,217,196,0.06)"
                    : "rgba(240,165,0,0.06)",
                  borderColor: isDark
                    ? "rgba(13,217,196,0.2)"
                    : "rgba(240,165,0,0.2)",
                },
              ]}
            >
              <View style={styles.referenceHeader}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={colors.success}
                />
                <Text
                  style={[
                    styles.referenceLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Your approach
                </Text>
              </View>
              <Text style={[styles.referenceText, { color: colors.text }]}>
                {drill.choices[drill.correct_option]}
              </Text>
            </View>

            <Text style={[styles.complexityHeader, { color: colors.text }]}>
              What's the time & space complexity of the optimal approach?
            </Text>

            <Text
              style={[styles.sectionLabel, { color: colors.textSecondary }]}
            >
              Select the correct complexity
            </Text>

            {drill.complexity_choices.map((choice, i) => (
              <ChoiceCard
                key={`${drill.id}-c${i}`}
                text={choice}
                index={i}
                onSelect={handleComplexitySelect}
                selectedIndex={complexitySelected}
                disabledSet={complexityDisabled}
                correctIndex={drill.correct_complexity_option}
                isStepCorrect={complexityCorrect}
                colors={colors}
                isDark={isDark}
              />
            ))}

            {complexityCorrect && (
              <View
                style={[
                  styles.correctBanner,
                  {
                    backgroundColor: isDark
                      ? "rgba(34,197,94,0.10)"
                      : "rgba(34,197,94,0.08)",
                    borderColor: isDark
                      ? "rgba(52,211,153,0.3)"
                      : "rgba(34,197,94,0.25)",
                  },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={colors.success}
                />
                <Text
                  style={[
                    styles.correctBannerText,
                    { color: colors.success },
                  ]}
                >
                  Correct! Well done!
                </Text>
              </View>
            )}

            {showComplexityHint && !complexityCorrect && (
              <Animated.View
                style={{
                  opacity: hintAnim,
                  transform: [
                    {
                      translateY: hintAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-10, 0],
                      }),
                    },
                  ],
                }}
              >
                <HintCard text={drill.complexity_hint} isDark={isDark} />
              </Animated.View>
            )}

            {showExplainButton &&
              step === "complexity" &&
              drill.explanation !== "" && (
                <ExplainButton
                  colors={colors}
                  isDark={isDark}
                  onPress={() => setShowExplainModal(true)}
                />
              )}
          </View>
        )}

        {/* ── Per-drill complete card ── */}
        {step === "complete" && (
          <Animated.View
            style={[
              styles.celebrationWrapper,
              {
                transform: [
                  { scale: celebrationScale },
                  {
                    rotate: celebrationRotate.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: ["-3deg", "1deg", "0deg"],
                    }),
                  },
                ],
              },
            ]}
          >
            <View
              style={[
                styles.celebrationCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: isDark
                    ? "rgba(52,211,153,0.25)"
                    : "rgba(34,197,94,0.2)",
                },
              ]}
            >
              <View
                style={[
                  styles.celebrationIconCircle,
                  {
                    backgroundColor: isDark
                      ? "rgba(52,211,153,0.12)"
                      : "rgba(34,197,94,0.10)",
                  },
                ]}
              >
                <Ionicons name="trophy" size={52} color={colors.success} />
              </View>

              <Text
                style={[styles.celebrationTitle, { color: colors.text }]}
              >
                Problem Complete!
              </Text>
              <Text
                style={[
                  styles.celebrationSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                You nailed both the approach and complexity.
              </Text>

              <View style={styles.celebrationDivider}>
                <View
                  style={[
                    styles.dividerLine,
                    { backgroundColor: colors.border },
                  ]}
                />
              </View>

              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Ionicons
                    name="code-slash-outline"
                    size={18}
                    color={colors.accent}
                  />
                  <Text
                    style={[styles.summaryLabel, { color: colors.textMuted }]}
                  >
                    Approach
                  </Text>
                  <Text
                    style={[styles.summaryValue, { color: colors.text }]}
                    numberOfLines={2}
                  >
                    {drill.choices[drill.correct_option]}
                  </Text>
                </View>
                <View
                  style={[
                    styles.summaryDividerV,
                    { backgroundColor: colors.border },
                  ]}
                />
                <View style={styles.summaryItem}>
                  <Ionicons
                    name="speedometer-outline"
                    size={18}
                    color={colors.accent}
                  />
                  <Text
                    style={[styles.summaryLabel, { color: colors.textMuted }]}
                  >
                    Complexity
                  </Text>
                  <Text
                    style={[styles.summaryValue, { color: colors.text }]}
                    numberOfLines={2}
                  >
                    {drill.complexity_choices[drill.correct_complexity_option]}
                  </Text>
                </View>
              </View>

              {/* Next / Complete button */}
              <Pressable
                style={({ pressed }) => [
                  styles.nextButton,
                  {
                    backgroundColor: colors.accent,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
                onPress={
                  isLastDrill ? () => setAllComplete(true) : handleNextProblem
                }
              >
                <Text
                  style={[
                    styles.nextButtonText,
                    { color: colors.accentText },
                  ]}
                >
                  {isLastDrill ? "Complete Session!" : "Next Problem"}
                </Text>
                <Ionicons
                  name={isLastDrill ? "trophy-outline" : "arrow-forward"}
                  size={20}
                  color={colors.accentText}
                />
              </Pressable>

              {drill.explanation !== "" && (
                <ExplainButton
                  colors={colors}
                  isDark={isDark}
                  onPress={() => setShowExplainModal(true)}
                />
              )}
            </View>
          </Animated.View>
        )}
      </Animated.View>

      {drill.explanation !== "" && (
        <ExplainModal
          visible={showExplainModal}
          onClose={() => setShowExplainModal(false)}
          explanation={drill.explanation}
          prompt={drill.prompt}
          colors={colors}
          isDark={isDark}
        />
      )}
    </ScrollView>
  );
}

// ─── Sub-components (unchanged) ───────────────────────────────────────────────

interface ChoiceCardProps {
  text: string;
  index: number;
  onSelect: (i: number) => void;
  selectedIndex: number | null;
  disabledSet: Set<number>;
  correctIndex: number;
  isStepCorrect: boolean;
  colors: any;
  isDark: boolean;
}

function ChoiceCard({
  text,
  index,
  onSelect,
  selectedIndex,
  disabledSet,
  correctIndex,
  isStepCorrect,
  colors,
  isDark,
}: ChoiceCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isSelected = selectedIndex === index;
  const isDisabled = disabledSet.has(index);
  const isCorrectChoice = isStepCorrect && index === correctIndex;
  const isWrongChoice = isDisabled;
  const canPress = !isDisabled && !isStepCorrect;

  let borderColor = colors.border;
  let bgColor = colors.surface;
  let letterBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  let letterColor = colors.textMuted;

  if (isCorrectChoice) {
    borderColor = colors.success;
    bgColor = isDark ? "#0D2818" : "#E8F5E9";
    letterBg = colors.success;
    letterColor = "#fff";
  } else if (isWrongChoice) {
    borderColor = isDark ? "rgba(248,113,113,0.4)" : "rgba(239,68,68,0.3)";
    bgColor = isDark ? "rgba(248,113,113,0.06)" : "rgba(239,68,68,0.04)";
    letterBg = isDark ? "rgba(248,113,113,0.2)" : "rgba(239,68,68,0.15)";
    letterColor = colors.error;
  } else if (isSelected && !isStepCorrect) {
    borderColor = colors.accent;
    bgColor = isDark ? "rgba(13,217,196,0.06)" : "rgba(240,165,0,0.06)";
    letterBg = colors.accent;
    letterColor = colors.accentText;
  }

  const onPressIn = () => {
    if (!canPress) return;
    Animated.spring(scaleAnim, {
      toValue: 0.96,
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

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], marginBottom: 10 }}>
      <Pressable
        style={[
          styles.choice,
          { borderColor, backgroundColor: bgColor },
          isDisabled && styles.choiceDisabled,
        ]}
        onPress={() => canPress && onSelect(index)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={!canPress}
      >
        <View style={[styles.letterCircle, { backgroundColor: letterBg }]}>
          <Text style={[styles.letterText, { color: letterColor }]}>
            {LETTERS[index]}
          </Text>
        </View>
        <Text
          style={[
            styles.choiceText,
            { color: isDisabled ? colors.textMuted : colors.text },
          ]}
        >
          {text}
        </Text>
        {isCorrectChoice && (
          <Ionicons
            name="checkmark-circle"
            size={22}
            color={colors.success}
            style={styles.choiceIcon}
          />
        )}
        {isWrongChoice && (
          <Ionicons
            name="close-circle"
            size={22}
            color={colors.error}
            style={[styles.choiceIcon, { opacity: 0.6 }]}
          />
        )}
      </Pressable>
    </Animated.View>
  );
}

function ExplainButton({
  colors,
  isDark,
  onPress,
}: {
  colors: any;
  isDark: boolean;
  onPress: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        marginTop: 14,
        alignSelf: "flex-end",
      }}
    >
      <Pressable
        style={[
          explainStyles.btn,
          {
            backgroundColor: isDark
              ? "rgba(251,191,36,0.10)"
              : "rgba(251,191,36,0.12)",
            borderColor: isDark
              ? "rgba(251,191,36,0.3)"
              : "rgba(251,191,36,0.4)",
          },
        ]}
        onPress={onPress}
        onPressIn={() =>
          Animated.spring(scaleAnim, {
            toValue: 0.95,
            friction: 8,
            useNativeDriver: true,
          }).start()
        }
        onPressOut={() =>
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
          }).start()
        }
      >
        <Ionicons
          name="bulb"
          size={16}
          color={isDark ? "#FBBF24" : "#D97706"}
        />
        <Text
          style={[
            explainStyles.btnText,
            { color: isDark ? "#FBBF24" : "#D97706" },
          ]}
        >
          Explain
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function ExplainModal({
  visible,
  onClose,
  explanation,
  prompt,
  colors,
  isDark,
}: {
  visible: boolean;
  onClose: () => void;
  explanation: string;
  prompt: string;
  colors: any;
  isDark: boolean;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={[explainStyles.modal, { backgroundColor: colors.background }]}>
        <View style={explainStyles.modalHeader}>
          <Text
            style={[explainStyles.modalTitle, { color: colors.text }]}
            numberOfLines={2}
          >
            {prompt}
          </Text>
          <Pressable
            style={[explainStyles.closeBtn, { backgroundColor: colors.surface }]}
            onPress={onClose}
          >
            <Ionicons name="close" size={22} color={colors.textSecondary} />
          </Pressable>
        </View>
        <ScrollView
          style={explainStyles.modalBody}
          contentContainerStyle={explainStyles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          <ExplanationContent text={explanation} colors={colors} isDark={isDark} />
        </ScrollView>
      </View>
    </Modal>
  );
}

function ExplanationContent({
  text,
  colors,
  isDark,
}: {
  text: string;
  colors: any;
  isDark: boolean;
}) {
  const parts = text.split(/(```python\n[\s\S]*?```)/g);
  return (
    <View>
      {parts.map((part, i) => {
        if (part.startsWith("```python\n") && part.endsWith("```")) {
          const code = part
            .replace(/^```python\n/, "")
            .replace(/```$/, "")
            .trim();
          return (
            <View
              key={i}
              style={[
                explainStyles.codeBlock,
                {
                  backgroundColor: isDark
                    ? "rgba(0,0,0,0.4)"
                    : "rgba(0,0,0,0.05)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.1)",
                },
              ]}
            >
              <View style={explainStyles.codeLangTag}>
                <Text
                  style={[explainStyles.codeLangText, { color: colors.textMuted }]}
                >
                  Python
                </Text>
              </View>
              <Text
                style={[
                  explainStyles.codeText,
                  { color: isDark ? "#E2E8F0" : "#1E293B" },
                ]}
              >
                {code}
              </Text>
            </View>
          );
        }
        return <FormattedText key={i} text={part} colors={colors} />;
      })}
    </View>
  );
}

function FormattedText({ text, colors }: { text: string; colors: any }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "") {
      elements.push(<View key={`sp-${i}`} style={{ height: 8 }} />);
      continue;
    }
    const boldMatch = line.match(/^\*\*(.+?)\*\*\s*(.*)/);
    if (boldMatch) {
      elements.push(
        <Text
          key={`b-${i}`}
          style={[explainStyles.boldLine, { color: colors.text }]}
        >
          <Text style={explainStyles.boldText}>{boldMatch[1]}</Text>
          {boldMatch[2] ? ` ${boldMatch[2]}` : ""}
        </Text>
      );
      continue;
    }
    const stepMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (stepMatch) {
      elements.push(
        <View key={`s-${i}`} style={explainStyles.stepRow}>
          <Text
            style={[explainStyles.stepNumber, { color: colors.accent }]}
          >
            {stepMatch[1]}.
          </Text>
          <Text style={[explainStyles.stepText, { color: colors.text }]}>
            {stepMatch[2]}
          </Text>
        </View>
      );
      continue;
    }
    elements.push(
      <Text
        key={`t-${i}`}
        style={[explainStyles.normalText, { color: colors.text }]}
      >
        {line}
      </Text>
    );
  }
  return <>{elements}</>;
}

function ExampleIOBlock({
  exampleInput,
  exampleOutput,
  colors,
  isDark,
}: {
  exampleInput: string;
  exampleOutput: string;
  colors: {
    text: string;
    textMuted: string;
    textSecondary: string;
    border: string;
    surface: string;
  };
  isDark: boolean;
}) {
  const inText = exampleInput.trim();
  const outText = exampleOutput.trim();
  if (!inText && !outText) return null;
  const monoBg = isDark ? "rgba(0,0,0,0.28)" : "rgba(0,0,0,0.045)";
  return (
    <View
      style={[
        styles.exampleWrap,
        { borderColor: colors.border, backgroundColor: colors.surface },
      ]}
    >
      <Text
        style={[styles.exampleHeading, { color: colors.textSecondary }]}
      >
        Example
      </Text>
      {inText ? (
        <>
          <Text
            style={[styles.exampleSubLabel, { color: colors.textMuted }]}
          >
            Input
          </Text>
          <Text
            selectable
            style={[
              styles.exampleMono,
              { color: colors.text, backgroundColor: monoBg },
            ]}
          >
            {inText}
          </Text>
        </>
      ) : null}
      {outText ? (
        <>
          <Text
            style={[
              styles.exampleSubLabel,
              { color: colors.textMuted, marginTop: inText ? 10 : 0 },
            ]}
          >
            Output
          </Text>
          <Text
            selectable
            style={[
              styles.exampleMono,
              { color: colors.text, backgroundColor: monoBg },
            ]}
          >
            {outText}
          </Text>
        </>
      ) : null}
    </View>
  );
}

function HintCard({ text, isDark }: { text: string; isDark: boolean }) {
  return (
    <View
      style={[
        styles.hintCard,
        {
          backgroundColor: isDark
            ? "rgba(251,191,36,0.08)"
            : "rgba(251,191,36,0.10)",
          borderColor: isDark
            ? "rgba(251,191,36,0.25)"
            : "rgba(251,191,36,0.35)",
        },
      ]}
    >
      <Ionicons
        name="bulb"
        size={20}
        color={isDark ? "#FBBF24" : "#D97706"}
        style={styles.hintIcon}
      />
      <Text
        style={[
          styles.hintText,
          { color: isDark ? "#FDE68A" : "#92400E" },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 48 },

  // Progress bar
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  progressTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "700",
    minWidth: 36,
    textAlign: "right",
  },

  // Confetti
  confettiOrigin: {
    position: "absolute",
    top: "42%",
    left: "50%",
    width: 0,
    height: 0,
    zIndex: 99,
  },

  // All-complete screen
  allCompleteContent: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    paddingBottom: 48,
  },
  allCompleteCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 28,
    alignItems: "center",
  },
  allCompleteTrophy: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  allCompleteTitle: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 6,
    textAlign: "center",
  },
  allCompleteSubtitle: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 4,
  },
  allCompleteDivider: {
    height: 1,
    width: "100%",
    marginVertical: 22,
  },
  allCompleteBtn: {
    width: "100%",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 12,
  },
  allCompleteBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
  allCompleteOutlineBtn: {
    width: "100%",
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 12,
  },
  allCompleteOutlineBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
  allCompleteGhostBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  allCompleteGhostBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },

  // Drill content
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  categoryPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  difficultyBadge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  difficultyText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  prompt: { fontSize: 20, fontWeight: "700", lineHeight: 28, marginBottom: 14 },
  exampleWrap: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 18 },
  exampleHeading: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  exampleSubLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  exampleMono: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 13,
    lineHeight: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    overflow: "hidden",
  },
  sectionLabel: { fontSize: 13, fontWeight: "600", marginBottom: 14 },
  choice: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  choiceDisabled: { opacity: 0.5 },
  letterCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  letterText: { fontSize: 14, fontWeight: "700" },
  choiceText: { fontSize: 15, lineHeight: 21, flex: 1 },
  choiceIcon: { marginLeft: 4 },
  hintCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  hintIcon: { marginTop: 1 },
  hintText: { fontSize: 14, lineHeight: 20, flex: 1, fontWeight: "500" },
  correctBanner: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  correctBannerText: { fontSize: 16, fontWeight: "700" },
  referenceCard: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 20 },
  referenceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  referenceLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  referenceText: { fontSize: 15, fontWeight: "600", lineHeight: 21 },
  complexityHeader: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 25,
    marginBottom: 18,
  },
  celebrationWrapper: { paddingTop: 20 },
  celebrationCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 28,
    alignItems: "center",
  },
  celebrationIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  celebrationTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  celebrationSubtitle: { fontSize: 14, fontWeight: "500", textAlign: "center" },
  celebrationDivider: { width: "100%", paddingVertical: 20 },
  dividerLine: { height: 1, width: "100%" },
  summaryRow: { flexDirection: "row", width: "100%", marginBottom: 24 },
  summaryItem: { flex: 1, alignItems: "center", gap: 4, paddingHorizontal: 4 },
  summaryLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 18,
  },
  summaryDividerV: { width: 1, alignSelf: "stretch" },
  nextButton: {
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
  },
  nextButtonText: { fontSize: 17, fontWeight: "700" },
});

const explainStyles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  btnText: { fontSize: 14, fontWeight: "700" },
  modal: { flex: 1, paddingTop: Platform.OS === "ios" ? 56 : 36 },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  modalTitle: { flex: 1, fontSize: 17, fontWeight: "700", lineHeight: 24 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: { flex: 1 },
  modalContent: { paddingHorizontal: 20, paddingBottom: 40 },
  codeBlock: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginVertical: 12,
  },
  codeLangTag: { marginBottom: 8 },
  codeLangText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  codeText: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 13,
    lineHeight: 20,
  },
  boldLine: { fontSize: 16, lineHeight: 24, marginTop: 4, marginBottom: 2 },
  boldText: { fontWeight: "800" },
  stepRow: {
    flexDirection: "row",
    paddingLeft: 4,
    marginVertical: 3,
    paddingRight: 16,
  },
  stepNumber: { fontSize: 15, fontWeight: "700", width: 22, lineHeight: 22 },
  stepText: { fontSize: 15, lineHeight: 22, flex: 1 },
  normalText: { fontSize: 15, lineHeight: 22 },
});
