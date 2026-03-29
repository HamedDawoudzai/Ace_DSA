import { whereDp2dOptimal } from "./01-where-optimal";
import { dp2dBruteSection } from "./02-brute";
import { dp2dOptimizedSection } from "./03-optimized";
import { dp2dPracticeSection } from "./04-practice";
import type { LearnDetailSection } from "../../learnSectionTypes";

export const DP_2D_SECTIONS: LearnDetailSection[] = [
  whereDp2dOptimal,
  dp2dBruteSection,
  dp2dOptimizedSection,
  dp2dPracticeSection,
];
