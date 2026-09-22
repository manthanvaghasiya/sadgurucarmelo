import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { getOptimizedUrl } from '../utils/imageUtils';

export default function CompareFloatingBar() {
  const { compareCars, removeFromCompare, clearCompare } = useCompare();
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(false);

  // Don't show on the actual comparison page or if list is empty
  if (compareCars.length === 0 || location.pathname === '/compare') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="fixed bottom-[88px] md:bottom-6 left-1/2 -translate-x-1/2 z-[70] w-[94%] max-w-2xl pointer-events-auto"
      >
        {isMinimized ? (
          /* Minimized Compact Badge */
          <div className="flex justify-center">
            <button
              onClick={() => setIsMinimized(false)}
              className="bg-slate-900/95 backdrop-blur-xl border border-amber-500/40 text-white rounded-full px-5 py-2.5 shadow-[0_15px_35px_rgba(0,0,0,0.4)] flex items-center gap-2.5 text-xs font-heading font-bold hover:scale-105 active:scale-95 transition-all"
            >
              <div className="w-5 h-5 rounded-full bg-brand-orange text-white flex items-center justify-center text-[11px] font-black">
                {compareCars.length}
              </div>
              <span className="text-amber-300">Cars in Compare</span>
              <ChevronUp className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        ) : (
          /* Full Floating Comparison Bar */
          <div className="bg-slate-900/95 backdrop-blur-xl border border-amber-500/30 text-white rounded-2xl p-2.5 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)] flex items-center justify-between gap-2.5 sm:gap-4">
            {/* Left: Selected Car Thumbnails */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-0.5 scrollbar-none">
              <div className="hidden sm:flex items-center gap-2 pr-2 border-r border-slate-700 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-brand-orange/20 text-brand-orange flex items-center justify-center">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-[11px] font-bold text-amber-300 block uppercase tracking-wider leading-none">
                    Compare
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {compareCars.length}/3 Selected
                  </span>
                </div>
              </div>

              {compareCars.map((car) => {
                const carId = String(car._id || car.id || '');
                const img = car.image || (car.images && car.images[0]) || '';
                return (
                  <div
                    key={carId}
                    className="relative w-12 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden border border-slate-700 bg-slate-800 shrink-0 group shadow-sm"
                  >
                    <img
                      src={getOptimizedUrl(img, 200)}
                      alt={car.model || 'Car'}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCompare(carId);
                      }}
                      className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] shadow-sm hover:scale-110 active:scale-90 transition-transform"
                      title="Remove"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                    <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 px-1 text-[8px] truncate text-center text-slate-200">
                      {car.model || car.make || 'Car'}
                    </div>
                  </div>
                );
              })}

              {/* Empty Slots */}
              {Array.from({ length: Math.max(0, 3 - compareCars.length) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="w-12 h-10 sm:w-16 sm:h-12 rounded-lg border border-dashed border-slate-700 flex items-center justify-center text-slate-600 text-[9px] font-medium shrink-0"
                >
                  + Slot
                </div>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Link
                to="/compare"
                className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500 text-slate-950 font-heading font-black text-xs sm:text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                <span>Compare ({compareCars.length})</span>
              </Link>

              <button
                onClick={() => setIsMinimized(true)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                title="Minimize"
              >
                <ChevronDown className="w-4 h-4" />
              </button>

              <button
                onClick={clearCompare}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition-colors"
                title="Clear all"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
