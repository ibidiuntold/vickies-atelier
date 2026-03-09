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
    const slideWidth =
      trackRef.current.querySelector("img")?.clientWidth ?? 380;
    trackRef.current.scrollBy({
      left: dir === "right" ? slideWidth + 16 : -(slideWidth + 16),
      behavior: "smooth",
    });
  };

  return (
    <div className="carousel">
      <button
        className="carousel-btn carousel-btn--left"
        onClick={() => scroll("left")}
        aria-label="Scroll left"
      >
        &#8592;
      </button>

      <div className="carousel-track" ref={trackRef}>
        {images.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            width={380}
            height={507}
            className="carousel-img"
            priority={false}
            loading="lazy"
            sizes="(max-width: 860px) 90vw, 380px"
            quality={75}
          />
        ))}
      </div>

      <button
        className="carousel-btn carousel-btn--right"
        onClick={() => scroll("right")}
        aria-label="Scroll right"
      >
        &#8594;
      </button>
    </div>
  );
}
