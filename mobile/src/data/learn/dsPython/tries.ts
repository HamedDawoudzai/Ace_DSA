import type { LearnDetailSection } from "../../learnSectionTypes";

export const DS_TRIES_SECTIONS: LearnDetailSection[] = [
  {
    title: "Python: trie node + insert / search / startsWith",
    body:
      "Each node holds `children` (char → node) and `is_end` for a full word. Insert and query walk one character at a time—O(L) for word length L.",
    code: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False


class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return node.is_end

    def startsWith(self, prefix):
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return True
`,
    codeLanguage: "python",
  },
];
