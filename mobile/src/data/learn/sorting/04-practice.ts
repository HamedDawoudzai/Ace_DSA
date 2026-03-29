import type { LearnDetailSection } from "../../learnSectionTypes";

export const sortingPracticeSection: LearnDetailSection = {
  title: "Stretch: sorting as a pre-processing step",
  body:
    "Sorting is rarely the whole solution—it is the move that makes the next step trivial:\n\n" +
    "• Merge intervals — sort by start; merge greedily in one pass.\n" +
    "• Meeting rooms II — sort starts and ends separately; sweep with two pointers.\n" +
    "• Largest number — custom comparator: compare a+b vs b+a as strings.\n" +
    "• Kth largest element — quickselect (partial sort); or sort + index.\n" +
    "• Two-pointer / sliding-window on unsorted input — sort first, then apply the pattern.\n\n" +
    "Below: merge overlapping intervals—the classic follow-up after overlap detection.",
  codeLanguage: "python",
  code: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    """O(n log n). Sort by start, merge greedily."""
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged


if __name__ == "__main__":
    assert merge_intervals([[1,3],[2,6],[8,10],[15,18]]) == [[1,6],[8,10],[15,18]]
    assert merge_intervals([[1,4],[4,5]]) == [[1,5]]
`,
};
