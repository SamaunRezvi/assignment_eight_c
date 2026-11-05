import type { Booking, BookingStatus } from "@/types";

export type BookingFilter = "All" | BookingStatus;

export const BOOKING_FILTERS: BookingFilter[] = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

/** Keeps the original order and returns the same array when no filter is applied. */
export function filterBookings<T extends Pick<Booking, "status">>(bookings: T[], filter: BookingFilter): T[] {
  return filter === "All" ? bookings : bookings.filter((booking) => booking.status === filter);
}

export function countByFilter(bookings: Array<Pick<Booking, "status">>): Record<BookingFilter, number> {
  const counts: Record<BookingFilter, number> = { All: bookings.length, Pending: 0, Confirmed: 0, Completed: 0, Cancelled: 0 };
  for (const booking of bookings) counts[booking.status] += 1;
  return counts;
}
