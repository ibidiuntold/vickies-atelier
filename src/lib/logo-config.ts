/**
 * Logo Configuration
 * 
 * Provides optimized logo assets for light and dark themes
 * with WebP format and fallbacks.
 * 
 * Requirements: 5.5, 5.6, 5.7, 5.8, 5.9, 16.2
 */

export interface LogoAsset {
  webp: string;
  fallback: string;
  alt: string;
  width: number;
  height: number;
}

export interface LogoConfig {
  light: LogoAsset;
  dark: LogoAsset;
}

/**
 * Logo configuration for different theme modes
 * 
 * Light mode: Optimized for light backgrounds
 * Dark mode: Optimized for dark backgrounds
 */
export const LOGO_CONFIG: LogoConfig = {
  light: {
    webp: '/images/logo/logo-dark.webp',
    fallback: '/images/logo/logo-dark.png',
    alt: "Vickie's Atelier - Luxury Fashion Design",
    width: 691,
    height: 361
  },
  dark: {
    webp: '/images/logo/logo-white.webp',
    fallback: '/images/logo/logo-white.png',
    alt: "Vickie's Atelier - Luxury Fashion Design",
    width: 623,
    height: 401
  }
};

/**
 * Get logo assets for the current theme
 * @param theme - Current theme mode ('light' or 'dark')
 * @returns Logo asset configuration
 */
export function getLogoAssets(theme: 'light' | 'dark'): LogoAsset {
  return LOGO_CONFIG[theme];
}
