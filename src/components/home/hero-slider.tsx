"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const photo = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2000&q=80`;

const SLIDES = [
  {
    eyebrow: "Photo studios",
    title: "Find the light your next shoot deserves",
    copy: "Cyclorama walls, strobes and golden-hour lofts, ready the moment you arrive and booked by the hour.",
    image: photo("1527011046414-4781f1f94f8c"),
  },
  {
    eyebrow: "Film & sound stages",
    title: "Roll camera on a stage built for it",
    copy: "Soundproofed stages, green screens and full grip packages from hosts who know production.",
    image: photo("1485846234645-a62644f84728"),
  },
  {
    eyebrow: "Music & podcast suites",
    title: "Capture your sound in a room that listens",
    copy: "Treated rooms, vintage consoles and pro microphones for records, podcasts and voice-over.",
    image: photo("1598488035139-bdbb2231ce04"),
  },
  {
    eyebrow: "Art workshops",
    title: "Make something with your hands, together",
    copy: "Ceramics, painting and maker spaces with the tools and light to teach, create and collaborate.",
    image: photo("1513364776144-60967b0f800f"),
  },
];

export function HeroSlider() {
  return (
    <section aria-label="Featured creative spaces" className="relative isolate overflow-hidden bg-black">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={900}
        autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        navigation={{ prevEl: ".hero-prev", nextEl: ".hero-next" }}
        className="hero-swiper"
      >
        {SLIDES.map((slide, index) => (
          <SwiperSlide key={slide.title}>
            <div className="relative flex min-h-[560px] items-center sm:min-h-[640px] lg:min-h-[720px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt=""
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                className="absolute inset-0 -z-10 size-full object-cover"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <div className="page-container w-full py-24">
                <div className="max-w-2xl space-y-6 text-white">
                  <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur">
                    <span className="size-1.5 rounded-full bg-primary" />
                    {slide.eyebrow}
                  </p>
                  <h1 className="font-heading text-4xl font-semibold leading-[1.08] tracking-tight !text-white sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>
                  <p className="max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{slide.copy}</p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link href="/studios" className={buttonVariants({ size: "lg" })}>
                      Explore Studios
                      <ArrowRight data-icon="inline-end" />
                    </Link>
                    <Link
                      href="/studios"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white dark:bg-white/10 dark:hover:bg-white/20",
                      )}
                    >
                      Host Your Space
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden sm:block">
        <div className="page-container flex justify-end gap-2">
          <button
            type="button"
            aria-label="Previous slide"
            className="hero-prev pointer-events-auto flex size-11 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur transition hover:bg-primary hover:text-primary-foreground"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            className="hero-next pointer-events-auto flex size-11 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur transition hover:bg-primary hover:text-primary-foreground"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
