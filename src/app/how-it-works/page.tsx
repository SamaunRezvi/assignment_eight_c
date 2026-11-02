import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { HowBookingWorks } from "@/components/home/how-booking-works";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How It Works",
  description: "See how to discover, book and host creative studios on StudioSpace.",
};

const HOST_STEPS = [
  { title: "List your space", copy: "Add photos, amenities, pricing and a security deposit in a few minutes." },
  { title: "Review requests", copy: "Confirm the sessions that suit you. Confirmed slots are locked so double bookings cannot happen." },
  { title: "Host and earn", copy: "Welcome your guest, mark the session completed and watch earnings build on your dashboard." },
];

const FAQ = [
  {
    q: "When am I charged for a booking?",
    a: "Sending a request does not charge you. Pricing is shown up front, and the host confirms the session before it is locked in.",
  },
  {
    q: "What is the security deposit?",
    a: "A refundable amount set by the host to protect equipment and the space. It is returned when the room is left in its original condition.",
  },
  {
    q: "Can I cancel a booking?",
    a: "Yes. You can cancel any pending request from My Bookings, which releases the slot straight away.",
  },
  {
    q: "How do I get a receipt?",
    a: "Once a booking is confirmed, a Download receipt button appears on the booking so you can save a PDF invoice.",
  },
  {
    q: "How do I become a host?",
    a: "Create a free account, choose Add New Studio from the account menu and publish your listing.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title="Booking a studio should feel effortless"
        description="Whether you are shooting, recording or teaching, here is the path from first search to final take."
      />

      <HowBookingWorks />

      <section className="border-y border-border bg-card/40 py-20" aria-labelledby="hosting-title">
        <div className="page-container">
          <div className="mb-10 space-y-3 text-center">
            <p className="section-eyebrow">For hosts</p>
            <h2 id="hosting-title" className="section-title">
              Turn an idle room into income
            </h2>
          </div>
          <ol className="grid gap-6 md:grid-cols-3">
            {HOST_STEPS.map((step, index) => (
              <li key={step.title} className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-7 shadow-sm">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{index + 1}</span>
                <h3 className="font-heading text-lg font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20" aria-labelledby="faq-title">
        <div className="page-container max-w-3xl">
          <div className="mb-10 space-y-3 text-center">
            <p className="section-eyebrow">FAQ</p>
            <h2 id="faq-title" className="section-title">
              Questions, answered
            </h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-border bg-card p-5 open:border-primary/50">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="text-xl text-primary transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link href="/studios" className={buttonVariants({ size: "lg" })}>
              Start exploring
              <ArrowRight data-icon="inline-end" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
