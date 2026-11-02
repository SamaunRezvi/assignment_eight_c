"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="page-container flex min-h-[60vh] flex-col items-center justify-center gap-6 py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <TriangleAlert className="size-8" />
      </span>
      <div className="space-y-2">
        <h1 className="section-title">Something went off script</h1>
        <p className="section-copy mx-auto">An unexpected error interrupted this page. You can try again or head back to the home page.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg" onClick={reset}>
          <RotateCcw data-icon="inline-start" />
          Try again
        </Button>
        <Link href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Return to Home
        </Link>
      </div>
    </div>
  );
}
