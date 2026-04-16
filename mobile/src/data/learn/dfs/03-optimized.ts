import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const dfsOptimizedSection: LearnDetailSection = {
  title: "DFS flood-fill: turn it into O(n × m)",
  body:
    VISUAL_ANCHOR +
    "Scan every cell. When you find a '1' that has not been visited, increment the island count and immediately launch a DFS to mark all connected land cells as visited.\n\n" +
    "The DFS 'sinks' the entire island before the outer loop moves on—no second pass needed.\n\n" +
    "Time: O(n × m)—each cell is visited exactly once.\n" +
    "Space: O(n × m) worst case for the call stack (a grid that is all land forms one long winding island).\n\n" +
    "Tip: mutating the grid (set '1' → '0') avoids a separate visited set and saves space, but only do this if the problem allows it.",
  codeLanguage: "python",
  code: `def count_islands_dfs(grid: list[list[str]]) -> int:
    """O(n * m) time and space. DFS flood-fill."""
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]

    def dfs(r: int, c: int) -> None:
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != "1":
            return
        grid[r][c] = "0"        # sink the cell so we don't revisit
        for dr, dc in dirs:
            dfs(r + dr, c + dc)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                dfs(r, c)
    return count


if __name__ == "__main__":
    g1 = [["1","1","0"],["0","1","0"],["0","0","1"]]
    assert count_islands_dfs(g1) == 2
    g2 = [["1","0","0"],["0","1","0"],["0","0","1"]]
    assert count_islands_dfs(g2) == 3
`,
};
