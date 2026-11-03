"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiPaginated, apiRequest, jsonBody, toQuery } from "@/lib/api";
import type { Review, Studio, StudioFilters } from "@/types";
import type { StudioFormValues } from "@/lib/validation/studio";
import type { ReviewFormValues } from "@/lib/validation/review";

export const studioKeys = {
  all: ["studios"] as const,
  list: (filters: StudioFilters) => ["studios", "list", filters] as const,
  featured: (limit: number) => ["studios", "featured", limit] as const,
  cities: ["studios", "cities"] as const,
  mine: ["studios", "mine"] as const,
  detail: (id: string) => ["studios", "detail", id] as const,
  reviews: (id: string) => ["studios", "reviews", id] as const,
};

export function useStudios(filters: StudioFilters) {
  return useQuery({
    queryKey: studioKeys.list(filters),
    queryFn: () => apiPaginated<Studio>(`/studios${toQuery(filters)}`),
    placeholderData: keepPreviousData,
  });
}

export function useFeaturedStudios(limit = 6) {
  return useQuery({
    queryKey: studioKeys.featured(limit),
    queryFn: () => apiRequest<Studio[]>(`/studios/featured${toQuery({ limit })}`),
  });
}

export function useStudioCities() {
  return useQuery({
    queryKey: studioKeys.cities,
    queryFn: () => apiRequest<string[]>("/studios/cities"),
    staleTime: 5 * 60_000,
  });
}

export function useMyStudios(enabled = true) {
  return useQuery({
    queryKey: studioKeys.mine,
    queryFn: () => apiRequest<Studio[]>("/studios/mine"),
    enabled,
  });
}

export function useStudio(id: string) {
  return useQuery({
    queryKey: studioKeys.detail(id),
    queryFn: () => apiRequest<Studio>(`/studios/${id}`),
    retry: (count, error) => !(error instanceof Error && "status" in error && error.status === 404) && count < 2,
  });
}

export function useCreateStudio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: StudioFormValues) =>
      apiRequest<Studio>("/studios", { method: "POST", body: jsonBody(values) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: studioKeys.all }),
  });
}

export function useUpdateStudio(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: StudioFormValues) =>
      apiRequest<Studio>(`/studios/${id}`, { method: "PUT", body: jsonBody(values) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: studioKeys.all }),
  });
}

export function useDeleteStudio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiRequest<{ deleted: boolean }>(`/studios/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

export function useReviews(studioId: string) {
  return useQuery({
    queryKey: studioKeys.reviews(studioId),
    queryFn: () => apiRequest<Review[]>(`/studios/${studioId}/reviews`),
  });
}

export function useAddReview(studioId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: ReviewFormValues) =>
      apiRequest<Review>(`/studios/${studioId}/reviews`, { method: "POST", body: jsonBody(values) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: studioKeys.all }),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) => apiRequest<{ deleted: boolean }>(`/reviews/${reviewId}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: studioKeys.all }),
  });
}
