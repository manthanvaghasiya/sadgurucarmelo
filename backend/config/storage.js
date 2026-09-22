import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

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
 * Upload a raw buffer to Cloudflare R2 object storage.
 * 
 * @param {Buffer} buffer - File buffer
 * @param {string} originalName - Original file name
 * @param {string} mimeType - File mime type (e.g. image/webp, image/jpeg)
 * @param {string} [folder='cars'] - Target folder in bucket
 * @returns {Promise<{url: string, key: string, path: string, filename: string}>}
 */
export async function uploadBufferToR2(buffer, originalName = 'photo.jpg', mimeType = 'image/jpeg', folder = 'cars') {
  if (!r2Client) {
    throw new Error('Cloudflare R2 is not configured. Missing R2 environment variables.');
  }

  const cleanName = (originalName || 'file').replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${cleanName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimeType || 'image/jpeg',
    CacheControl: 'public, max-age=31536000, immutable',
  });

  await r2Client.send(command);

  // Use custom domain (e.g. media.sadgurucarmelo.com) or fallback to pub-r2.dev URL
  const publicDomain = (process.env.R2_PUBLIC_DOMAIN || `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.dev`).replace(/\/$/, '');
  const url = `${publicDomain}/${key}`;

  return {
    url,
    key,
    path: url,      // Compatible with Cloudinary file.path
    filename: key,  // Compatible with Cloudinary file.filename
  };
}

/**
 * Delete an object from Cloudflare R2.
 */
export async function deleteFromR2(key) {
  if (!r2Client || !key) return;
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });
    await r2Client.send(command);
  } catch (err) {
    console.warn(`Failed to delete object ${key} from R2:`, err.message);
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
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  },
});

// ── Dual-Storage Multer Middleware ──
// If R2 is configured: uploads to memory buffer then auto-uploads to Cloudflare R2
// If R2 is not configured: falls back gracefully to Cloudinary
const memoryMulter = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

const cloudinaryMulter = multer({
  storage: cloudinaryStorage,
  limits: { fileSize: 25 * 1024 * 1024 },
});

// Process memory files to R2 in middleware
const processR2Files = async (req, res, next) => {
  if (!isR2Configured) return next();

  try {
    // 1. Single file
    if (req.file && req.file.buffer) {
      const uploaded = await uploadBufferToR2(req.file.buffer, req.file.originalname, req.file.mimetype);
      req.file.path = uploaded.url;
      req.file.filename = uploaded.key;
    }

    // 2. Array of files
    if (req.files && Array.isArray(req.files)) {
      await Promise.all(
        req.files.map(async (f) => {
          if (f.buffer) {
            const uploaded = await uploadBufferToR2(f.buffer, f.originalname, f.mimetype);
            f.path = uploaded.url;
            f.filename = uploaded.key;
          }
        })
      );
    }

    // 3. Fields with files
    if (req.files && !Array.isArray(req.files) && typeof req.files === 'object') {
      const fieldKeys = Object.keys(req.files);
      for (const key of fieldKeys) {
        const fileList = req.files[key];
        if (Array.isArray(fileList)) {
          await Promise.all(
            fileList.map(async (f) => {
              if (f.buffer) {
                const uploaded = await uploadBufferToR2(f.buffer, f.originalname, f.mimetype);
                f.path = uploaded.url;
                f.filename = uploaded.key;
              }
            })
          );
        }
      }
    }

    next();
  } catch (err) {
    console.error('Cloudflare R2 Upload Error:', err);
    res.status(500).json({ success: false, message: 'Failed to upload media to Cloudflare R2: ' + err.message });
  }
};

/**
 * Unified Multer uploader that automatically routes to Cloudflare R2 (when configured)
 * or falls back to Cloudinary.
 */
export const upload = {
  single: (fieldName) => {
    if (isR2Configured) {
      const memHandler = memoryMulter.single(fieldName);
      return (req, res, next) => {
        memHandler(req, res, (err) => {
          if (err) return next(err);
          processR2Files(req, res, next);
        });
      };
    }
    return cloudinaryMulter.single(fieldName);
  },

  array: (fieldName, maxCount) => {
    if (isR2Configured) {
      const memHandler = memoryMulter.array(fieldName, maxCount);
      return (req, res, next) => {
        memHandler(req, res, (err) => {
          if (err) return next(err);
          processR2Files(req, res, next);
        });
      };
    }
    return cloudinaryMulter.array(fieldName, maxCount);
  },

  fields: (fieldsArray) => {
    if (isR2Configured) {
      const memHandler = memoryMulter.fields(fieldsArray);
      return (req, res, next) => {
        memHandler(req, res, (err) => {
          if (err) return next(err);
          processR2Files(req, res, next);
        });
      };
    }
    return cloudinaryMulter.fields(fieldsArray);
  },
};

export default upload;
