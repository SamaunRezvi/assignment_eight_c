import type { Metadata } from "next";
import { MyBookingsPage } from "@/components/bookings/my-bookings-page";

export const metadata: Metadata = { title: "My Bookings" };

export default function Page() {
  return <MyBookingsPage />;
}
