import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import crypto from 'crypto';

// Ensure environment variables are loaded regardless of ESM import hoisting
dotenv.config();
if (!process.env.IMAGEKIT_PRIVATE_KEY && !process.env.CLOUDINARY_API_KEY) {
  try {
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    dotenv.config({ path: path.join(currentDir, '../.env') });
    dotenv.config({ path: path.join(currentDir, '../../.env') });
  } catch {}
}

// ── ImageKit Configuration Check & Sanitizer ──
export function getImageKitConfig() {
  const publicKey = (process.env.IMAGEKIT_PUBLIC_KEY || '').trim().replace(/[\r\n]+/g, '');
  const privateKey = (process.env.IMAGEKIT_PRIVATE_KEY || '').trim().replace(/[\r\n]+/g, '');
  const urlEndpoint = (process.env.IMAGEKIT_URL_ENDPOINT || '').trim().replace(/[\r\n]+/g, '').replace(/\/+$/, '');
  const isConfigured = Boolean(publicKey && privateKey && urlEndpoint);
  return { publicKey, privateKey, urlEndpoint, isConfigured };
}

export function checkImageKitConfigured() {
  return getImageKitConfig().isConfigured;
}

export function checkR2Configured() {
  return Boolean(
    process.env.R2_ACCOUNT_ID?.trim() &&
    process.env.R2_ACCESS_KEY_ID?.trim() &&
    process.env.R2_SECRET_ACCESS_KEY?.trim() &&
    process.env.R2_BUCKET_NAME?.trim()
  );
}

export function checkCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
    process.env.CLOUDINARY_API_KEY?.trim() &&
    process.env.CLOUDINARY_API_SECRET?.trim()
  );
}

// Backwards-compatible exports (evaluated dynamically when called or accessed)
export const isImageKitConfigured = checkImageKitConfigured();
export const isR2Configured = checkR2Configured();
export const isCloudinaryConfigured = checkCloudinaryConfigured();

// ── Initialize ImageKit Client (Lazy) ──
let _imagekitInstance = null;
export async function getImageKitClient() {
  const config = getImageKitConfig();
  if (!config.isConfigured) return null;
  if (_imagekitInstance) return _imagekitInstance;
  try {
    const { default: ImageKit } = await import('imagekit');
    _imagekitInstance = new ImageKit({
      publicKey: config.publicKey,
      privateKey: config.privateKey,
      urlEndpoint: config.urlEndpoint,
    });
    return _imagekitInstance;
  } catch (err) {
    console.warn('⚠️ ImageKit module load failed:', err.message);
    return null;
  }
}
export const imagekitClient = null; // Backwards-compatible export

// ── Initialize R2 S3 Client (Lazy) ──
let _r2Instance = null;
export async function getR2Client() {
  if (!checkR2Configured()) return null;
  if (_r2Instance) return _r2Instance;
  try {
    const { S3Client } = await import('@aws-sdk/client-s3');
    _r2Instance = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID.trim()}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID.trim(),
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY.trim(),
      },
    });
    return _r2Instance;
  } catch (err) {
    console.warn('⚠️ R2 S3Client load failed:', err.message);
    return null;
  }
}
export const r2Client = null; // Backwards-compatible export

/**
 * Compresses and standardizes an image buffer via Sharp:
 * - Auto-detects and converts iPhone HEIC / HEIF files to JPEG
 * - Auto-rotates orientation using EXIF tags (fixes mobile phone orientation)
 * - Downscales to a max 1920x1920 bounding box (without enlargement)
 * - Converts to WebP format at 80% quality (~50KB - 150KB average file size)
 *
 * @param {Buffer} buffer - Raw image buffer
 * @param {string} [originalName=''] - Original file name for format hints
 * @returns {Promise<Buffer>} - Compressed WebP buffer
 */
export async function optimizeImageBuffer(buffer, originalName = '') {
  try {
    let workingBuffer = buffer;

    // Check if the file is HEIC / HEIF (common when uploading from modern iPhones)
    const isHeic = (originalName && /\.(heic|heif)$/i.test(originalName)) ||
                   (buffer.length > 12 && buffer.toString('ascii', 4, 12).includes('ftyp'));

    if (isHeic) {
      try {
        const { default: heicConvert } = await import('heic-convert');
        workingBuffer = await heicConvert({
          buffer: workingBuffer,
          format: 'JPEG',
          quality: 0.95,
        });
      } catch (heicErr) {
        console.warn('⚠️ HEIC conversion fallback:', heicErr.message);
      }
    }

    try {
      const { default: sharp } = await import('sharp');
      return await sharp(workingBuffer, { failOn: 'none' })
        .rotate() // Auto-orient smartphone photos based on EXIF
        .resize({
          width: 1920,
          height: 1920,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toBuffer();
    } catch (sharpErr) {
      console.warn('⚠️ Sharp optimization unavailable, returning buffer:', sharpErr.message);
      return workingBuffer;
    }
  } catch (err) {
    console.warn('⚠️ Sharp optimization failed, falling back to raw buffer:', err.message);
    return buffer;
  }
}

/**
 * Upload an image buffer to ImageKit with Sharp compression.
 *
 * @param {Buffer} buffer - File buffer
 * @param {string} originalName - Original file name
 * @param {string} [folder='/inventory'] - Target folder in ImageKit
 * @returns {Promise<{url: string, key: string, path: string, filename: string, thumbnail_url: string}>}
 */
export async function uploadToImageKit(buffer, originalName = 'photo.jpg', folder = '/inventory') {
  const client = await getImageKitClient();
  if (!client) {
    throw new Error('ImageKit is not configured. Missing ImageKit environment variables.');
  }

  // 1. Sharp WebP compression with HEIC auto-handling
  const compressedBuffer = await optimizeImageBuffer(buffer, originalName);

  // 2. Unique filename
  const baseName = (originalName || 'upload')
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 40);

  const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const fileName = `car-${uniqueSuffix}-${baseName}.webp`;

  // 3. Upload via ImageKit SDK
  const response = await client.upload({
    file: compressedBuffer,
    fileName,
    folder: folder.startsWith('/') ? folder : `/${folder}`,
    useUniqueFileName: false,
  });

  return {
    url: response.url,
    key: response.fileId,
    path: response.url,             // Compatible with Multer file.path
    filename: response.fileId,      // Compatible with Multer file.filename
    thumbnail_url: `${response.url}?tr=w-400,h-300,q-80`,
  };
}

/**
 * Delete a file from ImageKit by fileId or image URL.
 *
 * @param {string} fileIdOrUrl
 */
export async function deleteFromImageKit(fileIdOrUrl) {
  const client = await getImageKitClient();
  if (!client || !fileIdOrUrl || typeof fileIdOrUrl !== 'string') return;

  try {
    let fileId = fileIdOrUrl;

    // If a full ImageKit URL was provided, look up the fileId by name
    if (fileIdOrUrl.startsWith('http://') || fileIdOrUrl.startsWith('https://')) {
      try {
        const parsed = new URL(fileIdOrUrl);
        const fileName = parsed.pathname.split('/').pop();
        if (fileName) {
          const files = await client.listFiles({
            name: fileName,
            limit: 1,
          });
          if (files && files.length > 0) {
            fileId = files[0].fileId;
          } else {
            console.log(`ℹ️ ImageKit file not found by name: ${fileName}`);
            return;
          }
        }
      } catch (lookupErr) {
        console.warn(`⚠️ Failed to parse ImageKit URL for deletion: ${lookupErr.message}`);
        return;
      }
    }

    if (!fileId) return;

    await client.deleteFile(fileId);
    console.log(`🗑️ Deleted ImageKit file: ${fileId}`);
  } catch (err) {
    if (err.message && err.message.includes('not found')) return;
    console.warn(`⚠️ Failed to delete ImageKit file (${fileIdOrUrl}):`, err.message);
  }
}

/**
 * Upload an image buffer to Cloudflare R2 with Sharp compression.
 *
 * @param {Buffer} buffer - File buffer
 * @param {string} originalName - Original file name
 * @param {string} [folder='cars'] - Target folder in bucket
 * @returns {Promise<{url: string, key: string, path: string, filename: string}>}
 */
export async function uploadBufferToR2(buffer, originalName = 'photo.jpg', folder = 'cars') {
  const client = await getR2Client();
  if (!client) {
    throw new Error('Cloudflare R2 is not configured. Missing R2 environment variables.');
  }

  const compressedBuffer = await optimizeImageBuffer(buffer, originalName);

  const baseName = (originalName || 'upload')
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 40);

  const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const key = `${folder}/${uniqueSuffix}-${baseName}.webp`;

  const { PutObjectCommand } = await import('@aws-sdk/client-s3');
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: compressedBuffer,
    ContentType: 'image/webp',
    CacheControl: 'public, max-age=31536000, immutable',
  });

  await client.send(command);

  const publicDomain = (
    process.env.R2_PUBLIC_DOMAIN ||
    `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.dev`
  ).replace(/\/$/, '');

  const url = `${publicDomain}/${key}`;

  return {
    url,
    key,
    path: url,
    filename: key,
  };
}

/**
 * Delete an object from Cloudflare R2.
 *
 * @param {string} keyOrUrl
 */
export async function deleteFromR2(keyOrUrl) {
  const client = await getR2Client();
  if (!client || !keyOrUrl || typeof keyOrUrl !== 'string') return;

  try {
    let key = keyOrUrl;
    if (keyOrUrl.startsWith('http://') || keyOrUrl.startsWith('https://')) {
      try {
        const parsed = new URL(keyOrUrl);
        key = parsed.pathname.replace(/^\/+/, '');
      } catch {
        const parts = keyOrUrl.split('/');
        key = parts.slice(3).join('/');
      }
    }

    if (!key) return;

    const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });

    await client.send(command);
    console.log(`🗑️ Deleted R2 object: ${key}`);
  } catch (err) {
    console.warn(`⚠️ Failed to delete object from R2 (${keyOrUrl}):`, err.message);
  }
}

/**
 * Upload an image buffer to Cloudinary with Sharp compression.
 *
 * @param {Buffer} buffer - File buffer
 * @param {string} originalName - Original file name
 * @param {string} [folder='sadguru_cars'] - Target folder in Cloudinary
 * @returns {Promise<{url: string, key: string, path: string, filename: string, thumbnail_url: string}>}
 */
export async function uploadToCloudinary(buffer, originalName = 'photo.jpg', folder = 'sadguru_cars') {
  if (!checkCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured. Missing Cloudinary credentials.');
  }

  const { v2: cloudinary } = await import('cloudinary');
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim().replace(/[\r\n]+/g, ''),
    api_key: process.env.CLOUDINARY_API_KEY.trim().replace(/[\r\n]+/g, ''),
    api_secret: process.env.CLOUDINARY_API_SECRET.trim().replace(/[\r\n]+/g, ''),
  });

  const compressedBuffer = await optimizeImageBuffer(buffer, originalName);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        format: 'webp',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          key: result.public_id,
          path: result.secure_url,
          filename: result.public_id,
          thumbnail_url: result.secure_url,
        });
      }
    );
    uploadStream.end(compressedBuffer);
  });
}

/**
 * Universal media uploader:
 * 1. Prefers ImageKit when configured (20 GB Free Cloud CDN)
 * 2. Falls back to Cloudflare R2 when configured
 * 3. Falls back to Cloudinary when configured
 *
 * @param {Buffer} buffer
 * @param {string} originalName
 * @param {string} [folder]
 */
export async function uploadMedia(buffer, originalName = 'photo.jpg', folder = 'inventory') {
  // 1. Primary: ImageKit
  if (checkImageKitConfigured()) {
    try {
      return await uploadToImageKit(buffer, originalName, folder.startsWith('/') ? folder : `/${folder}`);
    } catch (err) {
      console.warn('⚠️ ImageKit upload failed, attempting fallback storage provider:', err.message);
      // Fall through to R2 or Cloudinary
    }
  }

  // 2. Standby: Cloudflare R2
  if (checkR2Configured()) {
    try {
      return await uploadBufferToR2(buffer, originalName, folder.replace(/^\/+/, ''));
    } catch (err) {
      console.warn('⚠️ Cloudflare R2 upload failed, attempting fallback storage provider:', err.message);
      // Fall through to Cloudinary
    }
  }

  // 3. Standby: Cloudinary
  if (checkCloudinaryConfigured()) {
    try {
      return await uploadToCloudinary(buffer, originalName, folder === 'inventory' ? 'sadguru_cars' : folder);
    } catch (err) {
      console.error('⚠️ Cloudinary fallback upload failed:', err.message);
    }
  }

  throw new Error('No cloud storage provider configured or reachable. Please check ImageKit or Cloudinary environment variables.');
}

/**
 * Universal media deleter:
 * Automatically detects whether an image is on ImageKit, Cloudflare R2, or Cloudinary,
 * and calls the corresponding deletion API.
 *
 * @param {string} urlOrKeyOrId
 */
export async function deleteMedia(urlOrKeyOrId) {
  if (!urlOrKeyOrId || typeof urlOrKeyOrId !== 'string') return;

  // 1. ImageKit
  if (urlOrKeyOrId.includes('ik.imagekit.io') || (checkImageKitConfigured() && !urlOrKeyOrId.includes('/'))) {
    return await deleteFromImageKit(urlOrKeyOrId);
  }

  // 2. Cloudflare R2
  if (urlOrKeyOrId.includes('.r2.dev') || urlOrKeyOrId.includes('r2.cloudflarestorage.com') || (process.env.R2_PUBLIC_DOMAIN && urlOrKeyOrId.includes(process.env.R2_PUBLIC_DOMAIN))) {
    return await deleteFromR2(urlOrKeyOrId);
  }

  // 3. Legacy Cloudinary deletion (Dynamic cleanup for existing cars)
  if (urlOrKeyOrId.includes('cloudinary.com') && process.env.CLOUDINARY_API_KEY) {
    try {
      const { v2: cloudinary } = await import('cloudinary');
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      const publicId = urlOrKeyOrId.split('/').slice(-1)[0].split('.')[0];
      await cloudinary.uploader.destroy(`sadguru_cars/${publicId}`);
      console.log(`🗑️ Deleted Legacy Cloudinary object: ${publicId}`);
    } catch (err) {
      console.warn(`⚠️ Cloudinary delete failed:`, err.message);
    }
    return;
  }

  // If unknown, delete from ImageKit
  if (checkImageKitConfigured()) {
    await deleteFromImageKit(urlOrKeyOrId);
  } else if (checkR2Configured()) {
    await deleteFromR2(urlOrKeyOrId);
  }
}

const allowedMimes = [
  'image/jpeg', 'image/jpg', 'image/png',
  'image/webp', 'image/avif', 'image/gif',
  'image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence'
];

const fileFilter = (_req, file, cb) => {
  const isHeicExt = /\.(heic|heif)$/i.test(file.originalname);
  if (allowedMimes.includes(file.mimetype) || isHeicExt) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, GIF, WebP, AVIF, and HEIC images are allowed'), false);
  }
};

const memoryMulter = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 32 * 1024 * 1024,  // 32MB max per file
    files: 25,                   // max 25 files per request
    fieldSize: 2 * 1024 * 1024,  // 2MB for form fields
  },
  fileFilter,
});

/**
 * Sequential processor for memory files to compress and upload to ImageKit.
 */
const processMemoryFiles = async (req, res, next) => {
  try {
    // 1. Single file upload
    if (req.file && req.file.buffer) {
      const uploaded = await uploadMedia(req.file.buffer, req.file.originalname, 'inventory');
      req.file.path = uploaded.url;
      req.file.filename = uploaded.key;
    }

    // 2. Array of files — Sequential processing to protect RAM
    if (req.files && Array.isArray(req.files)) {
      for (const f of req.files) {
        if (f.buffer) {
          const uploaded = await uploadMedia(f.buffer, f.originalname, 'inventory');
          f.path = uploaded.url;
          f.filename = uploaded.key;
        }
      }
    }

    // 3. Fields with files
    if (req.files && !Array.isArray(req.files) && typeof req.files === 'object') {
      const fieldKeys = Object.keys(req.files);
      for (const fieldName of fieldKeys) {
        const fileList = req.files[fieldName];
        if (Array.isArray(fileList)) {
          for (const f of fileList) {
            if (f.buffer) {
              const uploaded = await uploadMedia(f.buffer, f.originalname, 'inventory');
              f.path = uploaded.url;
              f.filename = uploaded.key;
            }
          }
        }
      }
    }

    next();
  } catch (err) {
    console.error('Media Upload Error:', err);
    res.status(500).json({ success: false, message: 'Failed to upload media: ' + err.message });
  }
};

/**
 * Primary Multer uploader routing to ImageKit with Sharp compression (or R2 fallback)
 */
export const upload = {
  single: (fieldName) => {
    const memHandler = memoryMulter.single(fieldName);
    return (req, res, next) => {
      memHandler(req, res, (err) => {
        if (err) return next(err);
        processMemoryFiles(req, res, next);
      });
    };
  },

  array: (fieldName, maxCount = 25) => {
    const memHandler = memoryMulter.array(fieldName, maxCount);
    return (req, res, next) => {
      memHandler(req, res, (err) => {
        if (err) return next(err);
        processMemoryFiles(req, res, next);
      });
    };
  },

  fields: (fieldsArray) => {
    const memHandler = memoryMulter.fields(fieldsArray);
    return (req, res, next) => {
      memHandler(req, res, (err) => {
        if (err) return next(err);
        processMemoryFiles(req, res, next);
      });
    };
  },
};

export default upload;
