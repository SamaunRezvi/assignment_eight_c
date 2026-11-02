import Link from "next/link";
import { InstagramIcon, LinkedInIcon, YouTubeIcon } from "@/components/icons/brand-icons";
import { XIcon } from "@/components/icons/x-icon";
import { Logo } from "@/components/layout/logo";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { CATEGORIES, SITE_NAME } from "@/lib/constants";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/add-studio", label: "Host Your Space" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

const SOCIALS = [
  { href: "https://x.com", label: "StudioSpace on X", icon: XIcon },
  { href: "https://instagram.com", label: "StudioSpace on Instagram", icon: InstagramIcon },
  { href: "https://youtube.com", label: "StudioSpace on YouTube", icon: YouTubeIcon },
  { href: "https://linkedin.com", label: "StudioSpace on LinkedIn", icon: LinkedInIcon },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card/50">
      <div className="page-container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-4">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {SITE_NAME} connects filmmakers, photographers, podcasters and musicians with inspiring creative spaces. Our
            mission is to make professional production studios accessible to every maker, by the hour.
          </p>
          <div className="flex items-center gap-2">
            {SOCIALS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Quick links" className="lg:col-span-2">
          <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-widest text-foreground">Quick links</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Popular categories" className="lg:col-span-3">
          <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-widest text-foreground">
            Popular categories
          </h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {CATEGORIES.map((category) => (
              <li key={category.value}>
                <Link href={`/studios?category=${category.value}`} className="transition-colors hover:text-primary">
                  {category.plural}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-4 lg:col-span-3">
          <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-foreground">Studio notes</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            New spaces, host spotlights and production tips, once a month. No spam.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-border">
        <div className="page-container flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-primary">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
