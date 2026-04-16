import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const greedyPracticeSection: LearnDetailSection = {
  title: "Stretch: when greedy works (and when it does not)",
  body:
    VISUAL_ANCHOR +
    "Greedy shines when the problem has the exchange-argument property—you can prove swapping any non-greedy choice for the greedy one never hurts:\n\n" +
    "• Jump Game — can you reach the end? Track the maximum reachable index. O(n).\n" +
    "• Minimum number of arrows to burst balloons — same as activity selection by end coordinate.\n" +
    "• Gas station — check if total gas ≥ total cost; find the valid starting station in one pass.\n" +
    "• Coin change (special coin sets only) — greedy works for canonical coin sets (1, 5, 10, 25); fails for arbitrary denominations (use DP instead).\n\n" +
    "Below: Jump Game—classic O(n) greedy where you track the furthest index reachable.",
  codeLanguage: "python",
  code: `def can_jump(nums: list[int]) -> bool:
    """O(n) greedy. Track max reachable index."""
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach:
            return False        # stuck — cannot reach index i
        max_reach = max(max_reach, i + jump)
    return True


if __name__ == "__main__":
    assert can_jump([2, 3, 1, 1, 4]) is True
    assert can_jump([3, 2, 1, 0, 4]) is False
`,
};
