"use client";

import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useToggleWishlist, useWishlistIds } from "@/hooks/use-booking-queries";
import { ApiRequestError } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  studioId: string;
  studioTitle: string;
  className?: string;
}

export function WishlistButton({ studioId, studioTitle, className }: WishlistButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const signedIn = Boolean(session?.user);
  const { data: savedIds = [] } = useWishlistIds(signedIn);
  const toggle = useToggleWishlist();
  const saved = savedIds.includes(studioId);

  function onClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!signedIn) {
      toast.info("Log in to save studios to your wishlist.");
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    toggle.mutate(
      { studioId, saved },
      {
        onSuccess: () =>
          toast.success(saved ? `Removed ${studioTitle} from your saved studios` : `Saved ${studioTitle} to your wishlist`),
        onError: (error) =>
          toast.error(error instanceof ApiRequestError ? error.message : "Could not update your wishlist."),
      },
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${studioTitle} from saved studios` : `Save ${studioTitle}`}
      className={cn(
        "flex size-9 items-center justify-center rounded-full bg-background/85 text-foreground shadow-sm backdrop-blur transition hover:scale-110 hover:bg-background focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <Heart className={cn("size-[18px] transition-colors", saved && "fill-rose-500 text-rose-500")} />
    </button>
  );
}
