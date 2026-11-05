import { describe, expect, it } from "vitest";
import { initialsOf } from "@/lib/format";

describe("initialsOf", () => {
  it("uses the first letters of the first two words", () => {
    expect(initialsOf("Hana Host")).toBe("HH");
    expect(initialsOf("ada lovelace byron")).toBe("AL");
  });

  it("copes with one word, extra spaces and missing names", () => {
    expect(initialsOf("Cher")).toBe("C");
    expect(initialsOf("  Exam   Iner  ")).toBe("EI");
    expect(initialsOf("")).toBe("SS");
    expect(initialsOf(null)).toBe("SS");
    expect(initialsOf(undefined)).toBe("SS");
  });
});
