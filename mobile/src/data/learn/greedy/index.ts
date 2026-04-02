import { whereGreedyOptimal } from "./01-where-optimal";
import { greedyBruteSection } from "./02-brute";
import { greedyOptimizedSection } from "./03-optimized";
import { greedyPracticeSection } from "./04-practice";
import type { LearnDetailSection } from "../../learnSectionTypes";

export const GREEDY_SECTIONS: LearnDetailSection[] = [
  whereGreedyOptimal,
  greedyBruteSection,
  greedyOptimizedSection,
  greedyPracticeSection,
];
