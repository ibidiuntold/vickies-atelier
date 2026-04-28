const sharp = require('sharp');
const path = require('path');

async function createFavicon() {
  const inputPath = path.join(__dirname, '..', 'public', 'images', 'logo', 'logo-white.png');
  const faviconPath = path.join(__dirname, '..', 'public', 'favicon.ico');
  const favicon32Path = path.join(__dirname, '..', 'public', 'favicon-32x32.png');
  const favicon16Path = path.join(__dirname, '..', 'public', 'favicon-16x16.png');

  try {
    // Create 32x32 favicon
    await sharp(inputPath)
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(favicon32Path);

    // Create 16x16 favicon
    await sharp(inputPath)
      .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(favicon16Path);

    console.log('✓ Created favicon files');
  } catch (error) {
    console.error('✗ Failed to create favicon:', error.message);
  }
}

createFavicon().catch(console.error);