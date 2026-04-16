import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const dp1dOptimizedSection: LearnDetailSection = {
  title: "1D DP: turn it into O(n)",
  body:
    VISUAL_ANCHOR +
    "Build a DP table where dp[i] = number of ways to reach step i.\n\n" +
    "Fill bottom-up: dp[1] = 1, dp[2] = 2, then for i from 3 to n: dp[i] = dp[i−1] + dp[i−2].\n\n" +
    "Each sub-problem is computed exactly once → O(n) time, O(n) space for the table.\n\n" +
    "Space optimisation: because dp[i] only depends on the two previous values, you can replace the array with two variables, reducing space to O(1).\n\n" +
    "The pattern: identify the recurrence → define the DP state → choose filling order (bottom-up from base cases) → spot any space reduction.",
  codeLanguage: "python",
  code: `def climb_stairs_dp(n: int) -> int:
    """O(n) time, O(1) space — rolling two variables."""
    if n <= 2:
        return n
    prev, curr = 1, 2
    for _ in range(3, n + 1):
        prev, curr = curr, prev + curr
    return curr


if __name__ == "__main__":
    assert climb_stairs_dp(2) == 2
    assert climb_stairs_dp(3) == 3
    assert climb_stairs_dp(5) == 8
    assert climb_stairs_dp(45) == 1836311903
`,
};
