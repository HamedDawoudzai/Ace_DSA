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
 * Web: syntax highlighting in a plain `div` wrapper (not RN View) so the
 * browser lays out `<pre>` as normal text, not flex-spaced rows.
 */
export default function LearnCodeBlock({ code, language = "python" }: Props) {
  const { colors, isDark } = useTheme();
  const compact = compactCodeBlock(code);
  const hl = isDark ? oneDark : oneLight;

  return (
    <div
      style={{
        marginTop: 12,
        borderRadius: 14,
        border: `1px solid ${colors.accentMedium}`,
        overflow: "hidden",
        backgroundColor: colors.surfaceAlt,
        display: "block",
        width: "100%",
      }}
    >
      <div
        style={{
          padding: "6px 10px",
          backgroundColor: colors.accentSubtle,
          display: "inline-block",
          borderBottomRightRadius: 10,
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
          padding: "12px 14px",
          borderRadius: 0,
          background: isDark ? "#0E1827" : "#F2F0EB",
          fontSize: 12,
          lineHeight: 1.45,
          whiteSpace: "pre",
          display: "block",
          fontFamily:
            'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
        }}
        codeTagProps={{
          style: {
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
            lineHeight: 1.45,
          },
        }}
      >
        {compact}
      </SyntaxHighlighter>
    </div>
  );
}
