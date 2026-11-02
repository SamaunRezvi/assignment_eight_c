"use client";

import { Bookmark, CalendarCheck, CircleDollarSign, Clock, Plus, ServerCrash, Warehouse, Wallet } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RequireAuth } from "@/components/auth/require-auth";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardSummary } from "@/hooks/use-booking-queries";
import { BOOKING_STATUS_STYLES } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { BookingStatus, DashboardSummary } from "@/types";

const STATUSES: BookingStatus[] = ["Pending", "Confirmed", "Completed", "Cancelled"];

function StatCard({ icon: Icon, label, value, href }: { icon: typeof Clock; label: string; value: ReactNode; href?: string }) {
  const body = (
    <div className="flex h-full items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/50">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
        <Icon className="size-6" />
      </span>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
  return href ? (
    <Link href={href} className="block h-full">
      {body}
    </Link>
  ) : (
    body
  );
}

function StatusBreakdown({ counts }: { counts: Record<BookingStatus, number> }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {STATUSES.map((status) => (
        <li key={status} className={cn("rounded-xl border px-4 py-3", BOOKING_STATUS_STYLES[status])}>
          <p className="text-2xl font-bold">{counts[status]}</p>
          <p className="text-xs font-medium">{status}</p>
        </li>
      ))}
    </ul>
  );
}

function RevenueChart({ monthly }: { monthly: DashboardSummary["host"]["monthly"] }) {
  if (monthly.length === 0) {
    return <p className="py-10 text-center text-sm text-muted-foreground">Revenue will appear here once you have confirmed bookings.</p>;
  }

  const data = monthly.map((item) => ({
    label: new Date(`${item.month}-01T00:00:00Z`).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
    revenue: item.revenue,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={12} />
          <YAxis tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(value: number) => `$${value}`} />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.5 }}
            formatter={(value) => [formatPrice(Number(value)), "Revenue"]}
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              color: "var(--popover-foreground)",
            }}
          />
          <Bar dataKey="revenue" fill="var(--chart-1)" radius={[8, 8, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function DashboardContent({ name }: { name: string }) {
  const { data, isPending, isError, refetch } = useDashboardSummary();

  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((key) => (
            <Skeleton key={key} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={ServerCrash}
        title="We could not load your dashboard"
        description="Check your connection and try again."
        secondary={
          <Button size="lg" variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  const { host, guest } = data;

  return (
    <div className="space-y-10">
      <p className="text-lg text-muted-foreground">
        Welcome back, <span className="font-semibold text-foreground">{name.split(" ")[0]}</span>. Here is how things look today.
      </p>

      <section aria-labelledby="host-stats" className="space-y-5">
        <h2 id="host-stats" className="font-heading text-2xl font-semibold">
          Hosting
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Warehouse} label="Active listings" value={host.listings} href="/my-listings" />
          <StatCard icon={Clock} label="Requests to review" value={host.bookingsByStatus.Pending} href="/my-bookings" />
          <StatCard icon={CalendarCheck} label="Confirmed sessions" value={host.bookingsByStatus.Confirmed} href="/my-bookings" />
          <StatCard icon={CircleDollarSign} label="Revenue (6 months)" value={formatPrice(host.revenue)} />
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h3 className="mb-4 font-heading text-lg font-semibold">Monthly revenue</h3>
          <RevenueChart monthly={host.monthly} />
        </div>
        <div className="space-y-3">
          <h3 className="font-heading text-lg font-semibold">Requests for your studios</h3>
          <StatusBreakdown counts={host.bookingsByStatus} />
        </div>
      </section>

      <section aria-labelledby="guest-stats" className="space-y-5">
        <h2 id="guest-stats" className="font-heading text-2xl font-semibold">
          Your bookings
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard icon={CalendarCheck} label="Reservations made" value={Object.values(guest.bookingsByStatus).reduce((sum, count) => sum + count, 0)} href="/my-bookings" />
          <StatCard icon={Wallet} label="Total spent" value={formatPrice(guest.totalSpent)} />
          <StatCard icon={Bookmark} label="Saved studios" value={guest.wishlist} href="/saved" />
        </div>
        <StatusBreakdown counts={guest.bookingsByStatus} />
      </section>
    </div>
  );
}

export function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Your creative workspace"
        description="Bookings, earnings and saved spaces at a glance."
        actions={
          <Link href="/add-studio" className={buttonVariants({ size: "lg" })}>
            <Plus data-icon="inline-start" />
            Add New Studio
          </Link>
        }
      />
      <div className="page-container py-10">
        <RequireAuth next="/dashboard">{(user) => <DashboardContent name={user.name} />}</RequireAuth>
      </div>
    </>
  );
}
