import type { LearnDetailSection } from "../learnSectionTypes";

export const COMPLEXITY_SECTIONS_BIG_O: LearnDetailSection[] = [
  {
    title: "Seeing it in code",
    body:
      "Here are three functions that do something with a list. " +
      "Notice how the number of steps each one takes grows differently as the list gets longer.",
    code: `# O(1) — always one step, no matter how long the list is
def get_first(nums):
    return nums[0]   # just grab index 0, done


# O(n) — one step per item
def print_all(nums):
    for x in nums:   # loop runs once for every item
        print(x)


# O(n²) — one loop inside another
def print_all_pairs(nums):
    for x in nums:
        for y in nums:   # for every item, loop again
            print(x, y)
`,
    codeLanguage: "python",
  },
];

export const COMPLEXITY_SECTIONS_CONSTANT: LearnDetailSection[] = [
  {
    title: "O(1) in practice",
    body:
      "All three operations below finish in a single step regardless of how many items are stored.",
    code: `nums = [10, 20, 30, 40, 50]

# Read by index — always one step
first = nums[0]
last  = nums[-1]

# Dict lookup — always one step (on average)
prices = {"apple": 1.5, "banana": 0.5}
cost = prices["apple"]

# Set membership check — always one step (on average)
seen = {1, 2, 3, 4}
if 5 in seen:
    print("found")
`,
    codeLanguage: "python",
  },
];

export const COMPLEXITY_SECTIONS_LOG_N: LearnDetailSection[] = [
  {
    title: "O(log n) in practice",
    body:
      "Binary search cuts the remaining candidates in half every step. " +
      "That's why 1,000,000 items only needs about 20 steps instead of 1,000,000.",
    code: `def binary_search(nums, target):
    left = 0
    right = len(nums) - 1

    while left <= right:
        mid = (left + right) // 2   # check the middle

        if nums[mid] == target:
            return mid              # found it
        elif nums[mid] < target:
            left = mid + 1          # throw away the left half
        else:
            right = mid - 1         # throw away the right half

    return -1   # not found


# Example: 1 million items, about 20 steps max
nums = list(range(1_000_000))
print(binary_search(nums, 999_999))
`,
    codeLanguage: "python",
  },
];

export const COMPLEXITY_SECTIONS_LINEAR: LearnDetailSection[] = [
  {
    title: "O(n) in practice",
    body:
      "Any time you loop through every item once, you're doing O(n) work. " +
      "Double the list size and the work doubles too.",
    code: `nums = [3, 1, 4, 1, 5, 9, 2, 6]

# Find the largest value — one pass, one step per item
def find_max(nums):
    best = nums[0]
    for x in nums:          # visits every item once
        if x > best:
            best = x
    return best


# Count how many times a value appears — one pass
def count_value(nums, target):
    count = 0
    for x in nums:          # visits every item once
        if x == target:
            count += 1
    return count


print(find_max(nums))       # 9
print(count_value(nums, 1)) # 2
`,
    codeLanguage: "python",
  },
];

export const COMPLEXITY_SECTIONS_NLOGN: LearnDetailSection[] = [
  {
    title: "O(n log n) in practice",
    body:
      "Python's built-in sort runs in O(n log n). You don't need to implement it — " +
      "just know that it's the best you can do for general sorting, and it's fast enough for millions of items.",
    code: `nums = [5, 2, 8, 1, 9, 3]

# Python's sort is O(n log n) — use it freely
nums.sort()                  # sorts in-place: [1, 2, 3, 5, 8, 9]

# sorted() returns a new list, original unchanged
result = sorted(nums, reverse=True)   # [9, 8, 5, 3, 2, 1]

# Sorting by a custom key is still O(n log n)
words = ["banana", "apple", "kiwi", "mango"]
words.sort(key=len)          # sort by word length
print(words)                 # ['kiwi', 'apple', 'mango', 'banana']
`,
    codeLanguage: "python",
  },
];

export const COMPLEXITY_SECTIONS_N2: LearnDetailSection[] = [
  {
    title: "O(n²) in practice",
    body:
      "A loop inside a loop means you're doing n × n steps. " +
      "For 1,000 items that's 1,000,000 steps. For 10,000 items it's 100,000,000 — very slow.",
    code: `nums = [1, 2, 3, 4, 5]

# Check every pair — O(n²)
def find_pair_with_sum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):   # inner loop
            if nums[i] + nums[j] == target:
                return (nums[i], nums[j])
    return None

print(find_pair_with_sum(nums, 7))  # (2, 5) — but takes n² steps


# The O(n) way: use a set instead of a second loop
def find_pair_fast(nums, target):
    seen = set()
    for x in nums:
        complement = target - x
        if complement in seen:          # O(1) lookup
            return (complement, x)
        seen.add(x)
    return None

print(find_pair_fast(nums, 7))  # (2, 5) — same answer, much faster
`,
    codeLanguage: "python",
  },
];

export const COMPLEXITY_SECTIONS_EXPONENTIAL: LearnDetailSection[] = [
  {
    title: "O(2^n) in practice",
    body:
      "Every time you add one more item, the work doubles. " +
      "Adding memoization (storing results you already computed) fixes this and brings it down to O(n).",
    code: `# Slow: O(2^n) — recomputes the same values over and over
def fib_slow(n):
    if n <= 1:
        return n
    return fib_slow(n - 1) + fib_slow(n - 2)  # called twice every step!

# fib_slow(40) is already noticeably slow


# Fast: O(n) — store each result so it's never recomputed
def fib_fast(n, memo={}):
    if n <= 1:
        return n
    if n in memo:
        return memo[n]          # already computed, return instantly
    memo[n] = fib_fast(n - 1, memo) + fib_fast(n - 2, memo)
    return memo[n]

print(fib_fast(100))  # instant, even for large n
`,
    codeLanguage: "python",
  },
];

export const COMPLEXITY_SECTIONS_SPACE: LearnDetailSection[] = [
  {
    title: "Space complexity in practice",
    body:
      "Space complexity measures the extra memory your code creates — not counting the input itself. " +
      "O(1) extra space means you only use a handful of variables. O(n) extra space means you create a new structure that grows with the input.",
    code: `nums = [1, 2, 3, 4, 5]

# O(1) extra space — just a few variables, no new list
def sum_in_place(nums):
    total = 0           # one variable
    for x in nums:
        total += x
    return total


# O(n) extra space — creates a new list the same size as the input
def double_all(nums):
    result = []         # grows with input size
    for x in nums:
        result.append(x * 2)
    return result


# O(n) extra space — recursion uses stack space too
def countdown(n):
    if n == 0:
        return
    countdown(n - 1)    # each call sits on the call stack until it returns
                        # n calls deep = O(n) stack space
`,
    codeLanguage: "python",
  },
];
