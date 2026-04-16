import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const whereDfsOptimal: LearnDetailSection = {
  title: "Where DFS would be optimal",
  body:
    "The grid above mixes land (`1`) and water (`0`); one DFS flood from any land tile paints an entire island, which is why the outer loop only counts a new island when it finds an unseen `1`.\n\n" +
    VISUAL_ANCHOR +
    "Running example (count islands in a grid):\n\n" +
    "You are given a 2D grid of '1's (land) and '0's (water). " +
    "An island is a group of adjacent land cells connected horizontally or vertically. " +
    "Count the total number of islands.\n\n" +
    "Examples:\n" +
    "• [[1,1,0],[0,1,0],[0,0,1]] → 2  (one large island on the left, one single cell on the right).\n" +
    "• [[1,0,0],[0,1,0],[0,0,1]] → 3  (three isolated cells).\n\n" +
    "Why DFS fits: once you find a land cell, you want to mark its entire connected region as visited before moving on. " +
    "DFS plunges as deep as possible in one direction before backtracking—perfect for exhaustively tracing a connected component. " +
    "BFS would also work here, but DFS keeps the code shorter (recursion vs. explicit queue).",
};
