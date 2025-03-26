export const runner = <T extends (...args) => any>(
  testData: Array<{ expected: ReturnType<T>; args: Parameters<T> }>,
  func: T
) => {
  testData.forEach((data, i) => {
    const result = func(...data.args);
    const success = result === data.expected;
    const icon = success ? "✅" : "❌";
    console.log(
      `${icon} 테스트 ${i} - expected: ${data.expected}\treal: ${result}`
    );
  });
};
