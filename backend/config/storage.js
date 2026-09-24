import multer from 'multer';
import crypto from 'crypto';
import sharp from 'sharp';
import heicConvert from 'heic-convert';
import ImageKit from 'imagekit';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// ── ImageKit Configuration Check ──
export const isImageKitConfigured = Boolean(
  process.env.IMAGEKIT_PUBLIC_KEY &&
  process.env.IMAGEKIT_PRIVATE_KEY &&
  process.env.IMAGEKIT_URL_ENDPOINT
);

// ── Initialize ImageKit Client ──
export const imagekitClient = isImageKitConfigured
  ? new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    })
  : null;

// ── Cloudflare R2 Configuration Check ──
export const isR2Configured = Boolean(
  process.env.R2_ACCOUNT_ID &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY &&
  process.env.R2_BUCKET_NAME
);

// ── Initialize R2 S3 Client ──
export const r2Client = isR2Configured
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    })
  : null;

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
        workingBuffer = await heicConvert({
          buffer: workingBuffer,
          format: 'JPEG',
          quality: 0.95,
        });
      } catch (heicErr) {
        console.warn('⚠️ HEIC conversion fallback:', heicErr.message);
      }
    }

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
  if (!imagekitClient) {
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
  const response = await imagekitClient.upload({
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
  if (!imagekitClient || !fileIdOrUrl || typeof fileIdOrUrl !== 'string') return;

  try {
    let fileId = fileIdOrUrl;

    // If a full ImageKit URL was provided, look up the fileId by name
    if (fileIdOrUrl.startsWith('http://') || fileIdOrUrl.startsWith('https://')) {
      try {
        const parsed = new URL(fileIdOrUrl);
        const fileName = parsed.pathname.split('/').pop();
        if (fileName) {
          const files = await imagekitClient.listFiles({
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

    await imagekitClient.deleteFile(fileId);
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
  if (!r2Client) {
    throw new Error('Cloudflare R2 is not configured. Missing R2 environment variables.');
  }

  const compressedBuffer = await optimizeImageBuffer(buffer, originalName);

  const baseName = (originalName || 'upload')
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 40);

  const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const key = `${folder}/${uniqueSuffix}-${baseName}.webp`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: compressedBuffer,
    ContentType: 'image/webp',
    CacheControl: 'public, max-age=31536000, immutable',
  });

  await r2Client.send(command);

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
  if (!r2Client || !keyOrUrl || typeof keyOrUrl !== 'string') return;

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

    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });

    await r2Client.send(command);
    console.log(`🗑️ Deleted R2 object: ${key}`);
  } catch (err) {
    console.warn(`⚠️ Failed to delete object from R2 (${keyOrUrl}):`, err.message);
  }
}

/**
 * Universal media uploader:
 * 1. Prefers ImageKit when configured
 * 2. Uses Cloudflare R2 when configured
 * 3. Falls back with an informative error
 *
 * @param {Buffer} buffer
 * @param {string} originalName
 * @param {string} [folder]
 */
export async function uploadMedia(buffer, originalName = 'photo.jpg', folder = 'inventory') {
  if (isImageKitConfigured) {
    return await uploadToImageKit(buffer, originalName, folder.startsWith('/') ? folder : `/${folder}`);
  }
  if (isR2Configured) {
    return await uploadBufferToR2(buffer, originalName, folder.replace(/^\/+/, ''));
  }
  throw new Error('No cloud storage provider configured. Please set ImageKit or Cloudflare R2 environment variables.');
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
  if (urlOrKeyOrId.includes('ik.imagekit.io') || (isImageKitConfigured && !urlOrKeyOrId.includes('/'))) {
    return await deleteFromImageKit(urlOrKeyOrId);
  }

  // 2. Cloudflare R2
  if (urlOrKeyOrId.includes('.r2.dev') || urlOrKeyOrId.includes('r2.cloudflarestorage.com') || (process.env.R2_PUBLIC_DOMAIN && urlOrKeyOrId.includes(process.env.R2_PUBLIC_DOMAIN))) {
    return await deleteFromR2(urlOrKeyOrId);
  }

  // 3. Cloudinary fallback
  if (urlOrKeyOrId.includes('cloudinary.com')) {
    try {
      const publicId = urlOrKeyOrId.split('/').slice(-1)[0].split('.')[0];
      await cloudinary.uploader.destroy(`sadguru_cars/${publicId}`);
      console.log(`🗑️ Deleted Cloudinary object: ${publicId}`);
    } catch (err) {
      console.warn(`⚠️ Cloudinary delete failed:`, err.message);
    }
    return;
  }

  // If unknown, try ImageKit first, then R2
  if (isImageKitConfigured) {
    await deleteFromImageKit(urlOrKeyOrId);
  } else if (isR2Configured) {
    await deleteFromR2(urlOrKeyOrId);
  }
}

// ── Cloudinary Fallback Storage ──
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sadguru_cars',
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp', 'avif'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  },
});

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

const cloudinaryMulter = multer({
  storage: cloudinaryStorage,
  limits: {
    fileSize: 25 * 1024 * 1024,
    files: 25,
  },
  fileFilter,
});

const isManagedStorageActive = isImageKitConfigured || isR2Configured;

/**
 * Sequential processor for memory files to protect RAM during large uploads.
 */
const processMemoryFiles = async (req, res, next) => {
  if (!isManagedStorageActive) return next();

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
 * Unified Multer uploader that automatically routes to ImageKit / Cloudflare R2
 * with Sharp compression, or falls back gracefully to Cloudinary.
 */
export const upload = {
  single: (fieldName) => {
    if (isManagedStorageActive) {
      const memHandler = memoryMulter.single(fieldName);
      return (req, res, next) => {
        memHandler(req, res, (err) => {
          if (err) return next(err);
          processMemoryFiles(req, res, next);
        });
      };
    }
    return cloudinaryMulter.single(fieldName);
  },

  array: (fieldName, maxCount = 25) => {
    if (isManagedStorageActive) {
      const memHandler = memoryMulter.array(fieldName, maxCount);
      return (req, res, next) => {
        memHandler(req, res, (err) => {
          if (err) return next(err);
          processMemoryFiles(req, res, next);
        });
      };
    }
    return cloudinaryMulter.array(fieldName, maxCount);
  },

  fields: (fieldsArray) => {
    if (isManagedStorageActive) {
      const memHandler = memoryMulter.fields(fieldsArray);
      return (req, res, next) => {
        memHandler(req, res, (err) => {
          if (err) return next(err);
          processMemoryFiles(req, res, next);
        });
      };
    }
    return cloudinaryMulter.fields(fieldsArray);
  },
};

export default upload;
