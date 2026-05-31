import { describe, it, expect } from "vitest";
import { amountInIndianWords, formatIndianNumber, parseAmountInput } from "@/lib/format";

describe("formatIndianNumber", () => {
  it("formats with Indian grouping", () => {
    expect(formatIndianNumber(500000)).toBe("5,00,000");
    expect(formatIndianNumber(100000)).toBe("1,00,000");
    expect(formatIndianNumber(1234567)).toBe("12,34,567");
  });

  it("returns empty for invalid input", () => {
    expect(formatIndianNumber("")).toBe("");
    expect(formatIndianNumber(-1)).toBe("");
  });
});

describe("amountInIndianWords", () => {
  it("converts lakh amounts", () => {
    expect(amountInIndianWords(500000)).toBe("Five Lakh");
    expect(amountInIndianWords(100000)).toBe("One Lakh");
    expect(amountInIndianWords(1000000)).toBe("Ten Lakh");
  });

  it("combines crore, lakh, thousand, and remainder", () => {
    expect(amountInIndianWords(1234567)).toBe(
      "Twelve Lakh Thirty Four Thousand Five Hundred Sixty Seven",
    );
    expect(amountInIndianWords(10000000)).toBe("One Crore");
  });

  it("returns empty for zero or invalid input", () => {
    expect(amountInIndianWords(0)).toBe("");
    expect(amountInIndianWords("")).toBe("");
  });
});

describe("parseAmountInput", () => {
  it("parses valid numeric strings", () => {
    expect(parseAmountInput("500000")).toBe(500000);
    expect(parseAmountInput(" 100 ")).toBe(100);
  });

  it("returns null for empty or invalid input", () => {
    expect(parseAmountInput("")).toBeNull();
    expect(parseAmountInput("abc")).toBeNull();
    expect(parseAmountInput("-5")).toBeNull();
  });
});
