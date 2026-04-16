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

/** Native: monospace block with strong text contrast (not muted grey). */
export default function LearnCodeBlock({ code, language = "python" }: Props) {
  const { colors, isDark } = useTheme();
  const trimmed = compactCodeBlock(code);

  const panelBg = isDark ? "#0D0D0D" : "#FFFFFF";
  const borderCol = isDark ? colors.accent : colors.border;

  return (
    <View
      style={[
        styles.wrapNative,
        {
          borderColor: borderCol,
          backgroundColor: panelBg,
        },
      ]}
    >
      <View
        style={[
          styles.langRow,
          {
            borderBottomColor: isDark ? "#1E1E1E" : colors.border,
            backgroundColor: isDark ? "#141414" : colors.accentSubtle,
          },
        ]}
      >
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
          style={[styles.nativeCode, { color: colors.text }]}
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
    marginTop: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth + 0.5,
    overflow: "hidden",
    maxHeight: 440,
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 12,
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
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  nativeCode: {
    fontFamily: Platform.select({
      ios: "Menlo",
      android: "monospace",
      default: "monospace",
    }),
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.15,
  },
});
