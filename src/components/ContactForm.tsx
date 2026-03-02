"use client";

import { useState } from "react";
import type { EnquiryPayload } from "@/types";

export default function ContactForm() {
  const [form, setForm] = useState<EnquiryPayload>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className="contact" aria-label="Contact form" onSubmit={handleSubmit}>
      <h3>Enquire</h3>
      <label>
        Name
        <input
          type="text"
          name="name"
          placeholder="Your name"
          required
          value={form.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Email
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          required
          value={form.email}
          onChange={handleChange}
        />
      </label>
      <label>
        Message
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us about your event or garment…"
          required
          value={form.message}
          onChange={handleChange}
        />
      </label>
      <button type="submit" className="btn" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send Enquiry"}
      </button>
      {status === "success" && (
        <p className="form-success">
          Thank you! We&apos;ll be in touch soon.
        </p>
      )}
      {status === "error" && (
        <p className="form-error">
          Something went wrong. Please try again or email us directly.
        </p>
      )}
      <p className="disclaimer">
        By submitting, you agree to be contacted by Vickie&apos;s Atelier.
      </p>
    </form>
  );
}
