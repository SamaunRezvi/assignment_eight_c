import { Quote } from "lucide-react";
import type { ReactNode } from "react";
import { StudioImage } from "@/components/shared/studio-image";

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-black lg:block">
        <StudioImage
          src="https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=1400&q=80"
          alt=""
          className="absolute inset-0 size-full"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <Quote className="mb-4 size-8 text-primary" />
          <p className="max-w-md font-heading text-3xl font-medium leading-snug">
            The room sounded incredible and booking took less than a minute.
          </p>
          <p className="mt-4 text-sm text-white/70">Noah Bennett, podcast producer</p>
        </div>
      </div>

      <div className="relative flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="spotlight-glow absolute inset-0" aria-hidden="true" />
        <div className="relative w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="section-title">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
          <div className="text-center text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>
    </div>
  );
}
