"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { BrandSpinner } from "@/components/shared/skeletons";
import { useSession } from "@/lib/auth-client";

interface RequireAuthProps {
  children: (user: { id: string; name: string; email: string; image?: string | null }) => ReactNode;
  /** Path to return to after logging in. */
  next: string;
}

/**
 * Guards private pages on the client. While the session is still loading a branded spinner
 * is shown, so a reload on a private route never bounces a signed-in user to the login page.
 */
export function RequireAuth({ children, next }: RequireAuthProps) {
  const router = useRouter();
  const { data, isPending } = useSession();
  const user = data?.user;

  useEffect(() => {
    if (!isPending && !user) router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [isPending, user, router, next]);

  if (isPending || !user) return <BrandSpinner label="Checking your session" />;
  return <>{children(user)}</>;
}
