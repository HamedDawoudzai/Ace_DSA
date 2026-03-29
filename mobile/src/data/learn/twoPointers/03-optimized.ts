import type { LearnDetailSection } from "../../learnSectionTypes";

export const twoPointerOptimizedSection: LearnDetailSection = {
  title: "Two pointers: turn it into O(n)",
  body:
    "Assume arr is sorted ascending. Place left at 0 and right at n − 1. Let s = arr[left] + arr[right].\n\n" +
    "• If s == target, done.\n" +
    "• If s < target, the sum is too small—move left forward to try a larger left value.\n" +
    "• If s > target, the sum is too large—move right backward.\n\n" +
    "Each step discards only pairs that cannot work anymore, so you never skip a valid answer. " +
    "At most n steps → O(n) time, O(1) extra space.\n\n" +
    "Why it is safe: if s is too small, every pair using the current left with any index ≤ right was already ≤ s, so no missed solution on that side; " +
    "the symmetric argument holds when s is too large and you shrink right.",
  codeLanguage: "python",
  code: `def pair_sum_exists_sorted(arr: list[int], target: int) -> bool:
    """arr must be sorted ascending. O(n) time, O(1) extra space."""
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


if __name__ == "__main__":
    assert pair_sum_exists_sorted([10, 20, 35, 50], 70) is True
    assert pair_sum_exists_sorted([10, 20, 30], 70) is False
    assert pair_sum_exists_sorted([-8, 1, 4, 6, 10, 45], 16) is True
`,
};
