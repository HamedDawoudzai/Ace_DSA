import type { LearnDetailSection } from "../../learnSectionTypes";

export const sortingOptimizedSection: LearnDetailSection = {
  title: "Sort then sweep: turn it into O(n log n)",
  body:
    "Sort meetings by start time. After sorting, any two overlapping meetings must be consecutive in the sorted order—you only need to compare each meeting to its immediate predecessor.\n\n" +
    "Single sweep: for each meeting check if its start is before the previous meeting's end. " +
    "If yes → overlap found. Total: O(n log n) for the sort, O(n) for the sweep.\n\n" +
    "Custom comparators: Python's sort accepts a key= function. " +
    "For multi-key sorting (by end time, then start time) pass a tuple as the key. " +
    "In many greedy algorithms—interval scheduling, task scheduling—the 'sort by end' comparator is the crucial first step.",
  codeLanguage: "python",
  code: `def has_overlap_sorted(meetings: list[list[int]]) -> bool:
    """O(n log n) time. Sort by start, one sweep."""
    meetings.sort(key=lambda m: m[0])
    for i in range(1, len(meetings)):
        if meetings[i][0] < meetings[i - 1][1]:
            return True
    return False


if __name__ == "__main__":
    assert has_overlap_sorted([[0, 30], [5, 10], [15, 20]]) is True
    assert has_overlap_sorted([[7, 10], [2, 4]]) is False
    assert has_overlap_sorted([[1, 2], [3, 4], [5, 6]]) is False
`,
};
