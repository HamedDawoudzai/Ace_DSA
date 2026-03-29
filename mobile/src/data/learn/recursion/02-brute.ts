import type { LearnDetailSection } from "../../learnSectionTypes";

export const recursionBruteSection: LearnDetailSection = {
  title: "Naive recursion: elegant but exponential",
  body:
    "Translate the definition directly: F(n) = F(n−1) + F(n−2), with base cases F(0) = 0 and F(1) = 1.\n\n" +
    "This is correct but expensive. F(5) calls F(4) and F(3). F(4) calls F(3) and F(2). " +
    "F(3) is computed twice, F(2) three times, F(1) five times—the work explodes exponentially.\n\n" +
    "Time complexity is O(2^n). For n = 50, that is over one quadrillion recursive calls. " +
    "The call tree is a binary tree of depth n, and every leaf re-derives the same values.",
  codeLanguage: "python",
  code: `def fib_naive(n: int) -> int:
    """O(2^n) time — exponential due to repeated sub-problems."""
    if n <= 1:
        return n
    return fib_naive(n - 1) + fib_naive(n - 2)


if __name__ == "__main__":
    assert fib_naive(0) == 0
    assert fib_naive(6) == 8
    assert fib_naive(10) == 55
    # fib_naive(50) would take years to finish
`,
};
