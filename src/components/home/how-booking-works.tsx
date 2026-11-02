import { CalendarClock, Clapperboard, Search, Zap } from "lucide-react";

export const BOOKING_STEPS = [
  {
    icon: Search,
    title: "Discover Spaces",
    copy: "Filter by category, city, price and capacity to find rooms that fit your production.",
  },
  {
    icon: CalendarClock,
    title: "Select Shoot Hours",
    copy: "Pick a date and your start and end time. Transparent pricing is shown before you commit.",
  },
  {
    icon: Zap,
    title: "Book Instantly",
    copy: "Send your request in one tap. Confirmed slots are protected so nobody can double-book you.",
  },
  {
    icon: Clapperboard,
    title: "Create & Produce",
    copy: "Show up, set up and shoot. Download your receipt once the host confirms.",
  },
];

export function HowBookingWorks() {
  return (
    <section className="py-20" aria-labelledby="how-title">
      <div className="page-container">
        <div className="mb-12 space-y-3 text-center">
          <p className="section-eyebrow">How booking works</p>
          <h2 id="how-title" className="section-title">
            From idea to rolling in four steps
          </h2>
          <p className="section-copy mx-auto">No back-and-forth emails. Everything happens in one place.</p>
        </div>

        <ol className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            className="absolute left-[12.5%] right-[12.5%] top-10 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block"
            aria-hidden="true"
          />
          {BOOKING_STEPS.map((step, index) => (
            <li
              key={step.title}
              className="relative flex h-full flex-col items-center rounded-2xl border border-border bg-card p-7 text-center shadow-sm"
            >
              <span className="relative mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                <step.icon className="size-6" />
                <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full border-2 border-card bg-foreground text-xs font-bold text-background">
                  {index + 1}
                </span>
              </span>
              <h3 className="font-heading text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
