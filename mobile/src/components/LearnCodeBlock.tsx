import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { compactCodeBlock } from "../utils/compactCodeBlock";

type Props = {
  code: string;
  language?: string;
};

/** Native / fallback: monospace block with accent rail (matches app chrome). */
export default function LearnCodeBlock({ code, language = "python" }: Props) {
  const { colors } = useTheme();
  const trimmed = compactCodeBlock(code);

  return (
    <View
      style={[
        styles.wrapNative,
        {
          borderColor: colors.border,
          backgroundColor: colors.surfaceAlt,
        },
      ]}
    >
      <View style={[styles.langRow, { borderBottomColor: colors.border }]}>
        <View style={[styles.accentRail, { backgroundColor: colors.accent }]} />
        <Text style={[styles.langTextNative, { color: colors.accent }]}>
          {language.toUpperCase()}
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={styles.nativeScrollContent}
      >
        <Text
          style={[styles.nativeCode, { color: colors.textSecondary }]}
          selectable
        >
          {trimmed}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapNative: {
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    maxHeight: 420,
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 8,
  },
  accentRail: {
    width: 3,
    alignSelf: "stretch",
    borderRadius: 2,
  },
  langTextNative: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  nativeScrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  nativeCode: {
    fontFamily: Platform.select({
      ios: "Menlo",
      android: "monospace",
      default: "monospace",
    }),
    fontSize: 12,
    lineHeight: 17,
  },
});
