/**
 * Utility functions for handling images in the application.
 */

/**
 * Automatically injects auto-format and auto-quality parameters
 * into a Cloudinary URL to drastically reduce file sizes for the web.
 * 
 * @param {string} url - The original image URL
 * @returns {string} - The optimized image URL
 */
export const getOptimizedUrl = (url) => {
    if (!url || typeof url !== 'string') return url;

    // Check if the URL is a Cloudinary URL and hasn't been manually optimized yet over /upload/
    if (url.includes('cloudinary.com') && url.includes('/upload/') && !url.includes('/upload/f_auto,q_auto/')) {
        return url.replace('/upload/', '/upload/f_auto,q_auto/');
    }

    return url;
};
