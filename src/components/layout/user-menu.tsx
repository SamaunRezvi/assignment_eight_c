"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth-client";
import { initialsOf } from "@/lib/format";

export const ACCOUNT_LINKS: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add-studio", label: "Add New Studio", icon: PlusCircle },
  { href: "/my-listings", label: "My Studio Listings", icon: Warehouse },
  { href: "/my-bookings", label: "My Bookings", icon: CalendarCheck },
  { href: "/saved", label: "Saved Studios", icon: Bookmark },
];

export interface SessionUser {
  name: string;
  email: string;
  image?: string | null;
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    const { error } = await signOut();
    setPending(false);
    if (error) {
      toast.error("We could not log you out. Please try again.");
      return;
    }
    queryClient.clear();
    toast.success("You have been logged out");
    router.push("/");
    router.refresh();
  }

  return { logout, pending };
}

export function UserMenu({ user }: { user: SessionUser }) {
  const { logout, pending } = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        openOnHover
        delay={120}
        aria-label="Open account menu"
        className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar className="size-10 border border-border">
          {user.image ? <AvatarImage src={user.image} alt={user.name} referrerPolicy="no-referrer" /> : null}
          <AvatarFallback className="bg-primary/15 font-semibold text-foreground">{initialsOf(user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className="w-64 p-1.5">
        <div className="px-2 py-2">
          <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        {ACCOUNT_LINKS.map(({ href, label, icon: Icon }) => (
          <DropdownMenuItem key={href} render={<Link href={href} />} className="gap-2.5 py-2">
            <Icon />
            {label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" className="gap-2.5 py-2" disabled={pending} onClick={logout}>
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
