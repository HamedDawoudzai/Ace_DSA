import type { LearnDetailSection } from "../../learnSectionTypes";

/** Related interview patterns to practice next. */
export const twoPointersPractice: LearnDetailSection = {
  title: "More problems to practice (two pointers family)",
  body:
    "After sorted two-sum, common next steps include:\n\n" +
    "• Two Sum II (sorted array), 3Sum, 4Sum — extend one pointer setup to multiple sums or fix one index and recurse.\n" +
    "• Container With Most Water, Trapping Rain Water — opposite ends with a height or prefix structure.\n" +
    "• Merge sorted arrays / remove duplicates — both pointers advance forward.\n" +
    "• Longest substring without repeating characters — sliding window (related two-edge idea).\n" +
    "• Linked lists: middle node, cycle detection — slow and fast pointers.\n\n" +
    "Pick one pattern, implement it twice from scratch, then time yourself.",
  code: `# Tiny helper: reverse a string in-place style (two pointers toward center)
def is_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True
`,
};
