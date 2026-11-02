"use client";

import { ArrowLeft, Check, MapPin, PencilLine, SearchX, ShieldCheck, Users, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { BookingModal } from "@/components/studios/booking-modal";
import { GalleryCarousel } from "@/components/studios/gallery-carousel";
import { ReviewsSection } from "@/components/studios/reviews-section";
import { StarDisplay } from "@/components/studios/star-rating";
import { WishlistButton } from "@/components/studios/wishlist-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudio } from "@/hooks/use-studio-queries";
import { ApiRequestError } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { CATEGORY_BY_VALUE } from "@/lib/constants";
import { formatPrice, initialsOf } from "@/lib/format";

function DetailSkeleton() {
  return (
    <div className="page-container grid gap-10 py-10 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-8">
        <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-40 w-full" />
      </div>
      <Skeleton className="h-80 w-full rounded-2xl lg:col-span-4" />
    </div>
  );
}

export function StudioDetail({ id }: { id: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data: studio, isPending, isError, error } = useStudio(id);
  const [bookingOpen, setBookingOpen] = useState(false);

  if (isPending) return <DetailSkeleton />;

  if (isError || !studio) {
    const missing = error instanceof ApiRequestError && (error.status === 404 || error.status === 400);
    return (
      <div className="page-container py-16">
        <EmptyState
          icon={SearchX}
          title={missing ? "This studio could not be found" : "We could not load this studio"}
          description={
            missing
              ? "The listing may have been removed by its host. Explore other spaces that fit your project."
              : "Something went wrong while loading the studio. Please try again in a moment."
          }
          action={{ href: "/studios", label: "Explore Studios" }}
        />
      </div>
    );
  }

  const category = CATEGORY_BY_VALUE[studio.category];
  const user = session?.user;
  const isOwner = user?.id === studio.host.id;
  const images = [studio.image, ...studio.gallery].filter(Boolean);

  function onBook() {
    if (!user) {
      toast.info("Please log in to book this workspace.");
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    setBookingOpen(true);
  }

  return (
    <div className="page-container py-8 sm:py-10">
      <Link href="/studios" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to all studios
      </Link>

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-8">
          <GalleryCarousel images={images} title={studio.title} />

          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="gap-1.5 border-0 bg-primary/15 px-3 py-1 text-foreground">
                <category.icon className="size-3.5 text-primary" />
                {category.label}
              </Badge>
              {studio.reviewCount > 0 ? (
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <StarDisplay value={studio.rating} />
                  <span className="font-semibold text-foreground">{studio.rating.toFixed(1)}</span>
                  ({studio.reviewCount})
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">New listing</span>
              )}
            </div>
            <h1 className="section-title">{studio.title}</h1>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4 shrink-0 text-primary" />
              {studio.location.address}, {studio.location.city}
            </p>
          </header>

          <dl className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Wallet, label: "Hourly rate", value: `${formatPrice(studio.hourlyRate)} / hr` },
              { icon: ShieldCheck, label: "Security deposit", value: formatPrice(studio.securityDeposit) },
              { icon: Users, label: "Max capacity", value: `${studio.maxCapacity} people` },
            ].map((spec) => (
              <div key={spec.label} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <spec.icon className="size-5" />
                </span>
                <div>
                  <dt className="text-xs text-muted-foreground">{spec.label}</dt>
                  <dd className="font-semibold">{spec.value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <section aria-labelledby="overview-title" className="space-y-3">
            <h2 id="overview-title" className="font-heading text-2xl font-semibold">
              About this space
            </h2>
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{studio.overview}</p>
          </section>

          {studio.amenities.length > 0 ? (
            <section aria-labelledby="amenities-title" className="space-y-4">
              <h2 id="amenities-title" className="font-heading text-2xl font-semibold">
                Amenities
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {studio.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm">
                    <span className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Check className="size-3.5" />
                    </span>
                    {amenity}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section aria-labelledby="host-title" className="space-y-4">
            <h2 id="host-title" className="font-heading text-2xl font-semibold">
              Your host
            </h2>
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
              <Avatar className="size-14">
                {studio.host.photo ? <AvatarImage src={studio.host.photo} alt={studio.host.name} referrerPolicy="no-referrer" /> : null}
                <AvatarFallback className="bg-primary/15 text-lg font-semibold">{initialsOf(studio.host.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold">{studio.host.name || "StudioSpace host"}</p>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <ShieldCheck className="size-4 text-primary" />
                  Verified host
                </p>
              </div>
            </div>
          </section>

          <ReviewsSection studio={studio} />
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <p className="text-3xl font-bold">
                {formatPrice(studio.hourlyRate)}
                <span className="text-base font-normal text-muted-foreground"> / hr</span>
              </p>
              <WishlistButton studioId={studio.id} studioTitle={studio.title} className="border border-border" />
            </div>

            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between">
                <span>Security deposit (refundable)</span>
                <span className="font-medium text-foreground">{formatPrice(studio.securityDeposit)}</span>
              </li>
              <li className="flex justify-between">
                <span>Max capacity</span>
                <span className="font-medium text-foreground">{studio.maxCapacity} people</span>
              </li>
            </ul>

            {isOwner ? (
              <div className="space-y-3 rounded-xl bg-muted/60 p-4 text-sm">
                <p className="text-muted-foreground">This is your listing, so booking is disabled for you.</p>
                <Link href={`/studios/edit/${studio.id}`} className={buttonVariants({ size: "lg", className: "w-full" })}>
                  <PencilLine data-icon="inline-start" />
                  Edit listing
                </Link>
              </div>
            ) : (
              <Button size="lg" className="w-full" onClick={onBook}>
                Book Workspace Now
              </Button>
            )}
            <p className="text-center text-xs text-muted-foreground">You will not be charged until the host confirms.</p>
          </div>
        </aside>
      </div>

      <BookingModal studio={studio} open={bookingOpen} onOpenChange={setBookingOpen} />
    </div>
  );
}
