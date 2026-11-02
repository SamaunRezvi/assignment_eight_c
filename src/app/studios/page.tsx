import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StudioGridSkeleton } from "@/components/shared/skeletons";
import { StudiosExplorer } from "@/components/studios/studios-explorer";

export const metadata: Metadata = {
  title: "Explore Studios",
  description: "Search and filter photo studios, film stages, podcast lounges, music suites and art workshops.",
};

export default function StudiosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Explore studios"
        title="Find your next creative space"
        description="Compare rooms by category, city, price and capacity, then book the hours you need."
      />
      <Suspense
        fallback={
          <div className="page-container py-10">
            <StudioGridSkeleton count={9} />
          </div>
        }
      >
        <StudiosExplorer />
      </Suspense>
    </>
  );
}
