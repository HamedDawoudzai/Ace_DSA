import type { LearnDetailSection } from "../../learnSectionTypes";

export const backtrackingOptimizedSection: LearnDetailSection = {
  title: "Backtracking: systematic search with clean undo",
  body:
    "Define a recursive helper that takes the current starting index and the subset being built.\n\n" +
    "At each call:\n" +
    "1. Record the current subset as a valid answer.\n" +
    "2. Loop from start to end of the array. For each element: append it, recurse deeper (start = i + 1), then remove it (undo / backtrack).\n\n" +
    "The 'append then remove' pair is the key—it lets the same array track the state without copies. " +
    "Time is still O(n × 2^n) because you must output 2^n subsets, but backtracking is the idiomatic pattern that scales to constrained problems (permutations, N-Queens, Sudoku) where the bitmask approach cannot easily prune invalid branches.",
  codeLanguage: "python",
  code: `def subsets_backtrack(nums: list[int]) -> list[list[int]]:
    """O(n * 2^n) time. Backtracking with undo."""
    result: list[list[int]] = []

    def backtrack(start: int, current: list[int]) -> None:
        result.append(list(current))   # snapshot current subset
        for i in range(start, len(nums)):
            current.append(nums[i])    # include nums[i]
            backtrack(i + 1, current)
            current.pop()              # undo — try without nums[i]

    backtrack(0, [])
    return result


if __name__ == "__main__":
    out = subsets_backtrack([1, 2, 3])
    assert len(out) == 8
    assert [] in out
    assert [1, 2, 3] in out
`,
};
