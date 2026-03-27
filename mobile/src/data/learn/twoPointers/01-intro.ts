import type { LearnDetailSection } from "../../learnSectionTypes";

/** Introduction, when to use, and table of contents for this guide. */
export const twoPointersIntro: LearnDetailSection = {
  title: "Two pointers technique",
  body:
    "The two-pointers technique uses two indices that move through an array, list, or string—either toward each other or in the same direction—to avoid brute-force nested loops and often reach O(n) time with O(1) extra space.\n\n" +
    "It shows up everywhere: two sum in a sorted array, 3Sum-style problems, trapping rain water, palindrome checks, and (with slow/fast) linked list cycle detection.\n\n" +
    "When to reach for it:\n" +
    "• Sorted (or sortable) data — shrink the search space with left/right.\n" +
    "• Pairs, subarrays, or ranges — two boundaries instead of one index.\n" +
    "• Sliding window — related idea: two edges of a window.\n" +
    "• Linked lists — slow and fast pointers for middle/cycle problems.\n\n" +
    "This guide walks through: (1) a naive O(n²) pair search, (2) the O(n) two-pointer approach on sorted data, (3) why it is correct, and (4) more practice topics.",
};
