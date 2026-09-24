import { useState } from 'react';
import { Car, ImageOff } from 'lucide-react';
import { getOptimizedUrl, extractImageUrl } from '../utils/imageUtils';

export default function CarImage({
  src,
  alt = 'Car Image',
  className = '',
  width = 600,
  quality = 'auto',
  loading = 'lazy',
  aspectRatio = 'aspect-[4/3]',
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const cleanUrl = extractImageUrl(src);
  const optimizedSrc = getOptimizedUrl(cleanUrl, width, quality);

  // If no source is provided or an error occurred, show the luxury fallback UI
  if (!cleanUrl || hasError) {
    return (
      <div className={`relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-400 p-4 ${aspectRatio}`}>
        <div className="w-12 h-12 rounded-full bg-white/70 flex items-center justify-center mb-2 shadow-sm">
          <Car className="w-6 h-6 text-gray-400" />
        </div>
        <span className="text-[11px] font-semibold tracking-wider uppercase text-gray-500">
          Photo Coming Soon
        </span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${aspectRatio}`}>
      {/* Shimmer pulse skeleton while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
      )}

      <img
        src={optimizedSrc}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`w-full h-full object-cover transition-all duration-500 ${className} ${
          isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
        }`}
      />
    </div>
  );
}
