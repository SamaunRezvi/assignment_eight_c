import { describe, expect, it } from "vitest";
import { formatPrice, formatRating } from "@/lib/format";

describe("formatPrice", () => {
  it("drops the cents for whole dollar amounts", () => {
    expect(formatPrice(38)).toBe("$38");
    expect(formatPrice(1200)).toBe("$1,200");
  });

  it("keeps the cents when a price is not a whole number", () => {
    expect(formatPrice(37.5)).toBe("$37.50");
    expect(formatPrice(12.05)).toBe("$12.05");
  });
});

describe("formatRating", () => {
  it("shows one decimal place for rated studios", () => {
    expect(formatRating(4)).toBe("4.0");
    expect(formatRating(4.66)).toBe("4.7");
  });

  it("labels unrated studios as new", () => {
    expect(formatRating(0)).toBe("New");
  });
});
