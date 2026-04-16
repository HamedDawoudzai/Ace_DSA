import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const whereBacktrackingOptimal: LearnDetailSection = {
  title: "Where backtracking would be optimal",
  body:
    "The include/skip tree above draws every subset choice; walking every path is exactly the brute-force space backtracking will prune intelligently later.\n\n" +
    VISUAL_ANCHOR +
    "Running example (generate all subsets of a set):\n\n" +
    "Given an integer array with distinct values, return all possible subsets (the power set).\n\n" +
    "Examples:\n" +
    "• [1, 2, 3] → [[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]  (8 subsets = 2³).\n" +
    "• [0] → [[], [0]]  (2 subsets).\n\n" +
    "Why backtracking fits: at each element you make a binary choice—include it or skip it. " +
    "These choices form a tree. Backtracking walks the tree depth-first, building the subset as it descends, " +
    "and 'undoes' the last choice when it returns up. " +
    "Many problems need exhaustive search over valid combinations—backtracking gives you a clean, prunable template for all of them.",
};
