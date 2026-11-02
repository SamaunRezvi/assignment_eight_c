import type { Metadata } from "next";
import { EditStudioPage } from "@/components/studios/edit-studio-page";

export const metadata: Metadata = { title: "Update Studio" };

export default async function Page({ params }: PageProps<"/studios/edit/[id]">) {
  const { id } = await params;
  return <EditStudioPage id={id} />;
}
