"use client";

import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { AMENITY_SUGGESTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AmenitiesFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
  max?: number;
}

export function AmenitiesField({ value, onChange, max = 20 }: AmenitiesFieldProps) {
  const [custom, setCustom] = useState("");
  const options = [...AMENITY_SUGGESTIONS, ...value.filter((item) => !AMENITY_SUGGESTIONS.includes(item))];

  function toggle(item: string) {
    if (value.includes(item)) onChange(value.filter((entry) => entry !== item));
    else if (value.length < max) onChange([...value, item]);
  }

  function addCustom() {
    const item = custom.trim();
    if (!item) return;
    if (!value.some((entry) => entry.toLowerCase() === item.toLowerCase()) && value.length < max) {
      onChange([...value, item.slice(0, 40)]);
    }
    setCustom("");
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Amenities">
        {options.map((item) => {
          const selected = value.includes(item);
          return (
            <button
              key={item}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(item)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                selected ? "border-primary bg-primary/15 font-medium text-foreground" : "border-border text-muted-foreground hover:border-primary/60",
              )}
            >
              {selected ? <Check className="size-3.5 text-primary" /> : null}
              {item}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        <Input
          aria-label="Add a custom amenity"
          placeholder="Add your own, such as Vinyl turntable"
          value={custom}
          maxLength={40}
          onChange={(event) => setCustom(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addCustom();
            }
          }}
          className="h-11"
        />
        <Button type="button" variant="outline" className="h-11 shrink-0" onClick={addCustom}>
          <Plus />
          Add
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {value.length} of {max} selected
      </p>
    </div>
  );
}
