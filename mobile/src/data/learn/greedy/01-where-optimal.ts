import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const whereGreedyOptimal: LearnDetailSection = {
  title: "Where greedy would be optimal",
  body:
    "The calendar strip above stacks meetings; greedy repeatedly picks the meeting that ends soonest so your resource frees up as fast as possible for the next compatible pick.\n\n" +
    VISUAL_ANCHOR +
    "Running example (activity selection — maximum non-overlapping meetings):\n\n" +
    "You are given a list of meetings, each as [start, end]. " +
    "Select the maximum number of meetings that can be attended without any two overlapping.\n\n" +
    "Examples:\n" +
    "• [[1,4],[3,5],[0,6],[5,7],[8,9],[5,9],[6,10]] → 4  (meetings [1,4],[5,7],[8,9] plus one more).\n" +
    "• [[1,2],[1,2],[1,2]] → 1  (all overlap, pick any one).\n\n" +
    "Why greedy fits: if you always pick the meeting that ends earliest among those that do not conflict with what you have already scheduled, you leave the maximum room for future meetings. " +
    "A locally optimal choice (earliest end) leads to a globally optimal count—this is provably correct for interval scheduling.",
};
