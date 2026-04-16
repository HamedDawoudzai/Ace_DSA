import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const DS_BSTS_SECTIONS: LearnDetailSection[] = [
  {
    title: "Python: BST insert, search, delete",
    body:
      "The BST figure above keeps smaller values on the left branch and larger on the right—the `search` / `insert` / `delete` methods below enforce that same invariant in code.\n\n" +
      VISUAL_ANCHOR +
      "The code snippet below teaches you the basic binary search tree operations you need to know for interview problems.\n\n" +
      "• search — find a value by going left when the target is smaller, right when it's larger. Much faster than scanning everything.\n" +
      "• insert — add a new value in the correct spot so the BST rule (left < node < right) stays intact.\n" +
      "• _min_node — helper that finds the smallest value in a subtree by always going left.\n" +
      "• delete — remove a value while keeping the tree valid. Handles three situations: the node has no children, one child, or two children (in that last case, replace with the next-biggest value).",
    code: `class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class BST:
    def __init__(self):
        self.root = None

    def search(self, val):
        cur = self.root
        while cur:
            if val == cur.val:
                return cur              # found it
            elif val < cur.val:
                cur = cur.left          # smaller -> go left
            else:
                cur = cur.right         # larger  -> go right
        return None                     # not found

    def insert(self, val):
        if not self.root:
            self.root = TreeNode(val)   # tree was empty
            return
        cur = self.root
        while True:
            if val < cur.val:
                if cur.left:
                    cur = cur.left      # keep searching left
                else:
                    cur.left = TreeNode(val)   # empty spot found
                    return
            elif val > cur.val:
                if cur.right:
                    cur = cur.right     # keep searching right
                else:
                    cur.right = TreeNode(val)  # empty spot found
                    return
            else:
                return  # value already exists, skip it

    def _min_node(self, node):
        # the smallest value is always the leftmost node
        while node.left:
            node = node.left
        return node

    def delete(self, val):
        self.root = self._delete(self.root, val)

    def _delete(self, node, val):
        if not node:
            return None
        if val < node.val:
            node.left = self._delete(node.left, val)    # search left
        elif val > node.val:
            node.right = self._delete(node.right, val)  # search right
        else:
            # found the node to delete
            if not node.left:
                return node.right       # no left child: replace with right
            if not node.right:
                return node.left        # no right child: replace with left
            # two children: replace value with the next biggest, then delete it
            successor = self._min_node(node.right)
            node.val = successor.val
            node.right = self._delete(node.right, successor.val)
        return node
`,
    codeLanguage: "python",
  },
];
