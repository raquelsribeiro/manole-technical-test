export type AnalyzeNumbersResult = {
  somaPares: number;
  mediaImpares: number;
};

export function analyzeNumbers(values: unknown[]): AnalyzeNumbersResult {
  const validIntegers = values.filter(
    (value): value is number =>
      typeof value === "number" && Number.isInteger(value),
  );

  const evenNumbers = validIntegers.filter((number) => number % 2 === 0);
  const oddNumbers = validIntegers.filter((number) => number % 2 !== 0);

  const somaPares = evenNumbers.reduce((sum, number) => sum + number, 0);

  const somaImpares = oddNumbers.reduce((sum, number) => sum + number, 0);
  const mediaImpares =
    oddNumbers.length > 0 ? somaImpares / oddNumbers.length : 0;

  return {
    somaPares,
    mediaImpares,
  };
}
