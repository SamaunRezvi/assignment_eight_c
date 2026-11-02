import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { href: string; label: string };
  secondary?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, secondary, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center",
        className,
      )}
    >
      <span className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
        <Icon className="size-8" strokeWidth={1.6} />
      </span>
      <h3 className="font-heading text-xl font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action || secondary ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action ? (
            <Link href={action.href} className={buttonVariants({ size: "lg" })}>
              {action.label}
            </Link>
          ) : null}
          {secondary}
        </div>
      ) : null}
    </div>
  );
}
