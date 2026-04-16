import type { LearnDetailSection } from "../../learnSectionTypes";
import { VISUAL_ANCHOR } from "../imageAnchor";

export const DS_LINKED_LISTS_SECTIONS: LearnDetailSection[] = [
  {
    title: "Python: singly linked list node",
    body:
      "The linked-list drawing above is squares and arrows—each `ListNode` below is one square, and `.next` is the arrow to the following node.\n\n" +
      VISUAL_ANCHOR +
      "The code snippet below teaches you the basic linked list operations you need to know for interview problems.\n\n" +
      "• ListNode — the building block: each node stores a value and a pointer to the next node.\n" +
      "• traverse — walk through every node from head to tail, one step at a time.\n" +
      "• prepend — add a new node to the very front of the list.\n" +
      "• insert_after — add a new node right after a node you already have.\n" +
      "• delete_value — remove the first node that holds a given value (uses a dummy node so you never have to worry about whether the head itself is being deleted).",
    code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def traverse(head):
    cur = head
    while cur:
        # visit cur.val here
        cur = cur.next          # move to the next node


def prepend(head, val):
    new_node = ListNode(val)   # create a new node
    new_node.next = head       # point it to the old first node
    return new_node            # new_node is now the head


def insert_after(prev, val):
    new_node = ListNode(val)   # create the new node
    new_node.next = prev.next  # new node points to whatever came after prev
    prev.next = new_node       # prev now points to the new node


def delete_value(head, val):
    dummy = ListNode(0)        # dummy node before the real head
    dummy.next = head
    prev = dummy
    cur = head
    while cur:
        if cur.val == val:
            prev.next = cur.next  # skip over cur to remove it
            break
        prev = cur
        cur = cur.next
    return dummy.next          # return the real head (may have changed)
`,
    codeLanguage: "python",
  },
];
