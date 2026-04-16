import type { LearnDetailSection } from "../../learnSectionTypes";

export const DS_ARRAYS_SECTIONS: LearnDetailSection[] = [
  {
    title: "Python: list as a dynamic array",
    body:
      "In Python, `list` is your resizable array: O(1) index reads, amortized O(1) append at the end, O(n) insert/delete in the middle because elements shift. Use `collections.deque` when you need many pops from the front in O(1).",
    code: `# --- create ---
arr = []
arr = [1, 2, 3]

# --- append (end), amortized O(1) ---
arr.append(4)

# --- prepend, O(n) (everything shifts) ---
arr.insert(0, 0)

# --- pop end, O(1) ---
last = arr.pop()

# --- pop front, O(n) on a list (deque is better for FIFO) ---
first = arr.pop(0)

# --- linear scan by index ---
for i in range(len(arr)):
    pass  # use arr[i]

# --- linear scan by value ---
for x in arr:
    pass  # use x

# --- index + value ---
for i, x in enumerate(arr):
    pass  # use i, x
`,
    codeLanguage: "python",
  },
];
