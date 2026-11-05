"use client";

import { BOOKING_FILTERS, type BookingFilter } from "@/lib/booking-filter";
import { cn } from "@/lib/utils";

interface StatusFilterProps {
  value: BookingFilter;
  counts: Record<BookingFilter, number>;
  onChange: (value: BookingFilter) => void;
}

export function StatusFilter({ value, counts, onChange }: StatusFilterProps) {
  return (
    <div role="group" aria-label="Filter bookings by status" className="mb-5 flex flex-wrap gap-2">
      {BOOKING_FILTERS.map((filter) => {
        const active = filter === value;
        return (
          <button
            key={filter}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(filter)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
            )}
          >
            {filter}
            <span className={cn("text-xs tabular-nums", active ? "text-primary-foreground/80" : "text-muted-foreground")}>{counts[filter]}</span>
          </button>
        );
      })}
    </div>
  );
}
