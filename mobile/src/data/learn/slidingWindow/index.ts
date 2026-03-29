import { whereSlidingWindowOptimal } from "./01-where-optimal";
import { slidingWindowBruteSection } from "./02-brute";
import { slidingWindowOptimizedSection } from "./03-optimized";
import { slidingWindowPracticeSection } from "./04-practice";
import type { LearnDetailSection } from "../../learnSectionTypes";

export const SLIDING_WINDOW_SECTIONS: LearnDetailSection[] = [
  whereSlidingWindowOptimal,
  slidingWindowBruteSection,
  slidingWindowOptimizedSection,
  slidingWindowPracticeSection,
];
