import { describe, expect, it } from "vitest";
import { reviewFormSchema } from "@/lib/validation/review";
import { studioFormSchema } from "@/lib/validation/studio";

const studio = {
  title: "Harbor Light Cyclorama",
  category: "photo-studio",
  hourlyRate: 45,
  securityDeposit: 80,
  maxCapacity: 8,
  location: { address: "21 Dockside Avenue", city: "Portland" },
  image: "https://images.example.com/cover.jpg",
  gallery: [],
  amenities: ["Natural light", "Wi-Fi"],
  overview: "A bright, white cyclorama wall with daylight windows and a private changing room.",
};

describe("studioFormSchema", () => {
  it("accepts a complete listing", () => {
    expect(studioFormSchema.safeParse(studio).success).toBe(true);
  });

  it("rejects image links that are not http(s)", () => {
    for (const image of ["javascript:alert(1)", "data:text/html;base64,AAAA", "not a url", ""]) {
      expect(studioFormSchema.safeParse({ ...studio, image }).success).toBe(false);
    }
  });

  it("enforces price, capacity and category limits", () => {
    expect(studioFormSchema.safeParse({ ...studio, hourlyRate: 0 }).success).toBe(false);
    expect(studioFormSchema.safeParse({ ...studio, securityDeposit: -1 }).success).toBe(false);
    expect(studioFormSchema.safeParse({ ...studio, maxCapacity: 1.5 }).success).toBe(false);
    expect(studioFormSchema.safeParse({ ...studio, category: "castle" }).success).toBe(false);
  });

  it("caps the gallery at six images", () => {
    const gallery = Array.from({ length: 7 }, (_, index) => `https://images.example.com/${index}.jpg`);
    expect(studioFormSchema.safeParse({ ...studio, gallery }).success).toBe(false);
  });
});

describe("reviewFormSchema", () => {
  it("needs a 1 to 5 whole-number rating and a real comment", () => {
    expect(reviewFormSchema.safeParse({ rating: 5, comment: "Spotless and well equipped." }).success).toBe(true);
    expect(reviewFormSchema.safeParse({ rating: 0, comment: "Spotless and well equipped." }).success).toBe(false);
    expect(reviewFormSchema.safeParse({ rating: 6, comment: "Spotless and well equipped." }).success).toBe(false);
    expect(reviewFormSchema.safeParse({ rating: 4, comment: "ok" }).success).toBe(false);
  });
});
