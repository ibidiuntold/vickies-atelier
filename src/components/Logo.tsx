/**
 * Logo Component
 * 
 * Theme-aware logo component with WebP support and fallbacks.
 * Automatically switches between light and dark variants based on theme.
 * 
 * Requirements: 5.5, 5.6, 5.7, 5.8, 5.9, 16.2
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getLogoAssets } from '@/lib/logo-config';

interface LogoProps {
  /**
   * Theme mode - determines which logo variant to display
   */
  theme?: 'light' | 'dark';
  
  /**
   * Size variant for different contexts
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Whether the logo should be clickable (links to homepage)
   * @default true
   */
  clickable?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Priority loading for above-the-fold logos
   * @default false
   */
  priority?: boolean;
}

const SIZE_CONFIG = {
  small: { maxWidth: 120, maxHeight: 60 },    // Footer size
  medium: { maxWidth: 160, maxHeight: 80 },   // General use
  large: { maxWidth: 200, maxHeight: 100 }    // Header size
};

export default function Logo({
  theme = 'light',
  size = 'medium',
  clickable = true,
  className = '',
  priority = false
}: LogoProps) {
  const logoAssets = getLogoAssets(theme);
  const sizeConstraints = SIZE_CONFIG[size];

  const logoImage = (
    <picture>
      <source srcSet={logoAssets.webp} type="image/webp" />
      <Image
        src={logoAssets.fallback}
        alt={logoAssets.alt}
        width={logoAssets.width}
        height={logoAssets.height}
        priority={priority}
        className={`logo ${className}`}
        style={{
          width: 'auto',
          height: 'auto',
          maxWidth: `${sizeConstraints.maxWidth}px`,
          maxHeight: `${sizeConstraints.maxHeight}px`,
          objectFit: 'contain'
        }}
      />
    </picture>
  );

  if (clickable) {
    return (
      <Link 
        href="/" 
        className="logo-link"
        aria-label="Return to homepage"
        style={{
          display: 'inline-block',
          lineHeight: 0,
          padding: size === 'large' ? '8px 12px' : '4px 8px',
          margin: size === 'large' ? '0 16px 0 0' : '0 8px 0 0'
        }}
      >
        {logoImage}
      </Link>
    );
  }

  return (
    <div 
      className="logo-container"
      style={{
        display: 'inline-block',
        lineHeight: 0,
        padding: size === 'large' ? '8px 12px' : '4px 8px',
        margin: size === 'large' ? '0 16px 0 0' : '0 8px 0 0'
      }}
    >
      {logoImage}
    </div>
  );
}
