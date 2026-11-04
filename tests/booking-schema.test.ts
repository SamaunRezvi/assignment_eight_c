import { describe, expect, it } from "vitest";
import { TIME_OPTIONS, bookingFormSchema } from "@/lib/validation/booking";

const valid = { date: "2026-12-01", startTime: "10:00", endTime: "12:30", guests: 3, note: "" };

describe("bookingFormSchema", () => {
  it("accepts a well-formed half-hour slot", () => {
    expect(bookingFormSchema.safeParse(valid).success).toBe(true);
  });

  it("requires the session to end after it starts", () => {
    for (const endTime of ["10:00", "09:30"]) {
      const result = bookingFormSchema.safeParse({ ...valid, endTime });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.message).toMatch(/after the start/i);
    }
  });

  it("only allows times on the half hour", () => {
    expect(bookingFormSchema.safeParse({ ...valid, startTime: "10:15" }).success).toBe(false);
    expect(bookingFormSchema.safeParse({ ...valid, endTime: "24:00" }).success).toBe(false);
  });

  it("rejects fractional or empty guest counts and overlong notes", () => {
    expect(bookingFormSchema.safeParse({ ...valid, guests: 2.5 }).success).toBe(false);
    expect(bookingFormSchema.safeParse({ ...valid, guests: 0 }).success).toBe(false);
    expect(bookingFormSchema.safeParse({ ...valid, note: "x".repeat(501) }).success).toBe(false);
  });
});

describe("TIME_OPTIONS", () => {
  it("covers 06:00 to 23:30 in half-hour steps", () => {
    expect(TIME_OPTIONS).toHaveLength(36);
    expect(TIME_OPTIONS[0]).toBe("06:00");
    expect(TIME_OPTIONS.at(-1)).toBe("23:30");
  });
});
