import { AudioLines, Brush, Camera, Clapperboard, Mic2, type LucideIcon } from "lucide-react";
import type { BookingStatus, StudioCategory, StudioSort } from "@/types";

export const SITE_NAME = "StudioSpace";

export interface CategoryMeta {
  value: StudioCategory;
  /** Name used on forms and badges. */
  label: string;
  /** Name used on the home page category cards. */
  plural: string;
  blurb: string;
  icon: LucideIcon;
  image: string;
}

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=75`;

export const CATEGORIES: CategoryMeta[] = [
  {
    value: "photo-studio",
    label: "Photo Studio",
    plural: "Photo Studios",
    blurb: "Cyc walls, strobes and natural light",
    icon: Camera,
    image: unsplash("1527011046414-4781f1f94f8c"),
  },
  {
    value: "film-stage",
    label: "Film Stage",
    plural: "Sound Stages",
    blurb: "Soundproofed stages and screening rooms",
    icon: Clapperboard,
    image: unsplash("1485846234645-a62644f84728"),
  },
  {
    value: "podcast-lounge",
    label: "Podcast Lounge",
    plural: "Podcast Rooms",
    blurb: "Treated rooms wired for audio and video",
    icon: Mic2,
    image: unsplash("1478737270239-2f02b77fc618"),
  },
  {
    value: "music-suite",
    label: "Music Suite",
    plural: "Music Suites",
    blurb: "Recording suites and rehearsal halls",
    icon: AudioLines,
    image: unsplash("1598488035139-bdbb2231ce04"),
  },
  {
    value: "workshop",
    label: "Workshop",
    plural: "Art Workshops",
    blurb: "Ceramics, painting and maker spaces",
    icon: Brush,
    image: unsplash("1513364776144-60967b0f800f"),
  },
];

export const CATEGORY_BY_VALUE = Object.fromEntries(CATEGORIES.map((category) => [category.value, category])) as Record<
  StudioCategory,
  CategoryMeta
>;

export const AMENITY_SUGGESTIONS = [
  "Natural light",
  "Fast Wi-Fi",
  "Air conditioning",
  "Parking",
  "Green screen",
  "Soundproofing",
  "Lighting kit",
  "Backdrops",
  "Makeup station",
  "Green room",
  "Kitchenette",
  "Loading dock",
  "Monitors",
  "Props closet",
  "Restroom",
  "Wheelchair access",
];

export const SORT_OPTIONS: Array<{ value: StudioSort; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "top-rated", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export const BOOKING_STATUS_STYLES: Record<BookingStatus, string> = {
  Pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  Confirmed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  Completed: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
  Cancelled: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
] as const;
