import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Providers } from "@/components/providers";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "StudioSpace | Rent creative studios by the hour",
    template: "%s | StudioSpace",
  },
  description:
    "StudioSpace is a peer-to-peer marketplace for photo studios, film stages, podcast lounges, music suites and art workshops. Discover, compare and book creative spaces by the hour.",
  applicationName: "StudioSpace",
  openGraph: { type: "website", siteName: "StudioSpace", locale: "en_US" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3ea" },
    { media: "(prefers-color-scheme: dark)", color: "#1b1815" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${fraunces.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
          >
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
