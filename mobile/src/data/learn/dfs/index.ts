import { whereDfsOptimal } from "./01-where-optimal";
import { dfsBruteSection } from "./02-brute";
import { dfsOptimizedSection } from "./03-optimized";
import { dfsPracticeSection } from "./04-practice";
import type { LearnDetailSection } from "../../learnSectionTypes";

export const DFS_SECTIONS: LearnDetailSection[] = [
  whereDfsOptimal,
  dfsBruteSection,
  dfsOptimizedSection,
  dfsPracticeSection,
];
