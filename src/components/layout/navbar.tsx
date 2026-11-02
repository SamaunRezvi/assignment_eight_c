"use client";

import { Menu } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ACCOUNT_LINKS, UserMenu, useLogout } from "@/components/layout/user-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth-client";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function DesktopLinks({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
      {NAV_LINKS.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {link.label}
            {active ? (
              <motion.span
                layoutId="nav-indicator"
                className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

function MobileMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const { data, isPending } = useSession();
  const { logout, pending } = useLogout();
  const user = data?.user;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open menu" className="lg:hidden" />}>
        <Menu />
      </SheetTrigger>
      <SheetContent side="right" className="w-80 gap-0 p-0">
        <SheetHeader className="border-b border-border p-5">
          <SheetTitle className="font-heading text-lg">Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {NAV_LINKS.map((link) => (
            <SheetClose
              key={link.href}
              render={<Link href={link.href} />}
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm font-medium",
                isActive(pathname, link.href) ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {link.label}
            </SheetClose>
          ))}
          {user ? (
            <>
              <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Your account
              </p>
              {ACCOUNT_LINKS.map(({ href, label, icon: Icon }) => (
                <SheetClose
                  key={href}
                  render={<Link href={href} />}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"
                >
                  <Icon className="size-4" />
                  {label}
                </SheetClose>
              ))}
            </>
          ) : null}
        </div>
        <div className="border-t border-border p-4">
          {isPending ? (
            <Skeleton className="h-10 w-full" />
          ) : user ? (
            <Button variant="outline" className="w-full" disabled={pending} onClick={logout}>
              Logout
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <SheetClose render={<Link href="/login" />} className={buttonVariants({ variant: "outline" })}>
                Login
              </SheetClose>
              <SheetClose render={<Link href="/register" />} className={buttonVariants()}>
                Register
              </SheetClose>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { data, isPending } = useSession();
  const user = data?.user;

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="page-container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <DesktopLinks pathname={pathname} />
        </div>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {isPending ? (
            <Skeleton className="size-10 rounded-full" />
          ) : user ? (
            <UserMenu user={{ name: user.name, email: user.email, image: user.image }} />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
                Login
              </Link>
              <Link href="/register" className={buttonVariants()}>
                Register
              </Link>
            </div>
          )}
          <MobileMenu pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
