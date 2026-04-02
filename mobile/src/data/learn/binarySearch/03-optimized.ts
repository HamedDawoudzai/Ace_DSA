import type { LearnDetailSection } from "../../learnSectionTypes";

export const binarySearchOptimizedSection: LearnDetailSection = {
  title: "Binary search: turn it into O(log n)",
  body:
    "Set left = 0 and right = n − 1. Repeatedly check the midpoint mid = (left + right) // 2.\n\n" +
    "• If arr[mid] == target → found, return mid.\n" +
    "• If arr[mid] < target → target must be in the right half; set left = mid + 1.\n" +
    "• If arr[mid] > target → target must be in the left half; set right = mid − 1.\n\n" +
    "Each comparison halves the search space. After k rounds, at most n / 2^k elements remain. " +
    "You stop when left > right → O(log n) comparisons total, O(1) extra space.\n\n" +
    "Common mistakes: using mid = (left + right) / 2 causes integer overflow in some languages—prefer left + (right − left) // 2. " +
    "Also: keep the exit condition left ≤ right (not left < right) so you do not miss a one-element window.",
  codeLanguage: "python",
  code: `def binary_search(arr: list[int], target: int) -> int:
    """Sorted array required. O(log n) time, O(1) space."""
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1


if __name__ == "__main__":
    assert binary_search([1, 3, 5, 7, 9, 11], 7) == 3
    assert binary_search([2, 4, 6, 8, 10], 5) == -1
    assert binary_search([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1) == 0
`,
};
