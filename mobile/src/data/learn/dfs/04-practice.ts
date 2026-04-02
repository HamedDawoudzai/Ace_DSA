import type { LearnDetailSection } from "../../learnSectionTypes";

export const dfsPracticeSection: LearnDetailSection = {
  title: "Stretch: DFS on graphs and trees",
  body:
    "DFS is fundamental across many problem types:\n\n" +
    "• Cycle detection — track the recursion stack; if you visit a node already on the stack, there is a cycle.\n" +
    "• Topological sort — after exploring all outgoing edges, push the node to a result stack.\n" +
    "• Path existence — DFS and return True the moment you reach the target node.\n" +
    "• Connected components — count how many times DFS is launched from the outer loop.\n" +
    "• Tree: in-order / pre-order / post-order — all are DFS with different recording points.\n\n" +
    "Below: detect a cycle in a directed graph using a recursion-stack set.",
  codeLanguage: "python",
  code: `def has_cycle(graph: dict[int, list[int]]) -> bool:
    """DFS cycle detection in a directed graph. O(V + E)."""
    visited: set[int] = set()
    rec_stack: set[int] = set()

    def dfs(node: int) -> bool:
        visited.add(node)
        rec_stack.add(node)
        for neighbour in graph.get(node, []):
            if neighbour not in visited:
                if dfs(neighbour):
                    return True
            elif neighbour in rec_stack:
                return True
        rec_stack.remove(node)
        return False

    return any(dfs(node) for node in graph if node not in visited)


if __name__ == "__main__":
    assert has_cycle({0: [1], 1: [2], 2: [0]}) is True   # 0→1→2→0
    assert has_cycle({0: [1], 1: [2], 2: []}) is False
`,
};
