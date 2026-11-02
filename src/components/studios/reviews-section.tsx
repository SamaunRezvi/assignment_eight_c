"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquareText, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { StarDisplay, StarInput } from "@/components/studios/star-rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAddReview, useDeleteReview, useReviews } from "@/hooks/use-studio-queries";
import { ApiRequestError } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { formatRelativeDate, initialsOf } from "@/lib/format";
import { reviewFormSchema, type ReviewFormValues } from "@/lib/validation/review";
import type { Studio } from "@/types";

function ReviewForm({ studioId }: { studioId: string }) {
  const addReview = useAddReview(studioId);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { rating: 0, comment: "" },
  });

  async function onSubmit(values: ReviewFormValues) {
    try {
      await addReview.mutateAsync(values);
      toast.success("Thanks for sharing your experience!");
      reset();
    } catch (error) {
      toast.error(error instanceof ApiRequestError ? error.message : "We could not post your review.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-border bg-card p-5" noValidate>
      <h3 className="font-heading text-lg font-semibold">Share your experience</h3>
      <FormField label="Your rating" htmlFor="review-rating" error={errors.rating?.message}>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => <StarInput id="review-rating" value={field.value} onChange={field.onChange} />}
        />
      </FormField>
      <FormField label="Your review" htmlFor="review-comment" error={errors.comment?.message}>
        <Textarea id="review-comment" rows={3} placeholder="What was the space like to work in?" {...register("comment")} />
      </FormField>
      <Button type="submit" disabled={addReview.isPending}>
        {addReview.isPending ? "Posting..." : "Post review"}
      </Button>
    </form>
  );
}

export function ReviewsSection({ studio }: { studio: Studio }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data: reviews, isPending, isError } = useReviews(studio.id);
  const deleteReview = useDeleteReview();
  const user = session?.user;
  const isHost = user?.id === studio.host.id;
  const alreadyReviewed = reviews?.some((review) => review.userId === user?.id) ?? false;

  return (
    <section aria-labelledby="reviews-title" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="reviews-title" className="font-heading text-2xl font-semibold">
          Reviews
        </h2>
        {studio.reviewCount > 0 ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <StarDisplay value={studio.rating} />
            <span className="font-semibold text-foreground">{studio.rating.toFixed(1)}</span>
            from {studio.reviewCount} {studio.reviewCount === 1 ? "review" : "reviews"}
          </p>
        ) : null}
      </div>

      {isPending ? (
        <div className="space-y-4">
          {[0, 1].map((key) => (
            <Skeleton key={key} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Reviews could not be loaded right now.</p>
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={MessageSquareText}
          title="No reviews yet"
          description="Be the first creator to share what it was like to work in this space."
          className="py-10"
        />
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <Avatar className="size-10">
                  {review.userPhoto ? <AvatarImage src={review.userPhoto} alt="" referrerPolicy="no-referrer" /> : null}
                  <AvatarFallback className="bg-primary/15 text-sm font-semibold">{initialsOf(review.userName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{review.userName}</p>
                    <time className="text-xs text-muted-foreground" dateTime={review.createdAt}>
                      {formatRelativeDate(review.createdAt)}
                    </time>
                  </div>
                  <StarDisplay value={review.rating} className="mt-1" />
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
                </div>
                {review.userId === user?.id ? (
                  <ConfirmDialog
                    title="Delete your review?"
                    description="Your rating and comment will be removed from this studio."
                    confirmLabel="Delete review"
                    pending={deleteReview.isPending}
                    onConfirm={async () => {
                      try {
                        await deleteReview.mutateAsync(review.id);
                        toast.success("Your review was deleted");
                      } catch (error) {
                        toast.error(error instanceof ApiRequestError ? error.message : "Could not delete the review.");
                      }
                    }}
                    trigger={
                      <Button variant="ghost" size="icon-sm" aria-label="Delete your review">
                        <Trash2 />
                      </Button>
                    }
                  />
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      {user ? (
        isHost ? null : alreadyReviewed ? (
          <p className="text-sm text-muted-foreground">You have already reviewed this studio.</p>
        ) : (
          <ReviewForm studioId={studio.id} />
        )
      ) : (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">Log in to leave a review for this studio.</p>
          <Link href={`/login?next=${encodeURIComponent(pathname)}`} className={buttonVariants({ variant: "outline" })}>
            Login to review
          </Link>
        </div>
      )}
    </section>
  );
}
