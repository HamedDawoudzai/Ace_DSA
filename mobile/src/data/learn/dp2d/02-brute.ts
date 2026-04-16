import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const dp2dBruteSection: LearnDetailSection = {
  title: "Naive recursion: exponential overlapping calls",
  body:
    VISUAL_ANCHOR +
    "Define lcs(i, j) = LCS length for s[0..i-1] and t[0..j-1].\n\n" +
    "If s[i−1] == t[j−1]: lcs(i, j) = 1 + lcs(i−1, j−1).\n" +
    "Otherwise: lcs(i, j) = max(lcs(i−1, j), lcs(i, j−1)).\n\n" +
    "Base case: lcs(0, j) = lcs(i, 0) = 0 (empty prefix has no match).\n\n" +
    "Without caching, the same (i, j) pair is recomputed many times. " +
    "Time is O(2^(m+n)) in the worst case—every non-match forks into two recursive calls.",
  codeLanguage: "python",
  code: `def lcs_naive(s: str, t: str, i: int | None = None, j: int | None = None) -> int:
    """O(2^(m+n)) — no memoization."""
    if i is None:
        i, j = len(s), len(t)
    if i == 0 or j == 0:
        return 0
    if s[i - 1] == t[j - 1]:
        return 1 + lcs_naive(s, t, i - 1, j - 1)
    return max(lcs_naive(s, t, i - 1, j), lcs_naive(s, t, i, j - 1))


if __name__ == "__main__":
    assert lcs_naive("abcde", "ace") == 3
    assert lcs_naive("abc", "def") == 0
    # lcs_naive on strings of length 30+ would be very slow
`,
};
