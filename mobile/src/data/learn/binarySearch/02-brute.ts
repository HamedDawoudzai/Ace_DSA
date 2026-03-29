import type { LearnDetailSection } from "../../learnSectionTypes";

export const binarySearchBruteSection: LearnDetailSection = {
  title: "Brute force: scan every element",
  body:
    "Check each index from 0 to n − 1 until you find the target or reach the end. O(n) time, O(1) space.\n\n" +
    "This works on any array—sorted or not—but completely ignores the sorted structure. " +
    "In the worst case (target at the end or missing) you inspect every element. " +
    "For n = 1 000 000 that is one million comparisons; binary search would need only 20.",
  codeLanguage: "python",
  code: `def linear_search(arr: list[int], target: int) -> int:
    """O(n) time. Works on unsorted arrays too."""
    for i, val in enumerate(arr):
        if val == target:
            return i
    return -1


if __name__ == "__main__":
    assert linear_search([1, 3, 5, 7, 9, 11], 7) == 3
    assert linear_search([2, 4, 6, 8, 10], 5) == -1
`,
};
