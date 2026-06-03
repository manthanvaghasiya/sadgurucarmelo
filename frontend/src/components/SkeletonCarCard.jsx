import React from 'react';

export default function SkeletonCarCard() {
  return (
    <div className="car-card-glass rounded-2xl overflow-hidden shadow-sm flex flex-col h-full bg-white/50 border border-gray-100">
      
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] w-full bg-gray-200 animate-pulse"></div>

      {/* Content Skeleton */}
      <div className="p-3 sm:p-5 flex flex-col flex-grow">
        
        {/* Title & Price Skeleton */}
        <div className="mb-3 sm:mb-4">
          <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>

        {/* Specs Grid Skeleton */}
        <div className="grid grid-cols-2 gap-y-2 sm:gap-y-3 gap-x-1 sm:gap-x-2 mb-4 sm:mb-6 mt-auto">
          <div className="h-6 sm:h-8 bg-gray-100 rounded-md animate-pulse"></div>
          <div className="h-6 sm:h-8 bg-gray-100 rounded-md animate-pulse"></div>
          <div className="h-6 sm:h-8 bg-gray-100 rounded-md animate-pulse"></div>
          <div className="h-6 sm:h-8 bg-gray-100 rounded-md animate-pulse"></div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex flex-row gap-2 mt-auto pt-3 sm:pt-4 border-t border-gray-100">
          <div className="flex-1 h-8 sm:h-10 bg-gray-100 rounded-lg animate-pulse"></div>
          <div className="flex-1 h-8 sm:h-10 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>

      </div>
    </div>
  );
}
