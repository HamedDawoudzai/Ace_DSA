import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const slidingWindowOptimizedSection: LearnDetailSection = {
  title: "Sliding window: turn it into O(n)",
  body:
    VISUAL_ANCHOR +
    "Build the sum for the first window of size k upfront. Then slide right: add arr[i + k] (new right element), subtract arr[i] (old left element), update the best.\n\n" +
    "Only two operations per step → O(n) total, O(1) extra space.\n\n" +
    "Why it is safe: you never recount the k − 1 elements shared between adjacent windows. " +
    "The window 'remembers' its sum by adjusting incrementally.\n\n" +
    "Variable-size extension: for problems like 'longest subarray with sum ≤ S', the right pointer always advances while the left pointer shrinks the window whenever the constraint breaks. " +
    "Same O(n) cost—each pointer moves at most n times.",
  codeLanguage: "python",
  code: `def max_window_sum(arr: list[int], k: int) -> int:
    """Fixed window. O(n) time, O(1) space."""
    window = sum(arr[:k])
    best = window
    for i in range(len(arr) - k):
        window += arr[i + k] - arr[i]
        best = max(best, window)
    return best


if __name__ == "__main__":
    assert max_window_sum([2, 1, 5, 1, 3, 2], 3) == 9
    assert max_window_sum([1, 8, 30, -5, 20, 7], 3) == 45
    assert max_window_sum([4, 2, 1, 7, 8, 1, 2, 8, 1, 0], 3) == 16
`,
};
