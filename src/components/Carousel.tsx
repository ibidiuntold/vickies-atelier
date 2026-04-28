"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { ImageItem } from "@/types";
import { ArrowLeftIcon, ArrowRightIcon } from "./Icons";

interface CarouselProps {
  images: ImageItem[];
}

export default function Carousel({ images }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  // null = not yet measured (server render + first paint).
  // Buttons are hidden until after mount so server and client render identical HTML.
  const [atStart, setAtStart] = useState<boolean | null>(null);
  const [atEnd, setAtEnd] = useState<boolean | null>(null);

  const updateButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateButtons();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtons, { passive: true });
    return () => el.removeEventListener("scroll", updateButtons);
  }, [updateButtons, images]);

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const slideWidth = (el.querySelector("div") as HTMLElement)?.offsetWidth ?? 300;
    el.scrollBy({ left: dir === "right" ? slideWidth + 16 : -(slideWidth + 16), behavior: "smooth" });
  };

  const navBtnBase =
    "absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border flex items-center justify-center shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]";

  const navBtnActive =
    "bg-[var(--bg)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg-tertiary)] hover:border-[var(--brand)] hover:text-[var(--brand)] cursor-pointer";

  const navBtnDisabled =
    "bg-[var(--bg)] border-[var(--border)] text-[var(--muted)] opacity-30 cursor-not-allowed pointer-events-none";

  // Before mount: buttons are not rendered at all — server and client agree on null state.
  // After mount: buttons appear with correct measured state.
  const mounted = atStart !== null;

  return (
    <div className="relative px-6">
      {/* Left button — only rendered after mount */}
      {mounted && (
        <button
          onClick={() => scroll("left")}
          disabled={atStart === true}
          aria-label="Scroll left"
          aria-disabled={atStart === true}
          className={`${navBtnBase} -left-2 ${atStart ? navBtnDisabled : navBtnActive}`}
        >
          <ArrowLeftIcon size={18} />
        </button>
      )}

      {/* Track */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
        style={{ scrollbarWidth: "none" }}
      >
        {images.map((img) => (
          <div
            key={img.src}
            className="relative shrink-0 snap-start rounded-[18px] overflow-hidden"
            style={{ width: 300, height: 400 }}
          >
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

      {/* Right button — only rendered after mount */}
      {mounted && (
        <button
          onClick={() => scroll("right")}
          disabled={atEnd === true}
          aria-label="Scroll right"
          aria-disabled={atEnd === true}
          className={`${navBtnBase} -right-2 ${atEnd ? navBtnDisabled : navBtnActive}`}
        >
          <ArrowRightIcon size={18} />
        </button>
      )}
    </div>
  );
}
