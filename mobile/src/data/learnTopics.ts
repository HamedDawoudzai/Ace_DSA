import { ImageSourcePropType } from "react-native";
import type { LearnDetailSection } from "./learnSectionTypes";
import { TWO_POINTERS_SECTIONS } from "./learn/twoPointers";

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
    imageLight: require("../../assets/images/bst.png"),
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

export function getAlgorithmTopic(id: string): LearnTopic | undefined {
  return ALGO_TOPICS.find((topic) => topic.id === id);
}

export function getTopicImage(topic: LearnTopic, isDark: boolean): ImageSourcePropType | undefined {
  if (isDark) {
    return topic.imageDark ?? topic.image ?? topic.imageLight;
  }
  return topic.imageLight ?? topic.image ?? topic.imageDark;
}

