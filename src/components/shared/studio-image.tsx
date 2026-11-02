"use client";

import { Aperture } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StudioImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

/**
 * Hosts can paste an image URL from any domain, which next/image cannot optimise, so a
 * plain <img> is used together with a branded fallback for broken links.
 */
export function StudioImage({ src, alt, className, priority = false }: StudioImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("flex items-center justify-center bg-gradient-to-br from-muted to-accent text-primary/60", className)}
      >
        <Aperture className="size-10" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailedSrc(src)}
      className={cn("object-cover", className)}
    />
  );
}
