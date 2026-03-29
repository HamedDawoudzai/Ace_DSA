import type { LearnDetailSection } from "../../learnSectionTypes";

/** Problem statement + when two pointers are the right tool. */
export const whereTwoPointersOptimal: LearnDetailSection = {
  title: "Where two pointers would be optimal",
  body:
    "Running example (pair sum on a sorted array):\n\n" +
    "You are given an integer array sorted in non-decreasing order and a target T. " +
    "Return whether there exist two different indices i and j such that arr[i] + arr[j] == T.\n\n" +
    "Examples:\n" +
    "• [10, 20, 35, 50] with T = 70 → true (20 + 50).\n" +
    "• [10, 20, 30] with T = 70 → false.\n" +
    "• [-8, 1, 4, 6, 10, 45] with T = 16 → true (6 + 10).\n\n" +
    "Why two pointers fit: once the data is sorted, the smallest usable values sit on the left and the largest on the right. " +
    "You can start one pointer at each end and move inward based on whether the current sum is too small or too large—without scanning every pair. " +
    "That ordering is what makes the O(n) two-pointer sweep safe; unsorted data usually needs a hash set or sort first.",
};
