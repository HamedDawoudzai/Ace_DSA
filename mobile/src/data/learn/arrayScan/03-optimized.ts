import type { LearnDetailSection } from "../../learnSectionTypes";

export const arrayScanOptimizedSection: LearnDetailSection = {
  title: "Prefix sum: one scan, O(1) queries",
  body:
    "Build a prefix array where prefix[i] = arr[0] + arr[1] + … + arr[i − 1] (with prefix[0] = 0 as a sentinel).\n\n" +
    "Any range sum arr[L..R] is then prefix[R + 1] − prefix[L]. " +
    "One O(n) scan to build the table; every query answers in O(1).\n\n" +
    "Why it works: prefix[R + 1] has counted arr[0..R]. Subtracting prefix[L] removes everything before L. " +
    "The sentinel at index 0 means the formula works even when L = 0 without a special case.\n\n" +
    "Space trade-off: you spend O(n) extra memory on the prefix array, but Q queries now cost O(Q) total instead of O(Q × n).",
  codeLanguage: "python",
  code: `def build_prefix(arr: list[int]) -> list[int]:
    """O(n) build. prefix[i] = sum of arr[0..i-1]."""
    prefix = [0] * (len(arr) + 1)
    for i, val in enumerate(arr):
        prefix[i + 1] = prefix[i] + val
    return prefix


def range_sum(prefix: list[int], L: int, R: int) -> int:
    """O(1) per query."""
    return prefix[R + 1] - prefix[L]


if __name__ == "__main__":
    arr = [3, 1, 4, 1, 5, 9]
    pre = build_prefix(arr)
    assert range_sum(pre, 1, 4) == 11   # 1+4+1+5
    assert range_sum(pre, 0, 5) == 23   # whole array
`,
};
