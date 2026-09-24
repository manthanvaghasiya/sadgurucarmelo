import { v2 as cloudinary } from 'cloudinary';
import {
  upload,
  isImageKitConfigured,
  isR2Configured,
  uploadToImageKit,
  deleteFromImageKit,
  uploadBufferToR2,
  deleteFromR2,
  uploadMedia,
  deleteMedia,
} from './storage.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export {
  upload,
  isImageKitConfigured,
  isR2Configured,
  uploadToImageKit,
  deleteFromImageKit,
  uploadBufferToR2,
  deleteFromR2,
  uploadMedia,
  deleteMedia,
};
export default cloudinary;
