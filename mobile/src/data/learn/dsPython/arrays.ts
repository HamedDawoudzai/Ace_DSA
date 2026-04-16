import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const DS_ARRAYS_SECTIONS: LearnDetailSection[] = [
  {
    title: "Python: list as a dynamic array",
    body:
      "The lesson image above shows values sitting in a numbered row—that row is an array: same idea as the Python list operations below.\n\n" +
      VISUAL_ANCHOR +
      "The code snippet below teaches you the basic array operations you need to know for interview problems.\n\n" +
      "• create — start with an empty list or a list with values already in it.\n" +
      "• append — add an item to the end of the list (very fast).\n" +
      "• insert at front — add an item to the beginning (slower, everything else shifts over).\n" +
      "• pop end — remove and return the last item (very fast).\n" +
      "• pop front — remove and return the first item (slower, everything shifts).\n" +
      "• scan by index — loop through the list using position numbers (0, 1, 2…).\n" +
      "• scan by value — loop through the list and get each item directly.\n" +
      "• enumerate — loop and get both the position number and the item at the same time.",
    code: `# --- create ---
arr = []           # empty list
arr = [1, 2, 3]   # list with values already in it

# --- add to the end ---
arr.append(4)      # arr is now [1, 2, 3, 4]

# --- add to the front (everything else shifts over) ---
arr.insert(0, 0)   # arr is now [0, 1, 2, 3, 4]

# --- remove from the end ---
last = arr.pop()   # removes 4, returns it

# --- remove from the front (everything else shifts over) ---
first = arr.pop(0) # removes 0, returns it

# --- loop using index numbers (0, 1, 2...) ---
for i in range(len(arr)):
    pass  # use arr[i] to get the value at position i

# --- loop over values directly ---
for x in arr:
    pass  # use x

# --- loop with both index and value at the same time ---
for i, x in enumerate(arr):
    pass  # i is the position, x is the value
`,
    codeLanguage: "python",
  },
];
