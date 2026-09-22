import { v2 as cloudinary } from 'cloudinary';
import { upload, isR2Configured, uploadBufferToR2, deleteFromR2 } from './storage.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { upload, isR2Configured, uploadBufferToR2, deleteFromR2 };
export default cloudinary;
