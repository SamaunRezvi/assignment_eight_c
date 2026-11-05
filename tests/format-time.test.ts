import { describe, expect, it } from "vitest";
import { formatCalendarDate, formatTime, todayIso } from "@/lib/format";

describe("formatTime", () => {
  it("converts 24 hour times to a 12 hour clock", () => {
    expect(formatTime("00:00")).toBe("12:00 AM");
    expect(formatTime("09:30")).toBe("9:30 AM");
    expect(formatTime("12:00")).toBe("12:00 PM");
    expect(formatTime("13:30")).toBe("1:30 PM");
    expect(formatTime("23:30")).toBe("11:30 PM");
  });
});

describe("formatCalendarDate", () => {
  it("prints the calendar day exactly as stored, with no timezone shift", () => {
    expect(formatCalendarDate("2026-11-09")).toBe("Mon, Nov 9, 2026");
    expect(formatCalendarDate("2026-01-01")).toBe("Thu, Jan 1, 2026");
  });

  it("returns malformed input untouched instead of throwing", () => {
    expect(formatCalendarDate("soon")).toBe("soon");
  });
});

describe("todayIso", () => {
  it("returns a zero padded YYYY-MM-DD string", () => {
    expect(todayIso()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
