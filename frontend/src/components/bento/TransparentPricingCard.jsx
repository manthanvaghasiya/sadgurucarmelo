/**
 * @file frontend/src/components/bento/TransparentPricingCard.jsx
 * @description Bento grid card showcasing 100% Transparent Pricing with an itemized digital
 * billing invoice mockup, zero brokerage guarantee, and clear customer savings breakdown.
 */

// External dependencies
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Tag, ShieldCheck, CheckCircle2 } from 'lucide-react';

// Itemized invoice comparison points
const INVOICE_BREAKUP = [
  { item: 'કારની વાજબી કિંમત', value: '100% On-Paper', strike: false, color: 'text-slate-900 font-bold' },
  { item: 'બ્રોકરેજ અથવા દલાલી ફી', value: '₹0 (Zero)', strike: '₹25,000', color: 'text-emerald-600 font-black' },
  { item: 'છૂપા ચાર્જીસ અથવા કમિશન', value: '₹0 (બિલકુલ નહીં)', strike: false, color: 'text-emerald-600 font-bold' },
];

/**
 * Transparent Pricing Card Component
 * @param {Object} props
 * @param {Object} props.pillar - Pillar configuration object
 * @param {Function} props.onOpenModal - Callback when 'View Details' is clicked
 */
export default function TransparentPricingCard({ pillar = {}, onOpenModal }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      transition={{ delay: 0.15 }}
      className="bg-white rounded-[28px] sm:rounded-[32px] border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_22px_45px_rgba(15,23,42,0.08)] transition-all duration-300 flex flex-col justify-between overflow-hidden group"
    >
      {/* ── TOP DIGITAL ITEMIZED INVOICE BREAKDOWN VISUAL ── */}
      <div className="p-5 sm:p-6 bg-gradient-to-b from-[#F0FDF4] via-[#F8FAFC] to-white border-b border-slate-100 relative overflow-hidden flex flex-col justify-between">
        {/* Soft Ambient Emerald Glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Realistic Itemized Invoice Receipt Card */}
        <div className="relative z-10 rounded-2xl bg-white p-4 shadow-[0_8px_25px_rgba(15,23,42,0.06)] border border-slate-200">
          {/* Invoice Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5 text-xs">
            <span className="font-heading font-black text-slate-900 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-600" />
              ITEMIZED PRICING
            </span>
            <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
              Zero Brokerage
            </span>
          </div>

          {/* Itemized Rows */}
          <div className="space-y-2 text-[11px]">
            {INVOICE_BREAKUP.map((row, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-600">
                <span className="font-medium">{row.item}</span>
                <div className="flex items-center gap-1.5 font-mono">
                  {row.strike && (
                    <span className="line-through text-red-400 text-[10px]">{row.strike}</span>
                  )}
                  <span className={row.color}>{row.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Total Savings Ribbon */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="font-heading font-bold text-slate-700">ગ્રાહકની ચોખ્ખી બચત:</span>
            <span className="font-mono font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              ₹25,000+ બચત
            </span>
          </div>
        </div>

        {/* Verification Guarantee Seal */}
        <div className="relative z-10 flex items-center justify-between mt-3 px-1 text-[11px] font-heading font-bold">
          <span className="flex items-center gap-1.5 text-emerald-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            100% GST પાકું બિલિંગ
          </span>
          <span className="text-slate-500 font-mono text-[10px]">Zero Hidden Fees</span>
        </div>
      </div>

      {/* ── BOTTOM CARD EDITORIAL CONTENT ── */}
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            03 / TRUST · ZERO BROKERAGE
          </span>
          <h3 className="text-lg font-black font-heading text-slate-950 group-hover:text-brand-orange transition-colors">
            {pillar.title}
          </h3>
          <span className="text-[11px] font-heading font-bold text-emerald-600 block mt-0.5">
            {pillar.gujSub}
          </span>
          <p className="mt-2 text-xs text-slate-600 font-medium leading-relaxed font-body">
            {pillar.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-heading font-black text-slate-900">
            જે જુઓ છો તે જ ફાઇનલ કિંમત
          </span>
          <button
            onClick={() => onOpenModal(pillar)}
            className="inline-flex items-center gap-1 text-xs font-heading font-black text-indigo-600 hover:text-brand-orange transition-colors cursor-pointer"
          >
            <span>વિગતવાર જુઓ</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
