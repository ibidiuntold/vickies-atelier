"use client";

import { useState } from "react";
import type { EnquiryPayload } from "@/types";
import Button from "./Button";
import { useToast } from "./toast";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const inputClass = (error?: string) =>
  `w-full mt-1 px-4 py-2 rounded-[10px] bg-[var(--bg)] border text-[var(--text)] text-sm placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-colors duration-150 ${
    error ? "border-red-500" : "border-[var(--border)]"
  }`;

export default function ContactForm() {
  const { toast } = useToast();
  const [form, setForm] = useState<EnquiryPayload>({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<FormErrors>({});

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const validateForm = () => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Name is required";
    else if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!validateEmail(form.email)) e.email = "Please enter a valid email address";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      setErrors({});
      toast({ type: "success", title: "Message sent!", message: "We'll be in touch soon." });
    } catch {
      setStatus("error");
      toast({ type: "error", title: "Something went wrong", message: "Please try again or email us directly." });
    }
  };

  const isFormValid = form.name.trim() !== "" && form.email.trim() !== "" && form.message.trim() !== "";

  return (
    <form className="flex flex-col gap-4" aria-label="Contact form" onSubmit={handleSubmit}>
      <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--text)]">Enquire</h3>

      {/* Name */}
      <label className="flex flex-col text-sm font-medium text-[var(--text)]" htmlFor="contact-name">
        Name <span className="text-red-500 ml-0.5">*</span>
        <input id="contact-name" type="text" name="name" placeholder="Your name" required
          value={form.name} onChange={handleChange} className={inputClass(errors.name)}
          aria-required="true" aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "contact-name-error" : undefined} />
        {errors.name && <span id="contact-name-error" className="text-red-500 text-xs mt-1" role="alert">{errors.name}</span>}
      </label>

      {/* Email */}
      <label className="flex flex-col text-sm font-medium text-[var(--text)]" htmlFor="contact-email">
        Email <span className="text-red-500 ml-0.5">*</span>
        <input id="contact-email" type="email" name="email" placeholder="you@example.com" required
          value={form.email} onChange={handleChange} className={inputClass(errors.email)}
          aria-required="true" aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "contact-email-error" : undefined} />
        {errors.email && <span id="contact-email-error" className="text-red-500 text-xs mt-1" role="alert">{errors.email}</span>}
      </label>

      {/* Message */}
      <label className="flex flex-col text-sm font-medium text-[var(--text)]" htmlFor="contact-message">
        Message <span className="text-red-500 ml-0.5">*</span>
        <textarea id="contact-message" name="message" rows={4} placeholder="Tell us about your event or garment…" required
          value={form.message} onChange={handleChange} className={inputClass(errors.message)}
          aria-required="true" aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined} />
        {errors.message && <span id="contact-message-error" className="text-red-500 text-xs mt-1" role="alert">{errors.message}</span>}
      </label>

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={status === "loading"}
        disabled={status === "loading" || !isFormValid}
        className="w-full"
      >
        Send Enquiry
      </Button>

      {status === "success" && (
        <p className="text-green-600 text-sm" role="status" aria-live="polite">
          Thank you! We&apos;ll be in touch soon.
        </p>
      )}
      {status === "error" && (
        <p className="text-red-500 text-sm" role="alert" aria-live="assertive">
          Something went wrong. Please try again or email us directly.
        </p>
      )}
      <p className="text-xs text-[var(--muted)]">
        By submitting, you agree to be contacted by Vickie&apos;s Atelier.
      </p>
    </form>
  );
}
