import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const recursionPracticeSection: LearnDetailSection = {
  title: "Stretch: thinking recursively",
  body:
    VISUAL_ANCHOR +
    "Recursion is the foundation for trees, graphs, divide-and-conquer, and backtracking:\n\n" +
    "• Power(x, n) — x^n = x × x^(n−1); halve with x^n = (x^(n/2))^2 for O(log n).\n" +
    "• Tree height — height(node) = 1 + max(height(left), height(right)).\n" +
    "• Merge sort — split in half, sort each, merge. Classic divide-and-conquer.\n" +
    "• Flatten nested list — recurse into each sub-list; base case is a plain integer.\n\n" +
    "Template for any recursive function:\n" +
    "1. Base case — what is the simplest input I can handle directly?\n" +
    "2. Recursive case — what smaller version of the same problem do I delegate?\n" +
    "3. Combine — how do I build the final answer from the recursive results?\n\n" +
    "Below: fast power showing how halving the exponent reduces O(n) to O(log n).",
  codeLanguage: "python",
  code: `def fast_power(x: float, n: int) -> float:
    """O(log n) time. Handles negative exponents."""
    if n == 0:
        return 1.0
    if n < 0:
        return 1.0 / fast_power(x, -n)
    half = fast_power(x, n // 2)
    if n % 2 == 0:
        return half * half
    return half * half * x


if __name__ == "__main__":
    assert fast_power(2, 10) == 1024.0
    assert abs(fast_power(2, -2) - 0.25) < 1e-9
`,
};
