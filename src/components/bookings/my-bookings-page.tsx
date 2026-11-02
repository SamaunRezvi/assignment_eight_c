"use client";

import { CalendarX, Inbox, ServerCrash } from "lucide-react";
import { RequireAuth } from "@/components/auth/require-auth";
import { BookingCard } from "@/components/bookings/booking-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { ListSkeleton } from "@/components/shared/skeletons";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHostedBookings, useMyBookings } from "@/hooks/use-booking-queries";

function BookingList({ perspective }: { perspective: "guest" | "host" }) {
  const guest = useMyBookings(perspective === "guest");
  const host = useHostedBookings(perspective === "host");
  const { data, isPending, isError, refetch } = perspective === "guest" ? guest : host;

  if (isPending) return <ListSkeleton rows={3} />;

  if (isError) {
    return (
      <EmptyState
        icon={ServerCrash}
        title="We could not load your bookings"
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
    return perspective === "guest" ? (
      <EmptyState
        icon={CalendarX}
        title="No bookings yet"
        description="When you reserve a studio it will appear here, along with its status and receipt."
        action={{ href: "/studios", label: "Explore Studios" }}
      />
    ) : (
      <EmptyState
        icon={Inbox}
        title="No booking requests yet"
        description="Requests for your studios will appear here so you can confirm or decline them."
        action={{ href: "/add-studio", label: "Add a studio" }}
      />
    );
  }

  return (
    <ul className="space-y-4">
      {data.map((booking) => (
        <BookingCard key={booking.id} booking={booking} perspective={perspective} />
      ))}
    </ul>
  );
}

function Bookings() {
  const hosted = useHostedBookings();
  const pendingRequests = hosted.data?.filter((booking) => booking.status === "Pending").length ?? 0;

  return (
    <Tabs defaultValue="mine">
      <TabsList className="mb-6 h-auto p-1">
        <TabsTrigger value="mine" className="px-4 py-2">
          My bookings
        </TabsTrigger>
        <TabsTrigger value="requests" className="gap-2 px-4 py-2">
          Booking requests
          {pendingRequests > 0 ? (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {pendingRequests}
            </span>
          ) : null}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="mine">
        <BookingList perspective="guest" />
      </TabsContent>
      <TabsContent value="requests">
        <BookingList perspective="host" />
      </TabsContent>
    </Tabs>
  );
}

export function MyBookingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Reservations"
        title="My bookings"
        description="Track your reservations, cancel pending requests and manage requests for your own studios."
      />
      <div className="page-container max-w-5xl py-10">
        <RequireAuth next="/my-bookings">{() => <Bookings />}</RequireAuth>
      </div>
    </>
  );
}
