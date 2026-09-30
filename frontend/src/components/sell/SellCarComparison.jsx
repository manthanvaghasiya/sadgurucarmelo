/**
 * @file frontend/src/components/sell/SellCarComparison.jsx
 * @description Comparison table contrasting selling to unorganized brokers or random buyers
 * vs selling directly to Sadguru Car Melo with guaranteed protection and zero brokerage.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X as LucideX, ShieldAlert, ShieldCheck, Scale } from 'lucide-react';
import { SELLER_COMPARISON_ROWS } from '../../data/sellCarData';

export default function SellCarComparison() {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] relative overflow-hidden border-b border-slate-100">
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-gradient-to-br from-amber-100/20 to-transparent rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-heading font-bold text-xs uppercase tracking-widest mb-3.5 shadow-xs">
            <Scale className="w-3.5 h-3.5 text-brand-orange" /> સ્પષ્ટ તફાવત · THE SMART CHOICE
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 font-heading tracking-tight leading-tight">
            સામાન્ય બ્રોકર vs{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">
              સદગુરુ કાર મેળો
            </span>
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-slate-600 font-medium leading-relaxed font-body">
            અજાણ્યા લોકોને કાર વેચીને પછી પસ્તાવા કરતાં જુઓ કે સદગુરુ કાર મેળો શા માટે સુરતના કાર માલિકોની પહેલી પસંદ છે:
          </p>
        </div>

        {/* Comparison Table / Card Container */}
        <div className="bg-white rounded-[28px] sm:rounded-[32px] border border-slate-200/90 shadow-[0_12px_40px_rgba(15,23,42,0.04)] overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-100 text-xs sm:text-sm font-heading font-black">
            <div className="hidden md:block md:col-span-4 p-5 bg-slate-50/70 text-slate-500 uppercase tracking-wider">
              મુદ્દો (Parameter)
            </div>
            <div className="md:col-span-4 p-4 sm:p-5 bg-rose-50/60 text-rose-800 flex items-center gap-2 border-b md:border-b-0 md:border-r border-slate-100">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>લોકલ બ્રોકર / અજાણ્યા ગ્રાહકો</span>
            </div>
            <div className="md:col-span-4 p-4 sm:p-5 bg-emerald-50/60 text-emerald-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>સદગુરુ કાર મેળો (Sadguru Melo)</span>
            </div>
          </div>

          {/* Comparison Rows */}
          <div className="divide-y divide-slate-100">
            {SELLER_COMPARISON_ROWS.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 text-xs sm:text-sm items-center hover:bg-slate-50/50 transition-colors"
              >
                {/* Feature Column */}
                <div className="md:col-span-4 p-4 sm:p-5 font-heading font-black text-slate-900 bg-slate-50/40 border-b md:border-b-0 md:border-r border-slate-100">
                  {row.feature}
                </div>

                {/* Broker Column */}
                <div className="md:col-span-4 p-4 sm:p-5 text-slate-600 flex items-start gap-2.5 border-b md:border-b-0 md:border-r border-slate-100 font-body">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <LucideX className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>{row.broker}</span>
                </div>

                {/* Sadguru Column */}
                <div className="md:col-span-4 p-4 sm:p-5 text-slate-800 flex items-start gap-2.5 font-medium font-body bg-emerald-50/15">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="font-semibold text-slate-900">{row.sadguru}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
