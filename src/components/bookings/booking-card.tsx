"use client";

import { CalendarDays, Check, Clock, Download, Users, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/bookings/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StudioImage } from "@/components/shared/studio-image";
import { Button } from "@/components/ui/button";
import { useUpdateBookingStatus } from "@/hooks/use-booking-queries";
import { ApiRequestError, downloadFile } from "@/lib/api";
import { formatCalendarDate, formatPrice, formatTime } from "@/lib/format";
import type { Booking } from "@/types";

interface BookingCardProps {
  booking: Booking;
  /** "guest" sees their own reservations; "host" sees requests for their studios. */
  perspective: "guest" | "host";
}

export function BookingCard({ booking, perspective }: BookingCardProps) {
  const update = useUpdateBookingStatus();
  const [downloading, setDownloading] = useState(false);

  async function changeStatus(status: "Confirmed" | "Completed" | "Cancelled", success: string) {
    try {
      await update.mutateAsync({ id: booking.id, status });
      toast.success(success);
    } catch (error) {
      toast.error(error instanceof ApiRequestError ? error.message : "We could not update this booking.");
    }
  }

  async function invoice() {
    setDownloading(true);
    try {
      await downloadFile(`/bookings/${booking.id}/invoice`, "studiospace-invoice.pdf");
      toast.success("Your receipt is downloading.");
    } catch (error) {
      toast.error(error instanceof ApiRequestError ? error.message : "We could not generate the receipt.");
    } finally {
      setDownloading(false);
    }
  }

  const canInvoice = booking.status === "Confirmed" || booking.status === "Completed";

  return (
    <li className="grid gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:grid-cols-[auto_1fr_auto] sm:p-5">
      <StudioImage src={booking.studioImage} alt={booking.studioTitle} className="aspect-[4/3] w-full rounded-xl sm:size-24 sm:w-32" />

      <div className="min-w-0 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={booking.status} />
          <span className="text-xs text-muted-foreground">Ref {booking.id.slice(-8).toUpperCase()}</span>
        </div>
        <h2 className="font-heading text-lg font-semibold">
          <Link href={`/studios/${booking.studioId}`} className="hover:text-primary">
            {booking.studioTitle}
          </Link>
        </h2>
        <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <CalendarDays className="size-4 text-primary" />
            {formatCalendarDate(booking.date)}
          </li>
          <li className="flex items-center gap-1.5">
            <Clock className="size-4 text-primary" />
            {formatTime(booking.startTime)} – {formatTime(booking.endTime)} ({booking.hours} hr)
          </li>
          <li className="flex items-center gap-1.5">
            <Users className="size-4 text-primary" />
            {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
          </li>
        </ul>
        {perspective === "host" ? (
          <p className="text-sm">
            <span className="text-muted-foreground">Requested by </span>
            <span className="font-medium">{booking.guestName || "A creator"}</span>
            <span className="text-muted-foreground"> ({booking.guestEmail})</span>
          </p>
        ) : null}
        {booking.note ? <p className="rounded-lg bg-muted/60 px-3 py-2 text-sm italic text-muted-foreground">&ldquo;{booking.note}&rdquo;</p> : null}
        <p className="text-sm">
          <span className="font-semibold">{formatPrice(booking.total)}</span>
          <span className="text-muted-foreground">
            {" "}
            total ({formatPrice(booking.subtotal)} + {formatPrice(booking.securityDeposit)} refundable deposit)
          </span>
        </p>
      </div>

      <div className="flex flex-wrap gap-2 sm:flex-col sm:items-stretch">
        {perspective === "guest" && booking.status === "Pending" ? (
          <ConfirmDialog
            title="Cancel this booking?"
            description={`Your request for ${booking.studioTitle} on ${formatCalendarDate(booking.date)} will be withdrawn and the slot released.`}
            confirmLabel="Cancel booking"
            cancelLabel="Keep booking"
            pending={update.isPending}
            onConfirm={() => changeStatus("Cancelled", "Your booking was cancelled.")}
            trigger={
              <Button variant="destructive" size="sm">
                <X data-icon="inline-start" />
                Cancel Booking
              </Button>
            }
          />
        ) : null}

        {perspective === "host" && booking.status === "Pending" ? (
          <>
            <Button size="sm" disabled={update.isPending} onClick={() => changeStatus("Confirmed", "Booking confirmed. The guest has been notified.")}>
              <Check data-icon="inline-start" />
              Confirm
            </Button>
            <ConfirmDialog
              title="Decline this request?"
              description="The guest will see this booking as cancelled and the slot will stay open for others."
              confirmLabel="Decline request"
              cancelLabel="Go back"
              pending={update.isPending}
              onConfirm={() => changeStatus("Cancelled", "The request was declined.")}
              trigger={
                <Button variant="outline" size="sm">
                  <X data-icon="inline-start" />
                  Decline
                </Button>
              }
            />
          </>
        ) : null}

        {perspective === "host" && booking.status === "Confirmed" ? (
          <>
            <Button size="sm" disabled={update.isPending} onClick={() => changeStatus("Completed", "Marked as completed.")}>
              <Check data-icon="inline-start" />
              Mark completed
            </Button>
            <ConfirmDialog
              title="Cancel this confirmed booking?"
              description="The guest will be told the session is cancelled. Only do this if you truly cannot host."
              confirmLabel="Cancel booking"
              cancelLabel="Keep booking"
              pending={update.isPending}
              onConfirm={() => changeStatus("Cancelled", "The booking was cancelled.")}
              trigger={
                <Button variant="outline" size="sm">
                  <X data-icon="inline-start" />
                  Cancel
                </Button>
              }
            />
          </>
        ) : null}

        {canInvoice ? (
          <Button variant="outline" size="sm" disabled={downloading} onClick={invoice}>
            <Download data-icon="inline-start" />
            {downloading ? "Preparing..." : "Download receipt"}
          </Button>
        ) : null}
      </div>
    </li>
  );
}
