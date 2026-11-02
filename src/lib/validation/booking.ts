import { z } from "zod";

const time = z.string().regex(/^([01]\d|2[0-3]):(00|30)$/, "Pick a start and end time");

export const bookingFormSchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date"),
    startTime: time,
    endTime: time,
    guests: z.number({ error: "Enter the number of guests" }).int("Guests must be a whole number").min(1, "At least one guest"),
    note: z.string().trim().max(500, "Note can be at most 500 characters"),
  })
  .refine((value) => value.endTime > value.startTime, {
    path: ["endTime"],
    message: "End time must be after the start time",
  });

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

/** Half-hour slots from 06:00 to 23:30, shared by the start and end pickers. */
export const TIME_OPTIONS = Array.from({ length: 36 }, (_, index) => {
  const minutes = 6 * 60 + index * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${minutes % 60 === 0 ? "00" : "30"}`;
});
