import type { LearnDetailSection } from "../../learnSectionTypes";

/** Why incrementing left or decrementing right never skips a valid pair. */
export const twoPointersCorrectness: LearnDetailSection = {
  title: "How does this work? (correctness sketch)",
  body:
    "We need to see that no valid pair is skipped when we move pointers.\n\n" +
    "Case A — sum is too small (arr[left] + arr[right] < target): we increment left. " +
    "Keeping the same left and trying any smaller index than the current right would only give a sum ≤ the one we already saw (because the array is sorted). " +
    "So any pair that could still work must use a larger left. We are not discarding a solution that still involved the old left with some future right, because those rights were already too small when we previously moved right.\n\n" +
    "Case B — sum is too large: we decrement right. Symmetric reasoning: shrinking right is the only way to lower the sum while keeping the search space consistent.\n\n" +
    "Because each step moves one pointer and pointers only move inward, the loop runs in O(n) steps.",
  code: `# Same algorithm as before — correctness is about the reasoning, not new code.
def pair_sum_equals_target_sorted(arr: list[int], target: int) -> bool:
    left, right = 0, len(arr) - 1
    while left < right:
        s = arr[left] + arr[right]
        if s == target:
            return True
        if s < target:
            left += 1
        else:
            right -= 1
    return False
`,
};
