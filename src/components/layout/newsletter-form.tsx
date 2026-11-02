"use client";

import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiRequestError, apiRequest, jsonBody } from "@/lib/api";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      toast.error("Enter a valid email address to subscribe.");
      return;
    }

    setPending(true);
    try {
      const result = await apiRequest<{ alreadySubscribed: boolean }>("/newsletter", {
        method: "POST",
        body: jsonBody({ email: value }),
      });
      toast.success(result.alreadySubscribed ? "You are already on the list. Thank you!" : "You are subscribed. Welcome to StudioSpace!");
      setEmail("");
    } catch (error) {
      toast.error(error instanceof ApiRequestError ? error.message : "Subscription failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <Input
        id="newsletter-email"
        type="email"
        placeholder="you@studio.com"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="h-11 bg-background/60"
      />
      <Button type="submit" size="icon-lg" disabled={pending} aria-label="Subscribe to the newsletter" className="size-11 shrink-0">
        <Send />
      </Button>
    </form>
  );
}
