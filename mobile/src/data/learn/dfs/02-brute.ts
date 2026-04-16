import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const dfsBruteSection: LearnDetailSection = {
  title: "Brute force: count without merging components",
  body:
    VISUAL_ANCHOR +
    "A naive approach counts every '1' cell and then tries to subtract duplicates by checking all neighbours—but keeping track of which cells belong to the same island requires extra bookkeeping and multiple passes.\n\n" +
    "Alternatively, a union-find built naively (without path compression or union by rank) works but takes O(n²) per operation in the worst case—still correct but slower than needed.\n\n" +
    "The real issue is that without a systematic flood-fill, you end up revisiting cells or using a complex separate data structure just to group connected components.",
  codeLanguage: "python",
  code: `def count_islands_naive(grid: list[list[str]]) -> int:
    """O(n^2 * m^2) — checks all cells for each unvisited land cell."""
    rows, cols = len(grid), len(grid[0])
    visited: set[tuple[int,int]] = set()
    count = 0
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]

    def is_connected(r1: int, c1: int, r2: int, c2: int) -> bool:
        """BFS from (r1,c1) to see if (r2,c2) is reachable — O(n*m)."""
        queue = [(r1, c1)]
        seen = {(r1, c1)}
        while queue:
            r, c = queue.pop()
            if (r, c) == (r2, c2):
                return True
            for dr, dc in dirs:
                nr, nc = r+dr, c+dc
                if 0<=nr<rows and 0<=nc<cols and grid[nr][nc]=="1" and (nr,nc) not in seen:
                    seen.add((nr,nc))
                    queue.append((nr,nc))
        return False

    land_cells = [(r,c) for r in range(rows) for c in range(cols) if grid[r][c]=="1"]
    for r, c in land_cells:
        if (r,c) not in visited:
            visited.add((r,c))
            count += 1
            # Mark all cells reachable from (r,c) as visited
            for r2, c2 in land_cells:
                if (r2,c2) not in visited and is_connected(r, c, r2, c2):
                    visited.add((r2,c2))
    return count
`,
};
