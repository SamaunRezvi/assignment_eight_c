"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.3 14.6 2.4 12 2.4 6.9 2.4 2.8 6.6 2.8 11.8S6.9 21.2 12 21.2c5.3 0 8.8-3.7 8.8-9 0-.6-.1-1.1-.2-1.5H12Z" />
    </svg>
  );
}

export function GoogleButton({ callbackURL, label }: { callbackURL: string; label: string }) {
  const [pending, setPending] = useState(false);

  async function onClick() {
    setPending(true);
    const { error } = await signIn.social({ provider: "google", callbackURL });
    if (error) {
      setPending(false);
      toast.error(error.message || "Google sign-in is unavailable right now. Please try again.");
    }
  }

  return (
    <Button type="button" variant="outline" size="lg" className="w-full" disabled={pending} onClick={onClick}>
      <GoogleMark />
      {pending ? "Connecting to Google..." : label}
    </Button>
  );
}
