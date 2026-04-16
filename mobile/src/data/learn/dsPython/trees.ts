import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const DS_TREES_SECTIONS: LearnDetailSection[] = [
  {
    title: "Python: binary tree node and traversals",
    body:
      "The binary tree image above shows parent/child links; the traversal functions below walk that exact shape—just choosing when to print `node.val`.\n\n" +
      VISUAL_ANCHOR +
      "The code snippet below teaches you the basic tree traversal operations you need to know for interview problems.\n\n" +
      "• TreeNode — the building block: each node stores a value and optional left and right children.\n" +
      "• preorder — visit the current node first, then go left, then right. Good when you need to process a node before its children.\n" +
      "• inorder — go left first, then visit the current node, then go right. On a BST this gives you values in sorted order.\n" +
      "• postorder — go left first, then right, then visit the current node last. Good when you need children's results before the parent's.\n" +
      "• level_order — visit every node level by level, top to bottom, using a queue. Returns each level as its own list.",
    code: `from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


# visit node → go left → go right
def preorder(root):
    result = []

    def dfs(node):
        if not node:
            return
        result.append(node.val)   # visit this node first
        dfs(node.left)            # then explore the left side
        dfs(node.right)           # then explore the right side

    dfs(root)
    return result


# go left → visit node → go right
def inorder(root):
    result = []

    def dfs(node):
        if not node:
            return
        dfs(node.left)            # explore left side first
        result.append(node.val)   # then visit this node
        dfs(node.right)           # then explore right side

    dfs(root)
    return result


# go left → go right → visit node
def postorder(root):
    result = []

    def dfs(node):
        if not node:
            return
        dfs(node.left)            # explore left side first
        dfs(node.right)           # explore right side next
        result.append(node.val)   # visit this node last

    dfs(root)
    return result


# visit every node level by level, top to bottom
def level_order(root):
    if not root:
        return []
    result = []
    queue = deque()
    queue.append(root)
    while queue:
        level = []
        for _ in range(len(queue)):   # process every node on this level
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result
`,
    codeLanguage: "python",
  },
];
