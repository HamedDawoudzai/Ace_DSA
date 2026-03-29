import type { LearnDetailSection } from "../../learnSectionTypes";
import { whereTwoPointersOptimal } from "./01-where-optimal";
import { bruteForceSection } from "./02-brute";
import { twoPointerOptimizedSection } from "./03-optimized";
import { practiceSection } from "./04-practice";

/** Ordered sections: problem → brute force → two-pointer optimization → practice. */
export const TWO_POINTERS_SECTIONS: LearnDetailSection[] = [
  whereTwoPointersOptimal,
  bruteForceSection,
  twoPointerOptimizedSection,
  practiceSection,
];
