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
import { RouteProp, useRoute } from "@react-navigation/native";
import api from "../services/api";
import { AttemptRequest, AttemptResponse, Drill } from "../types";
import { MainStackParamList } from "../navigation/MainTabs";

export default function DrillDetailScreen() {
  const route = useRoute<RouteProp<MainStackParamList, "DrillDetail">>();
  const { drill } = route.params;

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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.category}>{drill.pattern_category}</Text>
      <Text style={styles.prompt}>{drill.prompt}</Text>

      {drill.choices.map((choice, index) => {
        const isSelected = selected === index;
        const showResult = result !== null;
        const isCorrectChoice = index === drill.correct_option;

        let choiceStyle = styles.choice;
        if (showResult && isCorrectChoice) {
          choiceStyle = { ...styles.choice, ...styles.choiceCorrect };
        } else if (showResult && isSelected && !result.is_correct) {
          choiceStyle = { ...styles.choice, ...styles.choiceWrong };
        } else if (isSelected) {
          choiceStyle = { ...styles.choice, ...styles.choiceSelected };
        }

        return (
          <TouchableOpacity
            key={index}
            style={choiceStyle}
            onPress={() => !result && setSelected(index)}
            activeOpacity={result ? 1 : 0.7}
            disabled={result !== null}
          >
            <Text style={styles.choiceText}>{choice}</Text>
          </TouchableOpacity>
        );
      })}

      {result ? (
        <View style={styles.resultContainer}>
          <Text
            style={[
              styles.resultText,
              result.is_correct ? styles.correctText : styles.wrongText,
            ]}
          >
            {result.is_correct ? "Correct!" : "Incorrect"}
          </Text>
          <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
            <Text style={styles.resetText}>Try Another</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.submitBtn, selected === null && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={submitting || selected === null}
        >
          {submitting ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.submitText}>Submit</Text>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E1DAC9",
  },
  content: {
    padding: 20,
  },
  category: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F5C842",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  prompt: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 24,
    lineHeight: 28,
  },
  choice: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  choiceSelected: {
    borderColor: "#F5C842",
    backgroundColor: "#FFF9E0",
  },
  choiceCorrect: {
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  choiceWrong: {
    borderColor: "#F44336",
    backgroundColor: "#FFEBEE",
  },
  choiceText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  submitBtn: {
    backgroundColor: "#F5C842",
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
    color: "#000",
  },
  resultContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  resultText: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
  },
  correctText: {
    color: "#4CAF50",
  },
  wrongText: {
    color: "#F44336",
  },
  resetBtn: {
    backgroundColor: "#F5C842",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  resetText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
});
