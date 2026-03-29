import type { LearnDetailSection } from "../../learnSectionTypes";

export const sortingBruteSection: LearnDetailSection = {
  title: "Brute force: compare every pair",
  body:
    "Check all pairs (i, j) with i < j. Two meetings [s1, e1] and [s2, e2] overlap if s2 < e1 (assuming s1 ≤ s2).\n\n" +
    "Two nested loops → O(n²) time. For 10 000 meetings that is 100 million comparisons. " +
    "There is no ordering assumption so every pair must be checked.",
  codeLanguage: "python",
  code: `def has_overlap_brute(meetings: list[list[int]]) -> bool:
    """O(n^2) time. Checks every pair."""
    n = len(meetings)
    for i in range(n):
        for j in range(i + 1, n):
            s1, e1 = meetings[i]
            s2, e2 = meetings[j]
            # Overlap when one starts before the other ends
            if s1 < e2 and s2 < e1:
                return True
    return False


if __name__ == "__main__":
    assert has_overlap_brute([[0, 30], [5, 10], [15, 20]]) is True
    assert has_overlap_brute([[7, 10], [2, 4]]) is False
`,
};
