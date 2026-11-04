import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "@/lib/navigation";

describe("safeRedirectPath", () => {
  it("keeps same-site relative paths", () => {
    expect(safeRedirectPath("/my-bookings")).toBe("/my-bookings");
    expect(safeRedirectPath("/studios?category=music-suite")).toBe("/studios?category=music-suite");
  });

  it("falls back for anything that could leave the site", () => {
    for (const hostile of ["https://evil.example", "//evil.example", "/\\evil.example", "javascript:alert(1)", "evil.example"]) {
      expect(safeRedirectPath(hostile)).toBe("/");
    }
  });

  it("uses the supplied fallback when nothing is provided", () => {
    expect(safeRedirectPath(null, "/dashboard")).toBe("/dashboard");
    expect(safeRedirectPath(undefined)).toBe("/");
    expect(safeRedirectPath("")).toBe("/");
  });
});
