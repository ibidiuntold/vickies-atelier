"use client";

import { useRef } from "react";
import Image from "next/image";
import type { ImageItem } from "@/types";

interface CarouselProps {
  images: ImageItem[];
}

export default function Carousel({ images }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!trackRef.current) return;
    const slideWidth = (trackRef.current.querySelector("div") as HTMLElement)?.offsetWidth ?? 300;
    trackRef.current.scrollBy({
      left: dir === "right" ? slideWidth + 16 : -(slideWidth + 16),
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Left button */}
      <button
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-4 w-10 h-10 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] flex items-center justify-center shadow-md hover:bg-[var(--bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-colors duration-150"
      >
        &#8592;
      </button>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {images.map((img) => (
          <div key={img.src} className="relative shrink-0 snap-start rounded-[18px] overflow-hidden" style={{ width: 300, height: 400 }}>
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover object-top"
              loading="lazy"
              sizes="300px"
              quality={75}
            />
          </div>
        ))}
      </div>

      {/* Right button */}
      <button
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-4 w-10 h-10 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] flex items-center justify-center shadow-md hover:bg-[var(--bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-colors duration-150"
      >
        &#8594;
      </button>
    </div>
  );
}
