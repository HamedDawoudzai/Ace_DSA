import type { LearnDetailSection } from "../../learnSectionTypes";

export const DS_BSTS_SECTIONS: LearnDetailSection[] = [
  {
    title: "Python: BST insert, search, delete",
    body:
      "Maintain invariant: left subtree values < node < right subtree. Search walks left/right by comparison. Delete has three cases: leaf, one child, two children (replace with inorder successor or predecessor).",
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
                return cur
            cur = cur.left if val < cur.val else cur.right
        return None

    def insert(self, val):
        if not self.root:
            self.root = TreeNode(val)
            return
        cur = self.root
        while True:
            if val < cur.val:
                if cur.left:
                    cur = cur.left
                else:
                    cur.left = TreeNode(val)
                    return
            elif val > cur.val:
                if cur.right:
                    cur = cur.right
                else:
                    cur.right = TreeNode(val)
                    return
            else:
                return  # no duplicates

    def _min_node(self, n):
        while n.left:
            n = n.left
        return n

    def delete(self, val):
        self.root = self._delete(self.root, val)

    def _delete(self, n, val):
        if not n:
            return None
        if val < n.val:
            n.left = self._delete(n.left, val)
        elif val > n.val:
            n.right = self._delete(n.right, val)
        else:
            if not n.left:
                return n.right
            if not n.right:
                return n.left
            succ = self._min_node(n.right)
            n.val = succ.val
            n.right = self._delete(n.right, succ.val)
        return n
`,
    codeLanguage: "python",
  },
];
