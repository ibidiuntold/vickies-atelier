/**
 * Property Test: Logo Theme Consistency
 * Property 2: Logo Theme Consistency
 * Validates: Requirements 10.1, 10.2, 10.3
 *
 * **Validates: Requirements 10.1, 10.2, 10.3**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getLogoAssets, LOGO_CONFIG, type LogoAsset } from '../lib/logo-config';

// Arbitrary for theme values
const themeArb = fc.constantFrom('light' as const, 'dark' as const);

describe('Logo Theme Consistency - Property 2', () => {
  // Property: getLogoAssets() returns a valid LogoAsset for any theme
  it('returns a valid LogoAsset for any theme input', () => {
    fc.assert(
      fc.property(themeArb, (theme) => {
        const asset = getLogoAssets(theme);

        expect(asset).toBeDefined();
        expect(typeof asset.webp).toBe('string');
        expect(typeof asset.fallback).toBe('string');
        expect(typeof asset.alt).toBe('string');
        expect(typeof asset.width).toBe('number');
        expect(typeof asset.height).toBe('number');

        expect(asset.webp.length).toBeGreaterThan(0);
        expect(asset.fallback.length).toBeGreaterThan(0);
        expect(asset.alt.length).toBeGreaterThan(0);
        expect(asset.width).toBeGreaterThan(0);
        expect(asset.height).toBeGreaterThan(0);
      })
    );
  });

  // Property: light theme always returns the dark logo variant (path contains 'dark')
  it('light theme always returns the dark logo variant', () => {
    fc.assert(
      fc.property(fc.constant('light' as const), (theme) => {
        const asset = getLogoAssets(theme);
        expect(asset.webp).toContain('dark');
        expect(asset.fallback).toContain('dark');
      })
    );
  });

  // Property: dark theme always returns the light logo variant (path contains 'light')
  it('dark theme always returns the light logo variant', () => {
    fc.assert(
      fc.property(fc.constant('dark' as const), (theme) => {
        const asset = getLogoAssets(theme);
        expect(asset.webp).toContain('light');
        expect(asset.fallback).toContain('light');
      })
    );
  });

  // Property: alt text is identical for both theme variants (Req 10.5)
  it('alt text is identical for both theme variants', () => {
    fc.assert(
      fc.property(themeArb, themeArb, (themeA, themeB) => {
        const assetA = getLogoAssets(themeA);
        const assetB = getLogoAssets(themeB);
        expect(assetA.alt).toBe(assetB.alt);
      })
    );
  });

  // Property: dimensions are identical for both variants (prevents layout shifts - Req 10.3)
  it('dimensions are identical for both variants to prevent layout shifts', () => {
    fc.assert(
      fc.property(themeArb, themeArb, (themeA, themeB) => {
        const assetA = getLogoAssets(themeA);
        const assetB = getLogoAssets(themeB);
        expect(assetA.width).toBe(assetB.width);
        expect(assetA.height).toBe(assetB.height);
      })
    );
  });

  // Property: both variants have WebP and PNG fallback paths
  it('both variants have WebP and PNG fallback paths', () => {
    fc.assert(
      fc.property(themeArb, (theme) => {
        const asset = getLogoAssets(theme);
        expect(asset.webp).toBeTruthy();
        expect(asset.fallback).toBeTruthy();
      })
    );
  });

  // Property: WebP path ends with .webp, fallback path ends with .png
  it('WebP path ends with .webp and fallback path ends with .png', () => {
    fc.assert(
      fc.property(themeArb, (theme) => {
        const asset = getLogoAssets(theme);
        expect(asset.webp.endsWith('.webp')).toBe(true);
        expect(asset.fallback.endsWith('.png')).toBe(true);
      })
    );
  });

  // Concrete tests for specific asset paths
  it('light theme returns the correct dark logo paths', () => {
    const asset = getLogoAssets('light');
    expect(asset.webp).toBe('/images/logo/optimized/va-logo-dark.webp');
    expect(asset.fallback).toBe('/images/logo/optimized/va-logo-dark.png');
  });

  it('dark theme returns the correct light logo paths', () => {
    const asset = getLogoAssets('dark');
    expect(asset.webp).toBe('/images/logo/optimized/va-logo-light.webp');
    expect(asset.fallback).toBe('/images/logo/optimized/va-logo-light.png');
  });

  it('both variants have the correct alt text', () => {
    const lightAsset = getLogoAssets('light');
    const darkAsset = getLogoAssets('dark');
    const expectedAlt = "Vickie's Atelier - Luxury Fashion Design";
    expect(lightAsset.alt).toBe(expectedAlt);
    expect(darkAsset.alt).toBe(expectedAlt);
  });

  it('both variants have identical dimensions of 691x361', () => {
    const lightAsset = getLogoAssets('light');
    const darkAsset = getLogoAssets('dark');
    expect(lightAsset.width).toBe(691);
    expect(lightAsset.height).toBe(361);
    expect(darkAsset.width).toBe(691);
    expect(darkAsset.height).toBe(361);
  });

  // Test that switching themes produces different asset paths
  it('switching themes produces different asset paths', () => {
    fc.assert(
      fc.property(themeArb, (theme) => {
        const otherTheme = theme === 'light' ? 'dark' : 'light';
        const assetA = getLogoAssets(theme);
        const assetB = getLogoAssets(otherTheme);
        expect(assetA.webp).not.toBe(assetB.webp);
        expect(assetA.fallback).not.toBe(assetB.fallback);
      })
    );
  });
});
