// 문제 : https://leetcode.com/problems/check-if-grid-can-be-cut-into-sections/description/?envType=daily-question&envId=2025-03-25

import { runner } from "./testRunner";

type Rectangle = [number, number, number, number];
type Line = [number, number]; // [start, end]

function mergeIntervals(lines: Line[]): Line[] {
  if (lines.length === 0) {
    return [];
  }

  // 1. 시작점을 기준으로 오름차순 정렬
  lines.sort((a, b) => a[0] - b[0]);

  const merged: Line[] = [];
  let currentMerged = [...lines[0]] as Line; // 첫 번째 구간으로 초기화 (깊은 복사)

  // 2. 순회하며 병합
  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i];
    if (currentLine[0] < currentMerged[1]) {
      currentMerged[1] = Math.max(currentMerged[1], currentLine[1]);
    } else {
      merged.push(currentMerged);
      currentMerged = [...currentLine] as Line; // 깊은 복사
    }
  }

  merged.push(currentMerged);

  return merged;
}

function checkValidCuts(n: number, rectangles: Rectangle[]): boolean {
  // X축 기준 병합
  const linesX: Line[] = rectangles.map((rect) => [rect[0], rect[2]]);
  const mergedX = mergeIntervals(linesX);

  // 병합된 구간이 3개 이상이면, 그 사이 공간에 두 개의 수직 절단선 가능
  if (mergedX.length >= 3) {
    return true;
  }

  // Y축 기준 병합
  const linesY: Line[] = rectangles.map((rect) => [rect[1], rect[3]]);
  const mergedY = mergeIntervals(linesY);
  // 병합된 구간이 3개 이상이면, 그 사이 공간에 두 개의 수평 절단선 가능
  if (mergedY.length >= 3) {
    return true;
  }

  return false;
}

const dataset: Array<{
  expected: boolean;
  args: Parameters<typeof checkValidCuts>;
}> = [
  {
    expected: true,
    args: [
      5,
      [
        [1, 0, 5, 2],
        [0, 2, 2, 4],
        [3, 2, 5, 3],
        [0, 4, 4, 5],
      ],
    ],
  },
  {
    expected: true,
    args: [
      4,
      [
        [0, 0, 1, 1],
        [2, 0, 3, 4],
        [0, 2, 2, 3],
        [3, 0, 4, 3],
      ],
    ],
  },
  {
    expected: false,
    args: [
      4,
      [
        [0, 2, 2, 4],
        [1, 0, 3, 2],
        [2, 2, 3, 4],
        [3, 0, 4, 2],
        [3, 2, 4, 4],
      ],
    ],
  },
  {
    expected: false,
    args: [
      4,
      [
        [0, 0, 1, 4],
        [1, 0, 2, 3],
        [2, 0, 3, 3],
        [3, 0, 4, 3],
        [1, 3, 4, 4],
      ],
    ],
  },
];
runner(dataset, checkValidCuts);
