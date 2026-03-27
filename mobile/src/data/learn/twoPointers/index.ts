import type { LearnDetailSection } from "../../learnSectionTypes";
import { twoPointersIntro } from "./01-intro";
import { twoPointersNaive } from "./02-naive";
import { twoPointersOpposing } from "./03-opposingPointers";

/** Ordered sections for the Two Pointers algorithm topic in Learn. */
export const TWO_POINTERS_SECTIONS: LearnDetailSection[] = [
  twoPointersIntro,
  twoPointersNaive,
  twoPointersOpposing,
];
