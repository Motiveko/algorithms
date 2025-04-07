import { runner } from "./testRunner";
/**
 * 두 개의 정렬된 배열에서 중앙값을 찾는 함수
 * @param arr1 첫 번째 정렬된 숫자 배열
 * @param arr2 두 번째 정렬된 숫자 배열
 * @returns 두 배열을 합쳤을 때의 중앙값
 *
 * 핵심 아이디어:
 * 두 배열을 합치지 않고, 이진 탐색을 이용하여 O(log(min(m, n))) 시간 복잡도로 중앙값을 찾는다.
 * 중앙값은 전체 원소를 정렬했을 때 중간에 위치하는 값(들)이다.
 * 즉, 전체 원소들을 왼쪽과 오른쪽 두 부분으로 나누었을 때,
 * 1. 왼쪽 부분의 원소 개수와 오른쪽 부분의 원소 개수가 같거나 하나 차이나고,
 * 2. 왼쪽 부분의 모든 원소는 오른쪽 부분의 모든 원소보다 작거나 같아야 한다.
 *
 * 이 조건을 만족하는 분할 지점을 이진 탐색으로 찾는다.
 * arr1에서 i개의 원소를 왼쪽 부분으로, arr2에서 j개의 원소를 왼쪽 부분으로 가져온다고 가정하자.
 * 전체 원소 수 totalLength = m + n 일 때, 왼쪽 부분의 총 원소 개수는 (m + n + 1) / 2 가 되어야 한다. (홀수, 짝수 모두 처리 가능)
 * 따라서, i + j = (m + n + 1) / 2 이어야 한다.
 *
 * 이진 탐색은 더 짧은 배열(arr1)을 기준으로 수행하여 탐색 범위를 줄인다. (0 <= i <= m)
 * i가 결정되면 j는 자동으로 계산된다 (j = (m + n + 1) / 2 - i).
 *
 * 올바른 분할 지점(i, j)의 조건:
 * - arr1[i-1] <= arr2[j]  (arr1의 왼쪽 마지막 원소가 arr2의 오른쪽 첫 원소보다 작거나 같음)
 * - arr2[j-1] <= arr1[i]  (arr2의 왼쪽 마지막 원소가 arr1의 오른쪽 첫 원소보다 작거나 같음)
 * (경계 값 처리: i=0, i=m, j=0, j=n 일 때는 -Infinity 또는 +Infinity로 간주)
 *
 * 이진 탐색 과정:
 * - 만약 arr1[i-1] > arr2[j] 이면, i가 너무 크다는 의미이므로 i를 줄여야 한다 (high = i - 1).
 * - 만약 arr2[j-1] > arr1[i] 이면, i가 너무 작다는 의미이므로 i를 늘려야 한다 (low = i + 1).
 * - 위 조건들을 만족하면 올바른 분할 지점을 찾은 것이다.
 *
 * 중앙값 계산:
 * - 전체 원소 개수(totalLength)가 홀수이면: 중앙값은 왼쪽 부분의 최대값이다. (max(arr1[i-1], arr2[j-1]))
 * - 전체 원소 개수(totalLength)가 짝수이면: 중앙값은 왼쪽 부분의 최대값과 오른쪽 부분의 최소값의 평균이다.
 * ( (max(arr1[i-1], arr2[j-1]) + min(arr1[i], arr2[j])) / 2 )
 */
function findMedianSortedArrays(arr1: number[], arr2: number[]): number {
  // arr1이 항상 arr2보다 짧거나 같도록 보장 (이진 탐색 효율성)
  if (arr1.length > arr2.length) {
    [arr1, arr2] = [arr2, arr1]; // 배열 스왑
  }

  const m = arr1.length;
  const n = arr2.length;
  const totalLength = m + n;
  // 왼쪽 파티션에 있어야 할 총 원소의 개수
  // totalLength가 홀수이면 중앙값 자체가 왼쪽 파티션의 최대값이 됨
  // totalLength가 짝수이면 두 중앙값 중 왼쪽 값이 왼쪽 파티션의 최대값이 됨
  const halfLen = Math.floor((totalLength + 1) / 2);

  let low = 0;
  let high = m; // arr1의 가능한 분할 지점 범위 (0부터 m까지)

  while (low <= high) {
    // arr1의 분할 지점 i (왼쪽 파티션에 arr1의 원소 i개를 포함)
    const i = Math.floor((low + high) / 2);
    // arr2의 분할 지점 j (왼쪽 파티션에 arr2의 원소 j개를 포함해야 halfLen 만족)
    const j = halfLen - i;

    // 파티션 경계 값 확인 및 조정
    const arr1LeftMax = i === 0 ? -Infinity : arr1[i - 1];
    const arr1RightMin = i === m ? Infinity : arr1[i];
    const arr2LeftMax = j === 0 ? -Infinity : arr2[j - 1];
    const arr2RightMin = j === n ? Infinity : arr2[j];

    // 올바른 분할 지점 조건 확인
    if (arr1LeftMax <= arr2RightMin && arr2LeftMax <= arr1RightMin) {
      // 올바른 분할 지점을 찾음! 중앙값 계산
      const maxLeft = Math.max(arr1LeftMax, arr2LeftMax);

      if (totalLength % 2 === 1) {
        // 총 길이가 홀수이면 왼쪽 파티션의 최대값이 중앙값
        return maxLeft;
      } else {
        // 총 길이가 짝수이면 왼쪽 파티션 최대값과 오른쪽 파티션 최소값의 평균
        const minRight = Math.min(arr1RightMin, arr2RightMin);
        return (maxLeft + minRight) / 2.0;
      }
    } else if (arr1LeftMax > arr2RightMin) {
      // arr1의 왼쪽 파티션이 너무 큼 (i가 너무 큼), i를 줄여야 함
      high = i - 1;
    } else {
      // arr2LeftMax > arr1RightMin
      // arr1의 왼쪽 파티션이 너무 작음 (i가 너무 작음), i를 늘려야 함
      low = i + 1;
    }
  }

  // 이론적으로는 이진 탐색이 항상 유효한 분할을 찾으므로 이 부분은 실행되지 않음
  // 하지만 컴파일러나 예외 상황을 위해 기본 반환값 추가 (혹은 에러 throw)
  throw new Error("입력 배열이 정렬되지 않았거나 로직 오류");
}

const testData: Array<{ expected: number; args: [number[], number[]] }> = [
  {
    expected: 3.5,
    args: [
      [5, 6],
      [1, 2, 3, 4],
    ],
  },
  {
    expected: 3.5,
    args: [
      [1, 2],
      [3, 4, 5, 6],
    ],
  },
  {
    expected: 2.5,
    args: [[1], [2, 3, 4]],
  },
  {
    expected: 100000.5,
    args: [[100000], [100001]],
  },
  {
    expected: 3,
    args: [[], [1, 2, 3, 4, 5]],
  },
  {
    expected: 1.5,
    args: [
      [1, 2],
      [1, 2],
    ],
  },
  {
    expected: 3,
    args: [
      [2, 2, 4, 4],
      [2, 2, 4, 4],
    ],
  },
  {
    expected: -1,
    args: [[3], [-2, -1]],
  },
  {
    expected: 2,
    args: [[1, 3], [2]],
  },
  {
    expected: 9,
    args: [
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    ],
  },
];

runner(testData, findMedianSortedArrays);
