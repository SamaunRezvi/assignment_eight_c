import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const API_URL = (process.env.API_URL ?? "http://localhost:5000").trim().replace(/\/+$/, "");

const STATIC_PAGES = ["", "/studios", "/how-it-works", "/about", "/terms", "/privacy"];

async function studioIds(): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL}/api/studios?limit=48&sort=newest`, { next: { revalidate: 3600 } });
    if (!response.ok) return [];
    const body = (await response.json()) as { data?: Array<{ id: string }> };
    return (body.data ?? []).map((studio) => studio.id);
  } catch {
    // The sitemap must still build when the API is asleep or unreachable.
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ids = await studioIds();
  return [
    ...STATIC_PAGES.map((path) => ({ url: `${SITE_URL}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 })),
    ...ids.map((id) => ({ url: `${SITE_URL}/studios/${id}`, changeFrequency: "daily" as const, priority: 0.8 })),
  ];
}
