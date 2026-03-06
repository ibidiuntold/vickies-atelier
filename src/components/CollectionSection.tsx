import Link from "next/link";
import Carousel from "./Carousel";
import type { Collection, ImageItem } from "@/types";

interface CollectionSectionProps {
  id: Collection;
  title: string;
  tagline: string;
  ctaLabel?: string; // Optional - no longer used, kept for backward compatibility
  images: ImageItem[];
}

export default function CollectionSection({
  id,
  title,
  tagline,
  ctaLabel,
  images,
}: CollectionSectionProps) {
  return (
    <div id={id} className="collection-section">
      <div className="container">
        <div className="collection-header">
          <div>
            <h3>{title}</h3>
            <p>{tagline}</p>
          </div>
          <div className="collection-actions">
            <Link href={`/consultation?collection=${id}`} className="btn">
              Book Consultation
            </Link>
            <Link href={`/order?collection=${id}`} className="btn">
              Order Now
            </Link>
          </div>
        </div>
        <Carousel images={images} />
      </div>
    </div>
  );
}
