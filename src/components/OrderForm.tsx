"use client";

import { useState } from "react";
import Link from "next/link";
import type { Collection, OrderPayload } from "@/types";
import { PhotoUpload } from "./PhotoUpload";
import { MeasurementDiagrams } from "./MeasurementDiagrams";

interface OrderFormProps {
  initialCollection?: Collection;
}

const COLLECTIONS: { id: Collection; label: string; desc: string }[] = [
  { id: "bespoke", label: "Bespoke",       desc: "One-of-one pieces tailored to your form and fantasy" },
  { id: "bridal",  label: "Bridal",        desc: "Romance reimagined — from classic silhouettes to statement gowns" },
  { id: "rtw",     label: "Ready-to-Wear", desc: "Polished, versatile pieces for effortless elegance" },
];

const MEASUREMENT_FIELDS: { key: keyof Pick<OrderPayload, "bust"|"waist"|"hips"|"height"|"shoulder"|"sleeve"|"inseam">; label: string }[] = [
  { key: "bust",     label: "Bust" },
  { key: "waist",    label: "Waist" },
  { key: "hips",     label: "Hips" },
  { key: "height",   label: "Height" },
  { key: "shoulder", label: "Shoulder Width" },
  { key: "sleeve",   label: "Sleeve Length" },
  { key: "inseam",   label: "Inseam" },
];

const emptyForm: OrderPayload = { collection: "bespoke", bust: "", waist: "", hips: "", height: "", shoulder: "", sleeve: "", inseam: "", notes: "", name: "", email: "" };

const inputCls = (err?: string) =>
  `w-full mt-1 px-4 py-2 rounded-[10px] bg-[var(--bg)] border text-[var(--text)] text-sm placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-colors duration-150 ${err ? "border-red-500" : "border-[var(--border)]"}`;

const btnPrimary = "inline-flex items-center justify-center px-6 py-3 rounded-[18px] bg-[var(--brand)] text-[#111] font-medium hover:bg-[var(--brand-hover)] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-all duration-200";
const btnGhost   = "inline-flex items-center justify-center px-6 py-3 rounded-[18px] border border-[var(--brand)] text-[var(--brand)] font-medium hover:bg-[var(--brand)] hover:text-[#111] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-all duration-200";

export default function OrderForm({ initialCollection }: OrderFormProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<OrderPayload>({ ...emptyForm, collection: initialCollection ?? "bespoke" });
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [readyDate, setReadyDate] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [errs, setErrs] = useState<Record<string, string>>({});

  const set = (field: keyof OrderPayload, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errs[field]) setErrs((p) => { const n = { ...p }; delete n[field]; return n; });
  };

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  const validateMeasurements = () => {
    const e: Record<string, string> = {};
    MEASUREMENT_FIELDS.forEach(({ key, label }) => { if (!form[key]?.trim()) e[key] = `${label} is required`; });
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const validateContact = () => {
    const e: Record<string, string> = {};
    if (!form.name?.trim()) e.name = "Name is required";
    else if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!form.email?.trim()) e.email = "Email is required";
    else if (!validateEmail(form.email)) e.email = "Please enter a valid email address";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const allMeasurementsFilled = MEASUREMENT_FIELDS.every(({ key }) => form[key]?.trim());
  const allContactFilled = form.name.trim() !== "" && form.email.trim() !== "";

  const handleSubmit = async () => {
    if (!validateContact()) return;
    setStatus("loading");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      photos.forEach((p, i) => fd.append(`photo_${i}`, p));
      fd.append("photoCount", photos.length.toString());
      const res = await fetch("/api/order", { method: "POST", body: fd });
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
      <div className="bg-[var(--bg-secondary)] rounded-[18px] border border-[var(--border)] p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600" aria-hidden="true">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[var(--text)] mb-3">Order Received</h2>
        <p className="text-[var(--muted)] mb-2">Thank you, <strong className="text-[var(--text)]">{form.name}</strong>. Your {COLLECTIONS.find((c) => c.id === form.collection)?.label} order has been confirmed.</p>
        <p className="text-[var(--brand)] font-medium mb-2">Estimated ready date: {readyDate}</p>
        <p className="text-[var(--muted)] mb-6">A confirmation has been sent to <strong className="text-[var(--text)]">{form.email}</strong>. We will be in touch to schedule your fitting.</p>
        <Link href="/" className={btnPrimary}>Back to Home</Link>
      </div>
    );
  }

  return (
    <>
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-0 mb-8">
        {[1, 2, 3].map((n, i) => (
          <div key={n} className="flex items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-200 ${step === n ? "bg-[var(--brand)] border-[var(--brand)] text-[#111]" : step > n ? "bg-[var(--brand)] border-[var(--brand)] text-[#111]" : "bg-[var(--bg)] border-[var(--border)] text-[var(--muted)]"}`}>
              {step > n ? "✓" : n}
            </div>
            {i < 2 && <div className={`w-16 h-0.5 ${step > n ? "bg-[var(--brand)]" : "bg-[var(--border)]"}`} />}
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg-secondary)] rounded-[18px] border border-[var(--border)] p-8">

        {/* Step 1 */}
        {step === 1 && (
          <>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[var(--text)] mb-2">Choose Your Collection</h2>
            <p className="text-[var(--muted)] mb-6">Select the type of garment you&apos;d like us to create for you.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {COLLECTIONS.map((col) => (
                <div
                  key={col.id}
                  onClick={() => set("collection", col.id)}
                  onKeyDown={(e) => e.key === "Enter" && set("collection", col.id)}
                  role="button" tabIndex={0}
                  className={`p-5 rounded-[14px] border-2 cursor-pointer transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] ${form.collection === col.id ? "border-[var(--brand)] bg-[var(--brand-subtle)]" : "border-[var(--border)] hover:border-[var(--brand)]"}`}
                >
                  <h4 className="font-semibold text-[var(--text)] mb-1">{col.label}</h4>
                  <p className="text-sm text-[var(--muted)]">{col.desc}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button className={btnPrimary} onClick={() => setStep(2)}>Continue →</button>
            </div>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[var(--text)] mb-2">Your Measurements</h2>
            <p className="text-[var(--muted)] mb-6">All measurements in centimetres (cm). Take them over fitted undergarments for best accuracy.</p>
            <MeasurementDiagrams measurements={["bust","waist","hips","height","shoulder","sleeve","inseam"]} tutorialUrl="https://www.youtube.com/watch?v=your-tutorial-video" />
            <PhotoUpload maxFiles={5} maxSizeMB={10} onFilesChange={setPhotos} acceptedFormats={["image/jpeg","image/png","image/heic","image/webp"]} />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {MEASUREMENT_FIELDS.map(({ key, label }) => (
                <div key={key} className="flex flex-col">
                  <label htmlFor={key} className="text-sm font-medium text-[var(--text)] mb-1">
                    {label} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input id={key} type="text" placeholder="e.g. 90" value={form[key]}
                      onChange={(e) => set(key, e.target.value)}
                      className={inputCls(errs[key])}
                      aria-invalid={!!errs[key]}
                      aria-describedby={errs[key] ? `${key}-error` : undefined} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]">cm</span>
                  </div>
                  {errs[key] && <span id={`${key}-error`} className="text-red-500 text-xs mt-1" role="alert">{errs[key]}</span>}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label htmlFor="notes" className="text-sm font-medium text-[var(--text)] mb-1 block">Special Notes / Requests</label>
              <textarea id="notes" rows={3} placeholder="Fabric preferences, style references, event date…"
                value={form.notes} onChange={(e) => set("notes", e.target.value)}
                className={inputCls()} />
            </div>
            <div className="flex justify-between mt-6">
              <button className={btnGhost} onClick={() => setStep(1)}>← Back</button>
              <button className={btnPrimary} disabled={!allMeasurementsFilled}
                onClick={() => { if (validateMeasurements()) setStep(3); }}
                title={!allMeasurementsFilled ? "Please fill in all required measurement fields" : ""}>
                Continue →
              </button>
            </div>
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[var(--text)] mb-2">Your Contact Details</h2>
            <p className="text-[var(--muted)] mb-6">We&apos;ll send your order confirmation and estimated ready date to this email.</p>
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-[var(--text)] mb-1 block">Full Name <span className="text-red-500">*</span></label>
                <input id="name" type="text" placeholder="Your full name" required value={form.name}
                  onChange={(e) => set("name", e.target.value)} className={inputCls(errs.name)}
                  aria-invalid={!!errs.name} aria-describedby={errs.name ? "name-error" : undefined} />
                {errs.name && <span id="name-error" className="text-red-500 text-xs mt-1" role="alert">{errs.name}</span>}
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium text-[var(--text)] mb-1 block">Email Address <span className="text-red-500">*</span></label>
                <input id="email" type="email" placeholder="you@example.com" required value={form.email}
                  onChange={(e) => set("email", e.target.value)} className={inputCls(errs.email)}
                  aria-invalid={!!errs.email} aria-describedby={errs.email ? "email-error" : undefined} />
                {errs.email && <span id="email-error" className="text-red-500 text-xs mt-1" role="alert">{errs.email}</span>}
              </div>
            </div>
            {status === "error" && (
              <p className="text-red-500 text-sm mb-4" role="alert">Something went wrong. Please try again or contact us directly.</p>
            )}
            <div className="flex justify-between">
              <button className={btnGhost} onClick={() => setStep(2)} disabled={status === "loading"}>← Back</button>
              <button className={btnPrimary} onClick={handleSubmit}
                disabled={status === "loading" || !allContactFilled}
                title={!allContactFilled ? "Please fill in all required fields" : ""}>
                {status === "loading" ? "Submitting…" : "Place Order"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
