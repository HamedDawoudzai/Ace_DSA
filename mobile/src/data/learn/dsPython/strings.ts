import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const DS_STRINGS_SECTIONS: LearnDetailSection[] = [
  {
    title: "Python: strings and mutable character buffers",
    body:
      "Above the code you see characters lined up in order—that is a string: a sequence of letters you walk with a loop or index, exactly like the examples below.\n\n" +
      VISUAL_ANCHOR +
      "The code snippet below teaches you the basic string operations you need to know for interview problems.\n\n" +
      "• traverse by character — loop through each letter in the string one at a time.\n" +
      "• traverse by index — loop using position numbers so you know exactly where each character is.\n" +
      "• concatenation — join two strings together (creates a brand-new string each time).\n" +
      "• mutable buffer — convert the string into a list of characters so you can swap letters in place, then turn it back into a string with join.\n" +
      "• build and join — collect pieces in a list and join them all at once at the end (much faster than using + inside a loop).",
    code: `s = "leetcode"

# --- visit each character one at a time ---
for ch in s:
    pass  # ch is the current character

# --- visit each character using its position ---
for i in range(len(s)):
    pass  # s[i] is the character at position i

# --- join two strings (creates a brand-new string) ---
s2 = s + "!"   # s2 is "leetcode!"

# --- convert to a list so you can change individual characters ---
chars = list(s)   # ['l', 'e', 'e', 't', 'c', 'o', 'd', 'e']
chars[0] = "L"    # change the first character
s3 = "".join(chars)  # join the list back into a string -> "Leetcode"

# --- collect pieces and join them all at once at the end ---
parts = []
parts.append("ab")
parts.append("cd")
joined = "".join(parts)  # "abcd"
`,
    codeLanguage: "python",
  },
];
