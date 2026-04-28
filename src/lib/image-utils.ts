/**
 * Image utilities for preventing hydration issues
 * 
 * This module provides utilities to generate placeholder images and
 * handle external image loading to prevent hydration mismatches.
 */

/**
 * Generates a simple blur data URL for image placeholders
 * This prevents hydration issues by providing consistent placeholder content
 */
export function generateBlurDataURL(width: number, height: number): string {
  // Create a simple gradient blur placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:#c7a17a;stop-opacity:0.1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
    </svg>
  `;
  
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Common image props for Unsplash images to prevent hydration issues
 */
export function getOptimizedImageProps(width: number, height: number) {
  return {
    placeholder: 'blur' as const,
    blurDataURL: generateBlurDataURL(width, height),
    style: {
      objectFit: 'cover' as const,
      width: '100%',
      height: '100%',
    },
  };
}

/**
 * Optimized Unsplash URL generator
 * Ensures consistent image loading and prevents hydration issues
 */
export function getOptimizedUnsplashUrl(
  photoId: string, 
  width: number, 
  height?: number,
  quality: number = 70
): string {
  // Handle full photo URLs or just IDs
  let cleanPhotoId = photoId;
  if (photoId.startsWith('photo-')) {
    cleanPhotoId = photoId;
  } else if (photoId.includes('photo-')) {
    // Extract photo ID from URL if provided
    const match = photoId.match(/photo-([^?]+)/);
    cleanPhotoId = match ? `photo-${match[1]}` : photoId;
  }
  
  const baseUrl = `https://images.unsplash.com/${cleanPhotoId}`;
  const params = new URLSearchParams({
    q: quality.toString(),
    w: width.toString(),
    auto: 'format',
    fit: 'crop',
  });
  
  if (height) {
    params.set('h', height.toString());
  }
  
  return `${baseUrl}?${params.toString()}`;
}