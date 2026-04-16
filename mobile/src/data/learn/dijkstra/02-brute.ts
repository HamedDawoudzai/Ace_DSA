import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const dijkstraBruteSection: LearnDetailSection = {
  title: "Brute force: try all paths",
  body:
    VISUAL_ANCHOR +
    "Enumerate every path from source to destination using DFS, tracking the running cost. " +
    "Keep the minimum cost seen across all complete paths.\n\n" +
    "In the worst case (a fully connected graph with n nodes), there are O(n!) possible paths. " +
    "For 20 cities that is over two quintillion paths—completely infeasible.\n\n" +
    "Without exploiting the structure of costs, you cannot avoid exploring dead-end paths that are already more expensive than the current best.",
  codeLanguage: "python",
  code: `def cheapest_path_brute(
    graph: dict[str, list[tuple[str, int]]],
    src: str,
    dst: str
) -> int:
    """O(n!) worst case — tries all paths via DFS."""
    best = [float("inf")]

    def dfs(node: str, cost: int, visited: set[str]) -> None:
        if node == dst:
            best[0] = min(best[0], cost)
            return
        for neighbour, weight in graph.get(node, []):
            if neighbour not in visited:
                visited.add(neighbour)
                dfs(neighbour, cost + weight, visited)
                visited.remove(neighbour)

    dfs(src, 0, {src})
    return int(best[0]) if best[0] != float("inf") else -1
`,
};
