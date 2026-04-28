import sharp from 'sharp';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

/**
 * Configuration for image compression
 */
const COMPRESSION_CONFIG = {
  jpeg: {
    quality: 85,
    progressive: true,
  },
  png: {
    compressionLevel: 8,
    progressive: true,
  },
  webp: {
    quality: 85,
  },
};

/**
 * Maximum dimensions for compressed images
 */
const MAX_DIMENSIONS = {
  width: 1920,
  height: 1920,
};

/**
 * Temporary directory for storing uploaded files
 */
const TEMP_DIR = path.join(process.cwd(), 'tmp', 'uploads');

/**
 * Ensure the temporary directory exists
 */
async function ensureTempDir(): Promise<void> {
  if (!existsSync(TEMP_DIR)) {
    await mkdir(TEMP_DIR, { recursive: true });
  }
}

/**
 * Generate a unique filename
 */
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const ext = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, ext);
  return `${nameWithoutExt}-${timestamp}-${random}${ext}`;
}

/**
 * Compress an image file using Sharp
 * @param buffer - The image buffer to compress
 * @param mimeType - The MIME type of the image
 * @returns Compressed image buffer
 */
export async function compressImage(
  buffer: Buffer,
  mimeType: string
): Promise<Buffer> {
  let sharpInstance = sharp(buffer);

  // Get image metadata
  const metadata = await sharpInstance.metadata();

  // Resize if image is too large
  if (
    metadata.width &&
    metadata.height &&
    (metadata.width > MAX_DIMENSIONS.width ||
      metadata.height > MAX_DIMENSIONS.height)
  ) {
    sharpInstance = sharpInstance.resize(MAX_DIMENSIONS.width, MAX_DIMENSIONS.height, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Compress based on format
  switch (mimeType) {
    case 'image/jpeg':
    case 'image/jpg':
      return sharpInstance.jpeg(COMPRESSION_CONFIG.jpeg).toBuffer();

    case 'image/png':
      return sharpInstance.png(COMPRESSION_CONFIG.png).toBuffer();

    case 'image/webp':
      return sharpInstance.webp(COMPRESSION_CONFIG.webp).toBuffer();

    case 'image/heic':
      // Convert HEIC to JPEG for better compatibility
      return sharpInstance.jpeg(COMPRESSION_CONFIG.jpeg).toBuffer();

    default:
      // Default to JPEG for unknown formats
      return sharpInstance.jpeg(COMPRESSION_CONFIG.jpeg).toBuffer();
  }
}

/**
 * Save a file to temporary storage
 * @param buffer - The file buffer to save
 * @param originalName - The original filename
 * @returns The path to the saved file
 */
export async function saveToTemp(
  buffer: Buffer,
  originalName: string
): Promise<string> {
  await ensureTempDir();
  const filename = generateUniqueFilename(originalName);
  const filepath = path.join(TEMP_DIR, filename);
  await writeFile(filepath, buffer);
  return filepath;
}

/**
 * Delete a temporary file
 * @param filepath - The path to the file to delete
 */
export async function deleteTempFile(filepath: string): Promise<void> {
  try {
    await unlink(filepath);
  } catch (error) {
    // Ignore errors if file doesn't exist
    console.error('Error deleting temp file:', error);
  }
}

/**
 * Process uploaded image files: compress and save to temporary storage
 * @param files - Array of files to process
 * @returns Array of temporary file paths
 */
export async function processUploadedImages(
  files: Array<{ buffer: Buffer; originalName: string; mimeType: string }>
): Promise<string[]> {
  const tempPaths: string[] = [];

  for (const file of files) {
    try {
      // Compress the image
      const compressedBuffer = await compressImage(file.buffer, file.mimeType);

      // Save to temporary storage
      const tempPath = await saveToTemp(compressedBuffer, file.originalName);
      tempPaths.push(tempPath);
    } catch (error) {
      console.error(`Error processing image ${file.originalName}:`, error);
      // Clean up any successfully processed files
      await Promise.all(tempPaths.map(deleteTempFile));
      throw new Error(`Failed to process image: ${file.originalName}`);
    }
  }

  return tempPaths;
}

/**
 * Clean up multiple temporary files
 * @param filepaths - Array of file paths to delete
 */
export async function cleanupTempFiles(filepaths: string[]): Promise<void> {
  await Promise.all(filepaths.map(deleteTempFile));
}

/**
 * Convert a File object to a buffer (for use in API routes)
 * @param file - The File object to convert
 * @returns Buffer containing the file data
 */
export async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Validate image file
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in MB
 * @param acceptedFormats - Array of accepted MIME types
 * @returns Validation result
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 10,
  acceptedFormats: string[] = [
    'image/jpeg',
    'image/png',
    'image/heic',
    'image/webp',
  ]
): { valid: boolean; error?: string } {
  // Check file type
  if (!acceptedFormats.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Please upload JPEG, PNG, HEIC, or WebP images.`,
    };
  }

  // Check file size
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit.`,
    };
  }

  return { valid: true };
}
