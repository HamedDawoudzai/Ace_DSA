import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const DS_QUEUES_SECTIONS: LearnDetailSection[] = [
  {
    title: "Python: queue and deque (FIFO + double-ended)",
    body:
      "The queue picture above shows people served in arrival order—that FIFO line is what `deque` with `popleft` mimics in the code below (and why BFS uses it).\n\n" +
      VISUAL_ANCHOR +
      "The code snippet below teaches you the basic queue and deque operations you need to know for interview problems.\n\n" +
      "• enqueue (append) — add an item to the back of the queue.\n" +
      "• dequeue (popleft) — remove and return the item from the front (first in, first out).\n" +
      "• appendleft — add an item to the front of a deque instead of the back.\n" +
      "• pop right — remove an item from the back of a deque.\n" +
      "• BFS sketch — a simple example showing how a queue powers level-by-level graph exploration: keep adding unvisited neighbors and process them in the order they arrived.",
    code: `from collections import deque

# --- FIFO queue: first in, first out ---
q = deque()
q.append(1)           # add 1 to the back
q.append(2)           # add 2 to the back
front = q.popleft()   # remove from the front -> front is 1

# --- double-ended: can add/remove from both ends ---
dq = deque([1, 2, 3])
dq.appendleft(0)   # add to the front  -> [0, 1, 2, 3]
dq.append(4)       # add to the back   -> [0, 1, 2, 3, 4]
x = dq.popleft()   # remove from front -> x is 0
y = dq.pop()       # remove from back  -> y is 4

# --- BFS: explore neighbors level by level ---
def bfs(adj, start):
    seen = set()
    seen.add(start)
    queue = deque()
    queue.append(start)
    while queue:
        node = queue.popleft()       # take the next node to visit
        for neighbor in adj[node]:   # look at each neighbor
            if neighbor not in seen:
                seen.add(neighbor)   # mark as visited so we don't revisit
                queue.append(neighbor)
`,
    codeLanguage: "python",
  },
];
