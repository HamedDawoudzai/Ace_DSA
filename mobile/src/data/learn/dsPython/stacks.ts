import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const DS_STACKS_SECTIONS: LearnDetailSection[] = [
  {
    title: "Python: stack with list or deque",
    body:
      "The stack illustration above is last-in, first-out—only the top matters, which matches `list.append` / `list.pop()` in the snippet below.\n\n" +
      VISUAL_ANCHOR +
      "The code snippet below teaches you the basic stack operations you need to know for interview problems.\n\n" +
      "• push (append) — add an item to the top of the stack.\n" +
      "• peek — look at the top item without removing it (use [-1]).\n" +
      "• pop — remove and return the top item.\n" +
      "• deque as stack — an alternative way to build a stack using deque; works the same way but can be slightly faster for very large stacks.",
    code: `stack = []

# --- push: add an item to the top ---
stack.append(1)
stack.append(2)   # stack is now [1, 2]

# --- peek: look at the top item without removing it ---
top = stack[-1]   # top is 2, stack is still [1, 2]

# --- pop: remove and return the top item ---
x = stack.pop()   # x is 2, stack is now [1]

# --- using deque as a stack (works the same way) ---
from collections import deque

dstack = deque()
dstack.append(3)   # push
y = dstack.pop()   # pop from the top, y is 3
`,
    codeLanguage: "python",
  },
];
