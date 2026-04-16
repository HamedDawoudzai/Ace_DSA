import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const DS_GRAPHS_SECTIONS: LearnDetailSection[] = [
  {
    title: "Python: adjacency list and basic traversal",
    body:
      "The graph illustration above is vertices and edges; the `defaultdict(list)` adjacency list below is that picture stored so each node maps to its neighbors.\n\n" +
      VISUAL_ANCHOR +
      "The code snippet below teaches you the basic graph operations you need to know for interview problems.\n\n" +
      "• add_edge — connect two nodes with a one-way (directed) edge.\n" +
      "• add_undirected — connect two nodes so you can travel in both directions.\n" +
      "• dfs_recursive — explore the graph by going as deep as possible down one path before backtracking; uses recursion to remember where it came from.\n" +
      "• bfs — explore the graph level by level using a queue; visits all direct neighbors before going deeper.",
    code: `from collections import defaultdict, deque

# adj stores each node mapped to a list of its neighbors
adj = defaultdict(list)


def add_edge(u, v):
    adj[u].append(v)       # u -> v (one direction only)


def add_undirected(u, v):
    adj[u].append(v)       # u -> v
    adj[v].append(u)       # v -> u (both directions)


def dfs_recursive(start, adj):
    seen = set()
    order = []

    def visit(node):
        seen.add(node)
        order.append(node)
        for neighbor in adj[node]:
            if neighbor not in seen:
                visit(neighbor)    # go deeper before coming back

    visit(start)
    return order


def bfs(start, adj):
    seen = set()
    seen.add(start)
    order = []
    queue = deque()
    queue.append(start)
    while queue:
        node = queue.popleft()           # take the next node to visit
        order.append(node)
        for neighbor in adj[node]:
            if neighbor not in seen:
                seen.add(neighbor)       # mark visited before adding to queue
                queue.append(neighbor)
    return order
`,
    codeLanguage: "python",
  },
];
