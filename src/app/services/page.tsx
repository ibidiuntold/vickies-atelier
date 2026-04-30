import type { Metadata } from "next";
import Image from "next/image";
import { getOptimizedUnsplashUrl } from "@/lib/image-utils";
import { CheckIcon } from "@/components/Icons";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Services — Vickie's Atelier",
  description: "Discover the Vickie's Atelier process — from your first consultation to the moment your garment is placed in your hands.",
};

const PROCESS_STEPS = [
  { number: "01", title: "Consultation", description: "Every great garment begins with a conversation. We sit with you to understand your vision, occasion, aesthetic, and lifestyle. Whether you arrive with a mood board or a blank canvas, we listen carefully and translate your ideas into a clear creative direction. Fabric swatches, silhouette references, and embellishment options are explored together." },
  { number: "02", title: "Measurement & Pattern", description: "Precision is the foundation of a perfect fit. We take a comprehensive set of measurements — bust, waist, hips, height, shoulder width, sleeve length, and more — and use them to draft a custom pattern built exclusively for your body. No standard sizing. No compromises. Every curve and contour is accounted for." },
  { number: "03", title: "Fabric Sourcing", description: "We believe the right fabric is half the garment. Working from our curated network of premium textile suppliers, we source ethically produced fabrics that honour both your design and the craft. From duchess satin and hand-beaded lace to structured crepe and fluid chiffon — every material is chosen with intention." },
  { number: "04", title: "Construction & Fittings", description: "Your garment is built by hand in our Lagos atelier. Couture techniques — French seams, hand-stitched hems, boning, and custom linings — are applied throughout. We schedule one to two fitting sessions during construction so adjustments are made on your body, not on a dress form. The result is a garment that moves with you." },
  { number: "05", title: "Final Delivery", description: "Your finished piece is hand-pressed, inspected, and presented to you in our signature packaging. We walk you through care instructions and styling notes. If any final tweaks are needed after your first wear, we are here. Our relationship with you does not end at delivery — it begins there." },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-[var(--bg-secondary)] border-b border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-[var(--brand)] text-xs font-semibold tracking-[0.15em] uppercase mb-3">The Atelier Process</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-[clamp(32px,5vw,56px)] font-bold text-[var(--text)] mb-4">From Vision to Garment</h1>
          <p className="text-[var(--muted)] text-lg max-w-xl">Every piece we create follows a deliberate, unhurried process. Here is what to expect when you work with Vickie&apos;s Atelier.</p>
        </div>
      </section>

      {/* Process steps */}
      <section className="py-20 bg-[var(--bg)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROCESS_STEPS.map((step) => (
              <div key={step.number} className="bg-[var(--bg-secondary)] rounded-[18px] p-8 border border-[var(--border)]">
                <div className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-[var(--brand)] opacity-40 mb-4">{step.number}</div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--text)] mb-3">{step.title}</h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(28px,3vw,40px)] font-semibold text-[var(--text)] mb-4">What to Expect</h2>
              <p className="text-[var(--muted)] mb-5">Working with us is a collaborative, personal experience. We keep you informed at every stage and are always available to answer questions.</p>
              <ul className="flex flex-col gap-2 mb-6">
                {["Dedicated stylist for your entire journey", "Transparent turnaround timelines", "1–2 in-person fitting sessions", "Email confirmation with your estimated ready date", "Post-delivery care and alteration support"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[var(--text)] text-sm">
                    <CheckIcon size={16} className="text-[var(--brand)] shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <Button variant="primary" size="md" href="/order">Place an Order</Button>
            </div>
            <div className="md:w-1/2 shrink-0">
              <div className="relative w-full rounded-[18px] overflow-hidden" style={{ aspectRatio: '5/4', maxWidth: 500 }}>
                <Image
                  src={getOptimizedUnsplashUrl("photo-1558618666-fcd25c85cd64", 500, 400)}
                  alt="Atelier craftsmanship"
                  fill
                  loading="lazy"
                  sizes="(max-width: 860px) 100vw, 500px"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Turnaround times */}
      <section className="py-20 bg-[var(--bg)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <header className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(28px,3vw,40px)] font-semibold text-[var(--text)] mb-3">Turnaround Times</h2>
            <p className="text-[var(--muted)] max-w-xl mx-auto">Standard lead times from order placement to delivery. Rush orders may be accommodated — contact us to discuss.</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Bespoke", time: "From 1 week", note: "Custom pattern, multiple fittings, couture finish" },
              { label: "Bridal", time: "From 1 week", note: "Gown construction, beading, and bridal fittings" },
              { label: "Ready-to-Wear", time: "From 1 week", note: "Pre-designed silhouettes made to your measurements" },
            ].map((item) => (
              <div key={item.label} className="bg-[var(--bg-secondary)] rounded-[18px] p-8 border border-[var(--border)]">
                <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--text)] mb-2">{item.label}</h3>
                <p className="text-[var(--brand)] font-bold text-xl mb-2">{item.time}</p>
                <p className="text-[var(--muted)] text-sm">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[var(--brand-subtle)] border-y border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[var(--text)] mb-3">Ready to Begin?</h2>
          <p className="text-[var(--muted)] mb-8">Place your order online and we will reach out to schedule your consultation.</p>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <Button variant="primary" size="md" href="/order">Place an Order</Button>
            <span className="text-[var(--muted)]">or</span>
            <Button variant="secondary" size="md" href="/#contact">Send an Enquiry</Button>
          </div>
        </div>
      </section>
    </>
  );
}
