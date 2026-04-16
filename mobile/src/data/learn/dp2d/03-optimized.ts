import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const dp2dOptimizedSection: LearnDetailSection = {
  title: "2D DP table: turn it into O(m × n)",
  body:
    VISUAL_ANCHOR +
    "Create a (m+1) × (n+1) table initialised to 0. Row indices represent prefixes of s, column indices prefixes of t.\n\n" +
    "Fill row by row:\n" +
    "• If s[i−1] == t[j−1]: dp[i][j] = dp[i−1][j−1] + 1.\n" +
    "• Otherwise: dp[i][j] = max(dp[i−1][j], dp[i][j−1]).\n\n" +
    "The sentinel row/column of zeros handles the base cases automatically. " +
    "Answer is dp[m][n].\n\n" +
    "Time: O(m × n). Space: O(m × n) for the table, reducible to O(min(m, n)) by keeping only two rows at a time.",
  codeLanguage: "python",
  code: `def lcs_dp(s: str, t: str) -> int:
    """O(m * n) time and space."""
    m, n = len(s), len(t)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s[i - 1] == t[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]


if __name__ == "__main__":
    assert lcs_dp("abcde", "ace") == 3
    assert lcs_dp("abc", "abc") == 3
    assert lcs_dp("abc", "def") == 0
    assert lcs_dp("oxcpqrsvwf", "shmtulqrypy") == 2
`,
};
