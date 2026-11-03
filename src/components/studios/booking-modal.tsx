"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock, Info, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { useAvailability, useCreateBooking } from "@/hooks/use-booking-queries";
import { ApiRequestError } from "@/lib/api";
import { formatPrice, formatTime, todayIso } from "@/lib/format";
import { TIME_OPTIONS, bookingFormSchema, type BookingFormValues } from "@/lib/validation/booking";
import type { Studio } from "@/types";

function hoursBetween(start: string, end: string): number {
  const toMinutes = (value: string) => Number(value.slice(0, 2)) * 60 + Number(value.slice(3, 5));
  return Math.max(0, (toMinutes(end) - toMinutes(start)) / 60);
}

interface BookingModalProps {
  studio: Studio;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingModal({ studio, open, onOpenChange }: BookingModalProps) {
  const router = useRouter();
  const createBooking = useCreateBooking();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: { date: "", startTime: "10:00", endTime: "12:00", guests: 1, note: "" },
  });

  const [date, startTime, endTime] = useWatch({ control, name: ["date", "startTime", "endTime"] });
  const { data: bookedSlots = [] } = useAvailability(studio.id, date);

  const hours = hoursBetween(startTime, endTime);
  const subtotal = hours * studio.hourlyRate;
  const total = subtotal + studio.securityDeposit;

  function handleOpenChange(next: boolean) {
    if (!next) {
      setServerError(null);
      reset();
    }
    onOpenChange(next);
  }

  async function onSubmit(values: BookingFormValues) {
    setServerError(null);
    try {
      await createBooking.mutateAsync({ ...values, studioId: studio.id });
      handleOpenChange(false);
      toast.success("Booking request sent! The host will confirm shortly.", {
        action: { label: "View bookings", onClick: () => router.push("/my-bookings") },
      });
    } catch (error) {
      const message = error instanceof ApiRequestError ? error.message : "We could not send your request. Please try again.";
      setServerError(message);
      toast.error(message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <span className="mb-1 flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <CalendarClock className="size-6" />
          </span>
          <DialogTitle className="font-heading text-xl">Book {studio.title}</DialogTitle>
          <DialogDescription>Choose your date and hours. You will not be charged until the host confirms.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Date" htmlFor="booking-date" error={errors.date?.message}>
            <Input id="booking-date" type="date" min={todayIso()} className="h-11" aria-invalid={Boolean(errors.date)} {...register("date")} />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start time" htmlFor="booking-start" error={errors.startTime?.message}>
              <NativeSelect id="booking-start" className="h-11" {...register("startTime")}>
                {TIME_OPTIONS.map((time) => (
                  <option key={time} value={time}>
                    {formatTime(time)}
                  </option>
                ))}
              </NativeSelect>
            </FormField>
            <FormField label="End time" htmlFor="booking-end" error={errors.endTime?.message}>
              <NativeSelect id="booking-end" className="h-11" {...register("endTime")}>
                {TIME_OPTIONS.map((time) => (
                  <option key={time} value={time}>
                    {formatTime(time)}
                  </option>
                ))}
              </NativeSelect>
            </FormField>
          </div>

          {date && bookedSlots.length > 0 ? (
            <div className="flex gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
              <Info className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-300" />
              <p className="text-foreground/90">
                Already booked on this day:{" "}
                <span className="font-semibold">
                  {bookedSlots.map((slot) => `${formatTime(slot.startTime)} – ${formatTime(slot.endTime)}`).join(", ")}
                </span>
              </p>
            </div>
          ) : null}

          <FormField
            label="Guests"
            htmlFor="booking-guests"
            error={errors.guests?.message}
            hint={`This space fits up to ${studio.maxCapacity} people.`}
          >
            <Input
              id="booking-guests"
              type="number"
              min={1}
              max={studio.maxCapacity}
              className="h-11"
              aria-invalid={Boolean(errors.guests)}
              {...register("guests", { valueAsNumber: true })}
            />
          </FormField>

          <FormField label="Note to host (optional)" htmlFor="booking-note" error={errors.note?.message}>
            <Textarea id="booking-note" rows={3} placeholder="Tell the host about your shoot, setup needs or arrival time." {...register("note")} />
          </FormField>

          <dl className="space-y-2 rounded-xl border border-border bg-muted/50 p-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                {formatPrice(studio.hourlyRate)} × {hours} {hours === 1 ? "hour" : "hours"}
              </dt>
              <dd className="font-medium">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Refundable security deposit</dt>
              <dd className="font-medium">{formatPrice(studio.securityDeposit)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="font-bold text-primary">{formatPrice(total)}</dd>
            </div>
          </dl>

          {serverError ? (
            <div role="alert" className="flex gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              {serverError}
            </div>
          ) : null}

          <Button type="submit" size="lg" className="w-full" disabled={createBooking.isPending}>
            {createBooking.isPending ? "Sending request..." : "Request booking"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
