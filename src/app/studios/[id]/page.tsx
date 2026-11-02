import type { Metadata } from "next";
import { StudioDetail } from "@/components/studios/studio-detail";

const API_URL = (process.env.API_URL ?? "http://localhost:5000").replace(/\/$/, "");

export async function generateMetadata({ params }: PageProps<"/studios/[id]">): Promise<Metadata> {
  const { id } = await params;
  try {
    const response = await fetch(`${API_URL}/api/studios/${encodeURIComponent(id)}`, { next: { revalidate: 60 } });
    if (!response.ok) return { title: "Studio" };
    const { data } = (await response.json()) as { data?: { title: string; overview: string; image: string } };
    if (!data) return { title: "Studio" };
    return {
      title: data.title,
      description: data.overview.slice(0, 155),
      openGraph: { title: data.title, description: data.overview.slice(0, 155), images: [data.image] },
    };
  } catch {
    return { title: "Studio" };
  }
}

export default async function StudioDetailPage({ params }: PageProps<"/studios/[id]">) {
  const { id } = await params;
  return <StudioDetail id={id} />;
}
