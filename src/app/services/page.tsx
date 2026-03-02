import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services — Vickie's Atelier",
  description:
    "Discover the Vickie's Atelier process — from your first consultation to the moment your garment is placed in your hands.",
};

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Consultation",
    description:
      "Every great garment begins with a conversation. We sit with you to understand your vision, occasion, aesthetic, and lifestyle. Whether you arrive with a mood board or a blank canvas, we listen carefully and translate your ideas into a clear creative direction. Fabric swatches, silhouette references, and embellishment options are explored together.",
  },
  {
    number: "02",
    title: "Measurement & Pattern",
    description:
      "Precision is the foundation of a perfect fit. We take a comprehensive set of measurements — bust, waist, hips, height, shoulder width, sleeve length, and more — and use them to draft a custom pattern built exclusively for your body. No standard sizing. No compromises. Every curve and contour is accounted for.",
  },
  {
    number: "03",
    title: "Fabric Sourcing",
    description:
      "We believe the right fabric is half the garment. Working from our curated network of premium textile suppliers, we source ethically produced fabrics that honour both your design and the craft. From duchess satin and hand-beaded lace to structured crepe and fluid chiffon — every material is chosen with intention.",
  },
  {
    number: "04",
    title: "Construction & Fittings",
    description:
      "Your garment is built by hand in our Lagos atelier. Couture techniques — French seams, hand-stitched hems, boning, and custom linings — are applied throughout. We schedule one to two fitting sessions during construction so adjustments are made on your body, not on a dress form. The result is a garment that moves with you.",
  },
  {
    number: "05",
    title: "Final Delivery",
    description:
      "Your finished piece is hand-pressed, inspected, and presented to you in our signature packaging. We walk you through care instructions and styling notes. If any final tweaks are needed after your first wear, we are here. Our relationship with you does not end at delivery — it begins there.",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="services-hero">
        <div className="container">
          <p
            style={{
              color: "var(--brand)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            The Atelier Process
          </p>
          <h1>From Vision to Garment</h1>
          <p>
            Every piece we create follows a deliberate, unhurried process.
            Here is what to expect when you work with Vickie&apos;s Atelier.
          </p>
        </div>
      </section>

      {/* Process steps */}
      <section className="section">
        <div className="container">
          <div className="process-grid">
            {PROCESS_STEPS.map((step) => (
              <div className="process-card" key={step.number}>
                <div className="process-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to expect strip */}
      <section className="section section--alt">
        <div className="container split">
          <div className="split-body">
            <h2>What to Expect</h2>
            <p style={{ color: "var(--muted)", marginBottom: 16 }}>
              Working with us is a collaborative, personal experience. We keep
              you informed at every stage and are always available to answer
              questions.
            </p>
            <ul className="ticks">
              <li>Dedicated stylist for your entire journey</li>
              <li>Transparent turnaround timelines</li>
              <li>1–2 in-person fitting sessions</li>
              <li>Email confirmation with your estimated ready date</li>
              <li>Post-delivery care and alteration support</li>
            </ul>
            <Link href="/order" className="btn" style={{ marginTop: 8 }}>
              Place an Order
            </Link>
          </div>
          <div className="split-media">
            <img
              src="https://images.unsplash.com/photo-1520975693416-35a1b0231d7e?q=80&w=1200&auto=format&fit=crop"
              alt="Atelier craftsmanship"
              style={{ borderRadius: "var(--radius)" }}
            />
          </div>
        </div>
      </section>

      {/* Turnaround times */}
      <section className="section">
        <div className="container">
          <header className="section-head">
            <h2>Turnaround Times</h2>
            <p>
              Standard lead times from order placement to delivery. Rush orders
              may be accommodated — contact us to discuss.
            </p>
          </header>
          <div className="cards" style={{ marginTop: 8 }}>
            {[
              {
                label: "Bespoke",
                time: "From 1 week",
                note: "Custom pattern, multiple fittings, couture finish",
              },
              {
                label: "Bridal",
                time: "From 1 week",
                note: "Gown construction, beading, and bridal fittings",
              },
              {
                label: "Ready-to-Wear",
                time: "From 1 week",
                note: "Pre-designed silhouettes made to your measurements",
              },
            ].map((item) => (
              <div className="card" key={item.label}>
                <div className="card-body">
                  <h3>{item.label}</h3>
                  <p
                    style={{
                      color: "var(--brand)",
                      fontWeight: 700,
                      fontSize: 20,
                      margin: "4px 0 8px",
                    }}
                  >
                    {item.time}
                  </p>
                  <p>{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="services-cta">
        <div className="container">
          <h2>Ready to Begin?</h2>
          <p>
            Place your order online and we will reach out to schedule your
            consultation.
          </p>
          <Link href="/order" className="btn">
            Place an Order
          </Link>
          <span style={{ margin: "0 12px", color: "var(--muted)" }}>or</span>
          <Link href="/#contact" className="btn btn--ghost">
            Send an Enquiry
          </Link>
        </div>
      </section>
    </>
  );
}
