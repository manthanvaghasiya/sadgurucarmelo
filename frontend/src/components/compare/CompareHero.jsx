/**
 * @file frontend/src/components/compare/CompareHero.jsx
 * @description Luxury light-mode Hero header for the Compare Cars page, featuring
 * bilingual automotive headlines, value badges, difference toggle, and quick actions.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeftRight,
  Sparkles,
  Plus,
  Trash2,
} from 'lucide-react';
import { COMPARE_VALUE_BADGES } from '../../data/compareCarsData';

export default function CompareHero({
  compareCount = 0,
  highlightDiff = false,
  onToggleHighlight,
  onClearCompare,
  onOpenSelector,
}) {
  return (
    <section className="relative pt-12 sm:pt-16 md:pt-20 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FDFCFB] via-[#FAF9F6] to-white border-b border-slate-100 overflow-hidden text-center sm:text-left">
      {/* Ambient Radiance */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[350px] bg-gradient-to-br from-amber-200/20 via-brand-orange/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle Architectural Grid Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_50%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/25 text-brand-orange font-heading font-black text-xs uppercase tracking-widest mb-3.5 shadow-xs">
              <ArrowLeftRight className="w-3.5 h-3.5 text-brand-orange" />
              <span>વિગતવાર સરખામણી · SIDE-BY-SIDE INTELLIGENCE</span>
            </div>

            {/* Master Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-950 font-heading tracking-tight leading-[1.18]">
              કારની સ્માર્ટ સરખામણી{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">
                · Compare Cars
                <svg
                  className="absolute -bottom-2 sm:-bottom-3.5 left-0 w-full h-3 sm:h-4 text-brand-orange overflow-visible pointer-events-none"
                  viewBox="0 0 160 20"
                  fill="none"
                >
                  <path
                    d="M3 9C45 19 115 19 157 8"
                    stroke="currentColor"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-600 font-medium max-w-2xl font-body leading-relaxed">
              તમારી પસંદગીની 2 અથવા 3 કારની કિંમત, માસિક EMI, એન્જિન ક્ષમતા, સલામતી અને સુવિધાઓ સરખાવીને તમારા પરિવાર માટે શ્રેષ્ઠ નિર્ણય લો.
            </p>
          </div>

          {/* Action Button Controls */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 self-center sm:self-auto">
            {compareCount < 3 && (
              <button
                type="button"
                onClick={() => onOpenSelector(compareCount)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-orange hover:bg-orange-600 text-white font-heading font-black text-xs sm:text-sm shadow-md shadow-brand-orange/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>કાર ઉમેરો · Add Car</span>
              </button>
            )}

            {compareCount >= 2 && (
              <button
                type="button"
                onClick={onToggleHighlight}
                className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl border text-xs sm:text-sm font-heading font-bold transition-all shadow-xs cursor-pointer ${
                  highlightDiff
                    ? 'bg-amber-500 text-white border-amber-500 shadow-amber-500/25'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-amber-400 hover:bg-amber-50/40'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{highlightDiff ? 'તફાવત હાઇલાઇટ છે' : 'તફાવત હાઇલાઇટ કરો'}</span>
              </button>
            )}

            {compareCount > 0 && (
              <button
                type="button"
                onClick={onClearCompare}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ક્લિયર કરો</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Value Badges Ribbon */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-left">
          {COMPARE_VALUE_BADGES.map((b, idx) => {
            const BIcon = b.icon;
            return (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3"
              >
                <div className={`w-9 h-9 rounded-xl ${b.bg} border flex items-center justify-center shrink-0`}>
                  <BIcon className={`w-4 h-4 ${b.color}`} />
                </div>
                <div className="truncate">
                  <h4 className="text-xs font-heading font-black text-slate-900 truncate">
                    {b.label}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 font-semibold block truncate">
                    {b.sub}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
