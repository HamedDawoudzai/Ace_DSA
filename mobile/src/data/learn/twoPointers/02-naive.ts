import type { LearnDetailSection } from "../../learnSectionTypes";

/** Brute-force all pairs — works on any order but O(n²) time. */
export const twoPointersNaive: LearnDetailSection = {
  title: "Naive method — O(n²) time, O(1) extra space",
  body:
    "The baseline is to try every pair (i, j) with i < j and check whether arr[i] + arr[j] equals the target. " +
    "Two nested loops cover all pairs; no sorting required.\n\n" +
    "Time complexity is O(n²) because there are on the order of n² pairs. Space is O(1) besides the input.",
  code: `def pair_sum_equals_target_naive(arr: list[int], target: int) -> bool:
    """Return True if some pair sums to target (any order)."""
    n = len(arr)
    for i in range(n):
        for j in range(i + 1, n):
            if arr[i] + arr[j] == target:
                return True
    return False


# Example
if __name__ == "__main__":
    print(pair_sum_equals_target_naive([0, -1, 2, -3, 1], -2))  # True
`,
};
