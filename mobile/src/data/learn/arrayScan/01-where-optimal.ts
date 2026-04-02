import type { LearnDetailSection } from "../../learnSectionTypes";

export const whereArrayScanOptimal: LearnDetailSection = {
  title: "Where array scanning would be optimal",
  body:
    "Running example (range sum queries on a static array):\n\n" +
    "You are given an integer array and Q queries. Each query asks: what is the sum of elements between index L and R (inclusive)?\n\n" +
    "Examples:\n" +
    "• arr = [3, 1, 4, 1, 5, 9], query (1, 4) → 1 + 4 + 1 + 5 = 11.\n" +
    "• arr = [2, 7, 1, 8, 2], query (0, 2) → 2 + 7 + 1 = 10.\n\n" +
    "Why a single scan fits: if you walk the array once and store a running total at every position, " +
    "any range sum becomes a simple subtraction later. " +
    "That one upfront pass—O(n)—turns every query from O(n) down to O(1).",
};
