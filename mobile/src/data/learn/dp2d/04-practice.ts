import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const dp2dPracticeSection: LearnDetailSection = {
  title: "Stretch: other 2D DP classics",
  body:
    VISUAL_ANCHOR +
    "The same 'fill a table of (i, j) states' idea powers many problems:\n\n" +
    "• Edit Distance — dp[i][j] = min insertions/deletions/substitutions to turn s[0..i] into t[0..j].\n" +
    "• Unique Paths — dp[i][j] = paths to reach cell (i, j) in a grid from (0, 0). dp[i][j] = dp[i−1][j] + dp[i][j−1].\n" +
    "• Coin Change 2 (combinations) — dp[i][j] = ways to make amount j with first i coin types.\n" +
    "• 0-1 Knapsack — dp[i][w] = max value using first i items with weight limit w.\n\n" +
    "Below: edit distance—the quintessential string 2D DP.",
  codeLanguage: "python",
  code: `def edit_distance(word1: str, word2: str) -> int:
    """O(m * n) time and space. Min insert/delete/replace ops."""
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i       # delete i chars from word1
    for j in range(n + 1):
        dp[0][j] = j       # insert j chars
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],      # delete from word1
                    dp[i][j - 1],      # insert into word1
                    dp[i - 1][j - 1],  # replace
                )
    return dp[m][n]


if __name__ == "__main__":
    assert edit_distance("horse", "ros") == 3
    assert edit_distance("intention", "execution") == 5
`,
};
