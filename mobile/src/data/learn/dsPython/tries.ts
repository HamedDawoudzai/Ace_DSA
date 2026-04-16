import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const DS_TRIES_SECTIONS: LearnDetailSection[] = [
  {
    title: "Python: trie node + insert / search / startsWith",
    body:
      "The trie diagram above branches on every character; the `TrieNode.children` map in the code is that branching drawn as nested dictionaries.\n\n" +
      VISUAL_ANCHOR +
      "The code snippet below teaches you the basic trie operations you need to know for interview problems.\n\n" +
      "• TrieNode — the building block: each node stores a dictionary of child characters and a flag marking whether a complete word ends here.\n" +
      "• insert — add a word to the trie by walking one character at a time and creating nodes for any characters that don't exist yet.\n" +
      "• search — check whether an exact word exists in the trie by following its characters all the way to a node marked as a word ending.\n" +
      "• startsWith — check whether any stored word begins with a given prefix, without needing an exact match at the end.",
    code: `class TrieNode:
    def __init__(self):
        self.children = {}    # maps each character to the next TrieNode
        self.is_end = False   # True when a complete word ends at this node


class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()  # create a node for this character
            node = node.children[ch]            # move to the next node
        node.is_end = True                      # mark that a word ends here

    def search(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                return False            # this character path doesn't exist
            node = node.children[ch]   # move to the next node
        return node.is_end             # True only if a full word ends here

    def startsWith(self, prefix):
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return False            # prefix path doesn't exist
            node = node.children[ch]
        return True                     # made it through the whole prefix
`,
    codeLanguage: "python",
  },
];
