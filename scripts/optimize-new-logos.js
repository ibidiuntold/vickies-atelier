const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeLogos() {
  const logoDir = path.join(__dirname, '..', 'Logo');
  const outputDir = path.join(__dirname, '..', 'public', 'images', 'logo');
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const logos = [
    { input: 'logo-dark.png', output: 'logo-dark' },
    { input: 'logo-white.png', output: 'logo-white' }
  ];

  for (const logo of logos) {
    const inputPath = path.join(logoDir, logo.input);
    const outputPng = path.join(outputDir, `${logo.output}.png`);
    const outputWebp = path.join(outputDir, `${logo.output}.webp`);

    try {
      // Get original dimensions
      const metadata = await sharp(inputPath).metadata();
      console.log(`${logo.input}: ${metadata.width}x${metadata.height}`);

      // Optimize PNG (compress without changing dimensions)
      await sharp(inputPath)
        .png({ quality: 90, compressionLevel: 9 })
        .toFile(outputPng);

      // Create WebP version
      await sharp(inputPath)
        .webp({ quality: 90 })
        .toFile(outputWebp);

      console.log(`✓ Optimized ${logo.input}`);
    } catch (error) {
      console.error(`✗ Failed to optimize ${logo.input}:`, error.message);
    }
  }
}

optimizeLogos().catch(console.error);