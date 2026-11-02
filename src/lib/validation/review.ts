import { z } from "zod";

export const reviewFormSchema = z.object({
  rating: z.number({ error: "Choose a rating" }).int().min(1, "Choose a rating from 1 to 5").max(5),
  comment: z.string().trim().min(10, "Tell us a bit more (at least 10 characters)").max(1000, "Keep it under 1000 characters"),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
