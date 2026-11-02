import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/register-form";
import { BrandSpinner } from "@/components/shared/skeletons";

export const metadata: Metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <Suspense fallback={<BrandSpinner label="Loading" />}>
      <RegisterForm />
    </Suspense>
  );
}
