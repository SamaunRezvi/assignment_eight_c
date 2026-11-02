import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="relative border-b border-border bg-card/40">
      <div className="spotlight-glow absolute inset-0" aria-hidden="true" />
      <div className="page-container relative flex flex-col gap-6 py-12 sm:py-14 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
          <h1 className="section-title">{title}</h1>
          {description ? <p className="section-copy">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </div>
  );
}
