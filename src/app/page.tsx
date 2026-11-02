import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedStudios } from "@/components/home/featured-studios";
import { HeroSlider } from "@/components/home/hero-slider";
import { HostGuarantee } from "@/components/home/host-guarantee";
import { HowBookingWorks } from "@/components/home/how-booking-works";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <FeaturedStudios />
      <CategoryGrid />
      <HowBookingWorks />
      <HostGuarantee />
    </>
  );
}
