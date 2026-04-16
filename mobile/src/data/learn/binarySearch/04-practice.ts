import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const binarySearchPracticeSection: LearnDetailSection = {
  title: "Stretch: binary search on the answer space",
  body:
    VISUAL_ANCHOR +
    "Binary search is not just for arrays—it works on any monotonic predicate (false…false true…true):\n\n" +
    "• First bad version — binary search over version IDs; stop at the earliest failing check.\n" +
    "• Koko eating bananas — binary search the eating speed; check if feasible in H hours.\n" +
    "• Split array largest sum — binary search the max allowed chunk sum; count required splits.\n" +
    "• Sqrt(x) — binary search the integer answer space.\n\n" +
    "Template: find the leftmost (or rightmost) value where a condition flips. " +
    "Below: find the first position where a value is ≥ target (left-bound search).",
  codeLanguage: "python",
  code: `def lower_bound(arr: list[int], target: int) -> int:
    """First index i where arr[i] >= target. O(log n)."""
    left, right = 0, len(arr)   # right is exclusive
    while left < right:
        mid = left + (right - left) // 2
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid
    return left  # len(arr) if target > all elements


if __name__ == "__main__":
    assert lower_bound([1, 3, 5, 7, 9], 6) == 3   # first index with val >= 6
    assert lower_bound([1, 3, 5, 7, 9], 5) == 2   # exact match
    assert lower_bound([1, 3, 5, 7, 9], 10) == 5  # past the end
`,
};
