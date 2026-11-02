"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RequireAuth } from "@/components/auth/require-auth";
import { PageHeader } from "@/components/shared/page-header";
import { StudioForm } from "@/components/studios/studio-form";
import { useCreateStudio } from "@/hooks/use-studio-queries";
import { ApiRequestError } from "@/lib/api";
import type { StudioFormValues } from "@/lib/validation/studio";

export function AddStudioPage() {
  const router = useRouter();
  const createStudio = useCreateStudio();

  async function onSubmit(values: StudioFormValues) {
    try {
      await createStudio.mutateAsync(values);
      toast.success("Your studio is live! Creators can now find and book it.");
      router.push("/my-listings");
    } catch (error) {
      toast.error(error instanceof ApiRequestError ? error.message : "We could not publish your studio. Please try again.");
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Host your space"
        title="Add a new studio"
        description="Share your space with the creative community. Great photos and honest details bring the best bookings."
      />
      <div className="page-container max-w-4xl py-10">
        <RequireAuth next="/add-studio">
          {(user) => (
            <StudioForm
              host={{ name: user.name, email: user.email }}
              submitLabel="Publish studio"
              pendingLabel="Publishing..."
              pending={createStudio.isPending}
              onSubmit={onSubmit}
            />
          )}
        </RequireAuth>
      </div>
    </>
  );
}
