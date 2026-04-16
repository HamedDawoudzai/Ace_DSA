import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const dijkstraOptimizedSection: LearnDetailSection = {
  title: "Dijkstra's: turn it into O((V + E) log V)",
  body:
    VISUAL_ANCHOR +
    "Maintain a dist table initialised to infinity for every node except the source (dist[src] = 0). " +
    "Use a min-heap (priority queue) seeded with (cost=0, node=src).\n\n" +
    "Each iteration:\n" +
    "1. Pop the node with the smallest known cost.\n" +
    "2. If already processed (cost > dist[node]), skip—it is stale.\n" +
    "3. For each neighbour: if dist[node] + edge weight < dist[neighbour], update dist[neighbour] and push to the heap.\n\n" +
    "Why it is correct: the heap always yields the globally cheapest unprocessed node. " +
    "With non-negative weights, relaxing through a more-expensive node can never improve a shorter path already found.\n\n" +
    "Python's heapq is a min-heap. Push (cost, node) tuples; smallest cost surfaces first.",
  codeLanguage: "python",
  code: `import heapq

def dijkstra(
    graph: dict[str, list[tuple[str, int]]],
    src: str,
    dst: str
) -> int:
    """O((V + E) log V) time."""
    dist: dict[str, float] = {src: 0}
    heap: list[tuple[float, str]] = [(0, src)]
    while heap:
        cost, node = heapq.heappop(heap)
        if node == dst:
            return int(cost)
        if cost > dist.get(node, float("inf")):
            continue
        for neighbour, weight in graph.get(node, []):
            new_cost = cost + weight
            if new_cost < dist.get(neighbour, float("inf")):
                dist[neighbour] = new_cost
                heapq.heappush(heap, (new_cost, neighbour))
    return -1


if __name__ == "__main__":
    g = {"A": [("B",4),("C",1)], "C": [("B",2),("D",5)], "B": [("D",3)], "D": []}
    assert dijkstra(g, "A", "D") == 6   # A→C→B→D = 1+2+3
`,
};
