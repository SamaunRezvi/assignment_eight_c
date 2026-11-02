"use client";

import { Lock, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RequireAuth } from "@/components/auth/require-auth";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { BrandSpinner } from "@/components/shared/skeletons";
import { StudioForm } from "@/components/studios/studio-form";
import { useStudio, useUpdateStudio } from "@/hooks/use-studio-queries";
import { ApiRequestError } from "@/lib/api";
import type { StudioFormValues } from "@/lib/validation/studio";

function EditForm({ id, user }: { id: string; user: { id: string; name: string; email: string } }) {
  const router = useRouter();
  const { data: studio, isPending, isError } = useStudio(id);
  const updateStudio = useUpdateStudio(id);

  if (isPending) return <BrandSpinner label="Loading your listing" />;

  if (isError || !studio) {
    return (
      <EmptyState
        icon={SearchX}
        title="We could not find this listing"
        description="It may have been deleted. Head back to your listings to see what is live."
        action={{ href: "/my-listings", label: "Go to My Listings" }}
      />
    );
  }

  if (studio.host.id !== user.id) {
    return (
      <EmptyState
        icon={Lock}
        title="Only the host can edit this studio"
        description="This listing belongs to another host. You can manage the studios you have created from your listings page."
        action={{ href: "/my-listings", label: "Go to My Listings" }}
      />
    );
  }

  const initialValues: StudioFormValues = {
    title: studio.title,
    category: studio.category,
    hourlyRate: studio.hourlyRate,
    securityDeposit: studio.securityDeposit,
    maxCapacity: studio.maxCapacity,
    location: studio.location,
    image: studio.image,
    gallery: studio.gallery,
    amenities: studio.amenities,
    overview: studio.overview,
  };

  async function onSubmit(values: StudioFormValues) {
    try {
      await updateStudio.mutateAsync(values);
      toast.success("Your studio was updated.");
      router.push("/my-listings");
    } catch (error) {
      toast.error(error instanceof ApiRequestError ? error.message : "We could not save your changes. Please try again.");
    }
  }

  return (
    <StudioForm
      host={{ name: user.name, email: user.email }}
      initialValues={initialValues}
      submitLabel="Save changes"
      pendingLabel="Saving..."
      pending={updateStudio.isPending}
      onSubmit={onSubmit}
    />
  );
}

export function EditStudioPage({ id }: { id: string }) {
  return (
    <>
      <PageHeader eyebrow="Manage listing" title="Update your studio" description="Keep your details, photos and pricing accurate." />
      <div className="page-container max-w-4xl py-10">
        <RequireAuth next={`/studios/edit/${id}`}>{(user) => <EditForm id={id} user={user} />}</RequireAuth>
      </div>
    </>
  );
}
