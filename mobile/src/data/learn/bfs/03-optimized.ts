import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const bfsOptimizedSection: LearnDetailSection = {
  title: "BFS: turn it into O(n × m)",
  body:
    VISUAL_ANCHOR +
    "Use a queue (deque). Start with (row=0, col=0, distance=1) and mark it visited. " +
    "Each iteration pops the front cell, tries all four neighbours, and enqueues any that are open and not yet visited.\n\n" +
    "The first time you dequeue the bottom-right cell, its stored distance is the shortest path—because BFS processes cells in non-decreasing distance order.\n\n" +
    "Time: O(n × m)—each cell enters the queue at most once.\n" +
    "Space: O(n × m) for the queue and visited set in the worst case.\n\n" +
    "Key insight: marking a cell visited when it is enqueued (not when it is dequeued) is critical—it prevents the same cell from being added to the queue multiple times.",
  codeLanguage: "python",
  code: `from collections import deque

def shortest_path_bfs(grid: list[list[int]]) -> int:
    """O(n * m) time and space."""
    rows, cols = len(grid), len(grid[0])
    if grid[0][0] == 1 or grid[rows-1][cols-1] == 1:
        return -1
    queue: deque[tuple[int,int,int]] = deque([(0, 0, 1)])
    visited = {(0, 0)}
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]
    while queue:
        r, c, dist = queue.popleft()
        if r == rows-1 and c == cols-1:
            return dist
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0 and (nr,nc) not in visited:
                visited.add((nr, nc))
                queue.append((nr, nc, dist + 1))
    return -1


if __name__ == "__main__":
    assert shortest_path_bfs([[0,0,0],[1,1,0],[1,1,0]]) == 4
    assert shortest_path_bfs([[0,1],[1,0]]) == -1
`,
};
