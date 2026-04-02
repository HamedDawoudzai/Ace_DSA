import { whereDijkstraOptimal } from "./01-where-optimal";
import { dijkstraBruteSection } from "./02-brute";
import { dijkstraOptimizedSection } from "./03-optimized";
import { dijkstraPracticeSection } from "./04-practice";
import type { LearnDetailSection } from "../../learnSectionTypes";

export const DIJKSTRA_SECTIONS: LearnDetailSection[] = [
  whereDijkstraOptimal,
  dijkstraBruteSection,
  dijkstraOptimizedSection,
  dijkstraPracticeSection,
];
