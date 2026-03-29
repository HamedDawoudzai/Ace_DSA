import type { LearnDetailSection } from "../../learnSectionTypes";

export const whereDijkstraOptimal: LearnDetailSection = {
  title: "Where Dijkstra's would be optimal",
  body:
    "Running example (cheapest flight cost between cities):\n\n" +
    "You are given a weighted directed graph where nodes are cities and edge weights are flight costs. " +
    "Find the minimum cost to travel from a source city to a destination city. " +
    "All edge weights are non-negative.\n\n" +
    "Examples:\n" +
    "• Graph: A→B=4, A→C=1, C→B=2, B→D=3, C→D=5. Source=A, Destination=D.\n" +
    "  Cheapest path: A→C→B→D = 1+2+3 = 6.\n\n" +
    "Why Dijkstra's fits: it processes nodes in order of their current best-known cost. " +
    "Each time a node is popped from the priority queue, you are guaranteed its cost is final. " +
    "That guarantee holds as long as all weights are non-negative (negative edges require Bellman-Ford instead).",
};
