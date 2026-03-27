import type { LearnDetailSection } from "../../learnSectionTypes";

/** Classic left/right scan on sorted array — O(n) time, O(1) space. */
export const twoPointersOpposing: LearnDetailSection = {
  title: "Two-pointer technique — O(n) time, O(1) extra space (sorted array)",
  body:
    "If the array is sorted in ascending order, place one pointer at the start (left) and one at the end (right). " +
    "Let sum = arr[left] + arr[right]. If sum equals the target, you are done. " +
    "If sum is too small, move left forward to increase the sum. If sum is too large, move right backward to decrease it. " +
    "Stop when left meets right.\n\n" +
    "Each step discards impossible pairs without revisiting them, so the loop runs in O(n) time.",
  code: `def pair_sum_equals_target_sorted(arr: list[int], target: int) -> bool:
    """arr must be sorted ascending. Returns True if any pair sums to target."""
    left, right = 0, len(arr) - 1
    while left < right:
        s = arr[left] + arr[right]
        if s == target:
            return True
        if s < target:
            left += 1
        else:
            right -= 1
    return False


# Examples
if __name__ == "__main__":
    print(pair_sum_equals_target_sorted([10, 20, 35, 50], 70))   # True (20 + 50)
    print(pair_sum_equals_target_sorted([10, 20, 30], 70))       # False
    print(pair_sum_equals_target_sorted([-8, 1, 4, 6, 10, 45], 16))  # True (6 + 10)
`,
};
