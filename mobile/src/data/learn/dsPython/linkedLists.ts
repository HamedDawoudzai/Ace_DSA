import type { LearnDetailSection } from "../../learnSectionTypes";

export const DS_LINKED_LISTS_SECTIONS: LearnDetailSection[] = [
  {
    title: "Python: singly linked list node",
    body:
      "Interview style: define `ListNode` with `val` and `next`. Insert/delete are pointer rewires—often easier with a dummy head so the real head can change without special cases.",
    code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def traverse(head):
    cur = head
    while cur:
        # visit(cur.val)
        cur = cur.next


def prepend(head, val):
    return ListNode(val, head)


# insert after prev (prev is not None)
def insert_after(prev, val):
    prev.next = ListNode(val, prev.next)


# delete first node with val (dummy head avoids head special-case)
def delete_value(head, val):
    dummy = ListNode(0, head)
    prev, cur = dummy, head
    while cur:
        if cur.val == val:
            prev.next = cur.next
            break
        prev, cur = cur, cur.next
    return dummy.next
`,
    codeLanguage: "python",
  },
];
