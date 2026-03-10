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
  const [photos, setPhotos] = useState<File[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const set = (field: keyof OrderPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * Validates email format
   * Requirements: 17.2
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  // Validate measurement fields
  const validateMeasurements = (): boolean => {
    const errors: Record<string, string> = {};
    
    MEASUREMENT_FIELDS.forEach(({ key, label }) => {
      if (!form[key] || form[key].trim() === "") {
        errors[key] = `${label} is required`;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate contact fields
  const validateContact = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!form.name || form.name.trim() === "") {
      errors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!form.email || form.email.trim() === "") {
      errors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      errors.email = "Please enter a valid email address";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Check if all measurements are filled
  const allMeasurementsFilled = MEASUREMENT_FIELDS.every(
    ({ key }) => form[key] && form[key].trim() !== ""
  );

  // Check if contact fields are filled
  const allContactFieldsFilled = form.name.trim() !== "" && form.email.trim() !== "";

  const handleSubmit = async () => {
    // Validate contact fields before submission
    if (!validateContact()) {
      return;
    }

    setStatus("loading");
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();
      
      // Add all form fields
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Add photos
      photos.forEach((photo, index) => {
        formData.append(`photo_${index}`, photo);
      });
      formData.append('photoCount', photos.length.toString());

      const res = await fetch("/api/order", {
        method: "POST",
        body: formData,
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

            {/* Measurement Diagrams */}
            <MeasurementDiagrams
              measurements={['bust', 'waist', 'hips', 'height', 'shoulder', 'sleeve', 'inseam']}
              tutorialUrl="https://www.youtube.com/watch?v=your-tutorial-video"
            />

            {/* Photo Upload */}
            <PhotoUpload
              maxFiles={5}
              maxSizeMB={10}
              onFilesChange={setPhotos}
              acceptedFormats={['image/jpeg', 'image/png', 'image/heic', 'image/webp']}
            />

            <div className="measurement-grid">
              {MEASUREMENT_FIELDS.map(({ key, label }) => (
                <div className="form-field" key={key}>
                  <label htmlFor={key}>
                    {label} <span className="required-indicator">*</span>
                  </label>
                  <input
                    id={key}
                    type="text"
                    placeholder="e.g. 90"
                    value={form[key]}
                    onChange={(e) => set(key, e.target.value)}
                    className={validationErrors[key] ? 'error' : ''}
                    aria-invalid={!!validationErrors[key]}
                    aria-describedby={validationErrors[key] ? `${key}-error` : undefined}
                  />
                  <span className="unit-hint">cm</span>
                  {validationErrors[key] && (
                    <span id={`${key}-error`} className="field-error" role="alert">
                      {validationErrors[key]}
                    </span>
                  )}
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
              <button 
                className="btn" 
                onClick={() => {
                  if (validateMeasurements()) {
                    setStep(3);
                  }
                }}
                disabled={!allMeasurementsFilled}
                title={!allMeasurementsFilled ? "Please fill in all required measurement fields" : ""}
              >
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
              <label htmlFor="name">
                Full Name <span className="required-indicator">*</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your full name"
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className={validationErrors.name ? 'error' : ''}
                aria-invalid={!!validationErrors.name}
                aria-describedby={validationErrors.name ? 'name-error' : undefined}
              />
              {validationErrors.name && (
                <span id="name-error" className="field-error" role="alert">
                  {validationErrors.name}
                </span>
              )}
            </div>
            <div className="form-field">
              <label htmlFor="email">
                Email Address <span className="required-indicator">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className={validationErrors.email ? 'error' : ''}
                aria-invalid={!!validationErrors.email}
                aria-describedby={validationErrors.email ? 'email-error' : undefined}
              />
              {validationErrors.email && (
                <span id="email-error" className="field-error" role="alert">
                  {validationErrors.email}
                </span>
              )}
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
                  status === "loading" || !allContactFieldsFilled
                }
                title={!allContactFieldsFilled ? "Please fill in all required fields" : ""}
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
