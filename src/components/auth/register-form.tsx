"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Circle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleButton } from "@/components/auth/google-button";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { signUp, useSession } from "@/lib/auth-client";
import { safeRedirectPath } from "@/lib/navigation";
import { PASSWORD_RULES, validatePassword } from "@/lib/validation/password";
import { cn } from "@/lib/utils";

const photoUrl = z
  .string()
  .trim()
  .refine((value) => {
    if (value === "") return true;
    try {
      const { protocol } = new URL(value);
      return protocol === "http:" || protocol === "https:";
    } catch {
      return false;
    }
  }, "Enter a valid image link starting with http:// or https://");

const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80, "Name is too long"),
  email: z.string().trim().min(1, "Enter your email address").pipe(z.email("Enter a valid email address")),
  photo: photoUrl,
  password: z.string().superRefine((value, ctx) => {
    const message = validatePassword(value);
    if (message) ctx.addIssue({ code: "custom", message });
  }),
});
type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeRedirectPath(params.get("next"));
  const { data: session } = useSession();
  const [pending, setPending] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", photo: "", password: "" },
  });
  const password = useWatch({ control, name: "password" }) ?? "";

  useEffect(() => {
    if (session?.user) router.replace(next);
  }, [session, next, router]);

  async function onSubmit(values: RegisterValues) {
    setPending(true);
    const { error } = await signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      ...(values.photo ? { image: values.photo } : {}),
    });
    setPending(false);

    if (error) {
      toast.error(error.message || "We could not create your account. Please try again.");
      return;
    }
    toast.success("Account created! Please log in to continue.");
    router.push(next === "/" ? "/login" : `/login?next=${encodeURIComponent(next)}`);
  }

  return (
    <AuthShell
      title="Create your account"
      description="Join StudioSpace to book creative spaces or list your own."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href={next === "/" ? "/login" : `/login?next=${encodeURIComponent(next)}`}
            className="font-semibold text-primary hover:underline"
          >
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField label="Full name" htmlFor="name" error={errors.name?.message}>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Alex Morgan"
            className="h-11"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
        </FormField>

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

        <FormField
          label="Photo URL (optional)"
          htmlFor="photo"
          error={errors.photo?.message}
          hint="A link to your profile picture. You can leave this empty."
        >
          <Input
            id="photo"
            type="url"
            inputMode="url"
            autoComplete="off"
            placeholder="https://example.com/me.jpg"
            className="h-11"
            aria-invalid={Boolean(errors.photo)}
            {...register("photo")}
          />
        </FormField>

        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="Create a password"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          <ul className="grid gap-1.5 pt-1 text-xs sm:grid-cols-3" aria-label="Password requirements">
            {PASSWORD_RULES.map((rule) => {
              const met = rule.test(password);
              return (
                <li
                  key={rule.id}
                  className={cn("flex items-center gap-1.5", met ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}
                >
                  {met ? <Check className="size-3.5" /> : <Circle className="size-3.5" />}
                  {rule.label}
                </li>
              );
            })}
          </ul>
        </FormField>

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Creating account..." : "Register"}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton callbackURL={next} label="Sign up with Google" />
    </AuthShell>
  );
}
