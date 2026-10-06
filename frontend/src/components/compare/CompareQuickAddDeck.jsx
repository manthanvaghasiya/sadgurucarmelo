/**
 * @file frontend/src/components/compare/CompareQuickAddDeck.jsx
 * @description Quick-Add Showroom Shelf presenting verified available inventory with
 * 1-click '+ Add to Compare' buttons, preventing empty-state dead space.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Fuel, Settings2, Sparkles, ArrowRight } from 'lucide-react';
import { getOptimizedUrl } from '../../utils/imageUtils';

export default function CompareQuickAddDeck({
  availableCars = [],
  compareCars = [],
  onAddToCompare,
  formatRupee,
}) {
  if (availableCars.length === 0) return null;

  return (
    <div className="mt-8 pt-8 border-t border-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-[10px] font-mono font-bold text-brand-orange uppercase tracking-wider block">
            QUICK ADD FROM LIVE INVENTORY
          </span>
          <h3 className="text-lg sm:text-xl font-heading font-black text-slate-900">
            ઇન્વેન્ટરીમાંથી ઝડપથી કાર ઉમેરો
          </h3>
        </div>
        <span className="text-xs font-mono font-semibold text-slate-500">
          {availableCars.length} કાર ઉપલબ્ધ છે · Click to compare
        </span>
      </div>

      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
        {availableCars.slice(0, 8).map((car) => {
          const carId = car._id || car.id;
          const img = car.image || (car.images && car.images[0]) || '';
          const isSelected = compareCars.some((comp) => String(comp._id || comp.id) === String(carId));

          return (
            <motion.div
              key={carId}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="w-[230px] sm:w-auto shrink-0 snap-start bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail */}
                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 mb-2.5 relative">
                  <img
                    src={getOptimizedUrl(img, 400)}
                    alt={car.model}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {car.status === 'Coming Soon' && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider">
                      Coming Soon
                    </span>
                  )}
                </div>

                {/* Make & Model */}
                <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider block">
                  {car.make}
                </span>
                <h4 className="font-heading font-black text-slate-900 text-sm leading-snug truncate">
                  {car.model} {car.year ? `(${car.year})` : ''}
                </h4>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-1">
                  <span>{car.fuelType || 'Petrol'}</span>
                  <span>•</span>
                  <span>{car.transmission || 'Manual'}</span>
                  <span>•</span>
                  <span>{car.kms ? `${(car.kms / 1000).toFixed(0)}k km` : 'Low KM'}</span>
                </div>

                <p className="font-heading font-black text-slate-900 text-base mt-2">
                  {formatRupee(car.price)}
                </p>
              </div>

              {/* Add Button */}
              <div className="mt-3 pt-2.5 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSelected || compareCars.length >= 3}
                  onClick={() => onAddToCompare(car)}
                  className={`w-full py-2 px-3 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                      : compareCars.length >= 3
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-950 hover:bg-brand-orange text-white shadow-xs active:scale-95'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>પસંદ કરેલ છે (Added)</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>સરખામણીમાં ઉમેરો</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
