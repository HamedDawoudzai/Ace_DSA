import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const backtrackingPracticeSection: LearnDetailSection = {
  title: "Stretch: pruning makes backtracking powerful",
  body:
    VISUAL_ANCHOR +
    "The same template handles many interview problems—the key is the pruning condition:\n\n" +
    "• Permutations — loop over remaining choices (track a visited set instead of a start index).\n" +
    "• Combinations summing to target — prune when running sum exceeds target; skip duplicates after sorting.\n" +
    "• N-Queens — prune when the placed queen attacks any earlier queen (column, diagonal checks).\n" +
    "• Sudoku solver — prune when a digit violates row, column, or box constraints.\n" +
    "• Word search in a grid — DFS + backtrack; prune when out of bounds or character mismatches.\n\n" +
    "Below: combinations that sum to a target—note how 'if total > target: return' prunes entire branches.",
  codeLanguage: "python",
  code: `def combination_sum(candidates: list[int], target: int) -> list[list[int]]:
    """Each candidate may be reused. O(n^(T/m)) worst case where m = min candidate."""
    result: list[list[int]] = []
    candidates.sort()

    def backtrack(start: int, current: list[int], total: int) -> None:
        if total == target:
            result.append(list(current))
            return
        for i in range(start, len(candidates)):
            if total + candidates[i] > target:
                break                           # pruning: sorted, so no point continuing
            current.append(candidates[i])
            backtrack(i, current, total + candidates[i])
            current.pop()

    backtrack(0, [], 0)
    return result


if __name__ == "__main__":
    assert combination_sum([2, 3, 6, 7], 7) == [[2, 2, 3], [7]]
    assert combination_sum([2, 3, 5], 8) == [[2, 2, 2, 2], [2, 3, 3], [3, 5]]
`,
};
