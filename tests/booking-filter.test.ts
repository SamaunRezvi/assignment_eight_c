import { describe, expect, it } from "vitest";
import { BOOKING_FILTERS, countByFilter, filterBookings } from "@/lib/booking-filter";
import type { BookingStatus } from "@/types";

const make = (...statuses: BookingStatus[]) => statuses.map((status, index) => ({ id: String(index), status }));

describe("filterBookings", () => {
  const bookings = make("Pending", "Cancelled", "Confirmed", "Cancelled", "Completed");

  it("returns everything, in order, for the All filter", () => {
    expect(filterBookings(bookings, "All")).toBe(bookings);
  });

  it("keeps only the chosen status and preserves ordering", () => {
    expect(filterBookings(bookings, "Cancelled").map((booking) => booking.id)).toEqual(["1", "3"]);
    expect(filterBookings(bookings, "Pending")).toHaveLength(1);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterBookings(make("Pending"), "Completed")).toEqual([]);
  });
});

describe("countByFilter", () => {
  it("counts each status and the total", () => {
    expect(countByFilter(make("Pending", "Cancelled", "Cancelled"))).toEqual({ All: 3, Pending: 1, Confirmed: 0, Completed: 0, Cancelled: 2 });
  });

  it("starts every filter at zero for an empty list", () => {
    const counts = countByFilter([]);
    for (const filter of BOOKING_FILTERS) expect(counts[filter]).toBe(0);
  });
});
