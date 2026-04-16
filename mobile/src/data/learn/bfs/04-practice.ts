import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const bfsPracticeSection: LearnDetailSection = {
  title: "Stretch: more BFS patterns",
  body:
    VISUAL_ANCHOR +
    "BFS appears whenever 'shortest' or 'minimum steps' matters in an unweighted space:\n\n" +
    "• Level-order tree traversal — process nodes level by level; add left and right children.\n" +
    "• Word ladder — each word is a node; edges connect words that differ by one letter.\n" +
    "• Rotting oranges — multi-source BFS: start all rotten oranges simultaneously at time 0.\n" +
    "• 0-1 BFS — edges cost either 0 or 1; use a deque (front for 0-cost, back for 1-cost).\n" +
    "• Minimum knight moves — BFS on a chessboard with 8-directional knight moves.\n\n" +
    "Below: multi-source BFS using rotting oranges as the template.",
  codeLanguage: "python",
  code: `from collections import deque

def oranges_rotting(grid: list[list[int]]) -> int:
    """Multi-source BFS. 0=empty, 1=fresh, 2=rotten. O(n*m)."""
    rows, cols = len(grid), len(grid[0])
    queue: deque[tuple[int,int,int]] = deque()
    fresh = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c, 0))
            elif grid[r][c] == 1:
                fresh += 1
    if fresh == 0:
        return 0
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]
    time = 0
    while queue:
        r, c, t = queue.popleft()
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2
                fresh -= 1
                time = t + 1
                queue.append((nr, nc, t + 1))
    return time if fresh == 0 else -1
`,
};
