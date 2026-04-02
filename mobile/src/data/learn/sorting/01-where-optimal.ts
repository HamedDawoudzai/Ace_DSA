import type { LearnDetailSection } from "../../learnSectionTypes";

export const whereSortingOptimal: LearnDetailSection = {
  title: "Where sorting would be optimal",
  body:
    "Running example (detect if any two meetings overlap):\n\n" +
    "You are given a list of meetings, each as [start, end]. " +
    "Return true if any two meetings overlap (i.e. a room would be double-booked).\n\n" +
    "Examples:\n" +
    "• [[0,30],[5,10],[15,20]] → true  (meeting 0 overlaps meeting 1).\n" +
    "• [[7,10],[2,4]] → false  (4 ≤ 7, so they are back-to-back but not overlapping).\n\n" +
    "Why sorting fits: if you sort meetings by start time, the only candidate for overlap is each meeting and the one directly before it. " +
    "Without sorting you must compare every pair—O(n²). " +
    "With sorting that one upfront O(n log n) pass lets a single O(n) sweep do the rest.",
};
