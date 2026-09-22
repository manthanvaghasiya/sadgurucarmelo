/**
 * Utility functions for handling and optimizing images across Cloudinary, ImageKit, and Cloudflare R2.
 */

/**
 * Automatically injects auto-format, auto-quality, and responsive width parameters
 * into image URLs to drastically reduce file sizes and save bandwidth.
 * 
 * @param {string} url - The original image URL
 * @param {number} [width] - Desired width in pixels (e.g., 400 for cards, 800 for 360 spin, 1200 for hero)
 * @param {string|number} [quality='auto'] - Image quality parameter
 * @returns {string} - The optimized image URL
 */
export const getOptimizedUrl = (url, width, quality = 'auto') => {
  if (!url || typeof url !== 'string') return url;

  // 1. Cloudinary URL optimization
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    let transform = `f_auto,q_${quality}`;
    if (width && typeof width === 'number') {
      transform += `,w_${width},c_limit`;
    }

    // If URL already has /upload/f_auto,q_auto/, replace it with width-aware transform
    if (url.includes('/upload/f_auto,q_auto/')) {
      return url.replace('/upload/f_auto,q_auto/', `/upload/${transform}/`);
    }

    // If standard /upload/, inject transform
    if (!url.includes(`/upload/${transform}/`)) {
      return url.replace('/upload/', `/upload/${transform}/`);
    }

    return url;
  }

  // 2. ImageKit URL optimization (compatible with Hari Ram pattern)
  if (url.includes('ik.imagekit.io')) {
    const qVal = quality === 'auto' ? 80 : quality;
    let tr = `q-${qVal},f-auto`;
    if (width && typeof width === 'number') {
      tr = `w-${width},${tr}`;
    }

    if (url.includes('?tr=')) {
      return url.replace(/\?tr=[^&]+/, `?tr=${tr}`);
    }
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}tr=${tr}`;
  }

  // 3. Cloudflare R2 / Custom CDN URLs
  // R2 images delivered via Cloudflare with Cache-Control headers
  return url;
};

