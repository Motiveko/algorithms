// https://leetcode.com/problems/longest-substring-without-repeating-characters/description/
import { runner } from "./testRunner";

function lengthOfLongestSubstring(s: string): number {
  let maxLen = 0;
  const lastIndexMap: Record<string, number> = {}; // 각 캐릭터별 마지막 index
  const wipUniqueStrRange: [number, number] = [0, 0]; // 현재 유니크 substring 범위
  const getWipUniqueStrLen = () =>
    wipUniqueStrRange[1] - wipUniqueStrRange[0] + 1; //

  for (let i = 0; i < s.length; i++) {
    const char = s.charAt(i);

    const prevLastIndex = lastIndexMap[char];
    wipUniqueStrRange[0] =
      prevLastIndex !== undefined
        ? Math.max(wipUniqueStrRange[0], prevLastIndex + 1)
        : wipUniqueStrRange[0];
    wipUniqueStrRange[1] = i;

    maxLen = Math.max(maxLen, getWipUniqueStrLen());
    lastIndexMap[char] = i;
  }

  return maxLen;
}

const testData: Array<{ expected: number; args: [string] }> = [
  {
    expected: 3,
    args: ["abcabcbb"],
  },
  {
    expected: 1,
    args: ["bbbbb"],
  },
  {
    expected: 3,
    args: ["pwwkew"],
  },
];

runner(testData, lengthOfLongestSubstring);
