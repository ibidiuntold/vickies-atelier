"use client";

import { useState } from "react";
import Link from "next/link";
import type { Collection, OrderPayload } from "@/types";

interface OrderFormProps {
  initialCollection?: Collection;
}

const COLLECTIONS: { id: Collection; label: string; desc: string }[] = [
  {
    id: "bespoke",
    label: "Bespoke",
    desc: "One-of-one pieces tailored to your form and fantasy",
  },
  {
    id: "bridal",
    label: "Bridal",
    desc: "Romance reimagined — from classic silhouettes to statement gowns",
  },
  {
    id: "rtw",
    label: "Ready-to-Wear",
    desc: "Polished, versatile pieces for effortless elegance",
  },
];

const MEASUREMENT_FIELDS: {
  key: keyof Pick<
    OrderPayload,
    "bust" | "waist" | "hips" | "height" | "shoulder" | "sleeve" | "inseam"
  >;
  label: string;
}[] = [
  { key: "bust", label: "Bust" },
  { key: "waist", label: "Waist" },
  { key: "hips", label: "Hips" },
  { key: "height", label: "Height" },
  { key: "shoulder", label: "Shoulder Width" },
  { key: "sleeve", label: "Sleeve Length" },
  { key: "inseam", label: "Inseam" },
];

const emptyForm: OrderPayload = {
  collection: "bespoke",
  bust: "",
  waist: "",
  hips: "",
  height: "",
  shoulder: "",
  sleeve: "",
  inseam: "",
  notes: "",
  name: "",
  email: "",
};

export default function OrderForm({ initialCollection }: OrderFormProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<OrderPayload>({
    ...emptyForm,
    collection: initialCollection ?? "bespoke",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [readyDate, setReadyDate] = useState("");

  const set = (field: keyof OrderPayload, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setReadyDate(data.readyDate);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="order-form-box order-success">
        <h2>Order Received</h2>
        <p>
          Thank you, <strong>{form.name}</strong>. Your{" "}
          {COLLECTIONS.find((c) => c.id === form.collection)?.label} order has
          been confirmed.
        </p>
        <p className="ready-date">Estimated ready date: {readyDate}</p>
        <p>
          A confirmation has been sent to <strong>{form.email}</strong>. We
          will be in touch to schedule your fitting.
        </p>
        <div style={{ marginTop: 28 }}>
          <Link href="/" className="btn">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Step indicator */}
      <div className="order-steps">
        <div className="step-indicator">
          {[1, 2, 3].map((n, i) => (
            <div key={n} style={{ display: "flex", alignItems: "center" }}>
              <div
                className={`step-dot ${step === n ? "active" : step > n ? "done" : ""}`}
              >
                {step > n ? "✓" : n}
              </div>
              {i < 2 && (
                <div className={`step-line ${step > n ? "done" : ""}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="order-form-box">
        {/* ── Step 1: Collection ── */}
        {step === 1 && (
          <>
            <h2>Choose Your Collection</h2>
            <p>Select the type of garment you&apos;d like us to create for you.</p>
            <div className="collection-cards">
              {COLLECTIONS.map((col) => (
                <div
                  key={col.id}
                  className={`collection-card-option${form.collection === col.id ? " selected" : ""}`}
                  onClick={() => set("collection", col.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && set("collection", col.id)
                  }
                >
                  <h4>{col.label}</h4>
                  <p>{col.desc}</p>
                </div>
              ))}
            </div>
            <div className="form-actions">
              <button className="btn" onClick={() => setStep(2)}>
                Continue →
              </button>
            </div>
          </>
        )}

        {/* ── Step 2: Measurements ── */}
        {step === 2 && (
          <>
            <h2>Your Measurements</h2>
            <p>
              All measurements in centimetres (cm). Take them over fitted
              undergarments for best accuracy.
            </p>
            <div className="measurement-grid">
              {MEASUREMENT_FIELDS.map(({ key, label }) => (
                <div className="form-field" key={key}>
                  <label htmlFor={key}>{label}</label>
                  <input
                    id={key}
                    type="text"
                    placeholder="e.g. 90"
                    value={form[key]}
                    onChange={(e) => set(key, e.target.value)}
                  />
                  <span className="unit-hint">cm</span>
                </div>
              ))}
            </div>
            <div className="form-field" style={{ marginTop: 4 }}>
              <label htmlFor="notes">Special Notes / Requests</label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Fabric preferences, style references, event date…"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button
                className="btn btn--ghost"
                onClick={() => setStep(1)}
              >
                ← Back
              </button>
              <button className="btn" onClick={() => setStep(3)}>
                Continue →
              </button>
            </div>
          </>
        )}

        {/* ── Step 3: Contact ── */}
        {step === 3 && (
          <>
            <h2>Your Contact Details</h2>
            <p>
              We&apos;ll send your order confirmation and estimated ready date to
              this email.
            </p>
            <div className="form-field" style={{ marginBottom: 14 }}>
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your full name"
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
            {status === "error" && (
              <p className="form-error">
                Something went wrong. Please try again or contact us directly.
              </p>
            )}
            <div className="form-actions">
              <button
                className="btn btn--ghost"
                onClick={() => setStep(2)}
                disabled={status === "loading"}
              >
                ← Back
              </button>
              <button
                className="btn"
                onClick={handleSubmit}
                disabled={
                  status === "loading" || !form.name || !form.email
                }
              >
                {status === "loading" ? "Submitting…" : "Place Order"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
