import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const greedyOptimizedSection: LearnDetailSection = {
  title: "Greedy: turn it into O(n log n)",
  body:
    VISUAL_ANCHOR +
    "Sort meetings by end time. Greedily pick each meeting whose start is ≥ the end of the last selected meeting.\n\n" +
    "Why the earliest-end choice is safe: suppose you picked a meeting M that does not end earliest. " +
    "Swapping M for the one that ends earliest cannot reduce the count—it can only free up more time for later meetings. " +
    "By induction, always choosing the earliest-ending compatible meeting is optimal.\n\n" +
    "Total: O(n log n) for sorting, O(n) for the sweep. O(1) extra space.",
  codeLanguage: "python",
  code: `def max_meetings_greedy(meetings: list[list[int]]) -> int:
    """O(n log n). Sort by end time, pick greedily."""
    meetings.sort(key=lambda m: m[1])
    count = 0
    last_end = float("-inf")
    for start, end in meetings:
        if start >= last_end:
            count += 1
            last_end = end
    return count


if __name__ == "__main__":
    assert max_meetings_greedy([[1,4],[3,5],[0,6],[5,7],[8,9],[5,9],[6,10]]) == 4
    assert max_meetings_greedy([[1,2],[1,2],[1,2]]) == 1
    assert max_meetings_greedy([[0,1],[1,2],[2,3]]) == 3
`,
};
