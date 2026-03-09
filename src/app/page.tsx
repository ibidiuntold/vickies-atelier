import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import CollectionSection from "@/components/CollectionSection";
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
      <section id="collections" className="section">
        <div className="container">
          <header className="section-head">
            <h2>Collections</h2>
            <p>
              From custom couture to day-to-night silhouettes—discover your
              signature look.
            </p>
          </header>
        </div>

        <CollectionSection
          id="bespoke"
          title="Bespoke"
          tagline="One-of-one pieces tailored to your form and fantasy. Premium fabrics, couture finishing, flawless fit."
          ctaLabel="Start your custom order"
          images={bespokeImages}
        />

        <CollectionSection
          id="bridal"
          title="Bridal"
          tagline="Romance reimagined—from classic silhouettes to statement gowns designed to make your moment unforgettable."
          ctaLabel="Design your gown"
          images={bridalImages}
        />

        <CollectionSection
          id="rtw"
          title="Ready-to-Wear"
          tagline="Polished, versatile pieces for effortless elegance—crafted to move with you from desk to dinner."
          ctaLabel="Order your piece"
          images={rtwImages}
        />
      </section>

      {/* Our Story */}
      <section id="story" className="section section--alt">
        <div className="container split">
          <div className="split-media">
            <Image
              src="https://images.unsplash.com/photo-1520975693416-35a1b0231d7e?q=70&w=1200&auto=format&fit=crop"
              alt="Tailor crafting a couture garment"
              width={1200}
              height={800}
              loading="lazy"
              quality={70}
              sizes="(max-width: 860px) 100vw, 50vw"
            />
          </div>
          <div className="split-body">
            <h2>Our Story</h2>
            <p>
              At Vickie&apos;s Atelier, we believe fashion is a language of
              confidence. Every stitch tells your story—precision cut,
              hand-finished, and designed to flatter.
            </p>
            <ul className="ticks">
              <li>Custom pattern-making &amp; fittings</li>
              <li>Ethically sourced premium textiles</li>
              <li>Artisanal craftsmanship &amp; couture finishes</li>
            </ul>
            <Link href="/services" className="btn">
              Our Process
            </Link>
          </div>
        </div>
      </section>

      {/* Lookbook */}
      <section id="lookbook" className="section">
        <div className="container">
          <header className="section-head">
            <h2>Lookbook</h2>
            <p>Selected looks across bespoke, bridal, and ready-to-wear.</p>
          </header>

          <div className="masonry">
            <Image
              src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=70&w=800&auto=format&fit=crop"
              alt="Elegant evening dress"
              width={800}
              height={1067}
              loading="lazy"
              quality={70}
              sizes="(max-width: 860px) 100vw, 33vw"
            />
            <Image
              src="https://images.unsplash.com/photo-1519741497674-611481863552?q=70&w=800&auto=format&fit=crop"
              alt="Modern bridal silhouette"
              width={800}
              height={1067}
              loading="lazy"
              quality={70}
              sizes="(max-width: 860px) 100vw, 33vw"
            />
            <Image
              src="https://images.unsplash.com/photo-1520975962217-1c2a615d4f2d?q=70&w=800&auto=format&fit=crop"
              alt="Tailored suit details"
              width={800}
              height={1067}
              loading="lazy"
              quality={70}
              sizes="(max-width: 860px) 100vw, 33vw"
            />
            <Image
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=70&w=800&auto=format&fit=crop"
              alt="Chic ready-to-wear outfit"
              width={800}
              height={1067}
              loading="lazy"
              quality={70}
              sizes="(max-width: 860px) 100vw, 33vw"
            />
            <Image
              src="https://images.unsplash.com/photo-1520974735194-76a1b8fd9a5f?q=70&w=800&auto=format&fit=crop"
              alt="Flowing bridal fabric"
              width={800}
              height={1067}
              loading="lazy"
              quality={70}
              sizes="(max-width: 860px) 100vw, 33vw"
            />
            <Image
              src="https://images.unsplash.com/photo-1503342217505-b0a15cf70489?q=70&w=800&auto=format&fit=crop"
              alt="Draped couture detail"
              width={800}
              height={1067}
              loading="lazy"
              quality={70}
              sizes="(max-width: 860px) 100vw, 33vw"
            />
          </div>
        </div>
      </section>

      {/* Callout */}
      <section className="callout">
        <div className="container callout-inner">
          <h3>bespoke. bridal. ready-to-wear.</h3>
          <p>Three signatures. One Atelier. Your perfect fit awaits.</p>
          <Link href="/order" className="btn btn--light">
            Book a Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
