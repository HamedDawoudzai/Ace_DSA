import { whereSortingOptimal } from "./01-where-optimal";
import { sortingBruteSection } from "./02-brute";
import { sortingOptimizedSection } from "./03-optimized";
import { sortingPracticeSection } from "./04-practice";
import type { LearnDetailSection } from "../../learnSectionTypes";

export const SORTING_SECTIONS: LearnDetailSection[] = [
  whereSortingOptimal,
  sortingBruteSection,
  sortingOptimizedSection,
  sortingPracticeSection,
];
