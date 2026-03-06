# Logo Integration Guide

This guide explains how to integrate the optimized logo assets into the Header and Footer components.

## Overview

The logo assets have been prepared with:
- ✅ WebP format with PNG fallbacks
- ✅ Light mode variant (for light backgrounds)
- ✅ Dark mode variant (for dark backgrounds)
- ✅ Optimized file sizes (5-20 KB)
- ✅ Maintained aspect ratios
- ✅ Accessibility alt text

## Quick Start

### 1. Import the Logo Component

```tsx
import Logo from '@/components/Logo';
```

### 2. Use in Header

```tsx
// In your Header component
import Logo from '@/components/Logo';
import { useTheme } from '@/hooks/useTheme';

export default function Header() {
  const { theme } = useTheme();
  
  return (
    <header>
      <Logo 
        theme={theme} 
        size="medium" 
        priority={true}  // Above the fold
      />
      {/* Other header content */}
    </header>
  );
}
```

### 3. Use in Footer (Desktop Only)

```tsx
// In your Footer component
import Logo from '@/components/Logo';
import { useTheme } from '@/hooks/useTheme';

export default function Footer() {
  const { theme } = useTheme();
  
  return (
    <footer>
      {/* Desktop only - hidden on mobile per requirement 5.3, 5.4 */}
      <div className="hidden md:block">
        <Logo 
          theme={theme} 
          size="small" 
          clickable={true}
        />
      </div>
      {/* Other footer content */}
    </footer>
  );
}
```

## Logo Component API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `'light' \| 'dark'` | `'light'` | Theme mode determining logo variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size variant |
| `clickable` | `boolean` | `true` | Whether logo links to homepage |
| `className` | `string` | `''` | Additional CSS classes |
| `priority` | `boolean` | `false` | Priority loading for LCP |

### Size Variants

- **Small**: 150x96px - For footer, compact headers
- **Medium**: 200x128px - Default header size
- **Large**: 300x193px - Hero sections, landing pages

## Advanced Usage

### Custom Implementation

If you need more control, use the logo configuration directly:

```tsx
import { getLogoAssets } from '@/lib/logo-config';

function CustomLogo({ theme }: { theme: 'light' | 'dark' }) {
  const logo = getLogoAssets(theme);
  
  return (
    <picture>
      <source srcSet={logo.webp} type="image/webp" />
      <img 
        src={logo.fallback}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </picture>
  );
}
```

### Theme Integration

The Logo component should receive the current theme from your theme context:

```tsx
'use client';

import { useTheme } from '@/hooks/useTheme';
import Logo from '@/components/Logo';

export default function ThemedLogo() {
  const { resolvedTheme } = useTheme();
  
  return <Logo theme={resolvedTheme} />;
}
```

## Responsive Behavior

### Header Logo
- **Mobile**: Display at medium size
- **Desktop**: Display at medium or large size
- **Always visible**: Per requirement 5.1

### Footer Logo
- **Mobile**: Hidden (requirement 5.3, 5.4)
- **Desktop**: Display at small size (requirement 5.2)

Example CSS:

```css
/* Footer logo - desktop only */
.footer-logo {
  display: none;
}

@media (min-width: 860px) {
  .footer-logo {
    display: block;
  }
}
```

## Performance Considerations

### Above the Fold (Header)
```tsx
<Logo theme={theme} priority={true} />
```
- Use `priority={true}` for header logos
- Prevents layout shift with explicit dimensions
- Optimizes Largest Contentful Paint (LCP)

### Below the Fold (Footer)
```tsx
<Logo theme={theme} priority={false} />
```
- Use `priority={false}` for footer logos
- Lazy loads by default
- Reduces initial page load

## Accessibility

The Logo component automatically provides:
- ✅ Descriptive alt text: "Vickie's Atelier - Luxury Fashion Design"
- ✅ Keyboard navigation (when clickable)
- ✅ ARIA label for homepage link
- ✅ Proper semantic HTML

## Browser Support

### WebP Support
- Chrome 23+
- Firefox 65+
- Safari 14+
- Edge 18+

### Fallback
- PNG fallback for older browsers
- Automatic via `<picture>` element
- No JavaScript required

## File Locations

```
public/images/logo/optimized/
├── va-logo-light.webp    # Light mode (WebP)
├── va-logo-light.png     # Light mode (PNG)
├── va-logo-dark.webp     # Dark mode (WebP)
└── va-logo-dark.png      # Dark mode (PNG)

src/
├── components/
│   └── Logo.tsx          # Logo component
└── lib/
    └── logo-config.ts    # Logo configuration
```

## Requirements Satisfied

This implementation satisfies:
- **5.5**: Light mode logo variant
- **5.6**: Dark mode logo variant
- **5.7**: Aspect ratio maintained
- **5.8**: Optimized file sizes
- **5.9**: Accessibility alt text
- **5.10**: Clickable to homepage
- **16.2**: Optimized for web delivery

## Testing Checklist

- [ ] Logo displays correctly in light mode
- [ ] Logo displays correctly in dark mode
- [ ] Logo switches when theme changes
- [ ] Logo is clickable and links to homepage
- [ ] Logo maintains aspect ratio on all screen sizes
- [ ] Logo is hidden in footer on mobile
- [ ] Logo is visible in footer on desktop
- [ ] WebP format loads in modern browsers
- [ ] PNG fallback loads in older browsers
- [ ] Alt text is present and descriptive
- [ ] No layout shift on page load
- [ ] Logo loads with priority in header

## Next Steps

1. Integrate Logo component into Header
2. Integrate Logo component into Footer (desktop only)
3. Connect to theme context
4. Test across different screen sizes
5. Verify WebP/PNG fallback behavior
6. Run Lighthouse audit for performance
