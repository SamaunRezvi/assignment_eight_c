import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/legal-page";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      intro="The ground rules for booking and hosting on StudioSpace. By using the platform you agree to them."
      sections={[
        {
          title: "Using StudioSpace",
          body: "StudioSpace is a marketplace that connects hosts who list creative spaces with creators who want to book them. You must provide accurate account information and keep your login credentials secure.",
        },
        {
          title: "Listings and bookings",
          body: "Hosts are responsible for the accuracy of their listings, including photos, amenities, pricing and capacity. A booking request becomes binding only when the host confirms it. Confirmed time slots cannot overlap with another confirmed booking.",
        },
        {
          title: "Pricing and deposits",
          body: "Prices are shown in US dollars and include the hourly rate for the selected time plus any refundable security deposit set by the host. Deposits are returned when the space is left in its original condition.",
        },
        {
          title: "Cancellations",
          body: "Guests may cancel a pending request at any time. Hosts may decline a pending request or cancel a confirmed session if they are unable to host, and should notify the guest as early as possible.",
        },
        {
          title: "Acceptable use",
          body: "You agree not to use a space for unlawful activity, to respect house rules set by the host, and to treat equipment and property with care. Accounts that abuse the platform may be suspended.",
        },
        {
          title: "Changes to these terms",
          body: "We may update these terms as the platform evolves. Continued use of StudioSpace after a change means you accept the updated terms.",
        },
      ]}
    />
  );
}
