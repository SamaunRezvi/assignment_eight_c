"use client";

import { ArrowRight, Film, ServerCrash } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { StudioGridSkeleton } from "@/components/shared/skeletons";
import { StudioCard } from "@/components/studios/studio-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { useFeaturedStudios } from "@/hooks/use-studio-queries";

export function FeaturedStudios() {
  const { data, isPending, isError, refetch, isFetching } = useFeaturedStudios(6);

  return (
    <section className="py-20" aria-labelledby="featured-title">
      <div className="page-container">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="section-eyebrow">Featured studios</p>
            <h2 id="featured-title" className="section-title">
              Top-rated spaces, ready to book
            </h2>
            <p className="section-copy">Hand-picked rooms with the best reviews from working creators.</p>
          </div>
          <Link href="/studios" className={buttonVariants({ variant: "outline" })}>
            View all studios
            <ArrowRight data-icon="inline-end" />
          </Link>
        </div>

        {isPending ? (
          <StudioGridSkeleton count={6} />
        ) : isError ? (
          <EmptyState
            icon={ServerCrash}
            title="We could not load the featured studios"
            description="Something interrupted the connection. Check your network and try again."
            secondary={
              <Button size="lg" variant="outline" onClick={() => refetch()} disabled={isFetching}>
                Try again
              </Button>
            }
          />
        ) : data.length === 0 ? (
          <EmptyState
            icon={Film}
            title="No studios have been listed yet"
            description="Be the first host to list a creative space and start earning from it."
            action={{ href: "/add-studio", label: "Host Your Space" }}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((studio) => (
              <StudioCard key={studio.id} studio={studio} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
