import { whereBinarySearchOptimal } from "./01-where-optimal";
import { binarySearchBruteSection } from "./02-brute";
import { binarySearchOptimizedSection } from "./03-optimized";
import { binarySearchPracticeSection } from "./04-practice";
import type { LearnDetailSection } from "../../learnSectionTypes";

export const BINARY_SEARCH_SECTIONS: LearnDetailSection[] = [
  whereBinarySearchOptimal,
  binarySearchBruteSection,
  binarySearchOptimizedSection,
  binarySearchPracticeSection,
];
