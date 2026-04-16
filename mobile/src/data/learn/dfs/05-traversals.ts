import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const dfsTreeTraversalsSection: LearnDetailSection = {
  title: "Tree Traversals: In-order, Pre-order, Post-order",
  body:
    "The annotated tree above prints the same nodes three ways—preorder, inorder, postorder—only the moment you record the value relative to visiting children changes.\n\n" +
    VISUAL_ANCHOR +
    "DFS on binary trees visits every node exactly once. The three classic orders differ only in *when* you record the current node relative to visiting its children.\n\n" +
    "Pre-order  (Root → Left → Right)\n" +
    "• Record the node first, then recurse left, then recurse right.\n" +
    "• Use case: copy/serialize a tree, prefix expression evaluation.\n\n" +
    "In-order  (Left → Root → Right)\n" +
    "• Recurse left first, record the node, then recurse right.\n" +
    "• Use case: BST in-order gives sorted output — the most common tree interview trick.\n\n" +
    "Post-order  (Left → Right → Root)\n" +
    "• Recurse left, recurse right, then record the node last.\n" +
    "• Use case: delete a tree (children before parent), evaluate postfix expressions, compute subtree sizes.\n\n" +
    "Example tree used below:\n" +
    "         4\n" +
    "        / \\\n" +
    "       2   6\n" +
    "      / \\ / \\\n" +
    "     1  3 5  7\n\n" +
    "Pre-order  → [4, 2, 1, 3, 6, 5, 7]\n" +
    "In-order   → [1, 2, 3, 4, 5, 6, 7]  ← sorted! (BST)\n" +
    "Post-order → [1, 3, 2, 5, 7, 6, 4]",
  codeLanguage: "python",
  code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


# ── Pre-order: Root → Left → Right ──────────────────────
def preorder(root: TreeNode | None) -> list[int]:
    if root is None:
        return []
    return [root.val] + preorder(root.left) + preorder(root.right)


# ── In-order: Left → Root → Right ───────────────────────
def inorder(root: TreeNode | None) -> list[int]:
    if root is None:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)


# ── Post-order: Left → Right → Root ─────────────────────
def postorder(root: TreeNode | None) -> list[int]:
    if root is None:
        return []
    return postorder(root.left) + postorder(root.right) + [root.val]


# Build the example tree:   4 / 2 \\ 6, 2's children: 1,3; 6's children: 5,7
root = TreeNode(4,
    TreeNode(2, TreeNode(1), TreeNode(3)),
    TreeNode(6, TreeNode(5), TreeNode(7)))

assert preorder(root)  == [4, 2, 1, 3, 6, 5, 7]
assert inorder(root)   == [1, 2, 3, 4, 5, 6, 7]  # sorted!
assert postorder(root) == [1, 3, 2, 5, 7, 6, 4]
print("All traversals correct!")
`,
};
