/**
 * @file frontend/src/components/compare/CompareMatrixTable.jsx
 * @description Side-by-side comparison matrix component presenting technical specifications,
 * difference highlighting, calculated EMIs, and empty slot placeholders.
 * Fully optimized for Flutter/iOS native mobile app experience with side-by-side mobile matrix
 * and sticky top comparison HUD.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Sparkles, ChevronRight, Layers, ArrowLeftRight } from 'lucide-react';
import { getOptimizedUrl } from '../../utils/imageUtils';
import WhatsAppIcon from '../WhatsAppIcon';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

export default function CompareMatrixTable({
  compareCars = [],
  emptySlotsCount = 0,
  comparisonRows = [],
  highlightDiff = false,
  hasRowDifference,
  formatRupee,
  onRemoveFromCompare,
  onOpenSelector,
  whatsappMessage,
}) {
  const colCount = compareCars.length + emptySlotsCount;

  return (
    <div className="bg-white rounded-[24px] sm:rounded-[36px] shadow-[0_12px_45px_rgba(15,23,42,0.06)] border border-slate-200/90 overflow-hidden">

      {/* ══════════════════════════════════════════════════════════════
          1. TOP CAR CARDS: DESKTOP & TABLET VIEW (UNCHANGED & INTACT)
          ══════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block p-6 sm:p-8 bg-[#F8FAFC] border-b border-slate-200/80">
        <div className="grid md:grid-cols-3 gap-6">
          {compareCars.map((car) => {
            const carId = car._id || car.id;
            const img = car.image || (car.images && car.images[0]) || '';
            return (
              <div
                key={carId}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/90 flex flex-col justify-between relative group hover:border-brand-orange/40 transition-colors"
              >
                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => onRemoveFromCompare(carId)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 hover:bg-red-600 hover:text-white text-slate-400 shadow-sm border border-slate-200 flex items-center justify-center transition-all z-10 cursor-pointer"
                  title="Remove from comparison"
                >
                  <X className="w-4 h-4" />
                </button>

                <div>
                  {/* Car Image Frame */}
                  <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 mb-3 relative">
                    <img
                      src={getOptimizedUrl(img, 600)}
                      alt={car.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {car.status === 'Coming Soon' && (
                      <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                        Coming Soon
                      </div>
                    )}
                  </div>

                  {/* Car Headings */}
                  <span className="text-[10px] font-heading font-black text-brand-orange uppercase tracking-wider block">
                    {car.make}
                  </span>
                  <h3 className="font-heading font-black text-base sm:text-lg text-slate-900 leading-snug mb-1 truncate">
                    {car.model} {car.year ? `(${car.year})` : ''}
                  </h3>
                  <p className="font-heading font-black text-xl text-brand-orange mb-4">
                    {formatRupee(car.price)}
                  </p>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <Link
                    to={`/car-details/${carId}`}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-heading font-bold text-xs text-center transition-colors truncate"
                  >
                    <span>વિગત જુઓ · Details</span>
                  </Link>

                  <a
                    href={buildWhatsAppUrl(
                      `નમસ્તે સદગુરુ કાર મેળો, હું ${car.make} ${car.model} (${car.year || ''}) સરખાવી રહ્યો છું. કૃપા કરીને બેસ્ટ ડીલ જણાવો.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center transition-colors shrink-0"
                    title="WhatsApp"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}

          {/* Empty Slot Fillers (Desktop) */}
          {Array.from({ length: emptySlotsCount }).map((_, slotIdx) => (
            <div
              key={`empty-slot-${slotIdx}`}
              onClick={() => onOpenSelector(compareCars.length + slotIdx)}
              className="rounded-2xl border-2 border-dashed border-slate-300 hover:border-brand-orange bg-white/70 hover:bg-orange-50/20 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[260px] group"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-brand-orange text-brand-orange group-hover:text-white flex items-center justify-center mb-3 transition-colors shadow-xs">
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h4 className="font-heading font-black text-slate-800 text-sm mb-1">
                બીજી કાર ઉમેરો · Add Car
              </h4>
              <p className="text-slate-500 text-xs font-body">
                સરખામણી માટે ઇન્વેન્ટરીમાંથી પસંદ કરો
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. TOP CAR CARDS: NATIVE MOBILE DOCK (SIDE-BY-SIDE SPLIT)
          ══════════════════════════════════════════════════════════════ */}
      <div className="md:hidden p-3.5 bg-[#F8FAFC] border-b border-slate-200/80">
        <div className={`grid ${compareCars.length + emptySlotsCount >= 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
          {compareCars.map((car) => {
            const carId = car._id || car.id;
            const img = car.image || (car.images && car.images[0]) || '';
            return (
              <div
                key={carId}
                className="bg-white rounded-2xl p-2.5 shadow-2xs border border-slate-200/90 flex flex-col justify-between relative"
              >
                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => onRemoveFromCompare(carId)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center shadow-xs z-10 active:scale-90 transition-transform cursor-pointer"
                  title="Remove"
                  aria-label="Remove car"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div>
                  {/* Car Image */}
                  <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 mb-2 relative">
                    <img
                      src={getOptimizedUrl(img, 300)}
                      alt={car.model}
                      className="w-full h-full object-cover"
                    />
                    {car.status === 'Coming Soon' && (
                      <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-amber-500 text-white text-[8px] font-black uppercase shadow-xs">
                        Soon
                      </div>
                    )}
                  </div>

                  {/* Make & Model */}
                  <span className="text-[9px] font-heading font-black text-brand-orange uppercase block leading-none mb-0.5 truncate">
                    {car.make}
                  </span>
                  <h4 className="font-heading font-black text-xs text-slate-900 leading-tight mb-1 truncate" title={car.model}>
                    {car.model}
                  </h4>
                  <p className="font-heading font-black text-sm text-brand-orange leading-tight mb-2 truncate">
                    {formatRupee(car.price)}
                  </p>
                </div>

                {/* Mobile Quick Action Buttons */}
                <div className="flex items-center gap-1 pt-1.5 border-t border-slate-100">
                  <Link
                    to={`/car-details/${carId}`}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-heading font-bold text-[10px] text-center truncate transition-colors"
                  >
                    View
                  </Link>

                  <a
                    href={buildWhatsAppUrl(
                      `નમસ્તે સદગુરુ કાર મેળો, હું ${car.make} ${car.model} (${car.year || ''}) સરખાવી રહ્યો છું. કૃપા કરીને બેસ્ટ ડીલ જણાવો.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shrink-0 active:scale-90"
                    title="WhatsApp"
                    aria-label="WhatsApp"
                  >
                    <WhatsAppIcon className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}

          {/* Empty Slot Fillers (Mobile) */}
          {Array.from({ length: emptySlotsCount }).map((_, slotIdx) => (
            <div
              key={`empty-mobile-slot-${slotIdx}`}
              onClick={() => onOpenSelector(compareCars.length + slotIdx)}
              className="rounded-2xl border-2 border-dashed border-slate-300 hover:border-brand-orange bg-white/70 p-3 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition-all min-h-[140px]"
            >
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center mb-1.5 shadow-2xs">
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h5 className="font-heading font-black text-slate-800 text-[11px] leading-tight mb-0.5">
                + બીજી કાર
              </h5>
              <span className="text-slate-400 text-[9px] font-body leading-tight">
                Add Car
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          3. STICKY MOBILE COMPARISON HUD BAR (Sticks when scrolling specs)
          ══════════════════════════════════════════════════════════════ */}
      {compareCars.length > 0 && (
        <div className="md:hidden sticky top-14 z-30 bg-white/95 backdrop-blur-xl border-y border-slate-200/90 shadow-2xs py-2 px-3 flex items-center justify-between">
          {compareCars.map((car, cIdx) => (
            <React.Fragment key={`sticky-hud-${car._id || car.id}`}>
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <img
                  src={getOptimizedUrl(car.image || (car.images && car.images[0]) || '', 80)}
                  alt={car.model}
                  className="w-7 h-7 rounded-lg object-cover shrink-0 border border-slate-200 shadow-2xs"
                />
                <div className="truncate">
                  <p className="text-[10px] font-heading font-black text-slate-900 truncate leading-none">
                    {car.make} {car.model?.split(' ')[0]}
                  </p>
                  <p className="text-[9px] font-heading font-black text-brand-orange mt-0.5 leading-none">
                    {formatRupee(car.price)}
                  </p>
                </div>
              </div>
              {cIdx === 0 && compareCars.length > 1 && (
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[8px] font-mono font-black flex items-center justify-center shrink-0 mx-1.5 shadow-xs">
                  VS
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* WhatsApp Advisor Banner */}
      {compareCars.length >= 2 && (
        <div className="p-4 sm:p-6 bg-emerald-50/80 border-b border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
              <WhatsAppIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-heading font-black text-slate-900 text-xs sm:text-sm">
                ગાડી પસંદ કરવામાં અસમંજસ છે? સદગુરુ કાર એક્સપર્ટની સલાહ લો!
              </p>
              <p className="text-[11px] sm:text-xs text-slate-600 font-body">
                આ {compareCars.length} મોડેલમાંથી તમારા બજેટ અને વપરાશ મુજબ કઈ ગાડી શ્રેષ્ઠ રહેશે તે WhatsApp પર પૂછો.
              </p>
            </div>
          </div>
          <a
            href={buildWhatsAppUrl(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-black text-xs flex items-center justify-center gap-2 shadow-xs shrink-0 active:scale-95 transition-all"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>એક્સપર્ટ સલાહ · Consult</span>
          </a>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          4. SPECIFICATION ROWS: NATIVE MOBILE VIEW (SIDE-BY-SIDE SPLIT)
          ══════════════════════════════════════════════════════════════ */}
      <div className="md:hidden divide-y divide-slate-100 p-3">
        {comparisonRows.map((cat, catIdx) => (
          <div key={`mob-cat-${catIdx}`} className="py-4 first:pt-1 last:pb-2">
            {/* Category Header */}
            <h3 className="font-heading font-black text-xs text-brand-orange uppercase tracking-wider mb-3 pb-1 border-b border-amber-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>{cat.category}</span>
            </h3>

            <div className="space-y-2">
              {cat.items.map((item, itemIdx) => {
                const differs = highlightDiff && hasRowDifference(item);
                return (
                  <div
                    key={`mob-item-${itemIdx}`}
                    className={`p-2.5 rounded-2xl transition-all ${
                      differs
                        ? 'bg-amber-50/80 border border-brand-orange/30 shadow-2xs'
                        : 'bg-slate-50/70 border border-slate-100'
                    }`}
                  >
                    {/* Specification Title & Difference Pill */}
                    <div className="flex items-center justify-between gap-1 mb-1.5 px-0.5">
                      <span className="font-heading font-bold text-xs text-slate-700">
                        {item.label}
                      </span>
                      {differs && (
                        <span className="text-[8px] bg-brand-orange text-white px-2 py-0.5 rounded-full font-heading font-black uppercase tracking-wider shadow-2xs">
                          Diff
                        </span>
                      )}
                    </div>

                    {/* Side-by-Side Split Boxes */}
                    <div className={`grid ${compareCars.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-1.5`}>
                      {compareCars.map((car, cIdx) => {
                        const carId = car._id || car.id;
                        return (
                          <div
                            key={`mob-val-${carId}-${itemIdx}`}
                            className={`rounded-xl p-2 flex flex-col justify-center text-center shadow-2xs border ${
                              cIdx === 1 && differs
                                ? 'bg-white border-brand-orange/40 ring-1 ring-brand-orange/20'
                                : 'bg-white border-slate-200/80'
                            }`}
                          >
                            <span className="text-[9px] font-heading font-bold text-slate-400 uppercase tracking-wider mb-0.5 truncate">
                              {car.model?.split(' ')[0]}
                            </span>
                            <div className="text-xs font-heading font-black text-slate-900 break-words leading-tight">
                              {item.render(car)}
                            </div>
                          </div>
                        );
                      })}

                      {/* Empty Slot Placeholder in Row */}
                      {Array.from({ length: emptySlotsCount }).map((_, i) => (
                        <div
                          key={`mob-empty-row-${i}`}
                          onClick={() => onOpenSelector(compareCars.length + i)}
                          className="rounded-xl p-2 border border-dashed border-slate-300 bg-white/70 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                          <span className="text-[9px] text-slate-400 font-bold leading-none">+ Add</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          5. SPECIFICATION ROWS: DESKTOP & TABLET VIEW (UNCHANGED & INTACT)
          ══════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block divide-y divide-slate-100">
        {comparisonRows.map((cat, catIdx) => (
          <div key={catIdx} className="p-6 sm:p-8">
            <h3 className="font-heading font-black text-sm text-brand-orange uppercase tracking-wider mb-4 pb-2 border-b border-amber-500/20">
              {cat.category}
            </h3>

            <div className="space-y-1.5">
              {cat.items.map((item, itemIdx) => {
                const differs = highlightDiff && hasRowDifference(item);
                return (
                  <div
                    key={itemIdx}
                    className={`grid grid-cols-4 gap-6 py-3 px-3 rounded-xl border-b border-slate-50 items-center text-sm transition-colors ${
                      differs
                        ? 'bg-amber-50/70 border-l-4 border-l-brand-orange text-slate-900 font-medium'
                        : 'hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Row Specification Label */}
                    <div className="font-heading font-bold text-slate-600 text-xs sm:text-sm flex items-center gap-2">
                      <span>{item.label}</span>
                      {differs && (
                        <span className="text-[9px] bg-brand-orange text-white px-1.5 py-0.5 rounded font-mono font-black uppercase tracking-wider">
                          Diff
                        </span>
                      )}
                    </div>

                    {/* Compared Car Values */}
                    {compareCars.map((car) => {
                      const carId = car._id || car.id;
                      return (
                        <div
                          key={carId}
                          className="font-medium text-slate-800 text-xs sm:text-sm"
                        >
                          {item.render(car)}
                        </div>
                      );
                    })}

                    {/* Empty Slots */}
                    {Array.from({ length: emptySlotsCount }).map((_, i) => (
                      <div key={`empty-val-${i}`} className="text-slate-300 text-xs">
                        —
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
