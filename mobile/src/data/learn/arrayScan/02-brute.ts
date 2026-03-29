import type { LearnDetailSection } from "../../learnSectionTypes";

export const arrayScanBruteSection: LearnDetailSection = {
  title: "Brute force: sum the range every time",
  body:
    "The obvious approach re-sums the slice for every query. Two nested loops—outer over queries, inner over elements—give O(n) work per query.\n\n" +
    "With Q queries on an array of length n, total time is O(Q × n). " +
    "For 10 000 queries on a 10 000-element array that is 100 million operations. " +
    "This is the baseline we want to beat.",
  codeLanguage: "python",
  code: `def range_sum_brute(arr: list[int], queries: list[tuple[int, int]]) -> list[int]:
    """O(n) per query, O(Q * n) total."""
    results = []
    for L, R in queries:
        total = 0
        for i in range(L, R + 1):
            total += arr[i]
        results.append(total)
    return results


if __name__ == "__main__":
    arr = [3, 1, 4, 1, 5, 9]
    assert range_sum_brute(arr, [(1, 4)]) == [11]
    assert range_sum_brute(arr, [(0, 5)]) == [23]
`,
};
