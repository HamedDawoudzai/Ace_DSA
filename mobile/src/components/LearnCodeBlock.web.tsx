import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../context/ThemeContext";
import { compactCodeBlock } from "../utils/compactCodeBlock";

type Props = {
  code: string;
  language?: string;
};

/**
 * Web: syntax highlighting with a high-contrast panel (not washed-out grey).
 */
export default function LearnCodeBlock({ code, language = "python" }: Props) {
  const { colors, isDark } = useTheme();
  const compact = compactCodeBlock(code);
  const hl = isDark ? oneDark : oneLight;

  const outerBorder = isDark ? colors.accent : colors.border;
  const codeBg = isDark ? "#0D1117" : "#FFFFFF";

  return (
    <div
      style={{
        marginTop: 14,
        borderRadius: 12,
        border: `1.5px solid ${outerBorder}`,
        overflow: "hidden",
        backgroundColor: isDark ? "#0A0A0A" : colors.surface,
        display: "block",
        width: "100%",
        boxShadow: isDark
          ? "0 0 0 1px rgba(13,217,196,0.12)"
          : "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          padding: "8px 12px",
          backgroundColor: isDark ? "#141414" : colors.accentSubtle,
          display: "block",
          borderBottom: `1px solid ${isDark ? "#222" : colors.border}`,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 1,
            color: colors.accent,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {language.toUpperCase()}
        </span>
      </div>
      <SyntaxHighlighter
        language={language}
        style={hl}
        PreTag="pre"
        CodeTag="code"
        wrapLines={false}
        wrapLongLines={false}
        customStyle={{
          margin: 0,
          padding: "14px 16px",
          borderRadius: 0,
          background: codeBg,
          fontSize: 13,
          lineHeight: 1.55,
          whiteSpace: "pre",
          display: "block",
          fontFamily:
            'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
        }}
        codeTagProps={{
          style: {
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
            lineHeight: 1.55,
          },
        }}
      >
        {compact}
      </SyntaxHighlighter>
    </div>
  );
}
