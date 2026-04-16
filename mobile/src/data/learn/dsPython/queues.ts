import type { LearnDetailSection } from "../../learnSectionTypes";

export const DS_QUEUES_SECTIONS: LearnDetailSection[] = [
  {
    title: "Python: queue and deque (FIFO + double-ended)",
    body:
      "Use `collections.deque` for FIFO queues: O(1) append to right and pop from left. `appendleft` / `pop` from the right give you a deque for sliding-window patterns.",
    code: `from collections import deque

# --- FIFO queue ---
q = deque()
q.append(1)
q.append(2)
front = q.popleft()

# --- double-ended ---
dq = deque([1, 2, 3])
dq.appendleft(0)   # prepend
dq.append(4)       # append right
x = dq.popleft()
y = dq.pop()       # pop right

# --- BFS sketch ---
def bfs(adj, start):
    seen = {start}
    q2 = deque([start])
    while q2:
        u = q2.popleft()
        for v in adj.get(u, []):
            if v not in seen:
                seen.add(v)
                q2.append(v)
`,
    codeLanguage: "python",
  },
];
