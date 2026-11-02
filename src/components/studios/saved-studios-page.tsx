"use client";

import { Heart, ServerCrash } from "lucide-react";
import { RequireAuth } from "@/components/auth/require-auth";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StudioGridSkeleton } from "@/components/shared/skeletons";
import { StudioCard } from "@/components/studios/studio-card";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-booking-queries";

function SavedList() {
  const { data, isPending, isError, refetch } = useWishlist();

  if (isPending) return <StudioGridSkeleton count={3} />;

  if (isError) {
    return (
      <EmptyState
        icon={ServerCrash}
        title="We could not load your saved studios"
        description="Check your connection and try again."
        secondary={
          <Button size="lg" variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Nothing saved yet"
        description="Tap the heart on any studio to keep it here and come back when you are ready to book."
        action={{ href: "/studios", label: "Explore Studios" }}
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((studio) => (
        <StudioCard key={studio.id} studio={studio} />
      ))}
    </div>
  );
}

export function SavedStudiosPage() {
  return (
    <>
      <PageHeader eyebrow="Wishlist" title="Saved studios" description="The spaces you have your eye on, ready when your next project is." />
      <div className="page-container py-10">
        <RequireAuth next="/saved">{() => <SavedList />}</RequireAuth>
      </div>
    </>
  );
}
