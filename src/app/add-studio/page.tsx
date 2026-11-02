import type { Metadata } from "next";
import { AddStudioPage } from "@/components/studios/add-studio-page";

export const metadata: Metadata = { title: "Add New Studio" };

export default function Page() {
  return <AddStudioPage />;
}
