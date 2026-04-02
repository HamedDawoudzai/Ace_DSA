import type { LearnDetailSection } from "../../learnSectionTypes";

export const whereDp2dOptimal: LearnDetailSection = {
  title: "Where 2D DP would be optimal",
  body:
    "Running example (Longest Common Subsequence):\n\n" +
    "Given two strings s and t, find the length of their longest common subsequence (LCS)—the longest sequence of characters that appears in both strings in the same relative order (not necessarily contiguous).\n\n" +
    "Examples:\n" +
    "• s = \"abcde\", t = \"ace\" → 3  (\"ace\" is in both).\n" +
    "• s = \"abc\", t = \"abc\" → 3  (whole string is common).\n" +
    "• s = \"abc\", t = \"def\" → 0  (nothing in common).\n\n" +
    "Why 2D DP fits: the LCS of s[0..i] and t[0..j] depends on the LCS of smaller prefixes. " +
    "There are O(m × n) unique pairs of prefixes, and each depends on at most three previously computed values. " +
    "A 2D table fills all of them exactly once.",
};
