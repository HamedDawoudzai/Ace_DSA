import type { LearnDetailSection } from "../../learnSectionTypes";

export const whereBinarySearchOptimal: LearnDetailSection = {
  title: "Where binary search would be optimal",
  body:
    "Running example (find a target value in a sorted array):\n\n" +
    "You are given an integer array sorted in ascending order and a target T. " +
    "Return the index of T, or -1 if it does not exist.\n\n" +
    "Examples:\n" +
    "• [1, 3, 5, 7, 9, 11], T = 7 → index 3.\n" +
    "• [2, 4, 6, 8, 10], T = 5 → -1.\n" +
    "• [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], T = 1 → index 0.\n\n" +
    "Why binary search fits: the array is sorted, so the middle element tells you exactly which half the target can be in. " +
    "After one comparison you throw away half the remaining candidates—cutting the problem in half every step until you find it or exhaust the search space.",
};
