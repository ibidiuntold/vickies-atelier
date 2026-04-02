import Link from "next/link";
import Image from "next/image";
import { getOptimizedImageProps, getOptimizedUnsplashUrl } from "@/lib/image-utils";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center" role="banner" aria-label="Showcase">
      {/* Background image */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src={getOptimizedUnsplashUrl("photo-1490481651871-ab68de25d43d", 1200)}
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          className="object-cover object-center"
          {...getOptimizedImageProps(1200, 800)}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-24">
        <h1 className="font-[family-name:var(--font-playfair)] text-[clamp(40px,7vw,76px)] font-bold leading-tight text-white mb-4">
          Vickie&apos;s Atelier
        </h1>
        <p className="text-lg tracking-[0.2em] uppercase text-white/80 mb-4 font-light">
          <span>bespoke.</span>{" "}<span>bridal.</span>{" "}<span>ready-to-wear.</span>
        </p>
        <p className="text-lg text-white/70 max-w-[600px] mb-8">
          A modern fashion house crafting elegance for every moment—made to
          measure, made to mesmerize.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/#collections"
            className="inline-flex items-center justify-center px-6 py-3 rounded-[18px] bg-[var(--brand)] text-[#111] font-medium hover:bg-[var(--brand-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-all duration-200"
          >
            Explore Collections
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-[18px] border border-white text-white font-medium hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
          >
            Book a Fitting
          </Link>
        </div>
      </div>
    </section>
  );
}
