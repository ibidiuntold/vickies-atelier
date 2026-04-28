# Logo Assets

This directory contains the logo assets for Vickie's Atelier website.

## Directory Structure

```
logo/
├── optimized/           # Optimized logo files for production use
│   ├── va-logo-light.webp    # Light mode logo (WebP)
│   ├── va-logo-light.png     # Light mode logo (PNG fallback)
│   ├── va-logo-dark.webp     # Dark mode logo (WebP)
│   └── va-logo-dark.png      # Dark mode logo (PNG fallback)
├── va-logo.png          # Original logo file
├── va-logo-light.jpg    # Original light variant
└── README.md            # This file
```

## Usage

### Using the Logo Component

The recommended way to use logos is through the `Logo` component:

```tsx
import Logo from '@/components/Logo';

// Light mode logo
<Logo theme="light" size="medium" />

// Dark mode logo
<Logo theme="dark" size="large" />

// Non-clickable logo
<Logo theme="light" clickable={false} />

// Priority loading (for above-the-fold)
<Logo theme="light" priority={true} />
```

### Direct Usage with Picture Element

For custom implementations, use the `<picture>` element for WebP support with fallbacks:

```tsx
<picture>
  <source srcSet="/images/logo/optimized/va-logo-light.webp" type="image/webp" />
  <img 
    src="/images/logo/optimized/va-logo-light.png" 
    alt="Vickie's Atelier - Luxury Fashion Design"
    width="200"
    height="128"
  />
</picture>
```

## Logo Variants

### Light Mode Logo
- **Use case**: Light backgrounds, default theme
- **Files**: `va-logo-light.webp`, `va-logo-light.png`
- **Dimensions**: 600x386px (optimized)
- **File sizes**: ~6 KB (WebP), ~6 KB (PNG)

### Dark Mode Logo
- **Use case**: Dark backgrounds, dark theme
- **Files**: `va-logo-dark.webp`, `va-logo-dark.png`
- **Dimensions**: 600x314px (optimized)
- **File sizes**: ~5 KB (WebP), ~20 KB (PNG)

## Optimization Details

All logos in the `optimized/` directory have been:
- ✅ Resized to optimal web dimensions (max 600px width)
- ✅ Converted to WebP format for modern browsers
- ✅ PNG fallbacks provided for older browsers
- ✅ Compressed for fast loading
- ✅ Aspect ratio maintained
- ✅ Optimized for both light and dark themes

## Accessibility

All logo implementations must include:
- **Alt text**: "Vickie's Atelier - Luxury Fashion Design"
- **Proper dimensions**: Width and height attributes to prevent layout shift
- **Clickable**: Logo should link to homepage (requirement 5.10)

## Requirements Satisfied

This logo asset preparation satisfies the following requirements:
- **5.5**: Logo variant optimized for light backgrounds
- **5.6**: Logo variant optimized for dark backgrounds
- **5.7**: Aspect ratio maintained across all screen sizes
- **5.8**: Logo file sizes optimized for fast loading
- **5.9**: Alt text provided for accessibility
- **16.2**: Logo files optimized for web delivery

## Re-optimization

To re-optimize logos after changes, run:

```bash
node scripts/optimize-logos.js
```

This script will:
1. Read original logo files from this directory
2. Create optimized WebP and PNG versions
3. Generate light and dark mode variants
4. Save optimized files to `optimized/` subdirectory
5. Display file size information

## Notes

- Always use optimized versions from `optimized/` directory in production
- Original files are kept for reference and re-optimization
- WebP format provides ~70% smaller file sizes than PNG
- PNG fallbacks ensure compatibility with older browsers
- Dark mode variant may need manual adjustment based on logo design
