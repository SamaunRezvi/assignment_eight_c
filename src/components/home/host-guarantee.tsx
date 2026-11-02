import { ArrowRight, Headset, ShieldCheck, UserCheck, Wrench } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const GUARANTEES = [
  {
    icon: ShieldCheck,
    title: "Liability protection",
    copy: "Every confirmed session is covered by our host liability policy, so both sides can focus on the work.",
  },
  {
    icon: UserCheck,
    title: "Verified profiles",
    copy: "Hosts and creators sign in with verified accounts, and reviews come only from real members.",
  },
  {
    icon: Wrench,
    title: "Equipment safety",
    copy: "Listings state exactly what gear is included, backed by refundable security deposits for peace of mind.",
  },
  {
    icon: Headset,
    title: "24/7 host support",
    copy: "A real person is always on hand to resolve schedule changes, access issues or last-minute questions.",
  },
];

export function HostGuarantee() {
  return (
    <section className="border-t border-border bg-card/40 py-20" aria-labelledby="guarantee-title">
      <div className="page-container">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-4">
            <p className="section-eyebrow">Host guarantee &amp; creator support</p>
            <h2 id="guarantee-title" className="section-title">
              Book and host with confidence
            </h2>
            <p className="section-copy">
              Trust is the foundation of every great session. These protections come with every booking on StudioSpace.
            </p>
            <Link href="/add-studio" className={buttonVariants({ size: "lg" })}>
              Start hosting
              <ArrowRight data-icon="inline-end" />
            </Link>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
            {GUARANTEES.map((item) => (
              <li
                key={item.title}
                className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/50"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <item.icon className="size-5" />
                </span>
                <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
