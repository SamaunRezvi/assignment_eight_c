import type { Metadata } from "next";
import { MyListingsPage } from "@/components/studios/my-listings-page";

export const metadata: Metadata = { title: "My Studio Listings" };

export default function Page() {
  return <MyListingsPage />;
}
