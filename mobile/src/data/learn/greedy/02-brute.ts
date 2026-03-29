import type { LearnDetailSection } from "../../learnSectionTypes";

export const greedyBruteSection: LearnDetailSection = {
  title: "Brute force: try every subset",
  body:
    "For n meetings, check all 2^n subsets. For each subset, verify that no two meetings overlap. " +
    "Track the largest valid subset size.\n\n" +
    "Time: O(n² × 2^n)—exponential. For n = 30 that is 900 billion subset checks. " +
    "This exhaustively explores every combination but throws away the key insight: you do not need to try everything when a simple ordering rule works.",
  codeLanguage: "python",
  code: `def max_meetings_brute(meetings: list[list[int]]) -> int:
    """O(n^2 * 2^n) — tries all subsets."""
    n = len(meetings)
    best = 0
    for mask in range(1 << n):
        selected = [meetings[i] for i in range(n) if mask & (1 << i)]
        selected.sort()
        valid = True
        for i in range(1, len(selected)):
            if selected[i][0] < selected[i-1][1]:
                valid = False
                break
        if valid:
            best = max(best, len(selected))
    return best


if __name__ == "__main__":
    assert max_meetings_brute([[1,2],[1,2],[1,2]]) == 1
`,
};
