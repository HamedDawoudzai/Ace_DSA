import type { LearnDetailSection } from "../../learnSectionTypes";

export const whereRecursionOptimal: LearnDetailSection = {
  title: "Where recursion would be optimal",
  body:
    "Running example (compute the n-th Fibonacci number):\n\n" +
    "The Fibonacci sequence is defined as F(0) = 0, F(1) = 1, and F(n) = F(n−1) + F(n−2). " +
    "Find F(n) for a given n.\n\n" +
    "Examples:\n" +
    "• F(0) = 0, F(1) = 1, F(2) = 1, F(3) = 2, F(4) = 3, F(5) = 5, F(6) = 8.\n" +
    "• F(10) = 55.\n\n" +
    "Why recursion fits: the problem is defined in terms of itself—F(n) literally depends on F(n−1) and F(n−2). " +
    "Recursion lets you express that definition directly in code. " +
    "The key skills are: identifying the base case (when to stop) and the recursive case (what smaller sub-problem to hand off).",
};
