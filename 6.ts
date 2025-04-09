// https://leetcode.com/problems/zigzag-conversion/description/
import { runner } from "./testRunner";

// O(n)
// 패턴반복임. 패턴은 numRows = n,  cycle = n > 1 ? 2n - 2 : 1;
// n = 1 => 1
// n = 2 => 2 (2n - 2)
// n = 3 => 4
// n = 4 => 6
function convert(s: string, numRows: number): string {
  const n = numRows;

  if (n === 1) {
    return s;
  }

  const resultRows = Array.from({ length: numRows }, () => "");
  const cycle = (n - 1) * 2;

  for (let i = 0; i < s.length; i++) {
    // n = 5 일때, index 증가하면서 row는  0 1 2 3 4 3 2 1 이 된다
    const mod = i % cycle;
    const row = mod < n ? mod : cycle - mod;

    resultRows[row] += s.charAt(i);
  }

  return resultRows.join("");
}

const testData: Array<{ args: [string, number]; expected: string }> = [
  {
    args: ["PAYPALISHIRING", 3],
    expected: "PAHNAPLSIIGYIR",
  },
  {
    args: ["PAYPALISHIRING", 4],
    expected: "PINALSIGYAHRPI",
  },
  {
    args: ["A", 1],
    expected: "A",
  },
];

runner(testData, convert);
