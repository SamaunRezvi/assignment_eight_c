"use client";

import { Eye, PencilLine, Plus, ServerCrash, Star, Trash2, Warehouse } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { RequireAuth } from "@/components/auth/require-auth";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { ListSkeleton } from "@/components/shared/skeletons";
import { StudioImage } from "@/components/shared/studio-image";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { useDeleteStudio, useMyStudios } from "@/hooks/use-studio-queries";
import { ApiRequestError } from "@/lib/api";
import { CATEGORY_BY_VALUE } from "@/lib/constants";
import { formatPrice, formatRating } from "@/lib/format";
import type { Studio } from "@/types";

function ListingRow({ studio }: { studio: Studio }) {
  const deleteStudio = useDeleteStudio();
  const category = CATEGORY_BY_VALUE[studio.category];

  async function remove() {
    try {
      await deleteStudio.mutateAsync(studio.id);
      toast.success(`"${studio.title}" was deleted.`);
    } catch (error) {
      toast.error(error instanceof ApiRequestError ? error.message : "We could not delete this studio.");
    }
  }

  return (
    <li className="grid gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-5">
      <StudioImage src={studio.image} alt={studio.title} className="aspect-[4/3] w-full rounded-xl sm:size-24 sm:w-32" />

      <div className="min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="gap-1.5">
            <category.icon className="size-3.5 text-primary" />
            {category.label}
          </Badge>
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="size-3.5 fill-primary text-primary" />
            {formatRating(studio.rating)}
            {studio.reviewCount > 0 ? ` (${studio.reviewCount})` : ""}
          </span>
        </div>
        <h2 className="truncate font-heading text-lg font-semibold">{studio.title}</h2>
        <p className="truncate text-sm text-muted-foreground">
          {studio.location.address}, {studio.location.city}
        </p>
        <p className="text-sm">
          <span className="font-semibold">{formatPrice(studio.hourlyRate)}</span>
          <span className="text-muted-foreground"> / hr · deposit {formatPrice(studio.securityDeposit)} · up to {studio.maxCapacity} people</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-2 sm:flex-col sm:items-stretch">
        <Link href={`/studios/${studio.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
          <Eye data-icon="inline-start" />
          View
        </Link>
        <Link href={`/studios/edit/${studio.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
          <PencilLine data-icon="inline-start" />
          Update
        </Link>
        <ConfirmDialog
          title="Delete this studio?"
          description={`"${studio.title}" will be removed along with its reviews, and any open booking requests will be cancelled. This cannot be undone.`}
          confirmLabel="Delete studio"
          pending={deleteStudio.isPending}
          onConfirm={remove}
          trigger={
            <Button variant="destructive" size="sm">
              <Trash2 data-icon="inline-start" />
              Delete
            </Button>
          }
        />
      </div>
    </li>
  );
}

function Listings() {
  const { data, isPending, isError, refetch } = useMyStudios();

  if (isPending) return <ListSkeleton rows={3} />;

  if (isError) {
    return (
      <EmptyState
        icon={ServerCrash}
        title="We could not load your listings"
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
        icon={Warehouse}
        title="You have not listed a studio yet"
        description="Turn your spare room, stage or workshop into income. Listing takes about five minutes."
        action={{ href: "/add-studio", label: "Add your first studio" }}
      />
    );
  }

  return (
    <ul className="space-y-4">
      {data.map((studio) => (
        <ListingRow key={studio.id} studio={studio} />
      ))}
    </ul>
  );
}

export function MyListingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Host dashboard"
        title="My studio listings"
        description="Update details, adjust pricing or retire a listing."
        actions={
          <Link href="/add-studio" className={buttonVariants({ size: "lg" })}>
            <Plus data-icon="inline-start" />
            Add New Studio
          </Link>
        }
      />
      <div className="page-container max-w-5xl py-10">
        <RequireAuth next="/my-listings">{() => <Listings />}</RequireAuth>
      </div>
    </>
  );
}
