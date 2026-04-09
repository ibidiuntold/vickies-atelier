import Image from 'next/image';
import Link from 'next/link';
import { getLogoAssets } from '@/lib/logo-config';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  clickable?: boolean;
  className?: string;
  priority?: boolean;
}

const SIZE_CONFIG = {
  small:  { maxWidth: 120, maxHeight: 60 },
  medium: { maxWidth: 160, maxHeight: 80 },
  large:  { maxWidth: 200, maxHeight: 100 },
};

export default function Logo({ size = 'medium', clickable = true, className = '', priority = false }: LogoProps) {
  const logoAssets = getLogoAssets('light');
  const { maxWidth, maxHeight } = SIZE_CONFIG[size];

  const img = (
    <picture>
      <source srcSet={logoAssets.webp} type="image/webp" />
      <Image
        src={logoAssets.fallback}
        alt={logoAssets.alt}
        width={logoAssets.width}
        height={logoAssets.height}
        priority={priority}
        className={`w-auto h-auto object-contain ${className}`}
        style={{ maxWidth, maxHeight }}
      />
    </picture>
  );

  if (clickable) {
    return (
      <Link href="/" aria-label="Return to homepage"
        className="inline-block leading-none hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:rounded transition-opacity duration-200">
        {img}
      </Link>
    );
  }

  return <div className="inline-block leading-none">{img}</div>;
}
