// https://leetcode.com/problems/reverse-integer/
import { runner, TestData } from "./testRunner";

function reverse(x: number): number {
  const str = String(x);
  const maxValue = Math.pow(2, 31) - 1;
  const minValue = Math.pow(2, 31) * -1;

  let result: number;
  if (str.startsWith("-")) {
    result = parseInt(Array.from(str).reverse().join("")) * -1;
  } else {
    result = parseInt(Array.from(str).reverse().join(""));
  }

  if (result > maxValue || result < minValue) {
    return 0;
  }

  return result;
}

const testData: TestData<typeof reverse> = [
  {
    args: [123],
    expected: 321,
  },
  {
    args: [-123],
    expected: -321,
  },
  {
    args: [120],
    expected: 21,
  },
  {
    args: [1534236469],
    expected: 0,
  },
];

runner(testData, reverse);
