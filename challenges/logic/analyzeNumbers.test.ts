import { analyzeNumbers } from "./analyzeNumbers";

describe("analyzeNumbers", () => {
  it("should return the sum of even numbers and average of odd numbers", () => {
    const result = analyzeNumbers([1, 2, 3, 4, 5, "a", null]);

    expect(result).toEqual({
      somaPares: 6,
      mediaImpares: 3,
    });
  });

  it("should ignore invalid values", () => {
    const result = analyzeNumbers([2, "test", null, undefined, 4, {}, []]);

    expect(result).toEqual({
      somaPares: 6,
      mediaImpares: 0,
    });
  });

  it("should return zero average when there are no odd numbers", () => {
    const result = analyzeNumbers([2, 4, 6]);

    expect(result).toEqual({
      somaPares: 12,
      mediaImpares: 0,
    });
  });

  it("should return zero sum when there are no even numbers", () => {
    const result = analyzeNumbers([1, 3, 5]);

    expect(result).toEqual({
      somaPares: 0,
      mediaImpares: 3,
    });
  });

  it("should handle empty arrays", () => {
    const result = analyzeNumbers([]);

    expect(result).toEqual({
      somaPares: 0,
      mediaImpares: 0,
    });
  });

  it("should handle negative numbers", () => {
    const result = analyzeNumbers([-2, -4, -1, -3]);

    expect(result).toEqual({
      somaPares: -6,
      mediaImpares: -2,
    });
  });
});
