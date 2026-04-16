import type { LearnDetailSection } from "../../learnSectionTypes";

export const DS_STRINGS_SECTIONS: LearnDetailSection[] = [
  {
    title: "Python: strings and mutable character buffers",
    body:
      "Python `str` is immutable: \"editing\" builds a new string. For O(1) character swaps or two-pointer mutations, use a `list` of chars and `''.join` at the end. Building many pieces: prefer `''.join(parts)` over repeated `+` in a loop.",
    code: `# --- create / traverse ---
s = "leetcode"

for ch in s:
    pass  # use ch

for i in range(len(s)):
    pass  # use s[i]

# --- concat makes a new string ---
s2 = s + "!"

# --- mutable buffer (interview pattern) ---
chars = list(s)
chars[0] = "L"
s3 = "".join(chars)

# --- build many pieces, join once ---
parts = []
parts.append("ab")
parts.append("cd")
joined = "".join(parts)
`,
    codeLanguage: "python",
  },
];
