export type TestData<T extends (...args) => any> = Array<{
  expected: ReturnType<T>;
  args: Parameters<T>;
}>;

export const runner = <T extends (...args) => any>(
  testData: TestData<T>,
  func: T,
  equalFn?: (a: ReturnType<T>, b: ReturnType<T>) => boolean
) => {
  testData.forEach((data, i) => {
    const result = func(...data.args);

    let success: boolean;
    if (equalFn) {
      success = equalFn(data.expected, result);
    } else {
      success =
        typeof result === "object" && result !== null
          ? JSON.stringify(result) === JSON.stringify(data.expected)
          : result === data.expected;
    }

    const icon = success ? "✅" : "❌";
    const resultMessage = `${icon} 테스트 ${i} - expected: ${
      typeof data.expected === "object" && data.expected !== null
        ? JSON.stringify(data.expected)
        : data.expected
    }\treal: ${
      typeof result === "object" && result !== null
        ? JSON.stringify(result)
        : result
    }`;

    console.log(resultMessage);
  });
};
