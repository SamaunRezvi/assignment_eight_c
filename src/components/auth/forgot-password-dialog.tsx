"use client";

import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ForgotPasswordDialog() {
  return (
    <Dialog>
      <DialogTrigger className="text-sm font-medium text-primary hover:underline">Forgot password?</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <span className="mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <KeyRound className="size-6" />
          </span>
          <DialogTitle className="font-heading text-xl">Password reset is on its way</DialogTitle>
          <DialogDescription className="leading-relaxed">
            Self-service password reset is not available yet. In the meantime you can sign in instantly with your Google
            account, or register a new account with a different email.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button size="lg" />}>Got it</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
