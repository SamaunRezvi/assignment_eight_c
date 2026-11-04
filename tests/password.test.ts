import { describe, expect, it } from "vitest";
import { PASSWORD_RULES, validatePassword } from "@/lib/validation/password";

describe("validatePassword", () => {
  it("accepts a password with upper case, lower case and six characters", () => {
    expect(validatePassword("Examiner123")).toBeNull();
    expect(validatePassword("Abcdef")).toBeNull();
  });

  it("reports the first unmet rule", () => {
    expect(validatePassword("Ab1")).toMatch(/at least 6/i);
    expect(validatePassword("lowercase1")).toMatch(/uppercase/i);
    expect(validatePassword("UPPERCASE1")).toMatch(/lowercase/i);
  });

  it("keeps the live checklist in step with the validator", () => {
    for (const sample of ["Ab1", "lowercase1", "UPPERCASE1", "Examiner123", ""]) {
      const allRulesPass = PASSWORD_RULES.every((rule) => rule.test(sample));
      expect(allRulesPass).toBe(validatePassword(sample) === null);
    }
  });
});
