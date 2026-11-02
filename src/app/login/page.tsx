import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { BrandSpinner } from "@/components/shared/skeletons";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <Suspense fallback={<BrandSpinner label="Loading" />}>
      <LoginForm />
    </Suspense>
  );
}
