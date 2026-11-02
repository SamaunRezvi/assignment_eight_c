import type { Metadata } from "next";
import { SavedStudiosPage } from "@/components/studios/saved-studios-page";

export const metadata: Metadata = { title: "Saved Studios" };

export default function Page() {
  return <SavedStudiosPage />;
}
