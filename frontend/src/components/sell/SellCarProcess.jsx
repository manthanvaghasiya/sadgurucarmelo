/**
 * @file frontend/src/components/sell/SellCarProcess.jsx
 * @description 3-Step seamless visual selling workflow component explaining how easy
 * it is to sell a car to Sadguru Car Melo in Surat.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '../../data/sellCarData';

export default function SellCarProcess() {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] relative overflow-hidden border-b border-slate-100">
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-gradient-to-br from-amber-100/20 to-transparent rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-heading font-bold text-xs uppercase tracking-widest mb-3.5 shadow-xs">
            <Zap className="w-3.5 h-3.5 text-brand-orange" /> સરળ પ્રક્રિયા · 3 SIMPLE STEPS
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 font-heading tracking-tight leading-tight">
            તમારી કાર વેચવી{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">
              હવે એકદમ સરળ છે
            </span>
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-slate-600 font-medium leading-relaxed font-body">
            અજાણ્યા બ્રોકરોના ધક્કા ખાવાની જરૂર નથી. માત્ર 3 સરળ સ્ટેપમાં તમારી જૂની કાર વેચીને રોકડ પેમેન્ટ મેળવો:
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch relative">
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
