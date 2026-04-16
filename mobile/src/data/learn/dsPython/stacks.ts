import type { LearnDetailSection } from "../../learnSectionTypes";

export const DS_STACKS_SECTIONS: LearnDetailSection[] = [
  {
    title: "Python: stack with list or deque",
    body:
      "A stack is LIFO. `list.append` / `list.pop()` from the end are O(1) amortized. For huge stacks, `collections.deque` is also O(1) on both ends and can be clearer for monotonic-stack style problems.",
    code: `# --- stack with list (most common) ---
stack = []
stack.append(1)   # push
stack.append(2)

top = stack[-1]   # peek (IndexError if empty)
x = stack.pop()   # pop  (IndexError if empty)

# --- optional: deque as stack ---
from collections import deque

dstack = deque()
dstack.append(3)
y = dstack.pop()
`,
    codeLanguage: "python",
  },
];
