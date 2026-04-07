import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCw, Maximize2, MoveHorizontal, Loader2 } from 'lucide-react';

const Car360Viewer = ({ images = [], title = "Full 360° Spin" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [preloading, setPreloading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const containerRef = useRef(null);

  // Preload all images for smooth spinning
  useEffect(() => {
    if (!images || images.length === 0) return;

    setPreloading(true);
    setLoadedCount(0);
    
    const imageObjects = images.map((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => setLoadedCount((prev) => prev + 1);
      return img;
    });

    return () => {
      imageObjects.forEach(img => img.onload = null);
    };
  }, [images]);

  useEffect(() => {
    if (loadedCount === images.length && images.length > 0) {
      setPreloading(false);
    }
  }, [loadedCount, images.length]);

  const handleStart = (clientX) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = useCallback((clientX) => {
    if (!isDragging || images.length === 0) return;

    const deltaX = startX - clientX;
    const sensitivity = 10; // Pixels to move to change one image
    
    if (Math.abs(deltaX) > sensitivity) {
      const direction = deltaX > 0 ? 1 : -1;
      const steps = Math.floor(Math.abs(deltaX) / sensitivity);
      
      setCurrentIndex((prev) => {
        let next = (prev + direction * steps) % images.length;
        if (next < 0) next = images.length + next;
        return next;
      });
      
      setStartX(clientX);
    }
  }, [isDragging, images.length, startX]);

  const handleEnd = () => {
    setIsDragging(false);
  };

  // Mouse Events
  const onMouseDown = (e) => handleStart(e.clientX);
  const onMouseMove = (e) => handleMove(e.clientX);
  const onMouseUp = handleEnd;
  const onMouseLeave = handleEnd;

  // Touch Events
  const onTouchStart = (e) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e) => handleMove(e.touches[0].clientX);
  const onTouchEnd = handleEnd;

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[16/9] bg-gray-100 rounded-3xl flex items-center justify-center border border-dashed border-gray-300">
        <p className="font-body text-sm text-text-muted italic">No 360° spin images available for this vehicle.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* Viewer Container */}
      <div
        ref={containerRef}
        className={`relative w-full aspect-[16/9] bg-white rounded-3xl overflow-hidden border border-gray-100 cursor-grab active:cursor-grabbing transition-shadow ${isDragging ? 'shadow-2xl' : 'shadow-lg'}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Preloader Overlay */}
        {preloading && (
          <div className="absolute inset-0 z-20 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity">
            <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
            <p className="font-heading font-bold text-text">Preloading 360° Experience...</p>
            <div className="mt-4 w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${(loadedCount / images.length) * 100}%` }}
              />
            </div>
            <p className="mt-2 font-body text-xs text-text-muted">
              {loadedCount} of {images.length} HD frames
            </p>
          </div>
        )}

        {/* Current Image */}
        {!preloading && (
          <img
            src={images[currentIndex]}
            alt={`Car View ${currentIndex + 1}`}
            className="w-full h-full object-cover pointer-events-none"
            loading="eager"
          />
        )}

        {/* UI Overlays */}
        {!preloading && (
          <>
            {/* Top Indicator */}
            <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full border border-white/50 shadow-sm z-10 transition-transform active:scale-95">
              <RotateCw className={`w-4 h-4 text-accent ${isDragging ? 'animate-spin' : ''}`} />
              <span className="font-body text-[10px] font-black text-text uppercase tracking-widest">
                {title}
              </span>
            </div>

            {/* Interaction Hint */}
            <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 bg-black/60 backdrop-blur-xl text-white rounded-full transition-opacity duration-500 z-10 ${isDragging ? 'opacity-0' : 'opacity-100'}`}>
              <MoveHorizontal className="w-4 h-4 text-accent animate-pulse" />
              <span className="font-body text-xs font-semibold">
                Drag to Spin
              </span>
            </div>

            {/* Frame Indicator */}
            <div className="absolute bottom-6 right-6 px-3 py-1.5 bg-white/80 backdrop-blur-md rounded-lg border border-white/50 text-[10px] font-bold text-text-muted z-10">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      
      {/* Quick Visual Polish: Shadow bottom */}
      <div className="w-[85%] h-6 mx-auto bg-black/10 blur-xl rounded-[100%] mt-[-10px] -z-10" />
    </div>
  );
};

export default Car360Viewer;
