import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const recursionOptimizedSection: LearnDetailSection = {
  title: "Memoization: cache results, turn it into O(n)",
  body:
    VISUAL_ANCHOR +
    "The fix is simple: store results you have already computed in a dictionary (memo). " +
    "Before computing F(k), check if you have seen it before—if yes, return immediately.\n\n" +
    "Now each unique sub-problem (F(0), F(1), …, F(n)) is computed exactly once. " +
    "Total calls drop from O(2^n) to O(n). Space is O(n) for the memo table and the call stack.\n\n" +
    "This technique—recursion plus caching—is called top-down dynamic programming. " +
    "It is the gateway into DP: you keep the natural recursive structure but avoid redundant work.\n\n" +
    "Alternative (bottom-up): build a table from F(0) upward using a loop, which avoids recursion entirely and reduces stack usage.",
  codeLanguage: "python",
  code: `def fib_memo(n: int, memo: dict[int, int] | None = None) -> int:
    """O(n) time, O(n) space — top-down DP with memoization."""
    if memo is None:
        memo = {}
    if n <= 1:
        return n
    if n in memo:
        return memo[n]
    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]


def fib_bottom_up(n: int) -> int:
    """O(n) time, O(1) space — iterative / bottom-up DP."""
    if n <= 1:
        return n
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr


if __name__ == "__main__":
    assert fib_memo(10) == 55
    assert fib_bottom_up(10) == 55
    assert fib_bottom_up(50) == 12586269025
`,
};
