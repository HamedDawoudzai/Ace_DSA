import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const whereSlidingWindowOptimal: LearnDetailSection = {
  title: "Where sliding window would be optimal",
  body:
    "In the sliding-window diagram at the top, only k consecutive cells are highlighted—that moving band is the window we shift one step at a time, adding the new right cell and subtracting the old left cell.\n\n" +
    VISUAL_ANCHOR +
    "Running example (maximum sum of any k consecutive elements):\n\n" +
    "You are given an integer array and a fixed window size k. " +
    "Find the maximum sum of any contiguous subarray of length exactly k.\n\n" +
    "Examples:\n" +
    "• [2, 1, 5, 1, 3, 2], k = 3 → 9  (subarray [5, 1, 3]).\n" +
    "• [1, 8, 30, -5, 20, 7], k = 3 → 45  (subarray [8, 30, -5]? No: [30, -5, 20] = 45).\n" +
    "• [4, 2, 1, 7, 8, 1, 2, 8, 1, 0], k = 3 → 16  (subarray [7, 8, 1]).\n\n" +
    "Why a window fits: you do not need to re-sum the entire subarray each time you move. " +
    "If you slide right by one position, you only need to add the new right element and drop the old left element—constant work per step.",
};
