/**
 * @file frontend/src/components/about/services/CoreServicesConsole.jsx
 * @description Executive automotive services console in light mode, featuring
 * clean segmented tab switching, live vehicle/valuation/trade-in stages, and bottom previews.
 */

// External dependencies
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CarFront, Banknote, RefreshCw, Zap } from 'lucide-react';

// Internal local imports
import BuyServiceStage from './BuyServiceStage';
import SellServiceStage from './SellServiceStage';
import ExchangeServiceStage from './ExchangeServiceStage';

// Service tab definitions
const CONSOLE_TABS = [
  {
    id: 'buy',
    label: 'કાર ખરીદો',
    icon: CarFront,
  },
  {
    id: 'sell',
    label: 'કાર વેચો',
    icon: Banknote,
  },
  {
    id: 'exchange',
    label: 'એક્સચેન્જ',
    icon: RefreshCw,
  },
];

/**
 * CoreServicesConsole Master Component (Light Mode)
 * @param {Object} props
 * @param {string} props.activeTab - Currently selected tab ('buy' | 'sell' | 'exchange')
 * @param {Function} props.onTabClick - Tab change handler
 */
export default function CoreServicesConsole({ activeTab = 'buy', onTabClick }) {
  return (
    <section
      id="core-services"
      className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-white text-slate-800 border-b border-slate-100 overflow-hidden"
    >
      {/* ── SOFT LUXURY AMBIENT RADIANCE ── */}
      <div className="absolute top-0 right-1/4 w-[650px] h-[350px] bg-gradient-to-br from-amber-200/25 via-brand-orange/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[320px] bg-gradient-to-tl from-emerald-100/25 to-transparent rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle Architectural Grid Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none" />

      {/* Invisible Anchors for URL Route & Navigation Compatibility */}
      <div id="service-anchor-buy" className="absolute top-0 pointer-events-none" />
      <div id="service-card-buy" className="absolute top-0 pointer-events-none" />
      <div id="service-anchor-sell" className="absolute top-0 pointer-events-none" />
      <div id="service-card-sell" className="absolute top-0 pointer-events-none" />
      <div id="service-anchor-exchange" className="absolute top-0 pointer-events-none" />
      <div id="service-card-exchange" className="absolute top-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ── SECTION HEADER (Client Preferred Authentic Copy) ── */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/25 text-brand-orange font-heading font-black text-xs uppercase tracking-widest mb-4 shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 text-brand-orange" />
            <span>અમારી મુખ્ય સેવાઓ · CORE SERVICES</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-950 font-heading tracking-tight leading-[1.18]"
          >
            કારની ખરીદી, વેચાણ કે એક્સચેન્જ —{' '}
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">
              સંપૂર્ણ પ્રીમિયમ અનુભવ
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
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed font-body"
          >
            સુરતનું મોખરાનું સર્ટિફાઇડ ઓટોમોટિવ હબ. 150+ ટેસ્ટેડ કાર્સ, 15 મિનિટમાં રોકડ પેમેન્ટ અને તે જ દિવસે હેન્ડઓવર.
          </motion.p>
        </div>

        {/* ── SEGMENTED LUXURY TACTILE SWITCHER (Light Mode) ── */}
        <div className="flex items-center justify-center mb-8 sm:mb-10">
          <div className="p-1.5 rounded-2xl bg-slate-100/90 backdrop-blur-md border border-slate-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.04)] flex flex-wrap sm:flex-nowrap items-center gap-2 max-w-xl w-full">
            {CONSOLE_TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabClick(tab.id)}
                  className={`relative flex-1 py-3 px-4 rounded-xl font-heading font-black text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    isSelected ? 'text-white shadow-md' : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeCoreServicePill"
                      className="absolute inset-0 bg-slate-950 rounded-xl"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <TabIcon className={`w-4 h-4 shrink-0 transition-colors ${isSelected ? 'text-brand-orange' : 'text-slate-400'}`} />
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── INTERACTIVE DYNAMIC SHOWCASE STAGE (Light Mode) ── */}
        <div className="relative rounded-[28px] sm:rounded-[36px] md:rounded-[42px] bg-[#F8FAFC] border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-[0_16px_40px_-10px_rgba(15,23,42,0.05)] overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'buy' && <BuyServiceStage />}
            {activeTab === 'sell' && <SellServiceStage />}
            {activeTab === 'exchange' && <ExchangeServiceStage />}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
