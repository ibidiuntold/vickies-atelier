import Link from "next/link";
import Carousel from "./Carousel";
import type { Collection, ImageItem } from "@/types";

interface CollectionSectionProps {
  id: Collection;
  title: string;
  tagline: string;
  ctaLabel?: string;
  images: ImageItem[];
}

export default function CollectionSection({ id, title, tagline, images }: CollectionSectionProps) {
  return (
    <div id={id} className="py-10 border-b border-[var(--border)] last:border-0">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[var(--text)] mb-1">
              {title}
            </h3>
            <p className="text-[var(--muted)] text-sm max-w-md">{tagline}</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href={`/consultation?collection=${id}`}
              className="inline-flex items-center justify-center px-5 py-2 rounded-[18px] border border-[var(--brand)] text-[var(--brand)] text-sm font-medium hover:bg-[var(--brand)] hover:text-[#111] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-all duration-200"
            >
              Book Consultation
            </Link>
            <Link
              href={`/order?collection=${id}`}
              className="inline-flex items-center justify-center px-5 py-2 rounded-[18px] bg-[var(--brand)] text-[#111] text-sm font-medium hover:bg-[var(--brand-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-all duration-200"
            >
              Order Now
            </Link>
          </div>
        </div>
        <Carousel images={images} />
      </div>
    </div>
  );
}
