"use client";

import { useState } from "react";
import { FreeMode, Navigation, Pagination, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import { StudioImage } from "@/components/shared/studio-image";
import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

export function GalleryCarousel({ images, title }: { images: string[]; title: string }) {
  const [thumbs, setThumbs] = useState<SwiperType | null>(null);
  const many = images.length > 1;

  return (
    <div className="space-y-3">
      <Swiper
        modules={[FreeMode, Navigation, Pagination, Thumbs]}
        navigation={many}
        pagination={many ? { clickable: true } : false}
        thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }}
        spaceBetween={12}
        className="gallery-swiper aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-muted"
      >
        {images.map((src, index) => (
          <SwiperSlide key={`${src}-${index}`}>
            <StudioImage
              src={src}
              alt={`${title}, photo ${index + 1} of ${images.length}`}
              priority={index === 0}
              className="size-full"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {many ? (
        <Swiper
          onSwiper={setThumbs}
          modules={[FreeMode, Thumbs]}
          slidesPerView={Math.min(images.length, 5)}
          spaceBetween={10}
          freeMode
          watchSlidesProgress
          className="thumbs-swiper"
        >
          {images.map((src, index) => (
            <SwiperSlide key={`${src}-thumb-${index}`} className="cursor-pointer">
              <StudioImage
                src={src}
                alt=""
                className={cn("aspect-[4/3] w-full rounded-lg border border-border opacity-60 transition-opacity")}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : null}
    </div>
  );
}
