import { describe, expect, it } from "vitest";
import { estimateRate, formatRate } from "./rate";

describe("hourly estimate", () => {
  it("divides income by billable hours without rounding the calculation", () => {
    expect(estimateRate("6000", "120").rate).toBe(50);
    expect(estimateRate(" 100.5 ", "3").rate).toBe(33.5);
    expect(estimateRate("100", "3").rate).toBe(100 / 3);
    expect(formatRate(100 / 3)).toBe("$33.33");
  });

  it.each(["", " ", "abc", "0", "-1", "NaN", "Infinity", "1e309"])(
    "rejects invalid or non-positive input %j in either field",
    (value) => {
      const badIncome = estimateRate(value, "100");
      const badHours = estimateRate("5000", value);
      expect(badIncome.rate).toBeUndefined();
      expect(badIncome.errors.income).toBeTruthy();
      expect(badHours.rate).toBeUndefined();
      expect(badHours.errors.hours).toBeTruthy();
    },
  );

  it("reports both invalid fields and recovers with valid values", () => {
    expect(estimateRate("", "0").errors).toEqual({
      income: "Enter a value greater than zero.",
      hours: "Enter a value greater than zero.",
    });
    expect(estimateRate("6000", "120").errors).toEqual({});
  });

  it("rejects overflow and underflow from otherwise positive finite inputs", () => {
    expect(estimateRate("1e308", "1e-308").errors.result).toBeTruthy();
    expect(estimateRate("5e-324", "1e308").errors.result).toBeTruthy();
  });

  it("keeps a small positive result readable instead of displaying zero", () => {
    expect(estimateRate("0.01", "100").rate).toBe(0.0001);
    expect(formatRate(0.0001)).toBe("Less than $0.01");
  });
});
