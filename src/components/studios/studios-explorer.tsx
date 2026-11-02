"use client";

import { ChevronLeft, ChevronRight, SearchX, ServerCrash, Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { StudioGridSkeleton } from "@/components/shared/skeletons";
import { StudioCard } from "@/components/studios/studio-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { useStudioCities, useStudios } from "@/hooks/use-studio-queries";
import { CATEGORIES, SORT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { StudioCategory, StudioFilters, StudioSort } from "@/types";

const PAGE_SIZE = 9;
const CATEGORY_VALUES = new Set<string>(CATEGORIES.map((category) => category.value));
const SORT_VALUES = new Set<string>(SORT_OPTIONS.map((option) => option.value));

function readNumber(value: string | null): number | undefined {
  if (value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export function StudiosExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const category = params.get("category");
  const sort = params.get("sort");
  const filters: StudioFilters = useMemo(
    () => ({
      q: params.get("q")?.trim() || undefined,
      category: category && CATEGORY_VALUES.has(category) ? (category as StudioCategory) : undefined,
      city: params.get("city") || undefined,
      minPrice: readNumber(params.get("minPrice")),
      maxPrice: readNumber(params.get("maxPrice")),
      capacity: readNumber(params.get("capacity")),
      sort: sort && SORT_VALUES.has(sort) ? (sort as StudioSort) : "newest",
      page: Math.max(1, Math.floor(readNumber(params.get("page")) ?? 1)),
      limit: PAGE_SIZE,
    }),
    [params, category, sort],
  );

  const { data, isPending, isError, isFetching, refetch } = useStudios(filters);
  const { data: cities = [] } = useStudioCities();

  function update(changes: Record<string, string | undefined>, resetPage = true) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value === undefined || value === "") next.delete(key);
      else next.set(key, value);
    }
    if (resetPage) next.delete("page");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  // The search box keeps its own text so typing feels instant; the URL updates after a pause.
  const [search, setSearch] = useState(filters.q ?? "");
  const [lastQ, setLastQ] = useState(filters.q);
  if (lastQ !== filters.q) {
    setLastQ(filters.q);
    setSearch(filters.q ?? "");
  }
  useEffect(() => {
    const trimmed = search.trim();
    if (trimmed === (filters.q ?? "")) return;
    const timer = setTimeout(() => update({ q: trimmed || undefined }), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const activeCount = [filters.q, filters.category, filters.city, filters.minPrice, filters.maxPrice, filters.capacity].filter(
    (value) => value !== undefined,
  ).length;
  const [showFilters, setShowFilters] = useState(false);

  function clearAll() {
    setSearch("");
    router.replace(pathname, { scroll: false });
  }

  const items = data?.items ?? [];
  const meta = data?.meta;

  return (
    <div className="page-container py-10">
      <div className="space-y-5 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, city, amenity or vibe"
              aria-label="Search studios"
              className="h-12 pl-10 text-base"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="lg:hidden"
            aria-expanded={showFilters}
            onClick={() => setShowFilters((value) => !value)}
          >
            <SlidersHorizontal />
            Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </Button>
        </div>

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filter by category">
          <button
            type="button"
            onClick={() => update({ category: undefined })}
            aria-pressed={!filters.category}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              !filters.category ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/60",
            )}
          >
            All spaces
          </button>
          {CATEGORIES.map((item) => {
            const active = filters.category === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => update({ category: active ? undefined : item.value })}
                aria-pressed={active}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/60",
                )}
              >
                <item.icon className="size-4" />
                {item.plural}
              </button>
            );
          })}
        </div>

        <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-5", showFilters ? "grid" : "hidden lg:grid")}>
          <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
            City
            <NativeSelect value={filters.city ?? ""} onChange={(event) => update({ city: event.target.value })}>
              <option value="">All cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </NativeSelect>
          </label>
          <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
            Min price ($/hr)
            <Input
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="0"
              value={filters.minPrice ?? ""}
              onChange={(event) => update({ minPrice: event.target.value })}
            />
          </label>
          <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
            Max price ($/hr)
            <Input
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Any"
              value={filters.maxPrice ?? ""}
              onChange={(event) => update({ maxPrice: event.target.value })}
            />
          </label>
          <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
            Guests
            <Input
              type="number"
              min={1}
              inputMode="numeric"
              placeholder="Any"
              value={filters.capacity ?? ""}
              onChange={(event) => update({ capacity: event.target.value })}
            />
          </label>
          <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
            Sort by
            <NativeSelect value={filters.sort} onChange={(event) => update({ sort: event.target.value })}>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </NativeSelect>
          </label>
        </div>
      </div>

      <div className="mt-8 flex min-h-8 items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {meta ? (
            <>
              <span className="font-semibold text-foreground">{meta.total}</span> {meta.total === 1 ? "space" : "spaces"} found
              {isFetching ? " · updating..." : ""}
            </>
          ) : null}
        </p>
        {activeCount > 0 ? (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <X />
            Clear filters
          </Button>
        ) : null}
      </div>

      <div className="mt-4">
        {isPending ? (
          <StudioGridSkeleton count={PAGE_SIZE} />
        ) : isError ? (
          <EmptyState
            icon={ServerCrash}
            title="We could not load studios"
            description="The connection was interrupted. Check your network and try again."
            secondary={
              <Button size="lg" variant="outline" onClick={() => refetch()}>
                Try again
              </Button>
            }
          />
        ) : items.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No studios match your search"
            description="Try a different keyword, widen the price range or clear your filters to see every space."
            secondary={
              <Button size="lg" onClick={clearAll}>
                Clear all filters
              </Button>
            }
          />
        ) : (
          <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", isFetching && "opacity-70 transition-opacity")}>
            {items.map((studio) => (
              <StudioCard key={studio.id} studio={studio} />
            ))}
          </div>
        )}
      </div>

      {meta && meta.totalPages > 1 ? (
        <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            disabled={meta.page <= 1}
            onClick={() => update({ page: String(meta.page - 1) }, false)}
          >
            <ChevronLeft />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page <span className="font-semibold text-foreground">{meta.page}</span> of {meta.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={meta.page >= meta.totalPages}
            onClick={() => update({ page: String(meta.page + 1) }, false)}
          >
            Next
            <ChevronRight />
          </Button>
        </nav>
      ) : null}
    </div>
  );
}
