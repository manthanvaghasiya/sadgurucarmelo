/**
 * @file frontend/src/components/compare/ComparePopularMatchups.jsx
 * @description Curated trending automotive matchups in Surat, offering 1-click comparison
 * triggers between popular models (e.g. Creta vs Seltos, Swift vs Baleno, Innova vs XUV700).
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { POPULAR_MATCHUPS } from '../../data/compareCarsData';

export default function ComparePopularMatchups({ onSelectMatchup }) {
  return (
    <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-b border-slate-100 relative overflow-hidden">
      {/* Soft Ambient Radiance */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[300px] bg-gradient-to-br from-amber-100/25 to-transparent rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 font-heading font-black text-xs uppercase tracking-widest mb-3 shadow-xs">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            લોકપ્રિય સરખામણી જોડીઓ · TRENDING MATCHUPS IN SURAT
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 font-heading tracking-tight leading-tight">
            સુરતમાં સૌથી વધુ{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">
              સરખામણી થતી જોડીઓ
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium leading-relaxed font-body">
            તમારો સમય બચાવો. સુરતના ગ્રાહકો જે ટોચની કાર્સ વચ્ચે સૌથી વધુ સરખામણી કરે છે, તે લોકપ્રિય જોડીઓ જુઓ:
          </p>
        </div>

        {/* Matchups 4-Card Reel / Grid (Swipeable Reel on Mobile, 2-Col Grid on Desktop) */}
        <div className="mobile-app-snap-reel flex md:grid md:grid-cols-2 gap-4 sm:gap-6 items-stretch -mx-2 px-2 sm:mx-0 sm:px-0 pb-3">
          {POPULAR_MATCHUPS.map((matchup, idx) => (
            <motion.div
              key={matchup.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="w-[85vw] max-w-[340px] md:w-auto snap-center shrink-0 bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(15,23,42,0.07)] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Card Top Pill & Price Range */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-[11px] font-heading font-black">
                    {matchup.tag}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-lg">
                    {matchup.priceRange}
                  </span>
                </div>

                {/* Matchup Title */}
                <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-950 group-hover:text-brand-orange transition-colors">
                  {matchup.title}
                </h3>
                <span className="text-xs font-heading font-bold text-slate-400 block mt-0.5 mb-3">
                  {matchup.gujSub}
                </span>

                {/* Matchup Versus Visual Frame */}
                <div className="relative rounded-2xl bg-slate-900 overflow-hidden aspect-[21/9] mb-4 flex items-center justify-between p-4">
                  {/* Backdrop car image blend */}
                  <img
                    src={matchup.image1}
                    alt={matchup.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-slate-950/90" />

                  <div className="relative z-10 text-left">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Car A</span>
                    <span className="text-sm font-heading font-black text-white">{matchup.car1Query}</span>
                  </div>

                  <div className="relative z-10 w-9 h-9 rounded-full bg-brand-orange text-white font-mono font-black text-xs flex items-center justify-center shadow-lg shadow-brand-orange/40">
                    VS
                  </div>

                  <div className="relative z-10 text-right">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Car B</span>
                    <span className="text-sm font-heading font-black text-white">{matchup.car2Query}</span>
                  </div>
                </div>

                {/* Expert Summary Text */}
                <p className="text-xs sm:text-sm text-slate-600 font-medium font-body leading-relaxed">
                  {matchup.summary}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400">
                  કેટેગરી: {matchup.category}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectMatchup(matchup)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 group-hover:bg-brand-orange text-white font-heading font-black text-xs transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <span>સરખામણી લોડ કરો</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Swipe Hint */}
        <p className="md:hidden text-center text-[11px] font-semibold text-slate-400 mt-2">
          ← સ્વાઇપ કરો · Swipe to compare top pairs →
        </p>
      </div>
    </section>
  );
}
