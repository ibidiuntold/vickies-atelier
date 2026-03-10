import Link from "next/link";
import Image from "next/image";
import { getOptimizedImageProps, getOptimizedUnsplashUrl } from "@/lib/image-utils";

export default function Hero() {
  return (
    <section className="hero" role="banner" aria-label="Showcase">
      <div className="hero-media" aria-hidden="true">
        <Image
          src={getOptimizedUnsplashUrl("photo-1490481651871-ab68de25d43d", 1200)}
          alt=""
          fill
          priority
          quality={60}
          sizes="100vw"
          {...getOptimizedImageProps(1200, 800)}
        />
      </div>
      <div className="container hero-content">
        <h1 className="headline">Vickie&apos;s Atelier</h1>
        <p className="punch">
          <span>bespoke.</span> <span>bridal.</span> <span>ready-to-wear.</span>
        </p>
        <p className="subhead">
          A modern fashion house crafting elegance for every moment—made to
          measure, made to mesmerize.
        </p>
        <div className="hero-cta">
          <Link href="/#collections" className="btn">
            Explore Collections
          </Link>
          <Link href="/#contact" className="btn btn--ghost">
            Book a Fitting
          </Link>
        </div>
      </div>
    </section>
  );
}
