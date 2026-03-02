import type { Metadata } from "next";
import { Suspense } from "react";
import OrderPageClient from "./OrderPageClient";

export const metadata: Metadata = {
  title: "Place an Order — Vickie's Atelier",
  description:
    "Submit your measurements and place a bespoke, bridal, or ready-to-wear order with Vickie's Atelier.",
};

export default function OrderPage() {
  return (
    <div className="order-page">
      <div className="container">
        <h1>Place an Order</h1>
        <p>
          Fill in your details below and we will confirm your order with an
          estimated ready date.
        </p>
        <Suspense fallback={<div style={{ textAlign: "center", color: "var(--muted)" }}>Loading…</div>}>
          <OrderPageClient />
        </Suspense>
      </div>
    </div>
  );
}
