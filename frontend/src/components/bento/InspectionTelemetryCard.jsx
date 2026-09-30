/**
 * @file frontend/src/components/bento/InspectionTelemetryCard.jsx
 * @description Tall flagship Bento grid card showcasing 100% Inspection Guarantee,
 * real hydraulic inspection lab visuals, OBD-II digital scan HUD, and certified pass holograms.
 */

// External dependencies
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ChevronRight, CheckCircle2, Cpu, Wrench } from 'lucide-react';

// Automotive inspection lab checkpoints
const INSPECTION_HUD_POINTS = [
  { label: 'એન્જિન & ટ્રાન્સમિશન', status: '100% Optimal Pass', icon: Cpu },
  { label: 'ચેસીસ & બોડી ફ્રેમ', status: '100% Non-Accidental', icon: ShieldCheck },
  { label: 'અંડરબોડી & સસ્પેન્શન', status: 'Hydraulic Lift Verified', icon: Wrench },
  { label: 'કિલોમીટર ઓરિજિનાલિટી', status: 'OBD-II Genuine Scan', icon: CheckCircle2 },
];

/**
 * Inspection Telemetry Card Component
 * @param {Object} props
 * @param {Object} props.pillar - Pillar configuration object
 * @param {Function} props.onOpenModal - Callback when 'View Standards' is clicked
 */
export default function InspectionTelemetryCard({ pillar = {}, onOpenModal }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      className="lg:col-span-5 bg-white rounded-[28px] sm:rounded-[32px] border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_22px_45px_rgba(15,23,42,0.08)] transition-all duration-300 flex flex-col justify-between overflow-hidden group"
    >
      {/* ── TOP AUTOMOTIVE LAB HUD VISUAL CANVAS ── */}
      <div className="relative aspect-[16/11] sm:aspect-[16/10] w-full bg-slate-950 overflow-hidden border-b border-slate-100 flex flex-col justify-between p-5 sm:p-6">
        {/* Real Inspection Lab Photo Backdrop */}
        <img
          src="/inspection_lab.jpg"
          alt="Sadguru 120-Point Technical Inspection Lab"
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60"
        />

        {/* Ambient Dark Gradient & Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40 pointer-events-none" />

        {/* Top Diagnostic HUD Badge */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold backdrop-blur-md shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>OBD-II DIGITAL SCAN · 100% PASS</span>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-heading font-black shadow-md flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>120+ Points</span>
          </span>
        </div>

        {/* 4 Interactive Diagnostic Checkpoint Badges (Automotive HUD) */}
        <div className="relative z-10 grid grid-cols-2 gap-2 mt-4">
          {INSPECTION_HUD_POINTS.map((item, idx) => {
            const ItemIcon = item.icon;
            return (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/15 flex items-center gap-2 shadow-sm"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <ItemIcon className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] font-heading font-bold text-white block truncate">
                    {item.label}
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 block truncate">
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Lab Guarantee Banner */}
        <div className="relative z-10 pt-2 flex items-center justify-between text-[11px] font-mono text-slate-300 border-t border-white/10 mt-3">
          <span>સર્ટિફાઇડ ટેકનિકલ લેબ તપાસ</span>
          <span className="text-amber-300 font-bold">100% Mechanical Guarantee</span>
        </div>
      </div>

      {/* ── BOTTOM CARD EDITORIAL CONTENT ── */}
      <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              01 / GUARANTEE
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="inline-flex items-center gap-1 text-[11px] font-heading font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80">
              <ShieldCheck className="w-3 h-3 text-amber-500" />
              100% Mechanical Pass
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-950 group-hover:text-brand-orange transition-colors">
            {pillar.title}
          </h3>
          <span className="text-xs font-heading font-bold text-brand-orange block mt-1">
            {pillar.gujSub}
          </span>

          <p className="mt-3 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed font-body">
            {pillar.description}
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-heading font-semibold text-slate-400 block truncate">
                ટેસ્ટિંગ સ્ટાન્ડર્ડ
              </span>
              <span className="text-xs font-heading font-black text-slate-900 block truncate">
                120+ પોઈન્ટ સઘન તપાસ
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-heading font-semibold text-slate-400 block truncate">
                લેબ સર્ટિફિકેટ
              </span>
              <span className="text-xs font-heading font-black text-slate-900 block truncate">
                100% પાસ ગેરંટી
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-2">
          <button
            onClick={() => onOpenModal(pillar)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-950 hover:bg-brand-orange text-white font-heading font-bold text-xs sm:text-sm shadow-sm hover:shadow-md active:scale-98 transition-all duration-300 cursor-pointer"
          >
            <span>વિગતવાર સ્ટાન્ડર્ડ જુઓ</span>
            <ChevronRight className="w-4 h-4 text-brand-orange group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
