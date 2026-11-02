import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/legal-page";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="What we collect, why we collect it and how you stay in control of your information."
      sections={[
        {
          title: "Information we collect",
          body: "We collect the details you give us when you register (name, email address and optional profile photo), the listings and bookings you create, and reviews you write. If you sign in with Google we receive your name, email and profile picture from Google.",
        },
        {
          title: "How we use it",
          body: "Your information is used to run your account, show your listings and bookings, let hosts and guests contact each other about a session and keep the platform secure. We do not sell personal information.",
        },
        {
          title: "What others can see",
          body: "Hosts see the name and email of a guest who requests a booking. Guests see a host's name and profile photo. A host's email address is never shown publicly.",
        },
        {
          title: "Cookies",
          body: "We use essential cookies to keep you signed in. They are marked HTTPOnly so scripts running on a page cannot read them. We also remember your light or dark theme preference in your browser.",
        },
        {
          title: "Your choices",
          body: "You can update or delete your listings and reviews at any time and can log out from every page. Contact us if you would like your account data removed.",
        },
      ]}
    />
  );
}
