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
import { DS_ARRAYS_SECTIONS } from "./learn/dsPython/arrays";
import { DS_STRINGS_SECTIONS } from "./learn/dsPython/strings";
import { DS_LINKED_LISTS_SECTIONS } from "./learn/dsPython/linkedLists";
import { DS_STACKS_SECTIONS } from "./learn/dsPython/stacks";
import { DS_QUEUES_SECTIONS } from "./learn/dsPython/queues";
import { DS_HASH_TABLES_SECTIONS } from "./learn/dsPython/hashTables";
import { DS_TREES_SECTIONS } from "./learn/dsPython/trees";
import { DS_BSTS_SECTIONS } from "./learn/dsPython/bsts";
import { DS_HEAPS_SECTIONS } from "./learn/dsPython/heaps";
import { DS_GRAPHS_SECTIONS } from "./learn/dsPython/graphs";
import { DS_TRIES_SECTIONS } from "./learn/dsPython/tries";
import {
  COMPLEXITY_SECTIONS_BIG_O,
  COMPLEXITY_SECTIONS_CONSTANT,
  COMPLEXITY_SECTIONS_LOG_N,
  COMPLEXITY_SECTIONS_LINEAR,
  COMPLEXITY_SECTIONS_NLOGN,
  COMPLEXITY_SECTIONS_N2,
  COMPLEXITY_SECTIONS_EXPONENTIAL,
  COMPLEXITY_SECTIONS_SPACE,
} from "./learn/complexity";

export type LearnTrack = "data-structures" | "algorithms" | "complexity";

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
    summary:
      "In the illustration above, values sit in a straight row of numbered slots—you jump to any slot by its index in O(1). That row is an array: a contiguous block of memory where position equals meaning.",
    imageLight: require("../../assets/images/arrays_light_mode.png"),
    imageDark: require("../../assets/images/arrays_dark_mode.png"),
    details:
      "Look at the picture above: each box is one storage slot, and the index is simply how far you are from the start.\n\n" +
      "Picture an array as a row of numbered boxes.\n\n" +
      "The key benefit is speed: reading `arr[i]` is O(1) because the elements live next to each other in memory. " +
      "The trade-off is what happens when you edit in the middle—if you insert/delete, many later elements may need to shift (O(n)).\n\n" +
      "For LeetCode, arrays are where most “scanning” patterns start: keep an invariant with pointers, slide a window, or use prefix sums to answer range questions.",
    generalUnderstanding:
      "Use arrays when the problem is naturally ordered and you need index-based access (subarrays, intervals, two pointers, windows).",
    teachingNotes: [
      "Index = position in that row. Contiguous storage is why `arr[i]` is instant—no hunting.",
      "If you insert or delete in the middle, everything after may slide one step—that is the O(n) cost you pay for physical reordering.",
      "Before you move two pointers, write one English sentence: “`L` means ___ and `R` means ___.” That sentence is your bug shield.",
    ],
    leetcodeTactics: [
      "Left/right pointers: write down what each index represents (e.g. “smallest value not in my window”) before you move them—moving without that sentence causes off-by-one bugs.",
      "Prefix sums: walk the array once, store running totals, then any range sum is two lookups and a subtraction instead of re-adding every element.",
      "Nested loops on the same array: ask if one ordered pass (or a forward pass plus a backward pass) can collect the same information—that often drops O(n²) to O(n).",
    ],
    relatedAlgorithmIds: ["algo-array-scan", "algo-two-pointers", "algo-sliding-window", "algo-binary-search"],
    detailSections: DS_ARRAYS_SECTIONS,
    lastUpdated: "13 Apr 2026",
  },
  {
    id: "ds-strings",
    track: "data-structures",
    title: "Strings",
    subtitle: "Arrays of characters",
    level: 2,
    summary:
      "Above you see characters lined up like beads on a string—that is a string in code: an ordered sequence of characters, usually with index access like an array but with extra text rules (immutability, encoding, etc.).",
    imageLight: require("../../assets/images/string_light_mode.png"),
    imageDark: require("../../assets/images/string_dark_mode.png"),
    details:
      "Use the artwork above as your mental model: left-to-right order matters, and each position holds one character.\n\n" +
      "Most programming languages treat a string like an array of characters, where you can still access characters by index.\n\n" +
      "Two important “real world” details: (1) many strings are immutable, so “changing” them can create a new string, and (2) string problems often care about character order and counts.\n\n" +
      "That’s why many LeetCode string problems reduce to classic array patterns: two pointers, sliding windows, and frequency/hash checks.",
    generalUnderstanding:
      "Use strings when the order of characters matters and you need constraints on substrings (frequency, uniqueness, palindromes).",
    teachingNotes: [
      "Treat the string as positions 0..n−1; most patterns are still “two indices” or “a moving segment,” just with letters instead of numbers.",
      "When the prompt says “at most k distinct letters” or “all unique,” think sliding window plus a small frequency table.",
      "Palindrome = mirror symmetry; two pointers from both ends (or expand around centers) usually beat ad-hoc string slicing.",
    ],
    leetcodeTactics: [
      "Character counts: use a length-26 array or a hash map to compare two windows in O(1) after you update counts as the window slides.",
      "Canonical keys: sort the letters of an anagram, or store a tuple of counts, so “same multiset of letters” becomes a dictionary key for grouping.",
      "Two pointers on a string: one from each end for palindrome checks, or both moving in the same direction for substring invariants—same logic as arrays, just with `s[i]` instead of `arr[i]`.",
    ],
    relatedAlgorithmIds: ["algo-array-scan", "algo-sliding-window", "algo-two-pointers", "algo-dp-2d"],
    detailSections: DS_STRINGS_SECTIONS,
    lastUpdated: "13 Apr 2026",
  },
  {
    id: "ds-linked-lists",
    track: "data-structures",
    title: "Linked Lists",
    subtitle: "Nodes connected by pointers",
    level: 3,
    summary:
      "In the diagram above, each square is a node and each arrow is a pointer to the next node—you walk the chain step by step instead of jumping by index, which makes inserts/deletes cheap but random access slow.",
    imageLight: require("../../assets/images/singly_linked_list_light_mode.png"),
    imageDark: require("../../assets/images/singly_linked_list_dark_mode.png"),
    details:
      "Match the picture above: there is no “slot i” in memory; you only know the next hop.\n\n" +
      "Picture a linked list as a line of nodes where each node points to the next one.\n\n" +
      "Because nodes aren’t stored contiguously, reaching the k-th element takes O(k). But once you’re at the right neighborhood, inserting/deleting is often O(1) because you only update pointers.\n\n" +
      "That pointer rewiring leads to classic interview patterns: cycle detection (fast/slow), reversing a list, and merging lists.",
    generalUnderstanding:
      "Use linked lists when the problem’s focus is changing structure (insert/delete/reverse) rather than random reads.",
    teachingNotes: [
      "Name three roles out loud—often `prev`, `curr`, `next`—and only advance when each pointer still points where you think.",
      "A dummy node is a fake first node whose `next` is the real head; it removes dozens of “what if we delete the head?” branches.",
      "Slow moves one step, fast moves two; if they meet there is a cycle; when fast hits null there is none—the same walk finds the middle in many templates.",
    ],
    leetcodeTactics: [
      "Dummy head: add a throwaway node before the real head so “delete/insert at front” uses the same code as the middle—almost every list rewrite is cleaner with one.",
      "Slow/fast pointers: one pointer advances one link per step, the other two links; meeting proves a cycle; stopping early finds the middle node for split/reverse patterns.",
      "Reverse in place: keep `prev`, `curr`, and `next`; point `curr` backward, then shift all three forward one node—no extra list, only pointer rewiring.",
    ],
    relatedAlgorithmIds: ["algo-two-pointers", "algo-recursion"],
    detailSections: DS_LINKED_LISTS_SECTIONS,
    lastUpdated: "13 Apr 2026",
  },
  {
    id: "ds-stacks",
    track: "data-structures",
    title: "Stacks",
    subtitle: "Last-in, first-out (LIFO)",
    level: 4,
    summary:
      "The stack drawing above is like a pile of plates: you only ever touch the top. Last item pushed is the first one popped—that LIFO rule models nesting, undo, and “finish the newest open task first.”",
    imageLight: require("../../assets/images/stack_light_mode.png"),
    imageDark: require("../../assets/images/stack_dark_mode.png"),
    details:
      "Compare the diagram above to a pile of work: the newest item sits on top and must be handled before older items below.\n\n" +
      "A stack supports two main actions: `push` (add) and `pop` (remove). The last thing you added is the first thing you remove (LIFO).\n\n" +
      "Stacks model “nested” reasoning: parsing parentheses, validating expressions, and simulating recursion frames all become straightforward when you think in terms of the most recent unresolved item.\n\n" +
      "A special family you’ll see often is the monotonic stack, which keeps candidates in order so you can answer “next greater/smaller” queries efficiently.",
    generalUnderstanding:
      "Use stacks when the problem describes nesting, undo/rollback, or “resolve the most recent unfinished thing first.”",
    teachingNotes: [
      "Whenever the story is “I opened something and must close it before older things,” you are probably stacking states.",
      "Parentheses parsers rarely need the raw characters—push the expected closing symbol or a depth counter you can reconcile cheaply.",
      "Monotonic stack = values (or indices) stay sorted inside the stack; each item enters once and leaves once, so total work stays linear.",
    ],
    leetcodeTactics: [
      "Push indices, not only values, when the problem cares about distance or positions (e.g. “next greater to the right”).",
      "Monotonic increasing/decreasing stack: when a new value breaks the order, pop until it fits—each pop answers “this index was the blocker for those earlier guys.”",
      "Sentinel values at the bottom (like -1 or infinity) avoid empty-stack checks while you sweep the array once.",
    ],
    relatedAlgorithmIds: ["algo-array-scan", "algo-dfs"],
    detailSections: DS_STACKS_SECTIONS,
    lastUpdated: "13 Apr 2026",
  },
  {
    id: "ds-queues",
    track: "data-structures",
    title: "Queues & Deques",
    subtitle: "First-in, first-out and double-ended",
    level: 5,
    summary:
      "The queue picture above shows people (or items) leaving in the same order they arrived—first in, first out. That fair line is why BFS explores a graph in expanding rings, and why a deque can maintain a sliding window’s best candidates from both ends.",
    imageLight: require("../../assets/images/queue_light_mode.png"),
    imageDark: require("../../assets/images/queue_dark_mode.png"),
    details:
      "Imagine the arrows in the figure above: new work joins the back, finished work leaves the front—never skipping someone who waited longer.\n\n" +
      "A queue processes items in the same order they arrive: enqueue at the back, dequeue from the front.\n\n" +
      "This is why BFS (level-by-level graph/tree traversal) is implemented with a queue: you explore all nodes at distance `k` before moving to `k+1`.\n\n" +
      "A deque (double-ended queue) lets you operate on both ends. That extra control is the key to sliding-window maximum/minimum patterns where you keep only the useful candidates.",
    generalUnderstanding:
      "Use queues for level-order workflows (BFS). Use deques when your task is about maintaining the best candidate inside a moving window.",
    teachingNotes: [
      "FIFO matches “distance layers” in unweighted graphs: everyone at distance d leaves the queue before anyone at d+1 is processed.",
      "A deque lets you evict stale candidates from the front while fresh ones enter the back—perfect for max/min inside a moving interval.",
      "Mark a vertex visited the moment you enqueue it, not when you pop it, to avoid pushing the same node endlessly.",
    ],
    leetcodeTactics: [
      "Level-order BFS: snapshot `queue.size()` before each round so you process exactly one wave per iteration when the interviewer wants levels.",
      "Sliding window min/max: deque stores indices with monotone values so the front is always the current extremum; pop from back while new value breaks the order.",
      "Grid BFS: push neighbor coordinates with bounds checks and a visited matrix the same second you enqueue—prevents exponential revisits.",
    ],
    relatedAlgorithmIds: ["algo-bfs", "algo-sliding-window"],
    detailSections: DS_QUEUES_SECTIONS,
    lastUpdated: "13 Apr 2026",
  },
  {
    id: "ds-hash-tables",
    track: "data-structures",
    title: "Hash Tables / Sets",
    subtitle: "Key → value lookup in O(1) average time",
    level: 6,
    summary:
      "The hash-map illustration above shows keys mapping to buckets or entries—think of a label on a drawer that lets you jump straight to the right drawer instead of opening every drawer in the house.",
    imageLight: require("../../assets/images/hash_map_light_mode.png"),
    imageDark: require("../../assets/images/hash_map_dark_mode.png"),
    details:
      "Use the diagram above as intuition: a key lands in a bucket via a hash function; collisions mean more than one item can share a bucket, but average depth stays tiny.\n\n" +
      "A hash table turns a key into a bucket index using a hash function.\n\n" +
      "If hashing distributes keys well, insert/delete/lookup are O(1) on average. Internally, collisions are handled by storing multiple items per bucket (details vary by language).\n\n" +
      "In LeetCode, hashing replaces slow nested scans: you store what you’ve already seen (counts, complements, last positions) and then answer membership/queries in constant time.",
    generalUnderstanding:
      "Use hash tables when you need frequent membership checks, counting, or grouping by key—especially when you’re tempted to write nested loops.",
    teachingNotes: [
      "Hash maps answer “have I seen this?” instantly; they do not keep sorted order—reach for a tree or sort when ordering matters.",
      "If you are about to compare every element to every other element, try storing one side in a map while you sweep the other once.",
      "Composite keys (tuple of `(row, col)` or sorted string) turn structured duplicates into one dictionary entry.",
    ],
    leetcodeTactics: [
      "Two-sum style: for each value `x`, check whether `target - x` already lives in your map—one pass, O(n) time.",
      "Prefix sum + map: store how often each prefix sum appeared so a subarray sum becomes “current prefix minus earlier prefix” in O(1).",
      "Frequency tables: count characters or numbers in one pass, then enforce constraints by updating counts as a window slides.",
    ],
    relatedAlgorithmIds: ["algo-array-scan", "algo-sliding-window", "algo-dp-1d"],
    detailSections: DS_HASH_TABLES_SECTIONS,
    lastUpdated: "13 Apr 2026",
  },
  {
    id: "ds-trees",
    track: "data-structures",
    title: "Trees & Binary Trees",
    subtitle: "Hierarchical, recursively defined structures",
    level: 7,
    summary:
      "The tree drawing above shows a root at the top and children branching downward with no cycles—hierarchy drawn as a picture. Traversals are just agreed orders for walking those nodes to compute sums, heights, or paths.",
    imageLight: require("../../assets/images/Binary_tree_light_mode.png"),
    imageDark: require("../../assets/images/Binary_tree_dark_mode.png"),
    details:
      "Point to the root in the image above, then follow one branch down—every step is “visit parent, then decide left/right child.”\n\n" +
      "A tree is a connected structure with a root and edges leading to children, with no cycles.\n\n" +
      "A binary tree is the common variant where each node has at most two children (left and right).\n\n" +
      "The big beginner win: trees encourage recursion. You can define what a “helper” returns for each node (height, sum, max, paths), then combine child results at the current node.",
    generalUnderstanding:
      "Use trees when relationships are hierarchical (parent/child). Learn traversals because most tree problems boil down to the right traversal + the right “return value.”",
    teachingNotes: [
      "Write the contract first: “my function returns ___ for this subtree.” Everything else is bookkeeping.",
      "Preorder = process node before children; inorder = between left and right; postorder = after both—pick the order that matches when you need child answers.",
      "If recursion scares you, push explicit `(node, state)` frames onto a stack—you are replaying the same picture mechanically.",
    ],
    leetcodeTactics: [
      "Let each recursive call return a small struct: height, tilt, max path through node, etc.—parent combines child answers in O(1).",
      "Need sorted order on BST? Inorder traversal visits keys ascending—use that fact instead of re-sorting.",
      "Iterative DFS: mimic the call stack with your own stack when recursion depth or interviewer constraints forbid implicit stacks.",
    ],
    relatedAlgorithmIds: ["algo-recursion", "algo-dfs", "algo-bfs"],
    detailSections: DS_TREES_SECTIONS,
    lastUpdated: "13 Apr 2026",
  },
  {
    id: "ds-bsts",
    track: "data-structures",
    title: "Binary Search Trees",
    subtitle: "Ordered binary trees",
    level: 8,
    summary:
      "The BST figure above shows the golden rule: everything left of a node is smaller, everything right is larger—so each step down the picture narrows the search range like a paper phone book torn in half each time.",
    imageLight: require("../../assets/images/bst_light.png"),
    imageDark: require("../../assets/images/bst_dark_mode.png"),
    details:
      "Trace any path in the illustration above: if you go left, values shrink; if you go right, they grow—no exceptions anywhere in the subtree.\n\n" +
      "A binary search tree (BST) has an ordering rule: everything in the left subtree is smaller than the node, and everything in the right subtree is larger.\n\n" +
      "Because of that invariant, you can search by narrowing the allowed range at each step. The time is O(h), where `h` is the height.\n\n" +
      "If the tree is balanced, O(log n) behavior appears. If it becomes skewed, worst-case height becomes O(n).",
    generalUnderstanding:
      "Use a BST mindset when the problem asks for validation, range queries, or “k-th smallest” reasoning via ordered traversal.",
    teachingNotes: [
      "Validation = carry `(low, high)` windows; each node must land inside the window inherited from its parent.",
      "Deletion has three shapes: leaf, one child, two children—draw them once and reuse forever.",
      "Skewed BST is basically a linked list for complexity—mention balancing only when the prompt guarantees height.",
    ],
    leetcodeTactics: [
      "Inorder walk prints keys sorted ascending—use that to answer “k-th smallest” without building an array of the whole universe.",
      "Pass `(min_allowed, max_allowed)` into recursion; if `node.val` slips outside, the picture is not a BST.",
      "Augment nodes with subtree sizes or threaded pointers when the problem asks for rank or predecessor/successor in O(log n) expected time.",
    ],
    relatedAlgorithmIds: ["algo-binary-search", "algo-dfs", "algo-recursion"],
    detailSections: DS_BSTS_SECTIONS,
    lastUpdated: "13 Apr 2026",
  },
  {
    id: "ds-heaps",
    track: "data-structures",
    title: "Heaps & Priority Queues",
    subtitle: "Efficient access to min/max elements",
    level: 9,
    summary:
      "The heap diagram above shows a complete tree packed into an array: parents sit “above” children in the drawing, and the smallest (or largest) value always bubbles to the root—so you always know where the extreme element lives without fully sorting.",
    imageLight: require("../../assets/images/max_min_heap_light_mode.png"),
    imageDark: require("../../assets/images/max_min_heap_dark_mode.png"),
    details:
      "Look at the tree shape above: it is not perfectly sorted left-to-right, yet the root is still the min (or max) because of the parent/child rule.\n\n" +
      "A heap is a tree stored in an array where only a partial order is guaranteed.\n\n" +
      "In a min-heap, every parent is smaller than its children, so the smallest value is always at the root (and similarly for max-heaps with the largest at the root).\n\n" +
      "That partial order is enough for a priority queue: insert and extract min/max are O(log n). This is the backbone of top-k problems and shortest-path style algorithms.",
    generalUnderstanding:
      "Use heaps when the next step depends on the extreme element (min/max) without needing full sorting every time.",
    teachingNotes: [
      "Only the root is guaranteed best; the rest is a partial order—do not assume the array is sorted.",
      "Streaming top-k: keep size k and evict the worst inside the heap as new items arrive.",
      "Dijkstra may enqueue duplicate distances; when you pop, skip if that distance is outdated—still correct thanks to ordering.",
    ],
    leetcodeTactics: [
      "K largest in a stream: maintain a min-heap of size k so the root is always the weakest member of your elite group.",
      "Need a max-heap in Python? store negatives or use `heapq` with tuples whose first field is inverted priority.",
      "State-space search: push `(cost, node)`; when you pop a worse duplicate, `continue`—cheaper copies already visited imply the pop is stale.",
    ],
    relatedAlgorithmIds: ["algo-dijkstra", "algo-greedy", "algo-sorting"],
    detailSections: DS_HEAPS_SECTIONS,
    lastUpdated: "13 Apr 2026",
  },
  {
    id: "ds-graphs",
    track: "data-structures",
    title: "Graphs",
    subtitle: "Nodes and edges",
    level: 10,
    summary:
      "The graph illustration above is dots (vertices) and arrows or lines (edges)—sometimes with numbers on the edges for cost. That picture is the vocabulary for reachability, shortest paths, and dependencies in code.",
    imageLight: require("../../assets/images/weighted_graph_light_mode.png"),
    imageDark: require("../../assets/images/weighted_graph_dark_mode.png"),
    details:
      "Point at the nodes and edges above: each relationship you can walk is an edge; anything you can model as “objects + connections between them” becomes this drawing.\n\n" +
      "A graph is a set of nodes connected by edges.\n\n" +
      "Edges can be directed or undirected, and they can have weights (costs) or not. Real problems like networks, prerequisites, and routing all reduce to graph questions.\n\n" +
      "In programming, graphs are usually stored as adjacency lists (neighbors per node). Once you’ve chosen the right representation, the main “moves” are BFS/DFS for traversal and Dijkstra for shortest paths with non-negative weights.",
    generalUnderstanding:
      "Use graphs when the relationships between items matter—especially for reachability, shortest paths, cycles, and ordering.",
    teachingNotes: [
      "Decide directed vs undirected and weighted vs unweighted before you code—wrong model, wrong algorithm.",
      "Sparse graphs love adjacency lists: total edges near vertices, not near V².",
      "Visited can be `node`, or `(node, mask)` in DP-on-grid puzzles—copy the state you need to disambiguate revisits.",
    ],
    leetcodeTactics: [
      "Build `graph[u] -> [v, ...]` (and reverse graph when you need incoming edges) instead of an O(V²) matrix unless the problem is dense.",
      "Track `(r, c, keys)` or similar when the puzzle adds keys/doors—plain `visited[r][c]` is not enough.",
      "Before coding, label the family: connectivity vs shortest path vs topo order vs bipartite check—each family has a template.",
    ],
    relatedAlgorithmIds: ["algo-bfs", "algo-dfs", "algo-dijkstra"],
    detailSections: DS_GRAPHS_SECTIONS,
    lastUpdated: "13 Apr 2026",
  },
  {
    id: "ds-tries",
    track: "data-structures",
    title: "Tries",
    subtitle: "Prefix trees for strings",
    level: 11,
    summary:
      "The trie drawing above fans out letter by letter: every downward path spells a prefix shared by all words that continue through that branch—so searching “do we have any word starting with `ca`?” only walks two edges, not every stored string.",
    imageLight: require("../../assets/images/trie_light_mode.png"),
    imageDark: require("../../assets/images/trie_dark_mode.png"),
    details:
      "Follow one branch in the picture above: each edge label extends the prefix; missing edge = no word uses that continuation—immediate stop.\n\n" +
      "A trie is a prefix tree: each edge represents a character, and each root-to-node path forms a prefix.\n\n" +
      "That means prefix search takes time proportional to the word length: O(L).\n\n" +
      "Tries trade memory for speed. They are ideal for autocomplete, “dictionary word with prefix,” and wildcard/pattern expansion problems.",
    generalUnderstanding:
      "Use tries when the problem repeatedly asks about prefixes (not just full strings).",
    teachingNotes: [
      "Runtime scales with query length L, not dictionary size—great when the dictionary is huge but queries are short.",
      "Mark ends of words with a boolean or count; sometimes store indices for autocomplete ranking.",
      "Wildcards mean “try every child edge here”—DFS from the trie node mirrors that branching.",
    ],
    leetcodeTactics: [
      "Boolean `is_end` plus optional frequency at nodes solves membership and ranking without scanning all words.",
      "Pattern strings with `.` become DFS: at each wildcard, recurse into every non-null child pointer.",
      "Prune as soon as `next` pointer is missing—no need to explore impossible prefixes.",
    ],
    relatedAlgorithmIds: ["algo-dfs", "algo-backtracking"],
    detailSections: DS_TRIES_SECTIONS,
    lastUpdated: "13 Apr 2026",
  },
];

export const ALGO_TOPICS: LearnTopic[] = [
  {
    id: "algo-array-scan",
    track: "algorithms",
    title: "Array Scanning & Basic Loops",
    subtitle: "Single-pass patterns",
    level: 1,
    summary:
      "The traversal graphic above shows your eye moving once along a line of values—that single left-to-right sweep is array scanning: you gather running totals, extremes, or counts in one pass so later questions about ranges do not rescan the whole array.",
    imageLight: require("../../assets/images/linear_traversal_light.png"),
    imageDark: require("../../assets/images/linear_traversal_dark.png"),
    details:
      "Use the picture above as a timeline: each position is visited once in order; whatever you compute while walking can be reused later without walking again.\n\n" +
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
    summary:
      "The diagram above places two fingers on the same sequence—often one on the left and one on the right, or two speeds moving forward—that is two pointers: two indices you move with simple rules instead of checking every pair with nested loops.",
    imageLight: require("../../assets/images/two_pointer_light.png"),
    imageDark: require("../../assets/images/two_pointer_dark.png"),
    details:
      "Match the illustration above to your code: each pointer is just an integer index; the art shows why moving both inward can test sums on a sorted line in linear time.\n\n" +
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
    summary:
      "In the artwork above, only a contiguous chunk of the array is highlighted at any moment—that chunk is the window; we slide it one step at a time, adding the new right edge and dropping the old left edge instead of resumming everything from scratch.",
    imageLight: require("../../assets/images/sliding_window_light.png"),
    imageDark: require("../../assets/images/sliding_window_dark.png"),
    details:
      "Look at the highlighted segment above: whatever condition the problem cares about (sum, uniqueness, counts) lives inside that moving frame while the rest of the array waits its turn.\n\n" +
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
    summary:
      "The binary-search figure above shows a sorted bar with a shrinking active region—each step throws away half of what is left because the middle tells you which side can still contain the answer.",
    imageLight: require("../../assets/images/binary_search_light.png"),
    imageDark: require("../../assets/images/binary_search_dark.png"),
    details:
      "Picture the highlighted interval above getting shorter: that is the invariant “answer stays inside [lo, hi]” while you cut the space in half.\n\n" +
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
    summary:
      "The call-tree illustration above shows one big problem spawning smaller copies of itself until the leaves hit trivial inputs—that branching picture is recursion: same function, smaller argument, until a base case stops the split.",
    details:
      "Trace any branch downward in the image above: each level is the same pattern on less input; the leaves are the easy answers you return upward.\n\n" +
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
    summary:
      "The decision tree above lists try/undo steps—each path is a partial solution and abandoned branches are pruned early; that explore-and-revert drawing is backtracking in one glance.",
    details:
      "Watch the branches above: go deeper while valid, hit a wall, then unwind one choice and try the next sibling—that undo arrow is the “backtrack.”\n\n" +
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
    summary:
      "The sorted bars above show values lined up smallest-to-largest—once that picture holds, greedy picks and two-pointer scans become easy because “neighbors” now mean something.",
    details:
      "Compare the jumbled vs ordered views implied above: sorting is the preprocessing step that exposes which elements belong together.\n\n" +
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
    summary:
      "In the graph illustration above, the numbers on the nodes show the order BFS would discover them if you start from the usual source: every node one hop away finishes before any node two hops away—those layers are the shortest distances in an unweighted graph.",
    details:
      "Read the labels on the picture above like timestamps: smaller numbers were seen earlier because the queue always drains the current wave before starting the next ring outward.\n\n" +
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
    summary:
      "In the tree diagram above, the visit numbers plunge down one spine before they jump to a sibling—that depth-first trace is DFS: go as far as you can, then pop back and try the next branch.",
    details:
      "Follow the order written on the nodes above: you will see long vertical runs (deep commits) before horizontal jumps to untouched subtrees.\n\n" +
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
    summary:
      "The weighted graph above labels edges with costs; Dijkstra always expands the cheapest unfinished frontier first—so the picture is “BFS vibes, but pull the lightest edge next” until you settle the destination.",
    imageLight: require("../../assets/images/djikstras_light.png"),
    imageDark: require("../../assets/images/djikstras_dark.png"),
    details:
      "Point to the thickening region in the illustration above: that is the set of nodes whose best-known distance has been finalized one relaxation at a time.\n\n" +
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
    summary:
      "The timeline or interval sketch above shows meetings or tasks being picked one after another by a simple rule (often “earliest finish first”)—each greedy step is a bite-sized local choice that hopefully stitches into a global optimum.",
    details:
      "Use the picture above as a storyboard: at every decision point you take the option that looks best right now without undoing earlier picks—if the drawing’s rule matches the proof sketch, greedy is justified.\n\n" +
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
    summary:
      "The stair-step or linear table above is one index wide—each cell reuses answers from earlier cells; that single row of cached answers is 1D DP turning exponential recursion into a polynomial fill.",
    details:
      "Read the diagram above left-to-right: every new cell only depends on a handful of previous positions, so you memoize once instead of recomputing the same subtree forever.\n\n" +
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
    summary:
      "The grid above is the literal DP table: rows and columns are two indices of state (two string prefixes or board coordinates); filling each cell from neighbors is exactly the 2D recurrence the code will implement.",
    details:
      "Pick any interior cell in the picture above: its value should depend only on cells already filled to the left, above, or diagonal—walk the grid in that dependency order.\n\n" +
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

export const COMPLEXITY_TOPICS: LearnTopic[] = [
  {
    id: "complexity-big-o",
    track: "complexity",
    title: "What is Big O?",
    subtitle: "A speed label for your code",
    level: 1,
    summary: "Big O tells you how your code slows down as the input gets bigger — before you even run it.",
    details:
      "Imagine you have a list of 10 names and you need to find one. Easy. Now imagine 10 million names. Does your approach still work, or does it grind to a halt?\n\n" +
      "Big O notation is the answer to that question. It is a simple label — like O(n) or O(n²) — that describes how the number of steps your code takes grows as the input size grows.\n\n" +
      "The letter n stands for the size of the input. If n doubles, some code takes twice as long (O(n)), some code takes four times as long (O(n²)), and some code barely slows down at all (O(log n)).\n\n" +
      "Big O ignores small details like exact milliseconds or hardware speed. It only cares about the shape of the growth: does it grow slowly or explosively?\n\n" +
      "You will see these labels everywhere in interview prep. The sections below walk through each one from fastest to slowest with everyday analogies and code examples.",
    detailSections: COMPLEXITY_SECTIONS_BIG_O,
    lastUpdated: "16 Apr 2026",
  },
  {
    id: "complexity-o1",
    track: "complexity",
    title: "O(1) — Constant Time",
    subtitle: "Always the same number of steps",
    level: 2,
    summary: "O(1) means your code finishes in a fixed number of steps no matter how large the input is.",
    details:
      "Think of a library where every book has a unique shelf number. If you know the number, you walk directly to that shelf. It does not matter if the library has 100 books or 100 million — one trip, done.\n\n" +
      "In code, that is O(1). Reading an item from an array by its index (arr[5]) or looking up a key in a dictionary (prices[\"apple\"]) both take one step, always.\n\n" +
      "O(1) is the best possible time complexity. When you see it, it means your code will not slow down no matter how much data you throw at it.\n\n" +
      "Common O(1) operations:\n" +
      "• arr[i] — read from an array by index\n" +
      "• my_dict[key] — look up a dictionary value\n" +
      "• my_set.add(x) — add to a set\n" +
      "• x in my_set — check if something is in a set\n" +
      "• stack.append(x) / stack.pop() — push or pop a stack",
    detailSections: COMPLEXITY_SECTIONS_CONSTANT,
    lastUpdated: "16 Apr 2026",
  },
  {
    id: "complexity-logn",
    track: "complexity",
    title: "O(log n) — Logarithmic Time",
    subtitle: "Cuts the problem in half each step",
    level: 3,
    summary: "O(log n) is extremely fast — even 1,000,000 items only needs about 20 steps.",
    details:
      "Imagine guessing a number between 1 and 100. Instead of guessing one by one, you always guess the middle: \"Is it 50?\" If the answer is \"lower,\" you now only have 1–49 left. Guess 25. Keep halving.\n\n" +
      "After just 7 guesses you can always find the answer out of 100. After 20 guesses, you can handle over a million possibilities.\n\n" +
      "That halving pattern is O(log n). The most common example in interviews is binary search: given a sorted array, repeatedly check the middle and throw away the half that cannot contain the answer.\n\n" +
      "O(log n) is the second-best complexity after O(1). It is so fast that even when n = 1,000,000,000 (one billion), you only need about 30 steps.\n\n" +
      "Common O(log n) operations:\n" +
      "• Binary search on a sorted array\n" +
      "• Each level of a balanced binary tree traversal\n" +
      "• heappush / heappop on Python's heapq",
    detailSections: COMPLEXITY_SECTIONS_LOG_N,
    lastUpdated: "16 Apr 2026",
  },
  {
    id: "complexity-on",
    track: "complexity",
    title: "O(n) — Linear Time",
    subtitle: "One step per item",
    level: 4,
    summary: "O(n) means you touch every item in the input once. Double the input, double the work.",
    details:
      "Think of scanning every item on a grocery list to find the cheapest one. If the list has 10 items you check 10. If it has 1000 you check 1000. The work grows at the same rate as the input — that is O(n).\n\n" +
      "Any time you write a single loop that goes through an entire list, you are doing O(n) work. It is one of the most common complexities you will write and is almost always acceptable in interviews.\n\n" +
      "A useful rule of thumb: if you see a nested loop, ask yourself whether it can be replaced by a hash map. A single loop + O(1) lookups is O(n), while two nested loops is O(n²) — a huge difference.\n\n" +
      "Common O(n) operations:\n" +
      "• A single for loop through a list\n" +
      "• Building a frequency map of characters\n" +
      "• Finding the max/min in an unsorted list\n" +
      "• Traversing every node in a linked list",
    detailSections: COMPLEXITY_SECTIONS_LINEAR,
    lastUpdated: "16 Apr 2026",
  },
  {
    id: "complexity-nlogn",
    track: "complexity",
    title: "O(n log n) — Sorting Time",
    subtitle: "The cost of efficient sorting",
    level: 5,
    summary: "O(n log n) is the best you can do for general sorting. It is fast enough for millions of items.",
    details:
      "Think of organizing a deck of cards by splitting it in half, sorting each half, then merging them back together. You are doing O(log n) merge levels, and each level touches all n cards. That gives n × log n total work.\n\n" +
      "This is what Python's built-in list.sort() and sorted() use under the hood (Timsort). You do not need to implement it yourself — just call it.\n\n" +
      "O(n log n) is noticeably faster than O(n²) for large inputs. For 10,000 items, O(n²) needs 100,000,000 steps while O(n log n) only needs about 130,000.\n\n" +
      "In interviews, a very common pattern is: sort first, then apply a simpler O(n) algorithm on the sorted result. The total is still O(n log n) because sorting dominates.\n\n" +
      "Common O(n log n) operations:\n" +
      "• list.sort() and sorted()\n" +
      "• Merge sort and quicksort\n" +
      "• Any algorithm that sorts the input before processing",
    detailSections: COMPLEXITY_SECTIONS_NLOGN,
    lastUpdated: "16 Apr 2026",
  },
  {
    id: "complexity-n2",
    track: "complexity",
    title: "O(n²) — Quadratic Time",
    subtitle: "A loop inside a loop",
    level: 6,
    summary: "O(n²) means for every item you loop through all items again. It gets slow quickly.",
    details:
      "Imagine a class of 30 students where every student needs to shake hands with every other student. That is 30 × 30 = 900 handshakes. Double the class to 60 students and you get 3,600 handshakes — four times as many.\n\n" +
      "In code, this usually looks like a loop inside a loop. For every item in the list, you check every other item. When n = 1,000 that is 1,000,000 steps. When n = 10,000 that is 100,000,000 steps — already very slow.\n\n" +
      "O(n²) solutions are sometimes unavoidable, but very often they can be improved. The most common trick is to replace the inner loop with an O(1) hash set or dictionary lookup, bringing the total down to O(n).\n\n" +
      "If you find yourself writing a nested loop, pause and ask: can I precompute something in the first pass that makes the second loop unnecessary?\n\n" +
      "Common O(n²) patterns:\n" +
      "• Checking every pair of elements (two nested for loops)\n" +
      "• Bubble sort and insertion sort\n" +
      "• Brute-force substring matching",
    detailSections: COMPLEXITY_SECTIONS_N2,
    lastUpdated: "16 Apr 2026",
  },
  {
    id: "complexity-exponential",
    track: "complexity",
    title: "O(2^n) — Exponential Time",
    subtitle: "Doubles with every new element",
    level: 7,
    summary: "O(2^n) gets unusable fast. The fix is almost always memoization or dynamic programming.",
    details:
      "Imagine you need to decide for each item in a list: include it or not. With 1 item there are 2 choices. With 2 items there are 4 choices. With 10 items there are 1,024 choices. With 30 items there are over 1,000,000,000 choices.\n\n" +
      "That explosive growth is O(2^n). The most common example is naive recursive Fibonacci: computing fib(5) calls fib(4) and fib(3), each of which calls two more functions, and so on. The same values get recomputed thousands of times.\n\n" +
      "The fix is almost always memoization: store each result the first time you compute it. If you ever need it again, just look it up in O(1) instead of recomputing it. This turns O(2^n) into O(n).\n\n" +
      "In interviews, if your recursive solution times out, check whether it is recomputing the same sub-problems. If yes, add memoization or convert to dynamic programming.\n\n" +
      "Common O(2^n) situations:\n" +
      "• Naive recursive Fibonacci without memoization\n" +
      "• Generating all subsets of a set (backtracking)\n" +
      "• Brute-force solutions to problems that have a DP solution",
    detailSections: COMPLEXITY_SECTIONS_EXPONENTIAL,
    lastUpdated: "16 Apr 2026",
  },
  {
    id: "complexity-space",
    track: "complexity",
    title: "Space Complexity",
    subtitle: "How much extra memory your code uses",
    level: 8,
    summary: "Space complexity measures the extra memory your code creates, not counting the input itself.",
    details:
      "Time complexity tells you how many steps your code takes. Space complexity tells you how much memory it creates while running.\n\n" +
      "The two most common space complexities you will see in interviews:\n\n" +
      "O(1) extra space — your code only uses a fixed number of variables (a counter, a pointer, a running total). No matter how large the input, you never create a new list or recursion stack that grows with n.\n\n" +
      "O(n) extra space — your code creates something that grows with the input: a new list, a hash map, a set of visited nodes, or a recursion stack n levels deep.\n\n" +
      "Interviewers often ask whether you can solve a problem in O(1) extra space (in-place), which is usually harder than the O(n) version but more memory-efficient.\n\n" +
      "Important: recursion uses stack space. A function that calls itself n times deep uses O(n) space on the call stack, even if it creates no other data structures.\n\n" +
      "Quick reference:\n" +
      "• A few variables → O(1)\n" +
      "• A new list or map the same size as the input → O(n)\n" +
      "• A 2D grid or table of size n×m → O(n × m)\n" +
      "• Recursion depth of n → O(n) stack space",
    detailSections: COMPLEXITY_SECTIONS_SPACE,
    lastUpdated: "16 Apr 2026",
  },
];

export function getLearnTopic(track: LearnTrack, id: string): LearnTopic | undefined {
  const source =
    track === "data-structures"
      ? DATA_STRUCTURE_TOPICS
      : track === "algorithms"
      ? ALGO_TOPICS
      : COMPLEXITY_TOPICS;
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
