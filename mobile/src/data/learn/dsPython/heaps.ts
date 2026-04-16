import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const DS_HEAPS_SECTIONS: LearnDetailSection[] = [
  {
    title: "Python: heapq (min-heap)",
    body:
      "The heap tree above keeps the smallest value at the root—`heapq` in Python implements that same partial order in a list for the operations below.\n\n" +
      VISUAL_ANCHOR +
      "The code snippet below teaches you the basic heap operations you need to know for interview problems.\n\n" +
      "• heappush — add a value into the heap; the heap automatically keeps the smallest value at the top.\n" +
      "• heappop — remove and return the smallest value from the heap.\n" +
      "• peek min — look at the smallest value without removing it (just read index 0).\n" +
      "• max-heap via negation — Python only has a min-heap, so to get the largest item first, store numbers as negatives and negate again when you pop.\n" +
      "• top_k — keep a heap of exactly k items as you scan a list; when the heap grows past k, pop the smallest. At the end the heap holds the k largest values.",
    code: `import heapq

# --- min-heap: the smallest value always comes out first ---
heap = []
heapq.heappush(heap, 3)
heapq.heappush(heap, 1)
heapq.heappush(heap, 2)
smallest = heapq.heappop(heap)   # removes and returns 1

# --- peek at the smallest without removing it ---
if heap:
    min_val = heap[0]            # just read index 0, no pop

# --- max-heap: Python has no built-in max-heap ---
# trick: store values as negatives so the "smallest negative" is the largest real value
max_heap = []
heapq.heappush(max_heap, -10)
heapq.heappush(max_heap, -5)
largest = -heapq.heappop(max_heap)  # pop -10, negate -> 10

# --- keep only the k largest values seen so far ---
def top_k(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)  # remove the smallest, keeping only k items
    return sorted(heap)          # the k largest values
`,
    codeLanguage: "python",
  },
];
