import { runner } from "./testRunner";

const createIndexMap = (numbers: number[]) => {
  const numberIndexes: Record<string, number[]> = {};
  numbers.forEach((num, i) => {
    if (!numberIndexes[num]) {
      numberIndexes[num] = [i];
    } else {
      numberIndexes[num].push(i);
    }
  });
  return numberIndexes;
};

// https://leetcode.com/problems/two-sum/description/
function twoSum(numbers: number[], target: number): number[] {
  // O(n)으로 만들방법
  const set = new Set(numbers);
  const indexMap = createIndexMap(numbers);
  let result;

  numbers.forEach((left, leftIndex) => {
    const right = target - left;
    if (set.has(right)) {
      const rightIndexes = indexMap[String(right)];
      const rightIndex = rightIndexes.find((i) => i !== leftIndex);

      if (rightIndex === undefined) return;

      result = [leftIndex, rightIndex];
    }
  });

  return result.sort();
}

const dataset: Array<{ expected: [number, number]; args: [number[], number] }> =
  [
    {
      expected: [0, 1],
      args: [[2, 7, 11, 15], 9],
    },
    {
      expected: [1, 2],
      args: [[3, 2, 4], 6],
    },
    {
      expected: [0, 1],
      args: [[3, 3], 6],
    },
  ];

runner(dataset, twoSum);
