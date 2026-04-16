import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const whereBfsOptimal: LearnDetailSection = {
  title: "Where BFS would be optimal",
  body:
    "In the graph at the top, read node numbers as BFS discovery order: every vertex one edge from the start is labeled before any vertex two edges away—those layers are shortest hops in an unweighted world.\n\n" +
    VISUAL_ANCHOR +
    "Running example (shortest path in a binary grid):\n\n" +
    "You are given an n × m grid where 0 = open cell and 1 = blocked wall. " +
    "Find the length of the shortest path from the top-left corner (0, 0) to the bottom-right corner (n−1, m−1). " +
    "You may move in all four directions (up, down, left, right). Return -1 if no path exists.\n\n" +
    "Examples:\n" +
    "• [[0,0,0],[1,1,0],[1,1,0]] → 4  (right, right, down, down, but the direct path works).\n" +
    "• [[0,1],[1,0]] → -1  (completely blocked).\n\n" +
    "Why BFS fits: BFS explores cells layer by layer—first all cells at distance 1, then distance 2, and so on. " +
    "The first time you reach the destination is guaranteed to be the shortest path. " +
    "DFS does not give this guarantee—it might find a long path first.",
};
