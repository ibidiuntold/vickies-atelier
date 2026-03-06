"use client";

import { useState } from "react";
import type { EnquiryPayload } from "@/types";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactForm() {
  const [form, setForm] = useState<EnquiryPayload>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<FormErrors>({});

  /**
   * Validates email format
   * Requirements: 17.2
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  /**
   * Validates the entire form
   * Requirements: 17.8, 17.9, 17.10
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Validate email
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate message
    if (!form.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (form.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    // Requirements: 17.9
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    // Requirements: 17.10
    if (!validateForm()) {
      return;
    }

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
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className="contact" aria-label="Contact form" onSubmit={handleSubmit}>
      <h3>Enquire</h3>
      <label htmlFor="contact-name">
        Name
        <input
          id="contact-name"
          type="text"
          name="name"
          placeholder="Your name"
          required
          value={form.name}
          onChange={handleChange}
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
        />
        {errors.name && (
          <span id="contact-name-error" className="field-error" role="alert">
            {errors.name}
          </span>
        )}
      </label>
      <label htmlFor="contact-email">
        Email
        <input
          id="contact-email"
          type="email"
          name="email"
          placeholder="you@example.com"
          required
          value={form.email}
          onChange={handleChange}
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
        />
        {errors.email && (
          <span id="contact-email-error" className="field-error" role="alert">
            {errors.email}
          </span>
        )}
      </label>
      <label htmlFor="contact-message">
        Message
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          placeholder="Tell us about your event or garment…"
          required
          value={form.message}
          onChange={handleChange}
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
        />
        {errors.message && (
          <span id="contact-message-error" className="field-error" role="alert">
            {errors.message}
          </span>
        )}
      </label>
      <button 
        type="submit" 
        className="btn" 
        disabled={status === "loading" || Object.keys(errors).length > 0}
      >
        {status === "loading" ? "Sending…" : "Send Enquiry"}
      </button>
      {status === "success" && (
        <p className="form-success" role="status" aria-live="polite">
          Thank you! We&apos;ll be in touch soon.
        </p>
      )}
      {status === "error" && (
        <p className="form-error" role="alert" aria-live="assertive">
          Something went wrong. Please try again or email us directly.
        </p>
      )}
      <p className="disclaimer">
        By submitting, you agree to be contacted by Vickie&apos;s Atelier.
      </p>
    </form>
  );
}
