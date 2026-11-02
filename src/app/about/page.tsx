import { ArrowRight, Handshake, Lightbulb, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { HostGuarantee } from "@/components/home/host-guarantee";
import { PageHeader } from "@/components/shared/page-header";
import { StudioImage } from "@/components/shared/studio-image";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us",
  description: "StudioSpace makes professional creative spaces accessible to every maker, by the hour.",
};

const VALUES = [
  {
    icon: Sparkles,
    title: "Access for every maker",
    copy: "A great room should not be reserved for people with big budgets. Hourly pricing keeps professional space within reach.",
  },
  {
    icon: Handshake,
    title: "Trust on both sides",
    copy: "Verified profiles, honest reviews and clear deposits mean hosts and creators can rely on each other.",
  },
  {
    icon: ShieldCheck,
    title: "Fairness by design",
    copy: "Confirmed sessions are protected from double booking, and every price is shown before you commit.",
  },
  {
    icon: Lightbulb,
    title: "Craft over clutter",
    copy: "We obsess over the details that matter to producers: light, sound, power, access and honest photos.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="We exist to put more creators in great rooms"
        description="StudioSpace is a peer-to-peer marketplace for filmmakers, photographers, podcasters, musicians and artists."
      />

      <section className="py-20">
        <div className="page-container grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-5">
            <p className="section-eyebrow">Our story</p>
            <h2 className="section-title">Great work needs the right room</h2>
            <p className="leading-relaxed text-muted-foreground">
              Every creator knows the feeling: the idea is ready, the crew is booked, and the only thing missing is a space that suits the
              shoot. Professional studios are often locked behind long contracts, opaque pricing and endless phone calls.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              StudioSpace was built to change that. Hosts list the rooms they have built, creators book exactly the hours they need, and
              everything from pricing to availability is visible in one place. Idle space becomes income, and projects get made.
            </p>
            <Link href="/studios" className={buttonVariants({ size: "lg" })}>
              Explore Studios
              <ArrowRight data-icon="inline-end" />
            </Link>
          </div>
          <StudioImage
            src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1400&q=80"
            alt="A recording studio with guitars on the wall and a mixing console"
            className="aspect-[4/3] w-full rounded-2xl border border-border shadow-lg"
          />
        </div>
      </section>

      <section className="border-y border-border bg-card/40 py-20" aria-labelledby="values-title">
        <div className="page-container">
          <div className="mb-10 space-y-3 text-center">
            <p className="section-eyebrow">What we believe</p>
            <h2 id="values-title" className="section-title">
              Principles behind every feature
            </h2>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <li key={value.title} className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <value.icon className="size-5" />
                </span>
                <h3 className="font-heading text-lg font-semibold">{value.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{value.copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <HostGuarantee />
    </>
  );
}
