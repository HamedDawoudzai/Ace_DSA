import type { LearnDetailSection } from "../../learnSectionTypes";

export const DS_HASH_TABLES_SECTIONS: LearnDetailSection[] = [
  {
    title: "Python: dict, set, defaultdict, Counter",
    body:
      "`dict` maps keys to values; `set` is keys only. Average O(1) insert/lookup/delete. `defaultdict` avoids key checks; `Counter` is built for frequencies.",
    code: `# --- dict: key -> value ---
freq = {}
for ch in "hello":
    freq[ch] = freq.get(ch, 0) + 1

# --- set: membership ---
seen = set()
seen.add(7)
if 7 in seen:
    pass

# --- defaultdict: auto-create missing keys ---
from collections import defaultdict

g = defaultdict(list)
g[0].append(1)

# --- Counter: frequencies ---
from collections import Counter

c = Counter("abracadabra")
`,
    codeLanguage: "python",
  },
];
