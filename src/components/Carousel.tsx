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
    const slideWidth = trackRef.current.querySelector("img")?.clientWidth ?? 380;
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
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            width={380}
            height={507}
            className="rounded-[18px] object-cover snap-start shrink-0"
            loading="lazy"
            sizes="(max-width: 860px) 90vw, 380px"
            quality={75}
          />
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
