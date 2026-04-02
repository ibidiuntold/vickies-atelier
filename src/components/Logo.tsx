'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import { getLogoAssets } from '@/lib/logo-config';

interface LogoProps {
  theme?: 'light' | 'dark';
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

export default function Logo({ theme: themeProp, size = 'medium', clickable = true, className = '', priority = false }: LogoProps) {
  const { resolvedTheme, mounted } = useTheme();
  const activeTheme: 'light' | 'dark' = themeProp ?? (mounted ? resolvedTheme : 'light');
  const logoAssets = getLogoAssets(activeTheme);
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
        className={`w-auto h-auto object-contain transition-opacity duration-300 ${className}`}
        style={{ maxWidth, maxHeight }}
      />
    </picture>
  );

  const wrapperClass = "inline-block leading-none hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:rounded transition-opacity duration-200";

  if (clickable) {
    return (
      <Link href="/" aria-label="Return to homepage" className={wrapperClass}>
        {img}
      </Link>
    );
  }

  return <div className="inline-block leading-none">{img}</div>;
}
