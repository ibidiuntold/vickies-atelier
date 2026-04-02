import type { Metadata } from "next";
import { Suspense } from "react";
import OrderPageClient from "./OrderPageClient";

export const metadata: Metadata = {
  title: "Place an Order — Vickie's Atelier",
  description: "Submit your measurements and place a bespoke, bridal, or ready-to-wear order with Vickie's Atelier.",
};

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] py-16">
      <div className="max-w-[800px] mx-auto px-6">
        <h1 className="font-[family-name:var(--font-playfair)] text-[clamp(28px,3vw,40px)] font-semibold text-[var(--text)] mb-2">Place an Order</h1>
        <p className="text-[var(--muted)] mb-10">Fill in your details below and we will confirm your order with an estimated ready date.</p>
        <Suspense fallback={<div className="text-center text-[var(--muted)]">Loading…</div>}>
          <OrderPageClient />
        </Suspense>
      </div>
    </div>
  );
}
