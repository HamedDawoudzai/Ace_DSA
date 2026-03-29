import { whereRecursionOptimal } from "./01-where-optimal";
import { recursionBruteSection } from "./02-brute";
import { recursionOptimizedSection } from "./03-optimized";
import { recursionPracticeSection } from "./04-practice";
import type { LearnDetailSection } from "../../learnSectionTypes";

export const RECURSION_SECTIONS: LearnDetailSection[] = [
  whereRecursionOptimal,
  recursionBruteSection,
  recursionOptimizedSection,
  recursionPracticeSection,
];
