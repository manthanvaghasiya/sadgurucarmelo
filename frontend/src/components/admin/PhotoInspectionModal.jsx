import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export default function PhotoInspectionModal({ photos = [], initialIndex = 0, isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const pinchStartDistanceRef = useRef(null);
  const lastTapRef = useRef(0);
  const containerRef = useRef(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    resetZoom();
  }, [initialIndex, isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  // Double tap to zoom toggle
  const handleDoubleTap = (e) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (scale > 1) {
        resetZoom();
      } else {
        setScale(2.5);
      }
    }
    lastTapRef.current = now;
  };

  // Touch handlers for pinch-to-zoom and pan
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // 2 fingers pinch
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      pinchStartDistanceRef.current = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
    } else if (e.touches.length === 1 && scale > 1) {
      // 1 finger pan while zoomed in
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && pinchStartDistanceRef.current) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      const ratio = currentDistance / pinchStartDistanceRef.current;
      setScale((prev) => Math.min(Math.max(prev * (ratio > 1 ? 1.03 : 0.97), 1), 4));
      pinchStartDistanceRef.current = currentDistance;
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      e.preventDefault();
      const newX = e.touches[0].clientX - dragStartRef.current.x;
      const newY = e.touches[0].clientY - dragStartRef.current.y;
      // Constrain dragging bounds
      const maxDrag = (scale - 1) * 150;
      setPosition({
        x: Math.max(Math.min(newX, maxDrag), -maxDrag),
        y: Math.max(Math.min(newY, maxDrag), -maxDrag),
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    pinchStartDistanceRef.current = null;
    if (scale <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handlePrevPhoto = (e) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetZoom();
    }
  };

  const handleNextPhoto = (e) => {
    e.stopPropagation();
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetZoom();
    }
  };

  if (!isOpen || photos.length === 0) return null;
  const currentPhoto = photos[currentIndex];
  const photoUrl = typeof currentPhoto === 'string' ? currentPhoto : currentPhoto?.url;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex flex-col justify-between backdrop-blur-md select-none touch-none"
      onClick={onClose}
    >
      {/* Top Bar with Inspection Tools */}
      <div
        className="flex items-center justify-between p-4 z-20 bg-gradient-to-b from-black/80 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <span className="text-white font-mono font-bold text-xs bg-white/20 px-3 py-1 rounded-full">
            {currentIndex + 1} / {photos.length}
          </span>
          <span className="text-brand-orange text-xs font-mono font-bold bg-brand-orange/20 px-2 py-0.5 rounded-full">
            {Math.round(scale * 100)}%
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-full px-2 py-1">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= 1}
            className="p-1.5 text-white/80 hover:text-white disabled:opacity-30 rounded-full"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={resetZoom}
            className="p-1.5 text-white/80 hover:text-white rounded-full text-xs font-mono font-bold"
            aria-label="Reset zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= 4}
            className="p-1.5 text-white/80 hover:text-white disabled:opacity-30 rounded-full"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Viewport with Pinch & Drag */}
      <div
        ref={containerRef}
        className="relative flex-1 flex items-center justify-center overflow-hidden p-2"
        onClick={handleDoubleTap}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous Button */}
        {currentIndex > 0 && (
          <button
            type="button"
            onClick={handlePrevPhoto}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center z-10 hover:bg-black/80"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Photo with Transform */}
        <div
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 200ms ease-out',
            transformOrigin: 'center center',
          }}
          className="max-w-full max-h-full flex items-center justify-center"
        >
          <img
            src={photoUrl}
            alt="Vehicle Inspection Full"
            className="max-h-[72vh] max-w-[95vw] object-contain select-none pointer-events-none rounded-lg"
          />
        </div>

        {/* Next Button */}
        {currentIndex < photos.length - 1 && (
          <button
            type="button"
            onClick={handleNextPhoto}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center z-10 hover:bg-black/80"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip for Fast Mobile Browsing */}
      <div
        className="p-3 bg-gradient-to-t from-black via-black/80 to-transparent z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[11px] font-mono text-center text-slate-400 mb-2">
          Pinch or double-tap to zoom on paint, scratches, & documents
        </p>
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {photos.map((photo, idx) => {
            const url = typeof photo === 'string' ? photo : photo?.url;
            const isSelected = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  resetZoom();
                }}
                className={`relative w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  isSelected
                    ? 'border-brand-orange scale-105 shadow-md'
                    : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={url} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
