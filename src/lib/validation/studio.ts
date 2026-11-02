import { z } from "zod";

const httpUrl = z
  .string()
  .trim()
  .min(1, "Image URL is required")
  .refine((value) => {
    try {
      const { protocol } = new URL(value);
      return protocol === "http:" || protocol === "https:";
    } catch {
      return false;
    }
  }, "Enter a valid http(s) image URL");

export const studioFormSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
  category: z.enum(["photo-studio", "film-stage", "podcast-lounge", "music-suite", "workshop"], {
    error: "Choose a studio category",
  }),
  hourlyRate: z.number({ error: "Enter an hourly rate" }).min(1, "Hourly rate must be at least $1").max(10000),
  securityDeposit: z.number({ error: "Enter a security deposit" }).min(0, "Deposit cannot be negative").max(100000),
  maxCapacity: z
    .number({ error: "Enter the maximum capacity" })
    .int("Capacity must be a whole number")
    .min(1, "Capacity must be at least 1")
    .max(500),
  location: z.object({
    address: z.string().trim().min(5, "Enter the full street address").max(200),
    city: z.string().trim().min(2, "Enter the city").max(80),
  }),
  image: httpUrl,
  gallery: z.array(httpUrl).max(6, "You can add up to 6 gallery images"),
  amenities: z.array(z.string().trim().min(1).max(40)).max(20, "You can add up to 20 amenities"),
  overview: z.string().trim().min(20, "Overview must be at least 20 characters").max(3000, "Overview is too long"),
});

export type StudioFormValues = z.infer<typeof studioFormSchema>;
