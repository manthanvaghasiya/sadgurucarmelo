/**
 * @file frontend/src/components/sell/SellCarHero.jsx
 * @description Premium luxury light-mode Hero section for the Sell Car page, featuring
 * bilingual automotive headlines, instant payout stats ribbon, and core trust pillars.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowDown, PhoneCall, Zap, ShieldCheck, ChevronRight, Info } from 'lucide-react';
import WhatsAppIcon from '../WhatsAppIcon';
import { SELL_VALUE_PILLARS } from '../../data/sellCarData';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import PillarActionSheet from './PillarActionSheet';

export default function SellCarHero({ onScrollToForm }) {
  const [selectedPillar, setSelectedPillar] = useState(null);

  const handlePillarClick = (pillar) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(10); } catch (_) {}
    }
    setSelectedPillar(pillar);
  };

  return (
    <section className="relative pt-10 sm:pt-16 md:pt-20 pb-12 sm:pb-18 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#FDFCFB] via-[#FAF9F6] to-white border-b border-slate-100 text-center">
      {/* Soft Ambient Radiance */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-[radial-gradient(ellipse_75%_55%_at_50%_0%,rgba(245,148,35,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-orange-100/30 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle Architectural Grid Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_50%,transparent_100%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center">
        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/25 text-brand-orange font-heading font-black text-[11px] sm:text-xs uppercase tracking-widest mb-3.5 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
          <span>સુરતમાં તમારી કારનું શ્રેષ્ઠ મૂલ્ય · INSTANT VALUATION</span>
        </motion.div>

        {/* Master Headline with Fluid Typography clamp() */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ fontSize: 'clamp(1.75rem, 5.5vw, 3.75rem)' }}
          className="font-black text-slate-950 font-heading tracking-tight leading-[1.2] px-1"
        >
          તમારી કાર વેચો{' '}
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">
            સૌથી ઊંચા માર્કેટ ભાવે
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
        </motion.h1>

        {/* Subtitle with Fluid Typography */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)' }}
          className="mt-4 text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed font-body px-2"
        >
          કોઈ દલાલી નહીં, કોઈ વચેટિયા નહીં. મફત ઇન્સ્પેક્શન, ત્વરિત માર્કેટ મૂલ્યાંકન,
          અને માત્ર <strong className="text-slate-950 font-bold">15 મિનિટમાં રોકડ પેમેન્ટ</strong> સાથે 100% ફ્રી RTO ટ્રાન્સફર.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto px-4"
        >
          <button
            onClick={onScrollToForm}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-brand-orange text-white font-heading font-black text-sm sm:text-base shadow-[0_10px_24px_rgba(245,148,35,0.3)] active:scale-95 transition-all cursor-pointer"
          >
            <span>ઓનલાઇન કિંમત જાણો · Get Quote</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          <a
            href={buildWhatsAppUrl('નમસ્તે, હું મારી કાર વેચવા માગું છું. કૃપા કરીને વેલ્યુએશન વિશે માહિતી આપો.')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-[#25D366] text-white font-heading font-black text-sm sm:text-base shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>WhatsApp પર ફોટા મોકલો</span>
          </a>
        </motion.div>

        {/* ── SECTION A: MOBILE-FIRST SLEEK HORIZONTAL TRUST RIBBON ── */}
        <div className="block sm:hidden w-full mt-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x -mx-4 px-4">
            {SELL_VALUE_PILLARS.map((pillar, idx) => {
              const PillarIcon = pillar.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePillarClick(pillar)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 shadow-2xs active:scale-95 transition-all flex items-center gap-2 shrink-0 snap-start cursor-pointer"
                >
                  <div className={`w-7 h-7 rounded-lg ${pillar.bg} border flex items-center justify-center shrink-0`}>
                    <PillarIcon className={`w-3.5 h-3.5 ${pillar.color}`} />
                  </div>
                  <div className="text-left">
                    <span className="font-heading font-black text-slate-900 text-xs block leading-tight">
                      {pillar.shortTitle || pillar.title}
                    </span>
                    <span className="text-[9px] font-mono font-semibold text-slate-400 block leading-tight">
                      {pillar.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── SECTION A: DESKTOP 4-COLUMN VALUE PILLARS GRID ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 w-full text-left"
        >
          {SELL_VALUE_PILLARS.map((pillar, idx) => {
            const PillarIcon = pillar.icon;
            return (
              <div
                key={idx}
                onClick={() => handlePillarClick(pillar)}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300 group cursor-pointer"
              >
                <div className={`w-11 h-11 rounded-xl ${pillar.bg} border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <PillarIcon className={`w-5 h-5 ${pillar.color}`} />
                </div>
                <h3 className="font-heading font-black text-slate-900 text-sm sm:text-base leading-snug">
                  {pillar.title}
                </h3>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mt-0.5">
                  {pillar.sub}
                </span>
                <p className="mt-2 text-xs text-slate-600 font-medium font-body leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Expandable Native Bottom Drawer Action Sheet */}
      <PillarActionSheet
        pillar={selectedPillar}
        isOpen={Boolean(selectedPillar)}
        onClose={() => setSelectedPillar(null)}
        onScrollToForm={onScrollToForm}
      />
    </section>
  );
}

