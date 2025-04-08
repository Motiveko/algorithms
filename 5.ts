// https://leetcode.com/problems/longest-palindromic-substring/
import { runner } from "./testRunner";

const findLongestPalindromicStr = (text: string, index: number) => {
  // 1.index의 문자열을 중심으로 계산(홀수 palindromic) 2. index를 왼쪽 끝문자열로(짝수 palindromic, e.g.) ab"c"cba )
  const oddPalindromicString = findOddPalindromicStr(text, index);
  const evenPalindromicString = findEvenPalindromicStr(text, index);

  return oddPalindromicString.length > evenPalindromicString.length
    ? oddPalindromicString
    : evenPalindromicString;
};

const findOddPalindromicStr = (text: string, index: number) => {
  let result = text.charAt(index);
  if (index === 0 || index === text.length - 1) {
    return result;
  }

  let i = 1;
  let left: number;
  let right: number;
  while ((left = index - i) >= 0 && (right = index + i) <= text.length - 1) {
    const leftChar = text.charAt(left);
    const rightChar = text.charAt(right);
    if (leftChar === rightChar) {
      result = `${leftChar}${result}${rightChar}`;
      i++;
    } else {
      break;
    }
  }

  return result;
};

const findEvenPalindromicStr = (text: string, index: number) => {
  let result = "";
  if (index === text.length - 1) {
    return result;
  }

  let left = index;
  let right = index + 1;
  while (left >= 0 && right <= text.length - 1) {
    const leftChar = text.charAt(left);
    const rightChar = text.charAt(right);
    if (leftChar === rightChar) {
      result = `${leftChar}${result}${rightChar}`;
      left--;
      right++;
    } else {
      break;
    }
  }

  return result;
};

const getAvailableLongestPalindromic = (text: string, i: number) => {
  // 홀수일경우
  const maxOdd = Math.min(i, text.length - 1 - i) * 2 + 1;
  const maxEven = Math.min(i + 1, text.length - 1 - i) * 2;

  return Math.max(maxOdd, maxEven);
};

// 시간복잡도 O(n^2)
const solve1 = (text: string) => {
  let longest = "";
  for (let i = 0; i < text.length; i++) {
    const availableLongestLength = getAvailableLongestPalindromic(text, i);
    if (longest.length >= availableLongestLength) {
      continue;
    }

    const currentLongest = findLongestPalindromicStr(text, i);
    longest = currentLongest.length > longest.length ? currentLongest : longest;
  }

  return longest;
};

// Manacher's algorithms O(n)
// 최적화방식임. 넓은 palindrome을 구했을 때 palindrome 내부 어딘가의 center 기준 palindrome 최소 너비(넓은 palindrome 범위 까지)는 인덱싱이 되는 원리
function solve2(s: string): string {
  if (s === null || s.length < 1) {
    return "";
  }

  // 1. 전처리 (Preprocessing)
  // 예: "aba" -> "^#a#b#a#$"
  // 예: "abba" -> "^#a#b#b#a#$"
  // ^와 $는 경계 검사를 단순화하기 위한 가드 문자입니다.
  let transformed = "^#" + s.split("").join("#") + "#$";
  const n = transformed.length;
  const p = new Array(n).fill(0); // 각 인덱스를 중심으로 하는 회문의 반지름 배열

  let center = 0; // 현재까지 가장 오른쪽으로 확장된 회문의 중심
  let rightBoundary = 0; // 현재까지 가장 오른쪽으로 확장된 회문의 오른쪽 경계 (경계 자체는 포함 안 함)

  // 2. 반지름 배열 계산 (Calculate Radius Array)
  for (let i = 1; i < n - 1; i++) {
    // ^와 $는 제외
    // i의 대칭점 계산 (Calculate mirror index)
    const mirror = 2 * center - i;

    // 3. 최적화: i가 현재 rightBoundary 내에 있으면 대칭점 정보 활용
    // rightBoundary - i 는 현재 중심(center)에서 i까지의 거리
    // p[mirror]는 대칭점에서의 반지름
    if (i < rightBoundary) {
      p[i] = Math.min(rightBoundary - i, p[mirror]);
    } else {
      // i가 rightBoundary 밖에 있으면, 초기 반지름은 0
      p[i] = 0;
    }

    // 4. 확장: 현재 p[i]를 기반으로 가능한 만큼 확장 시도
    // transformed[i + (p[i] + 1)] : 오른쪽으로 한 칸 더 간 문자
    // transformed[i - (p[i] + 1)] : 왼쪽으로 한 칸 더 간 문자
    while (transformed[i + p[i] + 1] === transformed[i - p[i] - 1]) {
      p[i]++;
    }

    // 5. 중심(center) 및 오른쪽 경계(rightBoundary) 업데이트
    // 현재 i에서 시작한 회문이 기존 rightBoundary보다 더 오른쪽으로 확장되면 업데이트
    if (i + p[i] > rightBoundary) {
      center = i;
      rightBoundary = i + p[i];
    }
  }

  // 6. 결과 추출 (Extract Result)
  // p 배열에서 가장 큰 반지름(maxLen)과 그 중심(maxCenter) 찾기
  let maxLen = 0;
  let maxCenter = 0;
  for (let i = 1; i < n - 1; i++) {
    if (p[i] > maxLen) {
      maxLen = p[i];
      maxCenter = i;
    }
  }

  // 가장 긴 회문의 시작 인덱스 계산 (원본 문자열 기준)
  // (maxCenter - maxLen) / 2 는 변환된 문자열에서 회문 시작 '#' 다음 문자의 위치에 해당
  const start = (maxCenter - maxLen) / 2;
  // 가장 긴 회문의 길이는 반지름 maxLen과 동일
  const longestPal = s.substring(start, start + maxLen);

  return longestPal;
}

function longestPalindrome(s: string): string {
  return solve2(s);
}

const testData: Array<{ expected: string; args: [string] }> = [
  {
    args: ["ccc"],
    expected: "ccc",
  },
  // {
  //   args: ["babad"],
  //   expected: "bab",
  // },
  // {
  //   args: ["cbbd"],
  //   expected: "bb",
  // },
];

runner(testData, longestPalindrome);
