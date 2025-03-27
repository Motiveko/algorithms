import { runner, TestData } from "./testRunner";
// https://leetcode.com/problems/add-two-numbers/submissions/1587755091/?source=submission-ac

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function addTwoNumbers(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  if (l1 === null) return l2;
  if (l2 === null) return l1;

  let additionalValue = 0;
  let curNode1: ListNode | null = l1;
  let curNode2: ListNode | null = l2;
  let result: number[] = [];

  while (curNode1 !== null || curNode2 !== null) {
    const v1 = curNode1?.val || 0;
    const v2 = curNode2?.val || 0;

    const total = v1 + v2 + additionalValue;
    result.push(total % 10);
    additionalValue = Math.floor(total / 10);

    curNode1 = curNode1?.next || null;
    curNode2 = curNode2?.next || null;
  }
  if (additionalValue > 0) {
    result.push(additionalValue);
  }

  return toListNodes(result);
}

const toListNodes = (numbers: number[]) => {
  if (numbers.length === 0) {
    return null;
  }
  const firstNode = new ListNode(numbers[0]);
  numbers.reduce((acc, current, i) => {
    if (i === 0) return firstNode;
    const currentNode = new ListNode(current);
    acc.next = currentNode;
    return currentNode;
  }, firstNode);

  return firstNode;
};

const dataset: Array<{
  expected: ListNode | null;
  args: [ListNode | null, ListNode | null];
}> = [
  {
    expected: toListNodes([7, 0, 8]),
    args: [toListNodes([2, 4, 3]), toListNodes([5, 6, 4])],
  },
  {
    expected: toListNodes([0]),
    args: [toListNodes([0]), toListNodes([0])],
  },
  {
    expected: toListNodes([8, 9, 9, 9, 0, 0, 0, 1]),
    args: [toListNodes([9, 9, 9, 9, 9, 9, 9]), toListNodes([9, 9, 9, 9])],
  },
];

runner(dataset, addTwoNumbers, (a, b) => {
  if (a === null) {
    return b === null;
  } else if (b === null) {
    return false;
  }

  let result;
  let nodeA: ListNode | null = a;
  let nodeB: ListNode | null = b;
  while (nodeA || nodeB) {
    if (nodeA?.val !== nodeB?.val) return false;
    nodeA = nodeA?.next || null;
    nodeB = nodeB?.next || null;
  }

  return true;
});
