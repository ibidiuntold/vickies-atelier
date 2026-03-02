import Link from "next/link";
import Carousel from "./Carousel";
import type { Collection, ImageItem } from "@/types";

interface CollectionSectionProps {
  id: Collection;
  title: string;
  tagline: string;
  ctaLabel: string;
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
          <Link href={`/order?collection=${id}`} className="btn">
            {ctaLabel}
          </Link>
        </div>
        <Carousel images={images} />
      </div>
    </div>
  );
}
