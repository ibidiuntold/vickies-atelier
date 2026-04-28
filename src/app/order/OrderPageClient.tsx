"use client";

import { useSearchParams } from "next/navigation";
import OrderForm from "@/components/OrderForm";
import type { Collection } from "@/types";

const VALID_COLLECTIONS: Collection[] = ["bespoke", "bridal", "rtw"];

export default function OrderPageClient() {
  const params = useSearchParams();
  const raw = params.get("collection");
  const initialCollection: Collection | undefined =
    raw && VALID_COLLECTIONS.includes(raw as Collection)
      ? (raw as Collection)
      : undefined;

  return <OrderForm initialCollection={initialCollection} />;
}
