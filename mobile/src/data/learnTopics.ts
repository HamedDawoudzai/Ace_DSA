export type LearnTrack = "data-structures" | "algorithms";

export interface LearnTopic {
  id: string;
  track: LearnTrack;
  title: string;
  subtitle: string;
  level: number;
  summary: string;
  details: string;
}

export const DATA_STRUCTURE_TOPICS: LearnTopic[] = [
  {
    id: "ds-arrays",
    track: "data-structures",
    title: "Arrays",
    subtitle: "Indexed contiguous storage",
    level: 1,
    summary: "The foundation for most DSA problems and higher-level structures.",
    details:
      "An array is a contiguous block of memory where elements are stored back-to-back and accessed by index. " +
      "Random access is O(1), but inserting or deleting in the middle can be O(n) because elements may need to shift. " +
      "Most languages expose fixed-length arrays and dynamic array wrappers (like slices or vectors) that manage resizing. " +
      "Interview patterns like two pointers, sliding windows, and prefix sums almost always begin with arrays.",
  },
  {
    id: "ds-strings",
    track: "data-structures",
    title: "Strings",
    subtitle: "Arrays of characters",
    level: 2,
    summary: "Specialized arrays; core to many LeetCode-style questions.",
    details:
      "A string is usually an immutable array of characters. Under the hood it behaves like an array with length, indexing, and slicing. " +
      "Because strings are often immutable, operations that appear to modify a string create a new one. " +
      "In algorithm problems, string challenges are typically solved using array techniques such as sliding windows, hashing, and prefix sums.",
  },
  {
    id: "ds-linked-lists",
    track: "data-structures",
    title: "Linked Lists",
    subtitle: "Nodes connected by pointers",
    level: 3,
    summary: "Lets you insert/delete in the middle by rewiring pointers instead of shifting elements.",
    details:
      "A linked list is a sequence of nodes where each node holds data and a reference to the next node (and sometimes the previous node). " +
      "Accessing the k-th element is O(k), but inserting or deleting at a known position is O(1). " +
      "Common interview patterns: fast/slow pointers, cycle detection (Floyd's algorithm), reversing a list, and merging sorted lists.",
  },
  {
    id: "ds-stacks",
    track: "data-structures",
    title: "Stacks",
    subtitle: "Last-in, first-out (LIFO)",
    level: 4,
    summary: "Used for undo, parsing, recursion, and many monotonic-stack problems.",
    details:
      "A stack supports push and pop from one end in O(1). It is typically implemented using an array or a linked list. " +
      "Stacks naturally represent nested structure: parentheses validation, expression evaluation, monotonic stacks for next-greater-element, " +
      "and managing recursion frames (the call stack) are all stack-based patterns.",
  },
  {
    id: "ds-queues",
    track: "data-structures",
    title: "Queues & Deques",
    subtitle: "First-in, first-out and double-ended",
    level: 5,
    summary: "Natural for processing items in arrival order; core for BFS and sliding window.",
    details:
      "A queue supports enqueue at the back and dequeue from the front in O(1). It is used any time you need to process things in arrival order. " +
      "Breadth-first search (BFS) on trees and graphs is implemented with a queue. Deques (double-ended queues) generalize queues so you can push/pop from both ends, " +
      "and are the backbone of sliding-window maximum/minimum patterns.",
  },
  {
    id: "ds-hash-tables",
    track: "data-structures",
    title: "Hash Tables / Sets",
    subtitle: "Key → value lookup in O(1) average time",
    level: 6,
    summary: "The workhorse for counting, membership tests, and grouping.",
    details:
      "A hash table uses a hash function to map keys to buckets. With good hashing and low load factor, inserts, deletes, and lookups are O(1) on average. " +
      "Hash maps and hash sets are your default tools for counting frequencies, detecting duplicates, grouping by key, and implementing caches.",
  },
  {
    id: "ds-trees",
    track: "data-structures",
    title: "Trees & Binary Trees",
    subtitle: "Hierarchical, recursively defined structures",
    level: 7,
    summary: "Powerful for representing hierarchies; prepares you for BSTs and heaps.",
    details:
      "A tree is a connected acyclic graph with a root. Binary trees restrict each node to at most two children. " +
      "Recursive definitions make traversal algorithms like pre-order, in-order, and post-order natural. " +
      "Many interview questions on recursion, divide-and-conquer, and dynamic programming are easier once you are comfortable with trees.",
  },
  {
    id: "ds-bsts",
    track: "data-structures",
    title: "Binary Search Trees",
    subtitle: "Ordered binary trees",
    level: 8,
    summary: "Maintain sorted data with efficient inserts, deletes, and lookups.",
    details:
      "A binary search tree (BST) maintains the invariant: left subtree < node < right subtree. " +
      "This allows search, insert, and delete in O(h) where h is the tree height. " +
      "In interviews, BSTs appear in problems about validation, kth-smallest elements, ranges, and building balanced trees from sorted arrays.",
  },
  {
    id: "ds-heaps",
    track: "data-structures",
    title: "Heaps & Priority Queues",
    subtitle: "Efficient access to min/max elements",
    level: 9,
    summary: "Great for top-k, scheduling, and graph algorithms like Dijkstra.",
    details:
      "A binary heap is an array-based tree that preserves a partial order: each parent is ≤ (min-heap) or ≥ (max-heap) its children. " +
      "Priority queues built on heaps support inserting and extracting the smallest or largest element in O(log n). " +
      "They are used in streaming top-k problems, scheduling, and shortest-path algorithms.",
  },
  {
    id: "ds-graphs",
    track: "data-structures",
    title: "Graphs",
    subtitle: "Nodes and edges",
    level: 10,
    summary: "Model relationships and networks; backbone for many advanced algorithms.",
    details:
      "Graphs model relationships as nodes connected by edges, optionally directed and weighted. " +
      "They are represented with adjacency lists or matrices. Many real-world problems (networks, prerequisites, maps) are graph problems. " +
      "Understanding graph representations is essential before learning BFS, DFS, Dijkstra, and topological sort.",
  },
  {
    id: "ds-tries",
    track: "data-structures",
    title: "Tries",
    subtitle: "Prefix trees for strings",
    level: 11,
    summary: "Efficiently store sets of strings by shared prefixes.",
    details:
      "A trie (prefix tree) stores characters along edges so that each path from root to node represents a prefix. " +
      "It supports prefix search in O(L) where L is the length of the word. " +
      "Tries are used for autocomplete, dictionary problems, and some pattern-matching questions.",
  },
];

export const ALGO_TOPICS: LearnTopic[] = [
  {
    id: "algo-array-scan",
    track: "algorithms",
    title: "Array Scanning & Basic Loops",
    subtitle: "Single-pass patterns",
    level: 1,
    summary: "Straightforward passes through arrays and strings to build intuition.",
    details:
      "Before fancy techniques, many interview problems reduce to a careful single pass. " +
      "Get comfortable iterating, tracking running values, using prefix and suffix computations, and reasoning about off-by-one errors.",
  },
  {
    id: "algo-two-pointers",
    track: "algorithms",
    title: "Two Pointers",
    subtitle: "Move two indices through an array/string",
    level: 2,
    summary: "Optimize from O(n²) to O(n) by scanning once from both ends or at different speeds.",
    details:
      "Two pointers can both move forward (slow/fast) or start at opposite ends. " +
      "Patterns include removing duplicates, partitioning arrays, palindrome checks, and linked-list cycle detection.",
  },
  {
    id: "algo-sliding-window",
    track: "algorithms",
    title: "Sliding Window",
    subtitle: "Fixed and variable windows over sequences",
    level: 3,
    summary: "Solve substring/subarray problems in O(n) instead of O(n²).",
    details:
      "A sliding window maintains a contiguous range [L, R] while you expand or shrink it. " +
      "Fixed-size windows slide with constant length; variable windows grow and shrink depending on constraints. " +
      "This pattern underlies many substring, subarray, and stream-processing questions.",
  },
  {
    id: "algo-binary-search",
    track: "algorithms",
    title: "Binary Search",
    subtitle: "Search sorted data or answer space",
    level: 4,
    summary: "Halve the search space repeatedly to find positions or optimal values.",
    details:
      "Classic binary search finds a target in a sorted array. More advanced uses search \"answer space\" for the smallest or largest value satisfying a condition, " +
      "as long as the predicate is monotonic (false...false true...true).",
  },
  {
    id: "algo-recursion",
    track: "algorithms",
    title: "Recursion Basics",
    subtitle: "Think in terms of smaller subproblems",
    level: 5,
    summary: "Fundamental for trees, backtracking, and many divide-and-conquer solutions.",
    details:
      "Recursion solves a problem by calling itself on smaller inputs until reaching a base case. " +
      "Understanding the call stack and being able to reason about state across calls is critical for tree traversals and search algorithms.",
  },
  {
    id: "algo-backtracking",
    track: "algorithms",
    title: "Backtracking",
    subtitle: "Systematic search through possibilities",
    level: 6,
    summary: "Generate permutations, combinations, and paths while pruning dead ends.",
    details:
      "Backtracking incrementally builds a candidate solution and abandons it when constraints fail. " +
      "Typical problems include subsets, permutations, N-Queens, and word search. " +
      "Being able to clearly define the state, choices, and constraints is key.",
  },
  {
    id: "algo-sorting",
    track: "algorithms",
    title: "Sorting & Comparators",
    subtitle: "Order data to make problems easier",
    level: 7,
    summary: "Use sort as a pre-processing step for greedy, two-pointers, and sweeping algorithms.",
    details:
      "Most languages give you an O(n log n) sort with customizable comparators. " +
      "In interviews, you rarely implement quicksort from scratch; instead you rely on sorting to structure data for simpler algorithms.",
  },
  {
    id: "algo-bfs",
    track: "algorithms",
    title: "Breadth-First Search (BFS)",
    subtitle: "Layer-by-layer graph exploration",
    level: 8,
    summary: "Ideal for shortest path in unweighted graphs and level-order tree traversal.",
    details:
      "BFS uses a queue to process nodes in waves: visit all nodes at distance k before distance k+1. " +
      "This guarantees shortest paths in unweighted graphs and is widely used for grid problems, word-ladder style transformations, and multi-source searches.",
  },
  {
    id: "algo-dfs",
    track: "algorithms",
    title: "Depth-First Search (DFS)",
    subtitle: "Backtracking through all paths",
    level: 9,
    summary: "Explore as far as possible along each branch before backtracking.",
    details:
      "DFS uses a stack or recursion to go deep along a path, then backtrack. " +
      "Applications include connected components, cycle detection, topological sort, and many backtracking problems.",
  },
  {
    id: "algo-dijkstra",
    track: "algorithms",
    title: "Dijkstra's Algorithm",
    subtitle: "Shortest paths in weighted graphs",
    level: 10,
    summary: "Find the cheapest path when edges have non-negative weights.",
    details:
      "Dijkstra's algorithm uses a priority queue to repeatedly expand the closest unvisited node, relaxing edges. " +
      "It is used in routing, maps, and any problem involving minimal cost paths with non-negative weights.",
  },
  {
    id: "algo-greedy",
    track: "algorithms",
    title: "Greedy Algorithms",
    subtitle: "Local choices for global results",
    level: 11,
    summary: "Select the best local option assuming it leads to a global optimum.",
    details:
      "Greedy algorithms build solutions step by step by always choosing the locally optimal move. " +
      "They work when the problem has a matroid-like structure or optimal substructure. Classic examples include interval scheduling and some coin-change problems.",
  },
  {
    id: "algo-dp-1d",
    track: "algorithms",
    title: "Dynamic Programming (1D)",
    subtitle: "Reuse results of overlapping subproblems",
    level: 12,
    summary: "Turn exponential recursion into polynomial-time solutions.",
    details:
      "1D DP stores answers to subproblems in an array or map so each state is computed once. " +
      "Typical examples: climbing stairs, house robber, coin change, and longest increasing subsequence.",
  },
  {
    id: "algo-dp-2d",
    track: "algorithms",
    title: "Dynamic Programming (2D & Strings)",
    subtitle: "Grids, subsequences, and edit distance",
    level: 13,
    summary: "Solve grid and string problems by filling a 2D table systematically.",
    details:
      "2D DP tables encode relationships between prefixes or positions in two dimensions. " +
      "Examples include edit distance, longest common subsequence, and path counting in grids with obstacles.",
  },
];

export function getLearnTopic(track: LearnTrack, id: string): LearnTopic | undefined {
  const source = track === "data-structures" ? DATA_STRUCTURE_TOPICS : ALGO_TOPICS;
  return source.find((t) => t.id === id);
}

