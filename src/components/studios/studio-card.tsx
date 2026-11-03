import { ArrowRight, MapPin, Star, Users } from "lucide-react";
import Link from "next/link";
import { StudioImage } from "@/components/shared/studio-image";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { WishlistButton } from "@/components/studios/wishlist-button";
import { CATEGORY_BY_VALUE } from "@/lib/constants";
import { formatPrice, formatRating } from "@/lib/format";
import type { Studio } from "@/types";

export function StudioCard({ studio }: { studio: Studio }) {
  const category = CATEGORY_BY_VALUE[studio.category];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Link href={`/studios/${studio.id}`} tabIndex={-1} aria-hidden="true" className="block size-full">
          <StudioImage
            src={studio.image}
            alt=""
            className="size-full transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" aria-hidden="true" />
        <Badge className="pointer-events-none absolute left-3 top-3 gap-1.5 border-0 bg-background/90 px-2.5 py-1 text-foreground backdrop-blur">
          <category.icon className="size-3.5 text-primary" />
          {category.label}
        </Badge>
        <WishlistButton studioId={studio.id} studioTitle={studio.title} className="absolute right-3 top-3" />
        <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow">
          <Star className="size-3.5 fill-current" />
          {formatRating(studio.rating)}
          {studio.reviewCount > 0 ? <span className="font-normal opacity-80">({studio.reviewCount})</span> : null}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-[3.25rem] font-heading text-lg font-semibold leading-snug">
          <Link href={`/studios/${studio.id}`} className="transition-colors hover:text-primary">
            {studio.title}
          </Link>
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          <span className="truncate">
            {studio.location.address}, {studio.location.city}
          </span>
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="size-4 shrink-0" />
          Up to {studio.maxCapacity} people
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <p className="text-xl font-bold text-foreground">
            {formatPrice(studio.hourlyRate)}
            <span className="text-sm font-normal text-muted-foreground"> / hr</span>
          </p>
          <Link href={`/studios/${studio.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
            View Details
            <ArrowRight data-icon="inline-end" />
          </Link>
        </div>
      </div>
    </article>
  );
}
