import { describe, expect, it } from "vitest";
import { BOOKING_STATUS_STYLES, CATEGORIES, CATEGORY_BY_VALUE, NAV_LINKS, SORT_OPTIONS } from "@/lib/constants";
import { studioFormSchema } from "@/lib/validation/studio";

describe("category catalogue", () => {
  it("offers exactly the five categories the API accepts", () => {
    expect(CATEGORIES.map((category) => category.value)).toEqual(["photo-studio", "film-stage", "podcast-lounge", "music-suite", "workshop"]);
  });

  it("keeps every value valid for the studio form schema", () => {
    for (const { value } of CATEGORIES) {
      const result = studioFormSchema.shape.category.safeParse(value);
      expect(result.success, value).toBe(true);
    }
  });

  it("gives every category a label, a card name, an icon and a photo", () => {
    for (const category of CATEGORIES) {
      expect(category.label).not.toBe("");
      expect(category.plural).not.toBe("");
      expect(category.icon).toBeDefined();
      expect(category.image).toMatch(/^https:\/\//);
      expect(CATEGORY_BY_VALUE[category.value]).toBe(category);
    }
  });
});

describe("shared option lists", () => {
  it("styles all four booking statuses", () => {
    expect(Object.keys(BOOKING_STATUS_STYLES).sort()).toEqual(["Cancelled", "Completed", "Confirmed", "Pending"]);
  });

  it("lists the four sort orders the API understands", () => {
    expect(SORT_OPTIONS.map((option) => option.value)).toEqual(["newest", "top-rated", "price-asc", "price-desc"]);
  });

  it("links the required primary navigation", () => {
    expect(NAV_LINKS.map((link) => link.href)).toEqual(["/", "/studios", "/how-it-works", "/about"]);
  });
});
