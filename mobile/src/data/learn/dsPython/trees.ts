import type { LearnDetailSection } from "../../learnSectionTypes";

export const DS_TREES_SECTIONS: LearnDetailSection[] = [
  {
    title: "Python: binary tree node and traversals",
    body:
      "`TreeNode` holds `val`, `left`, `right`. Traversals are DFS orders: preorder (node–left–right), inorder (left–node–right), postorder (left–right–node). Level-order uses a queue (BFS).",
    code: `from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def preorder(root):
    out = []

    def dfs(n):
        if not n:
            return
        out.append(n.val)
        dfs(n.left)
        dfs(n.right)

    dfs(root)
    return out


def inorder(root):
    out = []

    def dfs(n):
        if not n:
            return
        dfs(n.left)
        out.append(n.val)
        dfs(n.right)

    dfs(root)
    return out


def postorder(root):
    out = []

    def dfs(n):
        if not n:
            return
        dfs(n.left)
        dfs(n.right)
        out.append(n.val)

    dfs(root)
    return out


def level_order(root):
    if not root:
        return []
    res = []
    q = deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            n = q.popleft()
            level.append(n.val)
            if n.left:
                q.append(n.left)
            if n.right:
                q.append(n.right)
        res.append(level)
    return res
`,
    codeLanguage: "python",
  },
];
