import type { LearnDetailSection } from "../../learnSectionTypes";

export const DS_HEAPS_SECTIONS: LearnDetailSection[] = [
  {
    title: "Python: heapq (min-heap)",
    body:
      "`heapq` implements a min-heap in a list. `heappush` / `heappop` are O(log n). There is no max-heap: store negated values or push tuples `(-priority, item)` so the smallest tuple wins.",
    code: `import heapq

# --- min-heap ---
h = []
heapq.heappush(h, 3)
heapq.heappush(h, 1)
heapq.heappush(h, 2)
smallest = heapq.heappop(h)

# --- peek min (no pop) ---
min_val = h[0] if h else None

# --- max-heap: negate keys ---
hmax = []
heapq.heappush(hmax, -10)
heapq.heappush(hmax, -5)
largest = -heapq.heappop(hmax)

# --- top-k largest: size-k min-heap over the stream ---
def top_k(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)
    return sorted(heap)
`,
    codeLanguage: "python",
  },
];
