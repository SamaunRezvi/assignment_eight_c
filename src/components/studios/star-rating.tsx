"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarDisplay({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={cn("size-4", index < Math.round(value) ? "fill-primary text-primary" : "text-muted-foreground/40")}
        />
      ))}
    </span>
  );
}

interface StarInputProps {
  value: number;
  onChange: (value: number) => void;
  id?: string;
}

export function StarInput({ value, onChange, id }: StarInputProps) {
  return (
    <div id={id} role="radiogroup" aria-label="Rating" className="inline-flex gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const rating = index + 1;
        return (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={value === rating}
            aria-label={`${rating} ${rating === 1 ? "star" : "stars"}`}
            onClick={() => onChange(rating)}
            className="rounded p-0.5 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Star className={cn("size-7", rating <= value ? "fill-primary text-primary" : "text-muted-foreground/40")} />
          </button>
        );
      })}
    </div>
  );
}
