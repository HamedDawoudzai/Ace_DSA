import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const dp1dPracticeSection: LearnDetailSection = {
  title: "Stretch: classic 1D DP problems",
  body:
    VISUAL_ANCHOR +
    "Climbing stairs is the simplest 1D DP. The same pattern—define state, find recurrence, fill bottom-up—applies everywhere:\n\n" +
    "• House Robber — dp[i] = max(dp[i−2] + nums[i], dp[i−1]). Cannot rob adjacent houses.\n" +
    "• Coin Change — dp[amount] = min coins needed. Inner loop: try each coin.\n" +
    "• Longest Increasing Subsequence — dp[i] = length of LIS ending at index i.\n" +
    "• Word Break — dp[i] = True if s[0..i] can be segmented using the dictionary.\n\n" +
    "Below: House Robber—the classic 'skip or take' 1D DP.",
  codeLanguage: "python",
  code: `def house_robber(nums: list[int]) -> int:
    """O(n) time, O(1) space. dp[i] = max loot up to house i."""
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    prev2, prev1 = 0, nums[0]
    for i in range(1, len(nums)):
        curr = max(prev1, prev2 + nums[i])
        prev2, prev1 = prev1, curr
    return prev1


if __name__ == "__main__":
    assert house_robber([1, 2, 3, 1]) == 4     # rob houses 0 and 2
    assert house_robber([2, 7, 9, 3, 1]) == 12 # rob houses 0, 2, 4
`,
};
