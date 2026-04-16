import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const backtrackingBruteSection: LearnDetailSection = {
  title: "Brute force: enumerate with bitmasks",
  body:
    VISUAL_ANCHOR +
    "For n elements there are 2^n subsets. Each subset maps to a bitmask from 0 to 2^n − 1, " +
    "where bit i being set means element i is included.\n\n" +
    "Loop over every bitmask, decode which elements are in, collect the subset. " +
    "Time is O(n × 2^n)—correct, but every subset must still be generated. " +
    "There is no shortcut: for n = 20, that is 20 million iterations.",
  codeLanguage: "python",
  code: `def subsets_bitmask(nums: list[int]) -> list[list[int]]:
    """O(n * 2^n) time. Iterates every possible bitmask."""
    n = len(nums)
    result = []
    for mask in range(1 << n):          # 0 .. 2^n - 1
        subset = []
        for i in range(n):
            if mask & (1 << i):
                subset.append(nums[i])
        result.append(subset)
    return result


if __name__ == "__main__":
    out = subsets_bitmask([1, 2, 3])
    assert len(out) == 8
    assert [] in out
    assert [1, 2, 3] in out
`,
};
