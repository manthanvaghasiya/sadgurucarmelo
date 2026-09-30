/**
 * @file frontend/src/components/bento/LoanApprovalsCard.jsx
 * @description Wide horizontal Bento grid card showcasing Instant Loan Approvals,
 * top national banking partner tie-ups, 30-minute sanction letters, and zero downpayment.
 */

// External dependencies
import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Landmark, Zap, ShieldCheck } from 'lucide-react';

// National banking partners
const BANK_PARTNERS = [
  { name: 'State Bank of India', short: 'SBI', color: 'bg-sky-50 text-sky-800 border-sky-200' },
  { name: 'HDFC Bank', short: 'HDFC', color: 'bg-blue-50 text-blue-900 border-blue-200' },
  { name: 'ICICI Bank', short: 'ICICI', color: 'bg-amber-50 text-amber-900 border-amber-200' },
  { name: 'Axis Bank', short: 'AXIS', color: 'bg-rose-50 text-rose-900 border-rose-200' },
  { name: 'Bank of Baroda', short: 'BOB', color: 'bg-orange-50 text-orange-900 border-orange-200' },
];

const TENURE_OPTIONS = ['12 Mo', '24 Mo', '36 Mo', '48 Mo', '60 Mo', '84 Mo'];

const LOAN_CHECKLIST = [
  '0 ડાઉન પેમેન્ટ અને 100% સુધી સરળ ઓન-રોડ લોન સુવિધા',
  'માત્ર 30 મિનિટમાં ઇન-પ્રિન્સિપલ તાત્કાલિક લોન મંજૂરી',
  'ન્યૂનતમ દસ્તાવેજો સાથે સરળ અને ઝડપી પેપરલેસ પ્રક્રિયા',
];

/**
 * Loan Approvals Card Component
 * @param {Object} props
 * @param {Object} props.pillar - Pillar configuration object
 * @param {Function} props.onOpenModal - Callback when 'View Standards' is clicked
 */
export default function LoanApprovalsCard({ pillar = {}, onOpenModal }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      transition={{ delay: 0.2 }}
      className="w-full bg-white rounded-[28px] sm:rounded-[32px] border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_22px_45px_rgba(15,23,42,0.08)] transition-all duration-300 overflow-hidden group"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
        {/* ── LEFT COLUMN: REALISTIC BANK TIE-UPS & SANCTION LETTER ── */}
        <div className="md:col-span-6 p-6 sm:p-7 bg-gradient-to-b md:bg-gradient-to-r from-[#FAF5FF] via-[#F8FAFC] to-white border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-between relative overflow-hidden">
          {/* Ambient Purple Glow */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl pointer-events-none" />

          {/* Digital Loan Sanction Voucher Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_8px_25px_rgba(15,23,42,0.06)] border border-purple-200/80 relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-heading font-black text-slate-900 block leading-tight">
                    રાષ્ટ્રીય બેંક પાર્ટનરશિપ
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">Direct Showroom Tie-up</span>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-600" />
                30 Min Sanction
              </span>
            </div>

            {/* National Bank Logos Row */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              {BANK_PARTNERS.map((b) => (
                <span
                  key={b.short}
                  className={`px-2.5 py-1 rounded-lg border text-[10px] font-heading font-black shadow-xs ${b.color}`}
                >
                  {b.short}
                </span>
              ))}
            </div>

            {/* In-Principle Sanction Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-100">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[9px] font-mono text-slate-400 block uppercase">ડાઉન પેમેન્ટ</span>
                <span className="text-xs font-heading font-black text-slate-900">0% Downpayment</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[9px] font-mono text-slate-400 block uppercase">ઓન-રોડ ફંડિંગ</span>
                <span className="text-xs font-heading font-black text-emerald-600">100% Loan Support</span>
              </div>
            </div>
          </div>

          {/* Flexible EMI Tenure Badges */}
          <div className="relative z-10 mt-4 pt-2">
            <span className="text-[10px] font-mono text-slate-400 block mb-1.5 px-0.5">
              FLEXIBLE EMI TENURE OPTIONS (12 TO 84 MONTHS):
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {TENURE_OPTIONS.map((t, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-mono font-bold text-purple-900 shadow-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: COPY + CHECKLIST + BUTTON ── */}
        <div className="md:col-span-6 p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              04 / FINANCE · INSTANT SANCTION
            </span>
            <h3 className="text-xl font-black font-heading text-slate-950 group-hover:text-brand-orange transition-colors">
              {pillar.title}
            </h3>
            <span className="text-xs font-heading font-bold text-purple-600 block mt-0.5">
              {pillar.gujSub}
            </span>
            <p className="mt-2 text-xs text-slate-600 font-medium leading-relaxed font-body">
              {pillar.description}
            </p>

            {/* 3 Checklist Items with Clean Icons */}
            <div className="mt-4 space-y-2">
              {LOAN_CHECKLIST.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-md bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="text-xs text-slate-700 font-medium leading-snug font-body">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-2">
            <button
              onClick={() => onOpenModal(pillar)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-slate-950 hover:bg-brand-orange text-white font-heading font-bold text-xs sm:text-sm shadow-sm hover:shadow-md active:scale-98 transition-all duration-300 cursor-pointer"
            >
              <span>વિગતવાર સ્ટાન્ડર્ડ જુઓ</span>
              <ChevronRight className="w-4 h-4 text-brand-orange group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
