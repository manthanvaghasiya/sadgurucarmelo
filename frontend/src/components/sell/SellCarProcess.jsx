import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Zap, ChevronRight } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '../../data/sellCarData';

export default function SellCarProcess() {
  const [activeStep, setActiveStep] = useState(0);

  const handleStepChange = (index) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(10); } catch (_) {}
    }
    setActiveStep(index);
  };

  const handleNext = () => {
    if (activeStep < HOW_IT_WORKS_STEPS.length - 1) {
      handleStepChange(activeStep + 1);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      handleStepChange(activeStep - 1);
    }
  };

  const currentItem = HOW_IT_WORKS_STEPS[activeStep];

  return (
    <section className="py-12 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] relative overflow-hidden border-b border-slate-100">
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-gradient-to-br from-amber-100/20 to-transparent rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-heading font-bold text-[11px] sm:text-xs uppercase tracking-widest mb-3.5 shadow-xs">
            <Zap className="w-3.5 h-3.5 text-brand-orange" /> સરળ પ્રક્રિયા · 3 SIMPLE STEPS
          </span>
          <h2
            style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)' }}
            className="font-black text-slate-900 font-heading tracking-tight leading-tight px-1"
          >
            તમારી કાર વેચવી{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">
              હવે એકદમ સરળ છે
            </span>
          </h2>
          <p
            style={{ fontSize: 'clamp(0.85rem, 2.8vw, 1rem)' }}
            className="mt-2.5 text-slate-600 font-medium leading-relaxed font-body max-w-2xl mx-auto px-2"
          >
            અજાણ્યા બ્રોકરોના ધક્કા ખાવાની જરૂર નથી. માત્ર 3 સરળ સ્ટેપમાં તમારી જૂની કાર વેચીને રોકડ પેમેન્ટ મેળવો:
          </p>
        </div>

        {/* ── SECTION B: MOBILE STEP-INDICATOR SEGMENTED CONTROL & SWIPEABLE TIMELINE ── */}
        <div className="block md:hidden">
          {/* 1. Step-Indicator Segmented Control at Top */}
          <div className="bg-slate-200/70 p-1 rounded-2xl flex items-center justify-between mb-3 shadow-inner">
            {HOW_IT_WORKS_STEPS.map((step, idx) => {
              const isSelected = activeStep === idx;
              return (
                <button
                  key={step.step}
                  type="button"
                  onClick={() => handleStepChange(idx)}
                  className={`relative flex-1 py-2 px-2 text-center rounded-xl transition-all duration-200 cursor-pointer ${
                    isSelected ? 'text-slate-950 font-black' : 'text-slate-600 font-semibold'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeStepSegment"
                      className="absolute inset-0 bg-white rounded-xl shadow-xs -z-0"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 text-xs font-heading flex items-center justify-center gap-1.5">
                    <span className={`w-4 h-4 rounded-full text-[9px] font-mono font-black flex items-center justify-center ${
                      isSelected ? 'bg-brand-orange text-white' : 'bg-slate-300 text-slate-700'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="truncate">
                      {idx === 0 ? 'વિગતો' : idx === 1 ? 'મૂલ્યાંકન' : 'પેમેન્ટ'}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* 2. Progressive Step Progress Bar */}
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-orange via-amber-500 to-emerald-500"
              initial={false}
              animate={{ width: `${((activeStep + 1) / HOW_IT_WORKS_STEPS.length) * 100}%` }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            />
          </div>

          {/* 3. Swipeable Step Card with Fluid Typography */}
          <div className="relative min-h-[290px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem.step}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.3 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -40) handleNext();
                  if (info.offset.x > 40) handlePrev();
                }}
                className="bg-white rounded-[28px] p-6 border border-slate-200/90 shadow-[0_6px_25px_rgba(0,0,0,0.04)] flex flex-col justify-between"
              >
                <div>
                  {/* Step Top Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-10 h-10 rounded-xl bg-slate-950 text-white font-mono font-black text-base flex items-center justify-center shadow-md">
                        {currentItem.step}
                      </span>
                      <span className="text-[11px] font-heading font-black text-slate-400">
                        {currentItem.badge}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono font-bold text-brand-orange bg-brand-orange/10 px-2.5 py-1 rounded-full border border-brand-orange/20">
                      {currentItem.highlight}
                    </span>
                  </div>

                  {/* Fluid Heading to prevent awkward line breaks */}
                  <h3
                    style={{ fontSize: 'clamp(1.15rem, 4.5vw, 1.35rem)' }}
                    className="font-heading font-black text-slate-900 leading-snug"
                  >
                    {currentItem.title}
                  </h3>

                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mt-0.5 mb-2.5 font-semibold">
                    {currentItem.engTitle}
                  </span>

                  {/* Fluid Description */}
                  <p
                    style={{ fontSize: 'clamp(0.85rem, 3.4vw, 0.95rem)' }}
                    className="text-slate-600 font-medium font-body leading-relaxed"
                  >
                    {currentItem.description}
                  </p>
                </div>

                {/* Step Footer with Navigation Buttons */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-emerald-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>100% સુરક્ષિત</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeStep > 0 && (
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 active:scale-95"
                      >
                        પાછળ
                      </button>
                    )}
                    {activeStep < HOW_IT_WORKS_STEPS.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-brand-orange text-white text-xs font-bold shadow-xs active:scale-95"
                      >
                        <span>આગળ</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-xs font-mono font-bold text-brand-orange px-2 py-1 bg-brand-orange/10 rounded-lg">
                        પૂર્ણ ડીલ ✓
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 4. Native Progress Dots (• • •) */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {HOW_IT_WORKS_STEPS.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => handleStepChange(dotIdx)}
                aria-label={`Go to step ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeStep === dotIdx
                    ? 'w-7 h-2 bg-brand-orange shadow-xs'
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── SECTION B: DESKTOP 3-STEP SIDE-BY-SIDE GRID ── */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch relative">
          {HOW_IT_WORKS_STEPS.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -5, transition: { duration: 0.25 } }}
              className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-all flex flex-col justify-between relative group"
            >
              <div>
                {/* Step Top Badge */}
                <div className="flex items-center justify-between mb-5">
                  <span className="w-12 h-12 rounded-2xl bg-slate-950 text-white font-mono font-black text-lg flex items-center justify-center shadow-md group-hover:bg-brand-orange transition-colors">
                    {item.step}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full border border-brand-orange/20">
                    {item.highlight}
                  </span>
                </div>

                <span className="text-xs font-heading font-black text-slate-400 block mb-1">
                  {item.badge}
                </span>

                <h3 className="text-lg sm:text-xl font-heading font-black text-slate-900 group-hover:text-brand-orange transition-colors leading-snug">
                  {item.title}
                </h3>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mt-0.5 mb-3 font-semibold">
                  {item.engTitle}
                </span>

                <p className="text-xs sm:text-sm text-slate-600 font-medium font-body leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-heading font-bold text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  100% સુરક્ષિત પ્રક્રિયા
                </span>
                <span className="text-brand-orange font-mono text-sm font-bold">→</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

