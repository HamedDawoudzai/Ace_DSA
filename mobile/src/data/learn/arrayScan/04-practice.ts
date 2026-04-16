import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const arrayScanPracticeSection: LearnDetailSection = {
  title: "Stretch: more single-pass patterns",
  body:
    VISUAL_ANCHOR +
    "The same scan-once idea applies everywhere:\n\n" +
    "• Running maximum / minimum — track the best value seen so far.\n" +
    "• Kadane's algorithm — maximum subarray sum in one pass (extend or restart).\n" +
    "• Majority element — Boyer-Moore voting: increment for current candidate, decrement otherwise.\n" +
    "• Suffix arrays — mirror of prefix; useful for 'product except self' and rain water.\n\n" +
    "Below: Kadane's algorithm as the archetypal 'decide at each step' scan.",
  codeLanguage: "python",
  code: `def max_subarray_sum(arr: list[int]) -> int:
    """Kadane's algorithm. O(n) time, O(1) space."""
    best = arr[0]
    current = arr[0]
    for val in arr[1:]:
        current = max(val, current + val)
        best = max(best, current)
    return best


if __name__ == "__main__":
    assert max_subarray_sum([-2, 1, -3, 4, -1, 2, 1, -5, 4]) == 6  # [4,-1,2,1]
    assert max_subarray_sum([-1, -2, -3]) == -1
`,
};
