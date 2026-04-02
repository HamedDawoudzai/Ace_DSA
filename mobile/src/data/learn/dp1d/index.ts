import { whereDp1dOptimal } from "./01-where-optimal";
import { dp1dBruteSection } from "./02-brute";
import { dp1dOptimizedSection } from "./03-optimized";
import { dp1dPracticeSection } from "./04-practice";
import type { LearnDetailSection } from "../../learnSectionTypes";

export const DP_1D_SECTIONS: LearnDetailSection[] = [
  whereDp1dOptimal,
  dp1dBruteSection,
  dp1dOptimizedSection,
  dp1dPracticeSection,
];
