/**
 * @file frontend/src/components/bento/RtoTransferCard.jsx
 * @description Bento grid card showcasing 100% Free RTO Transfer, featuring an authentic
 * Gujarat RTO Smart Card mockup, legal title clearance seals, and 3-5 day handover tracking.
 */

// External dependencies
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Check, ChevronRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

/**
 * RTO Transfer Card Component
 * @param {Object} props
 * @param {Object} props.pillar - Pillar configuration object
 * @param {Function} props.onOpenModal - Callback when 'View Details' is clicked
 */
export default function RtoTransferCard({ pillar = {}, onOpenModal }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-[28px] sm:rounded-[32px] border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_22px_45px_rgba(15,23,42,0.08)] transition-all duration-300 flex flex-col justify-between overflow-hidden group"
    >
      {/* ── TOP REALISTIC GUJARAT RTO SMART CARD VISUAL ── */}
      <div className="p-5 sm:p-6 bg-gradient-to-b from-[#F0F7FF] via-[#F8FAFC] to-white border-b border-slate-100 relative overflow-hidden flex flex-col justify-between">
        {/* Soft Ambient Sky Glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Realistic Gujarat RTO Smart Card Mockup */}
        <div className="relative z-10 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-4 text-white shadow-[0_10px_25px_rgba(15,23,42,0.15)] border border-slate-700">
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-wider text-sky-300 uppercase">
                GUJARAT MOTOR VEHICLES DEPT.
              </span>
            </div>
            <span className="text-[9px] font-mono font-black text-amber-300 bg-white/10 px-2 py-0.5 rounded-full">
              SURAT RTO (GJ-05)
            </span>
          </div>

          {/* Smart Card Chip & Title Details */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              {/* Golden Smart Card Chip Graphic */}
              <div className="w-8 h-6 rounded-md bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-500 border border-amber-300 shadow-sm flex flex-col justify-around p-0.5 shrink-0">
                <div className="h-0.5 bg-amber-700/40 rounded-full" />
                <div className="h-0.5 bg-amber-700/40 rounded-full" />
              </div>
              <div>
                <span className="text-xs font-heading font-black text-white block">
                  VEHICLE REGISTRATION CARD
                </span>
                <span className="text-[9px] font-mono text-slate-300">
                  Clean Title · Legal Ownership
                </span>
              </div>
            </div>

            <span className="text-[10px] font-heading font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/40 shrink-0">
              ₹0 મફત ટ્રાન્સફર
            </span>
          </div>

          {/* 3-Step Legal Progress Flow */}
          <div className="space-y-1.5 pt-2 border-t border-white/10 text-[10px]">
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span className="flex items-center gap-1 text-emerald-400">
                <Check className="w-3 h-3 stroke-[3]" />
                કાનૂની દસ્તાવેજ ચકાસણી
              </span>
              <span className="text-amber-300 font-mono font-bold">3-5 દિવસ</span>
            </div>

            {/* Solid High-Tech Progress Bar */}
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 rounded-full"
              />
            </div>

            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-0.5">
              <span>પોલીસ &amp; બેંક NOC ક્લિયર</span>
              <span className="text-sky-300 font-bold">ઓરિજિનલ સ્માર્ટ કાર્ડ</span>
            </div>
          </div>
        </div>

        {/* Legal Shield Badge */}
        <div className="relative z-10 flex items-center justify-between mt-3 px-1 text-[11px] font-heading font-bold text-slate-700">
          <span className="flex items-center gap-1.5 text-sky-700">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            100% કાયદાકીય માલિકી સુરક્ષા
          </span>
          <span className="text-slate-500 font-mono text-[10px]">કોઈ ધક્કા નહીં</span>
        </div>
      </div>

      {/* ── BOTTOM CARD EDITORIAL CONTENT ── */}
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            02 / LEGAL · 100% FREE RTO
          </span>
          <h3 className="text-lg font-black font-heading text-slate-950 group-hover:text-brand-orange transition-colors">
            {pillar.title}
          </h3>
          <span className="text-[11px] font-heading font-bold text-sky-600 block mt-0.5">
            {pillar.gujSub}
          </span>
          <p className="mt-2 text-xs text-slate-600 font-medium leading-relaxed font-body">
            {pillar.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-heading font-black text-slate-900">
            સમયમર્યાદા: 3-5 દિવસ
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
