import { ImageSourcePropType } from "react-native";
import type { LearnDetailSection } from "./learnSectionTypes";
import { ARRAY_SCAN_SECTIONS } from "./learn/arrayScan";
import { TWO_POINTERS_SECTIONS } from "./learn/twoPointers";
import { SLIDING_WINDOW_SECTIONS } from "./learn/slidingWindow";
import { BINARY_SEARCH_SECTIONS } from "./learn/binarySearch";
import { RECURSION_SECTIONS } from "./learn/recursion";
import { BACKTRACKING_SECTIONS } from "./learn/backtracking";
import { SORTING_SECTIONS } from "./learn/sorting";
import { BFS_SECTIONS } from "./learn/bfs";
import { DFS_SECTIONS } from "./learn/dfs";
import { DIJKSTRA_SECTIONS } from "./learn/dijkstra";
import { GREEDY_SECTIONS } from "./learn/greedy";
import { DP_1D_SECTIONS } from "./learn/dp1d";
import { DP_2D_SECTIONS } from "./learn/dp2d";

export type LearnTrack = "data-structures" | "algorithms";

export interface LearnTopic {
  id: string;
  track: LearnTrack;
  title: string;
  subtitle: string;
  level: number;
  summary: string;
  details: string;
  /** Optional deep-dive sections (e.g. Python snippets) for algorithm guides */
  detailSections?: LearnDetailSection[];
  /** Shown on detail screen when set, e.g. "27 Mar 2026" */
  lastUpdated?: string;
  image?: ImageSourcePropType;
  imageLight?: ImageSourcePropType;
  imageDark?: ImageSourcePropType;
  generalUnderstanding?: string;
  teachingNotes?: string[];
  leetcodeTactics?: string[];
  relatedAlgorithmIds?: string[];
}

export const DATA_STRUCTURE_TOPICS: LearnTopic[] = [
  {
    id: "ds-arrays",
    track: "data-structures",
    title: "Arrays",
    subtitle: "Indexed contiguous storage",
    level: 1,
    summary: "Arrays are contiguous blocks of values you can jump to by index.",
    imageLight: require("../../assets/images/arrays_light_mode.png"),
    imageDark: require("../../assets/images/arrays_dark_mode.png"),
    details:
      "Picture an array as a row of numbered boxes.\n\n" +
      "The key benefit is speed: reading `arr[i]` is O(1) because the elements live next to each other in memory. " +
      "The trade-off is what happens when you edit in the middle—if you insert/delete, many later elements may need to shift (O(n)).\n\n" +
      "For LeetCode, arrays are where most “scanning” patterns start: keep an invariant with pointers, slide a window, or use prefix sums to answer range questions.",
    generalUnderstanding:
      "Use arrays when the problem is naturally ordered and you need index-based access (subarrays, intervals, two pointers, windows).",
    teachingNotes: [
      "Index = position. Because arrays are contiguous, “jumping” to an element is fast.",
      "If you change the middle, ask: “what needs to shift?” That’s where O(n) comes from.",
      "Start every array solution by stating your invariant: what do `L` and `R` represent?",
    ],
    leetcodeTactics: [
      "Track boundaries and invariants for left/right pointers.",
      "Precompute prefix/suffix values to answer range queries quickly.",
      "Convert nested loops to one-pass or two-pass scans when possible.",
    ],
    relatedAlgorithmIds: ["algo-array-scan", "algo-two-pointers", "algo-sliding-window", "algo-binary-search"],
  },
  {
    id: "ds-strings",
    track: "data-structures",
    title: "Strings",
    subtitle: "Arrays of characters",
    level: 2,
    summary: "Strings are sequences of characters—think “arrays,” with text rules.",
    imageLight: require("../../assets/images/string_light_mode.png"),
    imageDark: require("../../assets/images/string_dark_mode.png"),
    details:
      "Most programming languages treat a string like an array of characters, where you can still access characters by index.\n\n" +
      "Two important “real world” details: (1) many strings are immutable, so “changing” them can create a new string, and (2) string problems often care about character order and counts.\n\n" +
      "That’s why many LeetCode string problems reduce to classic array patterns: two pointers, sliding windows, and frequency/hash checks.",
    generalUnderstanding:
      "Use strings when the order of characters matters and you need constraints on substrings (frequency, uniqueness, palindromes).",
    teachingNotes: [
      "Convert “text” problems into index logic: windows, pointers, and comparisons.",
      "When the task mentions frequency/uniqueness, reach for a map/set with a sliding window.",
      "For palindromes and symmetry, two pointers (expand inward) are usually the cleanest first idea.",
    ],
    leetcodeTactics: [
      "Use frequency maps to compare character windows efficiently.",
      "Build canonical forms (sorted signature or counts) for grouping.",
      "Use two pointers for palindrome and substring constraints.",
    ],
    relatedAlgorithmIds: ["algo-array-scan", "algo-sliding-window", "algo-two-pointers", "algo-dp-2d"],
  },
  {
    id: "ds-linked-lists",
    track: "data-structures",
    title: "Linked Lists",
    subtitle: "Nodes connected by pointers",
    level: 3,
    summary: "Linked lists chain nodes, making “re-linking” easy and random access slow.",
    imageLight: require("../../assets/images/singly_linked_list_light_mode.png"),
    imageDark: require("../../assets/images/singly_linked_list_dark_mode.png"),
    details:
      "Picture a linked list as a line of nodes where each node points to the next one.\n\n" +
      "Because nodes aren’t stored contiguously, reaching the k-th element takes O(k). But once you’re at the right neighborhood, inserting/deleting is often O(1) because you only update pointers.\n\n" +
      "That pointer rewiring leads to classic interview patterns: cycle detection (fast/slow), reversing a list, and merging lists.",
    generalUnderstanding:
      "Use linked lists when the problem’s focus is changing structure (insert/delete/reverse) rather than random reads.",
    teachingNotes: [
      "Pointer choreography matters: always know what `prev`, `curr`, and `next` mean.",
      "Dummy head nodes simplify edge cases (especially operations that might change the real head).",
      "Fast/slow pointers are your go-to tool for “where is the middle/cycle?” problems.",
    ],
    leetcodeTactics: [
      "Use dummy head nodes to simplify edge cases.",
      "Track slow/fast pointers for midpoint and cycle detection.",
      "Reverse in-place with prev/current/next pointer choreography.",
    ],
    relatedAlgorithmIds: ["algo-two-pointers", "algo-recursion"],
  },
  {
    id: "ds-stacks",
    track: "data-structures",
    title: "Stacks",
    subtitle: "Last-in, first-out (LIFO)",
    level: 4,
    summary: "Stacks are LIFO “history” structures: last in, first out.",
    imageLight: require("../../assets/images/stack_light_mode.png"),
    imageDark: require("../../assets/images/stack_dark_mode.png"),
    details:
      "A stack supports two main actions: `push` (add) and `pop` (remove). The last thing you added is the first thing you remove (LIFO).\n\n" +
      "Stacks model “nested” reasoning: parsing parentheses, validating expressions, and simulating recursion frames all become straightforward when you think in terms of the most recent unresolved item.\n\n" +
      "A special family you’ll see often is the monotonic stack, which keeps candidates in order so you can answer “next greater/smaller” queries efficiently.",
    generalUnderstanding:
      "Use stacks when the problem describes nesting, undo/rollback, or “resolve the most recent unfinished thing first.”",
    teachingNotes: [
      "Think “resolve the latest.” LIFO is exactly what makes many parsing problems easy.",
      "For brackets/parsing, push what you expect to see next (not just raw characters).",
      "Monotonic stacks make repeated comparisons linear because each element is pushed and popped at most once.",
    ],
    leetcodeTactics: [
      "Store indices on stack when positions matter.",
      "Use monotonic stacks to find next greater/smaller elements in linear time.",
      "Push sentinels to reduce empty-stack branching.",
    ],
    relatedAlgorithmIds: ["algo-array-scan", "algo-dfs"],
  },
  {
    id: "ds-queues",
    track: "data-structures",
    title: "Queues & Deques",
    subtitle: "First-in, first-out and double-ended",
    level: 5,
    summary: "Queues are FIFO for “arrival order.” Deques add flexibility for window problems.",
    imageLight: require("../../assets/images/queue_light_mode.png"),
    imageDark: require("../../assets/images/queue_dark_mode.png"),
    details:
      "A queue processes items in the same order they arrive: enqueue at the back, dequeue from the front.\n\n" +
      "This is why BFS (level-by-level graph/tree traversal) is implemented with a queue: you explore all nodes at distance `k` before moving to `k+1`.\n\n" +
      "A deque (double-ended queue) lets you operate on both ends. That extra control is the key to sliding-window maximum/minimum patterns where you keep only the useful candidates.",
    generalUnderstanding:
      "Use queues for level-order workflows (BFS). Use deques when your task is about maintaining the best candidate inside a moving window.",
    teachingNotes: [
      "BFS works because FIFO matches “distance waves.” That’s what gives shortest paths in unweighted graphs.",
      "A deque is the difference between scanning everything and keeping a clean candidate set for windows.",
      "For traversals, mark visited early (before enqueue) to avoid duplicate work.",
    ],
    leetcodeTactics: [
      "For BFS, process one queue length at a time to isolate levels.",
      "Use deque for sliding window max/min with a monotonic strategy.",
      "Mark visited before enqueueing to avoid duplicate work.",
    ],
    relatedAlgorithmIds: ["algo-bfs", "algo-sliding-window"],
  },
  {
    id: "ds-hash-tables",
    track: "data-structures",
    title: "Hash Tables / Sets",
    subtitle: "Key → value lookup in O(1) average time",
    level: 6,
    summary: "Hash tables let you look up by key fast (average O(1)).",
    imageLight: require("../../assets/images/hash_map_light_mode.png"),
    imageDark: require("../../assets/images/hash_map_dark_mode.png"),
    details:
      "A hash table turns a key into a bucket index using a hash function.\n\n" +
      "If hashing distributes keys well, insert/delete/lookup are O(1) on average. Internally, collisions are handled by storing multiple items per bucket (details vary by language).\n\n" +
      "In LeetCode, hashing replaces slow nested scans: you store what you’ve already seen (counts, complements, last positions) and then answer membership/queries in constant time.",
    generalUnderstanding:
      "Use hash tables when you need frequent membership checks, counting, or grouping by key—especially when you’re tempted to write nested loops.",
    teachingNotes: [
      "Hashing is “fast lookup, no ordering.” If you need order, you’ll sort later or use a tree structure.",
      "Many O(n²) problems become O(n) when you store answers as you scan once.",
      "Key design is a superpower: sometimes you combine fields into one string/tuple key.",
    ],
    leetcodeTactics: [
      "Replace nested loops with one-pass map/set lookups.",
      "Store complement or needed value to solve pair-sum style problems.",
      "Combine hash map with prefix sums for subarray counting.",
    ],
    relatedAlgorithmIds: ["algo-array-scan", "algo-sliding-window", "algo-dp-1d"],
  },
  {
    id: "ds-trees",
    track: "data-structures",
    title: "Trees & Binary Trees",
    subtitle: "Hierarchical, recursively defined structures",
    level: 7,
    summary: "Trees model hierarchy. Traversal turns structure into something you can compute on.",
    imageLight: require("../../assets/images/Binary_tree_light_mode.png"),
    imageDark: require("../../assets/images/Binary_tree_dark_mode.png"),
    details:
      "A tree is a connected structure with a root and edges leading to children, with no cycles.\n\n" +
      "A binary tree is the common variant where each node has at most two children (left and right).\n\n" +
      "The big beginner win: trees encourage recursion. You can define what a “helper” returns for each node (height, sum, max, paths), then combine child results at the current node.",
    generalUnderstanding:
      "Use trees when relationships are hierarchical (parent/child). Learn traversals because most tree problems boil down to the right traversal + the right “return value.”",
    teachingNotes: [
      "In recursion, always define: “what does my function return for a node?”",
      "Traversal order is not arbitrary: preorder vs inorder vs postorder matches *when* you need children values.",
      "If recursion is confusing, simulate the call stack with an explicit stack to debug.",
    ],
    leetcodeTactics: [
      "Return useful aggregates from recursion (height, balance, path sums).",
      "Use preorder/inorder/postorder intentionally based on dependency order.",
      "Switch to iterative traversal with explicit stack when needed.",
    ],
    relatedAlgorithmIds: ["algo-recursion", "algo-dfs", "algo-bfs"],
  },
  {
    id: "ds-bsts",
    track: "data-structures",
    title: "Binary Search Trees",
    subtitle: "Ordered binary trees",
    level: 8,
    summary: "BSTs keep data ordered so search and updates can be fast.",
    imageLight: require("../../assets/images/bst_light.png"),
    imageDark: require("../../assets/images/bst_dark_mode.png"),
    details:
      "A binary search tree (BST) has an ordering rule: everything in the left subtree is smaller than the node, and everything in the right subtree is larger.\n\n" +
      "Because of that invariant, you can search by narrowing the allowed range at each step. The time is O(h), where `h` is the height.\n\n" +
      "If the tree is balanced, O(log n) behavior appears. If it becomes skewed, worst-case height becomes O(n).",
    generalUnderstanding:
      "Use a BST mindset when the problem asks for validation, range queries, or “k-th smallest” reasoning via ordered traversal.",
    teachingNotes: [
      "BST validation feels easiest when you carry lower/upper bounds down the recursion.",
      "Deletion is all about handling cases (no child, one child, two children).",
      "Always remember: height matters. Balanced is good; skewed can degrade to O(n).",
    ],
    leetcodeTactics: [
      "Use inorder traversal to read keys in sorted order.",
      "Maintain lower/upper bounds when validating BST constraints.",
      "Track subtree sizes or reverse-inorder for kth element problems.",
    ],
    relatedAlgorithmIds: ["algo-binary-search", "algo-dfs", "algo-recursion"],
  },
  {
    id: "ds-heaps",
    track: "data-structures",
    title: "Heaps & Priority Queues",
    subtitle: "Efficient access to min/max elements",
    level: 9,
    summary: "Heaps let you repeatedly get the smallest/largest element efficiently.",
    imageLight: require("../../assets/images/max_min_heap_light_mode.png"),
    imageDark: require("../../assets/images/max_min_heap_dark_mode.png"),
    details:
      "A heap is a tree stored in an array where only a partial order is guaranteed.\n\n" +
      "In a min-heap, every parent is smaller than its children, so the smallest value is always at the root (and similarly for max-heaps with the largest at the root).\n\n" +
      "That partial order is enough for a priority queue: insert and extract min/max are O(log n). This is the backbone of top-k problems and shortest-path style algorithms.",
    generalUnderstanding:
      "Use heaps when the next step depends on the extreme element (min/max) without needing full sorting every time.",
    teachingNotes: [
      "Heaps do not fully sort. Only the root is guaranteed to be the extreme.",
      "Top-k strategy: keep k best candidates in a heap and discard the rest as you scan.",
      "In some graph problems, you may push “stale” entries. It’s normal—just validate when popping.",
    ],
    leetcodeTactics: [
      "Use min-heap of size k for top-k largest stream patterns.",
      "Use max-heap via negation or comparator for opposite priority.",
      "Push updated states and ignore stale entries when popping.",
    ],
    relatedAlgorithmIds: ["algo-dijkstra", "algo-greedy", "algo-sorting"],
  },
  {
    id: "ds-graphs",
    track: "data-structures",
    title: "Graphs",
    subtitle: "Nodes and edges",
    level: 10,
    summary: "Graphs model relationships using nodes (entities) and edges (connections).",
    imageLight: require("../../assets/images/weighted_graph_light_mode.png"),
    imageDark: require("../../assets/images/weighted_graph_dark_mode.png"),
    details:
      "A graph is a set of nodes connected by edges.\n\n" +
      "Edges can be directed or undirected, and they can have weights (costs) or not. Real problems like networks, prerequisites, and routing all reduce to graph questions.\n\n" +
      "In programming, graphs are usually stored as adjacency lists (neighbors per node). Once you’ve chosen the right representation, the main “moves” are BFS/DFS for traversal and Dijkstra for shortest paths with non-negative weights.",
    generalUnderstanding:
      "Use graphs when the relationships between items matter—especially for reachability, shortest paths, cycles, and ordering.",
    teachingNotes: [
      "Start by modeling: directed vs undirected, weighted vs unweighted, cyclic vs acyclic.",
      "Adjacency lists are usually the default and keep traversal efficient (O(V + E)).",
      "Visited state must match the problem. Sometimes it’s just `node`; sometimes it’s `node + state`.",
    ],
    leetcodeTactics: [
      "Pick adjacency list by default for sparse graphs.",
      "Track visited states carefully (node-only or node+extra-state).",
      "Classify problems first: traversal, shortest path, cycle, ordering.",
    ],
    relatedAlgorithmIds: ["algo-bfs", "algo-dfs", "algo-dijkstra"],
  },
  {
    id: "ds-tries",
    track: "data-structures",
    title: "Tries",
    subtitle: "Prefix trees for strings",
    level: 11,
    summary: "Tries store strings by shared prefixes so prefix queries are fast.",
    imageLight: require("../../assets/images/trie_light_mode.png"),
    imageDark: require("../../assets/images/trie_dark_mode.png"),
    details:
      "A trie is a prefix tree: each edge represents a character, and each root-to-node path forms a prefix.\n\n" +
      "That means prefix search takes time proportional to the word length: O(L).\n\n" +
      "Tries trade memory for speed. They are ideal for autocomplete, “dictionary word with prefix,” and wildcard/pattern expansion problems.",
    generalUnderstanding:
      "Use tries when the problem repeatedly asks about prefixes (not just full strings).",
    teachingNotes: [
      "Prefix query time depends on word length L, not the number of stored words.",
      "At minimum you need an end-of-word flag; sometimes you store frequency or an index list.",
      "If a character path is missing, you can prune immediately—tries make that fast.",
    ],
    leetcodeTactics: [
      "Store terminal flags and optional metadata at end-of-word nodes.",
      "Use DFS from trie node for wildcard/prefix expansions.",
      "Prune traversal early when character path is missing.",
    ],
    relatedAlgorithmIds: ["algo-dfs", "algo-backtracking"],
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
    imageLight: require("../../assets/images/linear_traversal_light.png"),
    imageDark: require("../../assets/images/linear_traversal_dark.png"),
    details:
      "Before fancy data structures or multi-pointer tricks, many interview problems reduce to a careful single pass through an array or string.\n\n" +
      "The key idea: compute something in one sweep—a running maximum, a running sum, a frequency count—so that questions about ranges or positions can be answered instantly without re-scanning.\n\n" +
      "When to reach for a scan-based approach:\n" +
      "• Range queries on a static array — build a prefix sum array once in O(n); every query then answers in O(1).\n" +
      "• Running extremes — track the max or min seen so far while iterating; useful for 'Best Time to Buy and Sell Stock'.\n" +
      "• Decision at each step — Kadane's algorithm (max subarray sum) decides whether to extend the current subarray or restart, all in one pass.\n" +
      "• Frequency and counting — build a character or value map in O(n) to answer 'does X appear?' in O(1) afterward.\n\n" +
      "Concrete starting point below: multiple range-sum queries on a static array. Brute force sums the slice each time in O(n). A prefix sum array built in one O(n) scan reduces every future query to O(1).",
    detailSections: ARRAY_SCAN_SECTIONS,
    lastUpdated: "29 Mar 2026",
  },
  {
    id: "algo-two-pointers",
    track: "algorithms",
    title: "Two Pointers",
    subtitle: "Move two indices through an array/string",
    level: 2,
    summary: "Optimize from O(n²) to O(n) by scanning once from both ends or at different speeds.",
    imageLight: require("../../assets/images/two_pointer_light.png"),
    imageDark: require("../../assets/images/two_pointer_dark.png"),
    details:
      "The two-pointers technique is a simple but powerful idea: you keep two indices (pointers) that move through a structure—an array, list, or string—either toward each other or in the same direction, so you can solve many problems in one pass instead of nested loops.\n\n" +
      "It shows up constantly in interviews: two sum in a sorted array, closest pair to a target, 3Sum / 4Sum, trapping rain water, palindrome checks, merging sorted arrays, and many more.\n\n" +
      "When to reach for two pointers:\n" +
      "• Sorted (or sortable) input — pairs, triples, or ranges often shrink nicely with left/right movement. Example: two numbers in a sorted array that sum to a target.\n" +
      "• Pairs, subarrays, or ranges — questions about two elements or a segment instead of a single index. Examples: longest substring without repeating characters, max consecutive ones, palindrome validation.\n" +
      "• Sliding-window family — related mindset: two edges of a window that expand or contract. Examples: smallest subarray with sum ≥ k, move zeros to the end while preserving order.\n" +
      "• Linked lists — slow and fast pointers for cycles, middle node, or reordering. Example: Floyd’s cycle detection (tortoise and hare).\n\n" +
      "Concrete starting point below: on a sorted array, does any pair sum to a target? Brute force tries every pair in O(n²). Two pointers start at both ends and move inward depending on whether the current sum is too small or too large—one linear pass, O(n) time and O(1) extra space.",
    detailSections: TWO_POINTERS_SECTIONS,
    lastUpdated: "27 Mar 2026",
  },
  {
    id: "algo-sliding-window",
    track: "algorithms",
    title: "Sliding Window",
    subtitle: "Fixed and variable windows over sequences",
    level: 3,
    summary: "Solve substring/subarray problems in O(n) instead of O(n²).",
    imageLight: require("../../assets/images/sliding_window_light.png"),
    imageDark: require("../../assets/images/sliding_window_dark.png"),
    details:
      "A sliding window maintains a contiguous range [L, R] as it moves through a sequence. Instead of recomputing the window from scratch each step, you add the new element on the right and remove the old element on the left—constant work per step.\n\n" +
      "Two shapes:\n" +
      "• Fixed-size windows — the window length k is given; slide it right by one each step. Classic use: maximum or minimum subarray sum of size k.\n" +
      "• Variable-size windows — the window expands (move R right) until a constraint breaks, then shrinks (move L right) to restore it. Classic uses: longest substring without repeating characters, smallest subarray with sum ≥ k.\n\n" +
      "When to reach for a sliding window:\n" +
      "• The problem asks about a contiguous subarray or substring.\n" +
      "• An inner loop re-examines elements the outer loop already processed—the window eliminates that.\n" +
      "• There is a monotonic relationship: as the window grows, the metric can only get better (or worse), so shrinking from the left is always safe.\n\n" +
      "Concrete starting point below: maximum sum subarray of size k. Brute force sums k elements for each of n − k + 1 starting positions in O(n × k). One initial sum plus n − k incremental additions brings it to O(n).",
    detailSections: SLIDING_WINDOW_SECTIONS,
    lastUpdated: "29 Mar 2026",
  },
  {
    id: "algo-binary-search",
    track: "algorithms",
    title: "Binary Search",
    subtitle: "Search sorted data or answer space",
    level: 4,
    summary: "Halve the search space repeatedly to find positions or optimal values.",
    imageLight: require("../../assets/images/binary_search_light.png"),
    imageDark: require("../../assets/images/binary_search_dark.png"),
    details:
      "Binary search is the art of eliminating half the remaining candidates with a single comparison. The prerequisite: some ordering or monotonic property that tells you which half to discard.\n\n" +
      "Two shapes:\n" +
      "• Classic — find a target in a sorted array. Compare the midpoint; go left or right based on whether mid is too small or too large. O(log n) comparisons.\n" +
      "• Answer-space search — you do not search the array itself; you search for the smallest (or largest) value that satisfies a condition. As long as the predicate is monotonic (false…false true…true), binary search on the answer space works. Examples: Koko eating bananas, minimum capacity to ship packages, split array largest sum.\n\n" +
      "When to reach for binary search:\n" +
      "• Sorted input and you need a position — textbook binary search.\n" +
      "• 'Find the minimum X such that condition(X) is true' — search answer space.\n" +
      "• You spot O(n) and wonder if O(log n) is possible — think binary search.\n\n" +
      "Concrete starting point below: find a target index in a sorted array. Linear scan is O(n). Binary search halves the space each step for O(log n).",
    detailSections: BINARY_SEARCH_SECTIONS,
    lastUpdated: "29 Mar 2026",
  },
  {
    id: "algo-recursion",
    track: "algorithms",
    title: "Recursion Basics",
    subtitle: "Think in terms of smaller subproblems",
    level: 5,
    summary: "Fundamental for trees, backtracking, and many divide-and-conquer solutions.",
    details:
      "Recursion is the skill of trusting that a function can solve a smaller version of its own problem. You define two things: a base case (the simplest input you handle directly) and a recursive case (how you reduce the current input into something smaller).\n\n" +
      "The runtime model: every recursive call is pushed onto the call stack. Stack depth equals the recursion depth, so a function on input n with depth n uses O(n) stack space. A stack overflow usually means a missing base case.\n\n" +
      "When to reach for recursion:\n" +
      "• The problem is defined in terms of itself — Fibonacci, factorial, tree height.\n" +
      "• You need to explore a branching structure — trees, graphs, combination generation.\n" +
      "• Divide-and-conquer — split the problem, solve each half, merge results (merge sort, quick sort).\n" +
      "• The solution is naturally expressed as 'solve for n using the answer for n−1'.\n\n" +
      "Concrete starting point below: Fibonacci numbers—defined recursively. Naive recursion is O(2^n) because sub-problems overlap. Adding a memo cache (memoization) turns it into O(n).",
    imageLight: require("../../assets/images/recursion_light.png"),
    imageDark: require("../../assets/images/recursion_dark.png"),
    detailSections: RECURSION_SECTIONS,
    lastUpdated: "29 Mar 2026",
  },
  {
    id: "algo-backtracking",
    track: "algorithms",
    title: "Backtracking",
    subtitle: "Systematic search through possibilities",
    level: 6,
    summary: "Generate permutations, combinations, and paths while pruning dead ends.",
    details:
      "Backtracking is a refined brute force: you build a solution step by step and abandon a branch the moment you know it cannot lead to a valid answer.\n\n" +
      "The template is always: choose → explore → un-choose (backtrack). The 'un-choose' step is what makes backtracking different from plain recursion—it restores state so the next sibling branch starts clean.\n\n" +
      "When to reach for backtracking:\n" +
      "• Exhaustive enumeration — subsets, permutations, combinations (all valid configurations).\n" +
      "• Constraint satisfaction — N-Queens, Sudoku, crossword fill (reject invalid states early).\n" +
      "• Path finding in an explicit search space — word search in a grid, generating valid parentheses.\n" +
      "• Optimization over all candidates — when DP does not apply and you must try every option.\n\n" +
      "The power is in pruning: a good constraint check at each level can eliminate enormous subtrees, turning what looks exponential into something practical.\n\n" +
      "Concrete starting point below: generate all subsets of a set. Every element is either included or not—a binary tree of choices. Backtracking walks that tree and records each node as a valid answer.",
    imageLight: require("../../assets/images/backtracking_light.png"),
    imageDark: require("../../assets/images/backtracking_dark.png"),
    detailSections: BACKTRACKING_SECTIONS,
    lastUpdated: "29 Mar 2026",
  },
  {
    id: "algo-sorting",
    track: "algorithms",
    title: "Sorting & Comparators",
    subtitle: "Order data to make problems easier",
    level: 7,
    summary: "Use sort as a pre-processing step for greedy, two-pointers, and sweeping algorithms.",
    details:
      "Sorting is rarely the final answer—it is the move that makes the next step obvious. Once data is ordered, neighbouring elements are candidates, opposites are the cheapest pair to compare, and sweeping algorithms become trivial.\n\n" +
      "Python's sort (Timsort) is O(n log n) and stable. You customise it with a key= function that maps each element to a comparable value. For multi-key or non-standard comparisons, use functools.cmp_to_key.\n\n" +
      "When to reach for sorting:\n" +
      "• You want to compare adjacent elements — merge intervals, meeting overlap detection.\n" +
      "• Two-pointer or binary search on unsorted input — sort first, then apply the pattern.\n" +
      "• Greedy algorithms that need a canonical order — interval scheduling (sort by end), task scheduling (sort by deadline), Huffman coding.\n" +
      "• Grouping / deduplication — sorted order clusters equal elements together.\n\n" +
      "Cost: O(n log n) time. If that is too slow, check whether a counting sort (O(n + k) for bounded values) or a partial sort (heap, quickselect) fits better.\n\n" +
      "Concrete starting point below: detect if any two meetings overlap. Brute force compares all O(n²) pairs. Sorting by start time lets a single O(n) sweep do the job.",
    imageLight: require("../../assets/images/sorting_light.png"),
    imageDark: require("../../assets/images/sorting_dark.png"),
    detailSections: SORTING_SECTIONS,
    lastUpdated: "29 Mar 2026",
  },
  {
    id: "algo-bfs",
    track: "algorithms",
    title: "Breadth-First Search (BFS)",
    subtitle: "Layer-by-layer graph exploration",
    level: 8,
    summary: "Ideal for shortest path in unweighted graphs and level-order tree traversal.",
    details:
      "BFS explores a graph level by level: first all nodes one hop from the start, then all nodes two hops away, and so on. This wave-by-wave expansion is what makes BFS uniquely suited for shortest-path problems in unweighted graphs.\n\n" +
      "The tool: a queue (FIFO). Seed it with the start node, mark it visited, then repeatedly dequeue a node, process it, and enqueue all unvisited neighbours.\n\n" +
      "When to reach for BFS:\n" +
      "• Shortest path or minimum steps in an unweighted graph or grid — BFS gives the first answer, which is guaranteed shortest.\n" +
      "• Level-order tree traversal — process all nodes at depth k before depth k+1.\n" +
      "• Multi-source problems — seed the queue with multiple starting nodes simultaneously (rotting oranges, walls and gates).\n" +
      "• 'Minimum moves' puzzles — word ladder, sliding puzzle, knight moves.\n\n" +
      "DFS vs BFS: use DFS when you need to explore a full path (cycle detection, backtracking). Use BFS when you need the shortest or minimum-cost path in an unweighted space.\n\n" +
      "Concrete starting point below: shortest path in a binary grid. DFS finds a path but not necessarily the shortest. BFS guarantees it.",
    imageLight: require("../../assets/images/bfs_light.png"),
    imageDark: require("../../assets/images/bfs_dark.png"),
    detailSections: BFS_SECTIONS,
    lastUpdated: "29 Mar 2026",
  },
  {
    id: "algo-dfs",
    track: "algorithms",
    title: "Depth-First Search (DFS)",
    subtitle: "Backtracking through all paths",
    level: 9,
    summary: "Explore as far as possible along each branch before backtracking.",
    details:
      "DFS plunges as deep as possible along one path before backing up to try the next branch. Implemented with recursion (implicit stack) or an explicit stack.\n\n" +
      "The pattern: visit a node, mark it visited, recurse into each unvisited neighbour, return when there are no more unvisited neighbours.\n\n" +
      "When to reach for DFS:\n" +
      "• Connected components — count how many times DFS is launched from the outer loop.\n" +
      "• Flood fill — once you find a target cell, sink its entire connected region before moving on.\n" +
      "• Cycle detection — track the recursion stack; revisiting a node on the current stack means a cycle.\n" +
      "• Topological sort — push each node after all its neighbours are processed.\n" +
      "• Tree traversals — pre-order, in-order, post-order are all DFS with different recording points.\n" +
      "• Backtracking problems — DFS is the engine; backtracking is the undo logic at each step.\n\n" +
      "Concrete starting point below: count islands in a grid. Each land cell launches a DFS that sinks its entire connected island, so the outer loop counts islands by counting DFS launches.",
    imageLight: require("../../assets/images/dfs_light.png"),
    imageDark: require("../../assets/images/dfs_dark.png"),
    detailSections: DFS_SECTIONS,
    lastUpdated: "29 Mar 2026",
  },
  {
    id: "algo-dijkstra",
    track: "algorithms",
    title: "Dijkstra's Algorithm",
    subtitle: "Shortest paths in weighted graphs",
    level: 10,
    summary: "Find the cheapest path when edges have non-negative weights.",
    imageLight: require("../../assets/images/djikstras_light.png"),
    imageDark: require("../../assets/images/djikstras_dark.png"),
    details:
      "Dijkstra's algorithm is BFS's weighted sibling: instead of a plain queue, it uses a min-heap (priority queue) so the node with the smallest known cost is always processed next.\n\n" +
      "Core idea: maintain a dist table of the best-known cost to reach each node. Start with dist[src] = 0 and everything else at infinity. Each time you pop a node from the heap, you try to improve the cost of each neighbour (edge relaxation). The first time you pop a node, its cost is final—provided all weights are non-negative.\n\n" +
      "When to reach for Dijkstra's:\n" +
      "• Shortest path in a weighted graph with non-negative edge weights.\n" +
      "• Navigation and routing — maps, network routing protocols (OSPF).\n" +
      "• 'Minimum cost to reach destination' problems with weighted state transitions.\n" +
      "• As a subroutine in other algorithms (A*, Johnson's).\n\n" +
      "Limitations: does not handle negative edge weights (use Bellman-Ford) and does not work for graphs with negative cycles.\n\n" +
      "Concrete starting point below: find the cheapest flight cost between cities. Brute force tries all paths (factorial). Dijkstra's processes each city at most once in O((V + E) log V).",
    detailSections: DIJKSTRA_SECTIONS,
    lastUpdated: "29 Mar 2026",
  },
  {
    id: "algo-greedy",
    track: "algorithms",
    title: "Greedy Algorithms",
    subtitle: "Local choices for global results",
    level: 11,
    summary: "Select the best local option assuming it leads to a global optimum.",
    details:
      "A greedy algorithm builds its solution one step at a time, always picking the locally best option—without reconsidering past decisions. The catch: this only works when the problem has the greedy-choice property (a local optimum leads to a global optimum).\n\n" +
      "How to verify a greedy approach: use an exchange argument. Suppose the greedy choice at step k is G and some other algorithm picks A instead. Show that swapping A for G either keeps the solution equally good or improves it. If that holds for every step, greedy is provably optimal.\n\n" +
      "When to reach for greedy:\n" +
      "• Interval problems — activity selection, minimum rooms, minimum arrows. Sort by end time, pick greedily.\n" +
      "• Jump problems — can you reach the end? Track the furthest reachable index.\n" +
      "• Task scheduling — earliest deadline first, shortest job first.\n" +
      "• Classic graph algorithms — Dijkstra's and Prim's MST are greedy at their core.\n\n" +
      "When NOT to use greedy: coin change with arbitrary denominations, 0-1 knapsack, and other problems where a local optimum blocks the global one—use DP instead.\n\n" +
      "Concrete starting point below: select the maximum number of non-overlapping meetings. Brute force checks all 2^n subsets. Greedy (sort by end, pick greedily) does it in O(n log n).",
    imageLight: require("../../assets/images/greedy_light.png"),
    imageDark: require("../../assets/images/greedy_dark.png"),
    detailSections: GREEDY_SECTIONS,
    lastUpdated: "29 Mar 2026",
  },
  {
    id: "algo-dp-1d",
    track: "algorithms",
    title: "Dynamic Programming (1D)",
    subtitle: "Reuse results of overlapping subproblems",
    level: 12,
    summary: "Turn exponential recursion into polynomial-time solutions.",
    details:
      "Dynamic programming (DP) solves problems by breaking them into overlapping sub-problems, solving each once, and storing the results. 1D DP means the state can be described by a single index—usually the position in an array or the target value.\n\n" +
      "Two flavours:\n" +
      "• Top-down (memoization) — write the natural recursion, add a cache. Easiest to derive from the recurrence.\n" +
      "• Bottom-up (tabulation) — fill a table from the base cases upward. Usually faster in practice (no recursion overhead).\n\n" +
      "The four-step DP process:\n" +
      "1. Define the state — what does dp[i] represent?\n" +
      "2. Write the recurrence — how does dp[i] depend on smaller states?\n" +
      "3. Identify base cases — what are the smallest dp values you know directly?\n" +
      "4. Choose fill order — bottom-up: fill from base cases; top-down: memoize recursively.\n\n" +
      "When to reach for 1D DP: you spot a naive recursion with repeated sub-problems and the sub-problem space is O(n).\n\n" +
      "Concrete starting point below: climbing stairs with 1-step or 2-step moves. Naive recursion recomputes the same steps over and over in O(2^n). 1D DP stores each step's count once for O(n).",
    imageLight: require("../../assets/images/1d_dp_light.png"),
    imageDark: require("../../assets/images/1d_dp_dark.png"),
    detailSections: DP_1D_SECTIONS,
    lastUpdated: "29 Mar 2026",
  },
  {
    id: "algo-dp-2d",
    track: "algorithms",
    title: "Dynamic Programming (2D & Strings)",
    subtitle: "Grids, subsequences, and edit distance",
    level: 13,
    summary: "Solve grid and string problems by filling a 2D table systematically.",
    details:
      "2D DP extends the 1D idea to states described by two indices—typically two positions in two strings, or a row and column in a grid. The table dp[i][j] stores the answer for the sub-problem defined by the first i characters of one string and the first j characters of another (or cell (i, j) in a grid).\n\n" +
      "The setup:\n" +
      "• Allocate a (m+1) × (n+1) table (sentinel row/column of zeros handles base cases cleanly).\n" +
      "• Fill row by row (or column by column), each cell depending on cells already filled.\n" +
      "• Read the answer from dp[m][n].\n\n" +
      "When to reach for 2D DP:\n" +
      "• Two-string problems — LCS, edit distance, regular expression matching.\n" +
      "• Grid path counting or path optimization — unique paths, minimum path sum, dungeon game.\n" +
      "• Knapsack variants — item index × remaining capacity.\n" +
      "• Interval DP — dp[i][j] = answer for the sub-array or sub-string from i to j (burst balloons, matrix chain multiplication).\n\n" +
      "Space optimisation: if dp[i][j] only depends on the previous row, you can keep just two rows (or even one row updated in place) to reduce O(m × n) space to O(n).\n\n" +
      "Concrete starting point below: Longest Common Subsequence of two strings. Naive recursion is O(2^(m+n)). A 2D DP table fills all O(m × n) unique prefix pairs exactly once.",
    imageLight: require("../../assets/images/2d_dp_light.png"),
    imageDark: require("../../assets/images/2d_dp_dark.png"),
    detailSections: DP_2D_SECTIONS,
    lastUpdated: "29 Mar 2026",
  },
];

export function getLearnTopic(track: LearnTrack, id: string): LearnTopic | undefined {
  const source = track === "data-structures" ? DATA_STRUCTURE_TOPICS : ALGO_TOPICS;
  return source.find((t) => t.id === id);
}

export function getAlgorithmTopic(id: string): LearnTopic | undefined {
  return ALGO_TOPICS.find((topic) => topic.id === id);
}

export function getTopicImage(topic: LearnTopic, isDark: boolean): ImageSourcePropType | undefined {
  if (isDark) {
    return topic.imageDark ?? topic.image ?? topic.imageLight;
  }
  return topic.imageLight ?? topic.image ?? topic.imageDark;
}

