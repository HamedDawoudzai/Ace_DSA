import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const DS_HASH_TABLES_SECTIONS: LearnDetailSection[] = [
  {
    title: "Python: dict, set, defaultdict, Counter",
    body:
      "The hash-map artwork above shows keys mapping to storage buckets—`dict` and `set` in the snippet are that picture turned into Python syntax.\n\n" +
      VISUAL_ANCHOR +
      "The code snippet below teaches you the basic hash table and set operations you need to know for interview problems.\n\n" +
      "• dict (frequency map) — store a key paired with a value; here we count how many times each character appears.\n" +
      "• set (membership check) — store items you've already seen and instantly check if something is in the set.\n" +
      "• defaultdict — a smarter dict that automatically creates a default value when you access a key that doesn't exist yet (no need to check first).\n" +
      "• Counter — a ready-made tool that counts how many times each item appears in a list or string.",
    code: `# --- dict: count how many times each character appears ---
freq = {}
for ch in "hello":
    if ch not in freq:
        freq[ch] = 0            # first time seeing this character
    freq[ch] = freq[ch] + 1    # increment the count
# freq is now {'h': 1, 'e': 1, 'l': 2, 'o': 1}

# --- set: remember what you've already seen ---
seen = set()
seen.add(7)        # add 7 to the set
if 7 in seen:
    pass           # 7 is in the set, so this runs

# --- defaultdict: automatically starts with a default value ---
from collections import defaultdict

graph = defaultdict(list)   # each new key starts as an empty list
graph[0].append(1)          # no need to check if key 0 exists first

# --- Counter: count occurrences automatically ---
from collections import Counter

counts = Counter("abracadabra")
# counts is {'a': 5, 'b': 2, 'r': 2, 'c': 1, 'd': 1}
`,
    codeLanguage: "python",
  },
];
