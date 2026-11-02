"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, jsonBody, toQuery } from "@/lib/api";
import type { Booking, BookingStatus, DashboardSummary, Studio } from "@/types";
import type { BookingFormValues } from "@/lib/validation/booking";

export const bookingKeys = {
  all: ["bookings"] as const,
  mine: ["bookings", "mine"] as const,
  hosted: ["bookings", "hosted"] as const,
  availability: (studioId: string, date: string) => ["bookings", "availability", studioId, date] as const,
};

export function useMyBookings(enabled = true) {
  return useQuery({
    queryKey: bookingKeys.mine,
    queryFn: () => apiRequest<Booking[]>("/bookings/mine"),
    enabled,
  });
}

export function useHostedBookings(enabled = true) {
  return useQuery({
    queryKey: bookingKeys.hosted,
    queryFn: () => apiRequest<Booking[]>("/bookings/hosted"),
    enabled,
  });
}

export function useAvailability(studioId: string, date: string) {
  return useQuery({
    queryKey: bookingKeys.availability(studioId, date),
    queryFn: () =>
      apiRequest<Array<{ startTime: string; endTime: string }>>(`/bookings/availability${toQuery({ studioId, date })}`),
    enabled: Boolean(date),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: BookingFormValues & { studioId: string }) =>
      apiRequest<Booking>("/bookings", { method: "POST", body: jsonBody(values) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: bookingKeys.all }),
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Exclude<BookingStatus, "Pending"> }) =>
      apiRequest<Booking>(`/bookings/${id}/status`, { method: "PATCH", body: jsonBody({ status }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  });
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: () => apiRequest<DashboardSummary>("/dashboard/summary"),
  });
}

export const wishlistKeys = {
  ids: ["wishlist", "ids"] as const,
  list: ["wishlist", "list"] as const,
};

export function useWishlistIds(enabled: boolean) {
  return useQuery({
    queryKey: wishlistKeys.ids,
    queryFn: () => apiRequest<string[]>("/wishlist/ids"),
    enabled,
  });
}

export function useWishlist(enabled = true) {
  return useQuery({
    queryKey: wishlistKeys.list,
    queryFn: () => apiRequest<Studio[]>("/wishlist"),
    enabled,
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ studioId, saved }: { studioId: string; saved: boolean }) =>
      apiRequest<{ saved: boolean }>(`/wishlist/${studioId}`, { method: saved ? "DELETE" : "PUT" }),
    onMutate: async ({ studioId, saved }) => {
      await queryClient.cancelQueries({ queryKey: wishlistKeys.ids });
      const previous = queryClient.getQueryData<string[]>(wishlistKeys.ids);
      queryClient.setQueryData<string[]>(wishlistKeys.ids, (ids = []) =>
        saved ? ids.filter((id) => id !== studioId) : [...ids, studioId],
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(wishlistKeys.ids, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}
