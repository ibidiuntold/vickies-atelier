/**
 * Logo Asset Optimization Script
 * 
 * This script optimizes logo files for web delivery:
 * - Creates WebP versions with fallbacks
 * - Generates light mode and dark mode variants
 * - Maintains aspect ratio
 * - Optimizes file sizes
 * 
 * Requirements: 5.5, 5.6, 5.7, 5.8, 5.9, 16.2
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../public/images/logo');
const OUTPUT_DIR = path.join(__dirname, '../public/images/logo/optimized');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Optimize a logo file for web delivery
 * @param {string} inputPath - Path to input image
 * @param {string} outputName - Base name for output files
 * @param {object} options - Optimization options
 */
async function optimizeLogo(inputPath, outputName, options = {}) {
  const {
    maxWidth = 800,
    quality = 90,
    createDarkVariant = false
  } = options;

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`Processing ${path.basename(inputPath)}...`);
    console.log(`  Original: ${metadata.width}x${metadata.height}, ${metadata.format}`);

    // Calculate dimensions maintaining aspect ratio
    let width = metadata.width;
    let height = metadata.height;
    
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    // Create WebP version (primary format)
    await image
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality })
      .toFile(path.join(OUTPUT_DIR, `${outputName}.webp`));
    
    console.log(`  ✓ Created ${outputName}.webp (${width}x${height})`);

    // Create PNG fallback
    await sharp(inputPath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .png({ quality })
      .toFile(path.join(OUTPUT_DIR, `${outputName}.png`));
    
    console.log(`  ✓ Created ${outputName}.png (${width}x${height})`);

    // Create dark variant if requested
    if (createDarkVariant) {
      // For dark mode, we'll adjust brightness and contrast
      // This creates a lighter version suitable for dark backgrounds
      await sharp(inputPath)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .modulate({
          brightness: 1.2,  // Increase brightness by 20%
          saturation: 0.9   // Slightly reduce saturation
        })
        .webp({ quality })
        .toFile(path.join(OUTPUT_DIR, `${outputName}-dark.webp`));
      
      console.log(`  ✓ Created ${outputName}-dark.webp (${width}x${height})`);

      await sharp(inputPath)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .modulate({
          brightness: 1.2,
          saturation: 0.9
        })
        .png({ quality })
        .toFile(path.join(OUTPUT_DIR, `${outputName}-dark.png`));
      
      console.log(`  ✓ Created ${outputName}-dark.png (${width}x${height})`);
    }

    return { width, height };
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('Starting logo optimization...\n');

  try {
    // Process va-logo.png (for light backgrounds)
    const lightLogoPath = path.join(INPUT_DIR, 'va-logo.png');
    if (fs.existsSync(lightLogoPath)) {
      await optimizeLogo(lightLogoPath, 'va-logo-light', {
        maxWidth: 600,
        quality: 90,
        createDarkVariant: false
      });
    }

    // Process va-logo-light.jpg (already optimized for light, create dark variant)
    const lightJpgPath = path.join(INPUT_DIR, 'va-logo-light.jpg');
    if (fs.existsSync(lightJpgPath)) {
      await optimizeLogo(lightJpgPath, 'va-logo', {
        maxWidth: 600,
        quality: 90,
        createDarkVariant: true
      });
    }

    console.log('\n✅ Logo optimization complete!');
    console.log(`\nOptimized files saved to: ${OUTPUT_DIR}`);
    
    // Display file sizes
    console.log('\nFile sizes:');
    const files = fs.readdirSync(OUTPUT_DIR);
    files.forEach(file => {
      const filePath = path.join(OUTPUT_DIR, file);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`  ${file}: ${sizeKB} KB`);
    });

  } catch (error) {
    console.error('\n❌ Error during optimization:', error.message);
    process.exit(1);
  }
}

main();
