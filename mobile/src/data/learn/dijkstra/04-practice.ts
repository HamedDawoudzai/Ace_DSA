import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const dijkstraPracticeSection: LearnDetailSection = {
  title: "Stretch: extensions and alternatives",
  body:
    VISUAL_ANCHOR +
    "Dijkstra's is the foundation for many shortest-path variants:\n\n" +
    "• Cheapest flights within K stops — add stops as state; use (cost, stops, node) in heap.\n" +
    "• Network delay time — run Dijkstra from the source; answer is max dist across all nodes.\n" +
    "• Path with minimum effort — Dijkstra on a grid; edge weight = absolute height difference.\n" +
    "• Negative weights — use Bellman-Ford: relax all edges V−1 times. Detects negative cycles.\n" +
    "• All-pairs shortest path — Floyd-Warshall: O(V³) DP on the distance matrix.\n\n" +
    "Below: network delay time—Dijkstra from a single source, answer is max of all final distances.",
  codeLanguage: "python",
  code: `import heapq

def network_delay_time(times: list[list[int]], n: int, k: int) -> int:
    """Dijkstra from node k. -1 if not all nodes reachable. O((V+E) log V)."""
    graph: dict[int, list[tuple[int,int]]] = {i: [] for i in range(1, n+1)}
    for u, v, w in times:
        graph[u].append((v, w))
    dist = {k: 0}
    heap: list[tuple[int,int]] = [(0, k)]
    while heap:
        cost, node = heapq.heappop(heap)
        if cost > dist.get(node, float("inf")):
            continue
        for neighbour, weight in graph[node]:
            new_cost = cost + weight
            if new_cost < dist.get(neighbour, float("inf")):
                dist[neighbour] = new_cost
                heapq.heappush(heap, (new_cost, neighbour))
    return max(dist.values()) if len(dist) == n else -1
`,
};
