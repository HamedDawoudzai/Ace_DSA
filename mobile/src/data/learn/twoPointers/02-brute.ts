import type { LearnDetailSection } from "../../learnSectionTypes";

export const bruteForceSection: LearnDetailSection = {
  title: "Brute force: try every pair",
  body:
    "The straightforward idea is to check all pairs (i, j) with i < j. Two nested loops enumerate every combination; no sorting required.\n\n" +
    "Time is O(n²) because there are Θ(n²) pairs. Extra space is O(1) beyond the input. " +
    "This is the baseline you compare every trick against.",
  codeLanguage: "python",
  code: `def pair_sum_exists_naive(arr: list[int], target: int) -> bool:
    """Any order. O(n^2) time."""
    n = len(arr)
    for i in range(n):
        for j in range(i + 1, n):
            if arr[i] + arr[j] == target:
                return True
    return False


if __name__ == "__main__":
    assert pair_sum_exists_naive([0, -1, 2, -3, 1], -2) is True
`,
};
