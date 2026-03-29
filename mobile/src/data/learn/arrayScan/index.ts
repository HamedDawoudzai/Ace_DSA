import { whereArrayScanOptimal } from "./01-where-optimal";
import { arrayScanBruteSection } from "./02-brute";
import { arrayScanOptimizedSection } from "./03-optimized";
import { arrayScanPracticeSection } from "./04-practice";
import type { LearnDetailSection } from "../../learnSectionTypes";

export const ARRAY_SCAN_SECTIONS: LearnDetailSection[] = [
  whereArrayScanOptimal,
  arrayScanBruteSection,
  arrayScanOptimizedSection,
  arrayScanPracticeSection,
];
