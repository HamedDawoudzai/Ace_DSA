import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const slidingWindowBruteSection: LearnDetailSection = {
  title: "Brute force: sum every window from scratch",
  body:
    VISUAL_ANCHOR +
    "For each valid starting position i (from 0 to n − k), sum the k elements arr[i..i+k−1] using an inner loop.\n\n" +
    "There are n − k + 1 windows, each takes O(k) to sum. Total time is O(n × k).\n\n" +
    "For n = 100 000 and k = 50 000, that is 5 billion operations. " +
    "We are recomputing shared elements over and over—the same work done by the previous window is thrown away.",
  codeLanguage: "python",
  code: `def max_window_sum_brute(arr: list[int], k: int) -> int:
    """O(n * k) time."""
    n = len(arr)
    best = float("-inf")
    for i in range(n - k + 1):
        window_sum = 0
        for j in range(i, i + k):
            window_sum += arr[j]
        best = max(best, window_sum)
    return int(best)


if __name__ == "__main__":
    assert max_window_sum_brute([2, 1, 5, 1, 3, 2], 3) == 9
    assert max_window_sum_brute([4, 2, 1, 7, 8, 1, 2, 8, 1, 0], 3) == 16
`,
};
