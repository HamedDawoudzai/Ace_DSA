import { whereBfsOptimal } from "./01-where-optimal";
import { bfsBruteSection } from "./02-brute";
import { bfsOptimizedSection } from "./03-optimized";
import { bfsPracticeSection } from "./04-practice";
import type { LearnDetailSection } from "../../learnSectionTypes";

export const BFS_SECTIONS: LearnDetailSection[] = [
  whereBfsOptimal,
  bfsBruteSection,
  bfsOptimizedSection,
  bfsPracticeSection,
];
