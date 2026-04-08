import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCw, MoveHorizontal, Loader2, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Car360Viewer = ({ images = [], title = "360° SPIN" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [preloading, setPreloading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef(null);

  // Preload all images using new Image() for high performance
  useEffect(() => {
    if (!images || images.length === 0) return;

    setPreloading(true);
    setLoadedCount(0);
    
    let isMounted = true;
    const TOTAL_IMAGES = images.length;

    const imageObjects = images.map((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (isMounted) {
          setLoadedCount((prev) => prev + 1);
        }
      };
      img.onerror = () => {
        if (isMounted) {
          setLoadedCount((prev) => prev + 1); // Skip failed images but continue
        }
      };
      return img;
    });

    return () => {
      isMounted = false;
      imageObjects.forEach(img => img.onload = null);
    };
  }, [images]);

  // Transition out of preloading when all images are ready
  useEffect(() => {
    if (loadedCount === images.length && images.length > 0) {
      // Subtle delay for premium feel
      const timer = setTimeout(() => setPreloading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [loadedCount, images.length]);

  const handleStart = (clientX) => {
    setIsDragging(true);
    setStartX(clientX);
    setHasInteracted(true);
  };

  const handleMove = useCallback((clientX) => {
    if (!isDragging || images.length === 0) return;

    const deltaX = startX - clientX;
    const sensitivity = 12; // 12px drag movement triggers a frame change
    
    if (Math.abs(deltaX) > sensitivity) {
      const direction = deltaX > 0 ? 1 : -1;
      const steps = Math.floor(Math.abs(deltaX) / sensitivity);
      
      setCurrentIndex((prev) => {
        // Infinite looping logic using Modulo arithmetic
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

  // Touch Events (Mobile Support)
  const onTouchStart = (e) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e) => {
    // Prevent scrolling while interacting with the 360 viewer
    if (e.cancelable) e.preventDefault();
    handleMove(e.touches[0].clientX);
  };
  const onTouchEnd = handleEnd;

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[16/9] bg-gray-50 rounded-3xl flex items-center justify-center border border-dashed border-gray-200">
        <p className="font-body text-sm text-text-muted italic">No 360° spin images available.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full select-none overflow-hidden touch-none">
      {/* Viewer Container */}
      <div
        ref={containerRef}
        className={`relative w-full aspect-[16/9] bg-white rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-500 ${isDragging ? 'shadow-2xl scale-[0.995]' : 'shadow-lg'}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          {preloading ? (
            <motion.div 
              key="preloader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 bg-white flex flex-col items-center justify-center p-8"
            >
              <div className="relative mb-8">
                <Loader2 className="w-12 h-12 text-accent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-black text-accent">{Math.round((loadedCount / images.length) * 100)}%</span>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="font-heading font-black text-text uppercase tracking-tighter text-xl mb-1">Preparing 360° Experience</h3>
                <p className="font-body text-xs text-text-muted">High-resolution frame syncing...</p>
              </div>

              {/* Professional Progress Bar */}
              <div className="mt-8 w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
                <motion.div 
                  className="h-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${(loadedCount / images.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              <p className="mt-3 font-body text-[10px] font-bold text-accent uppercase tracking-widest">
                Optimizing {images.length} HD Frames
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="viewer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full relative"
            >
              {/* Main Image Rendering - Optimized with eager loading hint */}
              <img
                src={images[currentIndex]}
                alt={`Car Rotation Frame ${currentIndex + 1}`}
                className="w-full h-full object-contain pointer-events-none"
                style={{ contentVisibility: 'auto' }}
              />

              {/* UI Overlays */}
              
              {/* 360° SPIN Badge */}
              <div className="absolute top-6 left-6 z-10">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full border border-gray-100 shadow-xl">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                  <span className="font-heading font-black text-[10px] text-text uppercase tracking-[0.2em]">
                    {title}
                  </span>
                </div>
              </div>

              {/* Frame Counter Indicator */}
              <div className="absolute top-6 right-6 z-10 px-3 py-1 bg-black/5 backdrop-blur-sm rounded-lg border border-black/5">
                <span className="font-body text-[10px] font-bold text-text-muted">
                  {String(currentIndex + 1).padStart(2, '0')} / {images.length}
                </span>
              </div>

              {/* Interaction Hint: "Drag to Rotate" */}
              <AnimatePresence>
                {!hasInteracted && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center gap-4 px-6 py-3 bg-accent text-white rounded-full shadow-2xl shadow-accent/40 ring-4 ring-white/20">
                        <MoveHorizontal className="w-4 h-4 animate-bounce-x" />
                        <span className="font-heading font-bold text-xs uppercase tracking-widest whitespace-nowrap">
                          Drag to Rotate
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 opacity-60">
                        <MousePointer2 className="w-3 h-3 text-text-muted" />
                        <span className="font-body text-[10px] font-bold text-text-muted uppercase">Interactive 3D View</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Perspective Shadow for Depth */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-black/10 blur-3xl rounded-[100%] -z-10" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tailwind Custom Animation for the hint */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-x {
          0%, 100% { transform: translateX(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
          50% { transform: translateX(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
      `}} />
    </div>
  );
};

export default Car360Viewer;
