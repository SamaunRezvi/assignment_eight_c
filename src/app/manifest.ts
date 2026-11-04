import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StudioSpace",
    short_name: "StudioSpace",
    description: "Rent photo studios, film stages, podcast lounges, music suites and art workshops by the hour.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f3ea",
    theme_color: "#e29a2e",
    icons: [{ src: "/icon", sizes: "64x64", type: "image/png" }, { src: "/apple-icon", sizes: "180x180", type: "image/png" }],
  };
}
