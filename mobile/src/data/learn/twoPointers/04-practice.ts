import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const practiceSection: LearnDetailSection = {
  title: "Stretch: more two-pointer patterns",
  body:
    VISUAL_ANCHOR +
    "Same idea, different shapes:\n\n" +
    "• 3Sum / 4Sum — fix one (or more) indices, run two pointers on the rest.\n" +
    "• Container With Most Water, Trapping Rain Water — opposite ends with height logic.\n" +
    "• Palindrome checks — expand from both ends or compare symmetric indices.\n" +
    "• Linked lists — slow/fast (Floyd) for cycles and middle node.\n\n" +
    "Below: palindrome check as a tiny two-pointer template.",
  codeLanguage: "python",
  code: `def is_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True
`,
};
