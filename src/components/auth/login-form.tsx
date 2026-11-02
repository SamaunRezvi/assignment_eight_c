"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordDialog } from "@/components/auth/forgot-password-dialog";
import { GoogleButton } from "@/components/auth/google-button";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { signIn, useSession } from "@/lib/auth-client";
import { safeRedirectPath } from "@/lib/navigation";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Enter your email address").pipe(z.email("Enter a valid email address")),
  password: z.string().min(1, "Enter your password"),
});
type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeRedirectPath(params.get("next"));
  const { data: session } = useSession();
  const [pending, setPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  useEffect(() => {
    if (session?.user) router.replace(next);
  }, [session, next, router]);

  async function onSubmit(values: LoginValues) {
    setPending(true);
    const { error } = await signIn.email({ email: values.email, password: values.password });
    setPending(false);

    if (error) {
      toast.error(error.message || "Incorrect email or password. Please try again.");
      return;
    }
    toast.success("Welcome back to StudioSpace!");
    router.replace(next);
    router.refresh();
  }

  return (
    <AuthShell
      title="Welcome back"
      description="Log in to manage your bookings, listings and saved studios."
      footer={
        <>
          New to StudioSpace?{" "}
          <Link
            href={next === "/" ? "/register" : `/register?next=${encodeURIComponent(next)}`}
            className="font-semibold text-primary hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@studio.com"
            className="h-11"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </FormField>

        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Your password"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
        </FormField>

        <div className="flex justify-end">
          <ForgotPasswordDialog />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Logging in..." : "Login"}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton callbackURL={next} label="Continue with Google" />
    </AuthShell>
  );
}
