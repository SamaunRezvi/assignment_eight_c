import { Aperture } from "lucide-react";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label={`${SITE_NAME} home`} className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-500 group-hover:rotate-90">
        <Aperture className="size-5" strokeWidth={2.2} />
      </span>
      <span className="font-heading text-xl font-semibold tracking-tight text-foreground">{SITE_NAME}</span>
    </Link>
  );
}
