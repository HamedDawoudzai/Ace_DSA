import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const slidingWindowPracticeSection: LearnDetailSection = {
  title: "Stretch: variable-size windows",
  body:
    VISUAL_ANCHOR +
    "Fixed-size is just the entry point. Variable windows unlock harder problems:\n\n" +
    "• Longest substring without repeating characters — expand right until duplicate, shrink left until clean.\n" +
    "• Minimum window substring — shrink once the window contains all required characters.\n" +
    "• Fruits into baskets / at-most-K distinct characters — classic 'at most K types' variable window.\n" +
    "• Subarray product less than K — right expands freely, left advances when product breaks the limit.\n\n" +
    "Below: longest substring without repeating characters—the most common variable-window starter.",
  codeLanguage: "python",
  code: `def length_of_longest_unique(s: str) -> int:
    """Variable window. O(n) time, O(min(n, alphabet)) space."""
    seen: dict[str, int] = {}  # char -> last index seen
    best = 0
    left = 0
    for right, ch in enumerate(s):
        if ch in seen and seen[ch] >= left:
            left = seen[ch] + 1
        seen[ch] = right
        best = max(best, right - left + 1)
    return best


if __name__ == "__main__":
    assert length_of_longest_unique("abcabcbb") == 3   # "abc"
    assert length_of_longest_unique("bbbbb") == 1      # "b"
    assert length_of_longest_unique("pwwkew") == 3     # "wke"
`,
};
