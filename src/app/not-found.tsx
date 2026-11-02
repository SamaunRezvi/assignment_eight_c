import { Home, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { StudioIllustration } from "@/components/shared/studio-illustration";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="page-container flex min-h-[70vh] flex-col items-center justify-center gap-8 py-16 text-center">
      <StudioIllustration className="w-full max-w-md" />
      <div className="space-y-3">
        <p className="section-eyebrow">Error 404</p>
        <h1 className="section-title">This scene was cut from the final edit</h1>
        <p className="section-copy mx-auto">
          The page you are looking for has moved, been removed or never existed. Let us get you back on set.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          <Home data-icon="inline-start" />
          Return to Home
        </Link>
        <Link href="/studios" className={buttonVariants({ variant: "outline", size: "lg" })}>
          <Search data-icon="inline-start" />
          Explore Studios
        </Link>
      </div>
    </div>
  );
}
