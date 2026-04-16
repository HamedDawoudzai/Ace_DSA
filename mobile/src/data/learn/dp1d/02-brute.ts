import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const dp1dBruteSection: LearnDetailSection = {
  title: "Naive recursion: correct but exponential",
  body:
    VISUAL_ANCHOR +
    "Translate the recurrence directly: ways(n) = ways(n−1) + ways(n−2), with ways(1) = 1 and ways(2) = 2.\n\n" +
    "This forms a binary call tree of depth n. Sub-problems are solved over and over: " +
    "ways(n−2) is computed by both the ways(n−1) branch and directly. " +
    "Time is O(2^n)—the same exponential blowup as naive Fibonacci.",
  codeLanguage: "python",
  code: `def climb_stairs_naive(n: int) -> int:
    """O(2^n) — overlapping sub-problems recomputed each time."""
    if n <= 2:
        return n
    return climb_stairs_naive(n - 1) + climb_stairs_naive(n - 2)


if __name__ == "__main__":
    assert climb_stairs_naive(2) == 2
    assert climb_stairs_naive(3) == 3
    assert climb_stairs_naive(5) == 8
    # climb_stairs_naive(50) would run for an extremely long time
`,
};
