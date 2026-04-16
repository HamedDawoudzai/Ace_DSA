import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const bfsBruteSection: LearnDetailSection = {
  title: "Brute force: DFS tries all paths",
  body:
    VISUAL_ANCHOR +
    "A naive DFS explores every possible path from start to end, tracking the minimum length found. " +
    "Without pruning, the same cells can be revisited on different branches.\n\n" +
    "Worst case: O(4^(n×m)) paths in a fully open grid—the branching factor is 4 (four directions), " +
    "and a path can be up to n × m cells long. " +
    "Even with a visited set to avoid cycles the result might not be the shortest path found first.",
  codeLanguage: "python",
  code: `def shortest_path_dfs(grid: list[list[int]]) -> int:
    """DFS — finds A path but not guaranteed shortest first. Exponential."""
    rows, cols = len(grid), len(grid[0])
    if grid[0][0] == 1 or grid[rows-1][cols-1] == 1:
        return -1
    best = [float("inf")]
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]

    def dfs(r: int, c: int, steps: int, visited: set) -> None:
        if r == rows-1 and c == cols-1:
            best[0] = min(best[0], steps)
            return
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0 and (nr,nc) not in visited:
                visited.add((nr,nc))
                dfs(nr, nc, steps + 1, visited)
                visited.remove((nr,nc))

    dfs(0, 0, 1, {(0,0)})
    return int(best[0]) if best[0] != float("inf") else -1
`,
};
