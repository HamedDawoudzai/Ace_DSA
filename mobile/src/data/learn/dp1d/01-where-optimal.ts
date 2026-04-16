import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const whereDp1dOptimal: LearnDetailSection = {
  title: "Where 1D DP would be optimal",
  body:
    "The staircase figure above is one index of state per step—exactly the 1D DP idea: dp[i] only looks at dp[i−1] and dp[i−2].\n\n" +
    VISUAL_ANCHOR +
    "Running example (climbing stairs):\n\n" +
    "You are climbing a staircase with n steps. Each time you can climb either 1 or 2 steps. " +
    "In how many distinct ways can you reach the top?\n\n" +
    "Examples:\n" +
    "• n = 2 → 2  (1+1 or 2).\n" +
    "• n = 3 → 3  (1+1+1, 1+2, or 2+1).\n" +
    "• n = 5 → 8.\n\n" +
    "Why DP fits: the number of ways to reach step n depends only on steps n−1 and n−2 (from where you can take a 1-step or 2-step). " +
    "Naive recursion recomputes these sub-problems repeatedly. " +
    "DP stores each answer once, so the total work is linear—O(n)—instead of exponential.",
};
