import type { LearnDetailSection } from "../../learnSectionTypes";

export const DS_GRAPHS_SECTIONS: LearnDetailSection[] = [
  {
    title: "Python: adjacency list and basic traversal",
    body:
      "Store `node -> list of neighbors`. For weighted edges use a list of `(neighbor, weight)` pairs. BFS uses a deque; DFS uses recursion or an explicit stack.",
    code: `from collections import defaultdict, deque

# --- directed graph ---
adj = defaultdict(list)


def add_edge(u, v):
    adj[u].append(v)


# --- undirected: both directions ---
def add_undirected(u, v):
    adj[u].append(v)
    adj[v].append(u)


def dfs_recursive(start, adj2):
    seen = set()
    order = []

    def visit(u):
        seen.add(u)
        order.append(u)
        for v in adj2[u]:
            if v not in seen:
                visit(v)

    visit(start)
    return order


def bfs(start, adj2):
    seen = {start}
    order = []
    q = deque([start])
    while q:
        u = q.popleft()
        order.append(u)
        for v in adj2[u]:
            if v not in seen:
                seen.add(v)
                q.append(v)
    return order
`,
    codeLanguage: "python",
  },
];
