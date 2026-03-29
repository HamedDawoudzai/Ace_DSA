import { whereBacktrackingOptimal } from "./01-where-optimal";
import { backtrackingBruteSection } from "./02-brute";
import { backtrackingOptimizedSection } from "./03-optimized";
import { backtrackingPracticeSection } from "./04-practice";
import type { LearnDetailSection } from "../../learnSectionTypes";

export const BACKTRACKING_SECTIONS: LearnDetailSection[] = [
  whereBacktrackingOptimal,
  backtrackingBruteSection,
  backtrackingOptimizedSection,
  backtrackingPracticeSection,
];
