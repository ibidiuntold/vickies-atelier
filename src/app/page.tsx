import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import CollectionSection from "@/components/CollectionSection";
import { getOptimizedImageProps, getOptimizedUnsplashUrl } from "@/lib/image-utils";
import type { ImageItem } from "@/types";

const bespokeImages: ImageItem[] = [
  { src: "/images/bespoke/bespoke-1.jpeg", alt: "Bespoke look 1" },
  { src: "/images/bespoke/bespoke-2.jpeg", alt: "Bespoke look 2" },
  { src: "/images/bespoke/bespoke-3.jpeg", alt: "Bespoke look 3" },
  { src: "/images/bespoke/bespoke-4.jpeg", alt: "Bespoke look 4" },
  { src: "/images/bespoke/bespoke-5.jpeg", alt: "Bespoke look 5" },
  { src: "/images/bespoke/bespoke-6.jpeg", alt: "Bespoke look 6" },
];
const bridalImages: ImageItem[] = [
  { src: "/images/bridal/1000014328.jpg.jpeg", alt: "Bridal look 1" },
  { src: "/images/bridal/1000014422.jpg.jpeg", alt: "Bridal look 2" },
  { src: "/images/bridal/1000014439.jpg.jpeg", alt: "Bridal look 3" },
  { src: "/images/bridal/1000014440.jpg.jpeg", alt: "Bridal look 4" },
  { src: "/images/bridal/1000014441.jpg.jpeg", alt: "Bridal look 5" },
  { src: "/images/bridal/1000014445.jpg.jpeg", alt: "Bridal look 6" },
];
const rtwImages: ImageItem[] = [
  { src: "/images/rtw/ready-1.jpeg", alt: "Ready-to-Wear look 1" },
  { src: "/images/rtw/ready-2.jpeg", alt: "Ready-to-Wear look 2" },
  { src: "/images/rtw/ready-3.jpeg", alt: "Ready-to-Wear look 3" },
  { src: "/images/rtw/ready-4.jpeg", alt: "Ready-to-Wear look 4" },
  { src: "/images/rtw/ready-5.jpeg", alt: "Ready-to-Wear look 5" },
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* Collections */}
      <section id="collections" className="py-20 bg-[var(--bg)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <header className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(28px,3vw,40px)] font-semibold text-[var(--text)] mb-3">Collections</h2>
            <p className="text-[var(--muted)] max-w-xl mx-auto">From custom couture to day-to-night silhouettes—discover your signature look.</p>
          </header>
        </div>
        <CollectionSection id="bespoke" title="Bespoke" tagline="One-of-one pieces tailored to your form and fantasy. Premium fabrics, couture finishing, flawless fit." images={bespokeImages} />
        <CollectionSection id="bridal" title="Bridal" tagline="Romance reimagined—from classic silhouettes to statement gowns designed to make your moment unforgettable." images={bridalImages} />
        <CollectionSection id="rtw" title="Ready-to-Wear" tagline="Polished, versatile pieces for effortless elegance—crafted to move with you from desk to dinner." images={rtwImages} />
      </section>

      {/* Our Story */}
      <section id="story" className="py-20 bg-[var(--bg-secondary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 shrink-0">
              <div className="relative w-full rounded-[18px] overflow-hidden" style={{ aspectRatio: '5/4', maxWidth: 500 }}>
                <Image
                  src={getOptimizedUnsplashUrl("photo-1558618666-fcd25c85cd64", 500, 400)}
                  alt="Tailor crafting a couture garment"
                  fill
                  loading="lazy"
                  quality={70}
                  sizes="(max-width: 860px) 100vw, 500px"
                  className="object-cover object-center"
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(28px,3vw,40px)] font-semibold text-[var(--text)] mb-4">Our Story</h2>
              <p className="text-[var(--muted)] mb-5">
                At Vickie&apos;s Atelier, we believe fashion is a language of confidence. Every stitch tells your story—precision cut, hand-finished, and designed to flatter.
              </p>
              <ul className="flex flex-col gap-2 mb-6">
                {["Custom pattern-making & fittings", "Ethically sourced premium textiles", "Artisanal craftsmanship & couture finishes"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[var(--text)] text-sm">
                    <span className="text-[var(--brand)]">✓</span> {item}
                  </li>
                ))}
              </ul>
              <Link href="/services" className="inline-flex items-center justify-center px-6 py-3 rounded-[18px] bg-[var(--brand)] text-[#111] font-medium hover:bg-[var(--brand-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-all duration-200">
                Our Process
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lookbook */}
      <section id="lookbook" className="py-20 bg-[var(--bg)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <header className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(28px,3vw,40px)] font-semibold text-[var(--text)] mb-3">Lookbook</h2>
            <p className="text-[var(--muted)]">Selected looks across bespoke, bridal, and ready-to-wear.</p>
          </header>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { id: "photo-1496747611176-843222e1e57c", alt: "Elegant evening dress" },
              { id: "photo-1519741497674-611481863552", alt: "Modern bridal silhouette" },
              { id: "photo-1509631179647-0177331693ae", alt: "Tailored suit details" },
              { id: "photo-1512436991641-6745cdb1723f", alt: "Chic ready-to-wear outfit" },
              { id: "photo-1515886657613-9f3515b0c78f", alt: "Flowing bridal fabric" },
              { id: "photo-1503342217505-b0a15cf70489", alt: "Draped couture detail" },
            ].map((img) => (
              <div key={img.id} className="relative rounded-[12px] overflow-hidden aspect-[3/4]">
                <Image
                  src={getOptimizedUnsplashUrl(img.id, 600, 800)}
                  alt={img.alt}
                  fill
                  loading="lazy"
                  quality={70}
                  sizes="(max-width: 860px) 50vw, 33vw"
                  className="object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Callout */}
      <section className="py-20 bg-[var(--brand-subtle)] border-y border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[var(--text)] mb-3">bespoke. bridal. ready-to-wear.</h3>
          <p className="text-[var(--muted)] mb-6">Three signatures. One Atelier. Your perfect fit awaits.</p>
          <Link href="/order" className="inline-flex items-center justify-center px-6 py-3 rounded-[18px] bg-[var(--brand)] text-[#111] font-medium hover:bg-[var(--brand-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-all duration-200">
            Book a Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
