import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import api from "../services/api";
import { AttemptRequest, AttemptResponse } from "../types";
import { MainStackParamList } from "../navigation/MainTabs";
import { useTheme } from "../context/ThemeContext";

export default function DrillDetailScreen() {
  const route = useRoute<RouteProp<MainStackParamList, "DrillDetail">>();
  const { drill } = route.params;
  const { colors, isDark } = useTheme();

  const [selected, setSelected] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AttemptResponse | null>(null);

  const handleSubmit = async () => {
    if (selected === null) {
      Alert.alert("Select an answer", "Please choose one of the options.");
      return;
    }

    setSubmitting(true);
    try {
      const body: AttemptRequest = {
        drill_id: drill.id,
        chosen_option: selected,
      };
      const { data } = await api.post<AttemptResponse>("/attempts", body);
      setResult(data);
    } catch (err: any) {
      const msg =
        err?.response?.data || err?.message || "Failed to submit attempt.";
      Alert.alert("Error", typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelected(null);
    setResult(null);
  };

  const getChoiceStyle = (index: number) => {
    const isSelected = selected === index;
    const showResult = result !== null;
    const isCorrectChoice = index === drill.correct_option;

    if (showResult && isCorrectChoice) {
      return {
        borderColor: colors.success,
        backgroundColor: isDark ? "#0D2818" : "#E8F5E9",
      };
    }
    if (showResult && isSelected && !result.is_correct) {
      return {
        borderColor: colors.error,
        backgroundColor: isDark ? "#2D0A0A" : "#FFEBEE",
      };
    }
    if (isSelected) {
      return {
        borderColor: colors.accent,
        backgroundColor: isDark ? "#1A2A2A" : "#FFF9E0",
      };
    }
    return {
      borderColor: "transparent",
      backgroundColor: colors.surface,
    };
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.category, { color: colors.accent }]}>
        {drill.pattern_category}
      </Text>
      <Text style={[styles.prompt, { color: colors.text }]}>
        {drill.prompt}
      </Text>

      {drill.choices.map((choice, index) => {
        const dynamicStyle = getChoiceStyle(index);
        const letter = String.fromCharCode(65 + index);
        const isSelected = selected === index;
        const isCorrectChoice = result !== null && index === drill.correct_option;
        const isWrongChoice = result !== null && isSelected && !result.is_correct;

        return (
          <TouchableOpacity
            key={index}
            style={[styles.choice, dynamicStyle]}
            onPress={() => !result && setSelected(index)}
            activeOpacity={result ? 1 : 0.7}
            disabled={result !== null}
          >
            <View
              style={[
                styles.letterCircle,
                {
                  backgroundColor: isCorrectChoice
                    ? colors.success
                    : isWrongChoice
                    ? colors.error
                    : isSelected
                    ? colors.accent
                    : isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.07)",
                },
              ]}
            >
              <Text
                style={[
                  styles.letterText,
                  {
                    color:
                      isCorrectChoice || isWrongChoice
                        ? "#fff"
                        : isSelected
                        ? colors.accentText
                        : colors.textMuted,
                  },
                ]}
              >
                {letter}
              </Text>
            </View>
            <Text style={[styles.choiceText, { color: colors.text, flex: 1 }]}>
              {choice}
            </Text>
          </TouchableOpacity>
        );
      })}

      {result ? (
        <View
          style={[
            styles.resultCard,
            {
              backgroundColor: result.is_correct
                ? isDark
                  ? "rgba(34,197,94,0.12)"
                  : "rgba(76,175,80,0.1)"
                : isDark
                ? "rgba(239,68,68,0.12)"
                : "rgba(244,67,54,0.08)",
              borderColor: result.is_correct ? colors.success : colors.error,
            },
          ]}
        >
          <Ionicons
            name={result.is_correct ? "checkmark-circle" : "close-circle"}
            size={36}
            color={result.is_correct ? colors.success : colors.error}
          />
          <Text
            style={[
              styles.resultText,
              { color: result.is_correct ? colors.success : colors.error },
            ]}
          >
            {result.is_correct ? "Correct!" : "Incorrect"}
          </Text>
          <TouchableOpacity
            style={[styles.resetBtn, { backgroundColor: colors.accent }]}
            onPress={handleReset}
          >
            <Text style={[styles.resetText, { color: colors.accentText }]}>
              Try Another
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.submitBtn,
            { backgroundColor: colors.accent },
            selected === null && styles.submitDisabled,
          ]}
          onPress={handleSubmit}
          disabled={submitting || selected === null}
        >
          {submitting ? (
            <ActivityIndicator color={colors.accentText} />
          ) : (
            <Text style={[styles.submitText, { color: colors.accentText }]}>
              Submit
            </Text>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  category: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  prompt: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 24,
    lineHeight: 28,
  },
  choice: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  letterCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  letterText: {
    fontSize: 14,
    fontWeight: "700",
  },
  choiceText: {
    fontSize: 16,
    lineHeight: 22,
  },
  submitBtn: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    fontSize: 17,
    fontWeight: "700",
  },
  resultCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 24,
    alignItems: "center",
    marginTop: 16,
    gap: 12,
  },
  resultText: {
    fontSize: 22,
    fontWeight: "800",
  },
  resetBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 4,
  },
  resetText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
