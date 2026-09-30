import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, FileText, Landmark, Tag, Check, ChevronRight,
  Sparkles, CheckCircle2, Clock, Percent, ArrowUpRight, Zap,
  Building2, Award, ShieldAlert
} from 'lucide-react';

/**
 * SadguruStandardBento
 * Modern SaaS/Fintech-grade Bento Grid layout for Sadguru Car Surat's 4 Core Pillars.
 * Replaces generic/stock dealership photos with custom, high-tech interactive UI widgets
 * inspired by high-end design systems (donut charts, equalizer telemetry, smooth curve graphs,
 * and stacked tier metrics).
 */
export default function SadguruStandardBento({ pillars = [], onOpenModal = () => {} }) {
  // Extract the 4 pillars by id with safe fallbacks
  const safePillars = Array.isArray(pillars) ? pillars : [];
  const inspection = safePillars.find((p) => p?.id === 'inspection') || safePillars[0] || {};
  const rcTransfer = safePillars.find((p) => p?.id === 'rc-transfer') || safePillars[1] || {};
  const pricing = safePillars.find((p) => p?.id === 'transparent-pricing') || safePillars[3] || {};
  const loan = safePillars.find((p) => p?.id === 'loan-approvals') || safePillars[2] || {};

  return (
    <div className="w-full">
      {/* ─────────────────────────────────────────────────────────────
          BENTO GRID: 2-Column Asymmetric Architectural Layout
          Desktop: 5 cols (Tall Flagship) + 7 cols (Top 2 cards + Bottom wide card)
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* ══════════════════════════════════════════════════════════════
            CARD 1: LEFT TALL FEATURE CARD (100% Inspection Guarantee)
            ══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          whileHover={{ y: -5, transition: { duration: 0.3 } }}
          className="lg:col-span-5 bg-white rounded-[28px] sm:rounded-[32px] border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_22px_45px_rgba(15,23,42,0.08)] transition-all duration-300 flex flex-col justify-between overflow-hidden group"
        >
          {/* Top Visual Widget Canvas */}
          <div className="p-5 sm:p-7 bg-gradient-to-b from-[#F5F6FD] via-[#F8F9FE] to-white border-b border-slate-100 relative overflow-hidden flex flex-col justify-between">
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Floating Telemetry Card */}
            <div className="relative z-10 bg-white rounded-2xl p-4 sm:p-5 shadow-[0_8px_25px_rgba(15,23,42,0.05)] border border-slate-150">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    Diagnostics Score
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black font-heading text-slate-900">
                      120 / 120
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      100% Pass
                    </span>
                  </div>
                </div>

                {/* Circular Donut Metric */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                    {/* Background Ring */}
                    <path
                      className="text-slate-100"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Segment 1: Engine/OBD (Amber) */}
                    <path
                      className="text-amber-500"
                      strokeDasharray="40, 100"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Segment 2: Chassis (Indigo) */}
                    <path
                      className="text-indigo-600"
                      strokeDasharray="35, 100"
                      strokeDashoffset="-40"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Segment 3: Suspension (Emerald) */}
                    <path
                      className="text-emerald-500"
                      strokeDasharray="25, 100"
                      strokeDashoffset="-75"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-black text-slate-800 leading-none">120+</span>
                    <span className="text-[8px] font-bold text-slate-400">Points</span>
                  </div>
                </div>
              </div>

              {/* Floating Callout Pointer Tag (Matches Reference Image) */}
              <div className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-heading font-semibold shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>OBD-II Scan: 100% Clean · Zero Faults</span>
              </div>
            </div>

            {/* Vertical Diagnostic Telemetry Equalizer Bars (Matches Reference Image) */}
            <div className="relative z-10 mt-6 pt-2">
              <div className="flex items-end justify-between gap-1.5 sm:gap-2 h-20 sm:h-24 px-1">
                {[
                  { h: '65%', color: 'from-amber-400 to-amber-500' },
                  { h: '85%', color: 'from-amber-500 to-brand-orange' },
                  { h: '100%', color: 'from-brand-orange to-orange-600' },
                  { h: '70%', color: 'from-indigo-400 to-indigo-500' },
                  { h: '95%', color: 'from-indigo-500 to-indigo-600' },
                  { h: '80%', color: 'from-violet-500 to-purple-600' },
                  { h: '90%', color: 'from-purple-500 to-indigo-600' },
                  { h: '100%', color: 'from-emerald-400 to-emerald-500' },
                  { h: '75%', color: 'from-emerald-500 to-teal-600' },
                  { h: '90%', color: 'from-teal-500 to-emerald-600' },
                  { h: '85%', color: 'from-sky-400 to-sky-500' },
                  { h: '95%', color: 'from-sky-500 to-indigo-500' },
                  { h: '70%', color: 'from-amber-400 to-brand-orange' },
                  { h: '80%', color: 'from-brand-orange to-indigo-600' }
                ].map((bar, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-slate-100 rounded-full overflow-hidden flex flex-col justify-end h-full"
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: bar.h }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.03, ease: 'easeOut' }}
                      className={`w-full rounded-full bg-gradient-to-t ${bar.color} opacity-90 group-hover:opacity-100 transition-opacity`}
                    />
                  </div>
                ))}
              </div>

              {/* Status Chips underneath bars */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2.5 px-0.5">
                <span>Engine & Trans</span>
                <span>Chassis 100% Pass</span>
                <span>Electronics</span>
              </div>
            </div>
          </div>

          {/* Bottom Card Content */}
          <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
            <div>
              {/* Category Pill Tag */}
              <div className="flex items-center gap-2 mb-2.5">
                <span className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  01 / GUARANTEE
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="inline-flex items-center gap-1 text-[11px] font-heading font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80">
                  <ShieldCheck className="w-3 h-3 text-amber-500" />
                  100% Mechanical Pass
                </span>
              </div>

              {/* Title & Gujarati Subtitle */}
              <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-950 group-hover:text-brand-orange transition-colors">
                {inspection.title}
              </h3>
              <span className="text-xs font-heading font-bold text-brand-orange block mt-1">
                {inspection.gujSub}
              </span>

              {/* Concise Description */}
              <p className="mt-3 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed font-body">
                {inspection.description}
              </p>

              {/* Mini Highlights */}
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

            {/* Action Pill Button */}
            <div className="mt-6 pt-2">
              <button
                onClick={() => onOpenModal(inspection)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-950 hover:bg-brand-orange text-white font-heading font-bold text-xs sm:text-sm shadow-sm hover:shadow-md active:scale-98 transition-all duration-300 cursor-pointer"
              >
                <span>વિગતવાર સ્ટાન્ડર્ડ જુઓ</span>
                <ChevronRight className="w-4 h-4 text-brand-orange group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </motion.div>


        {/* ══════════════════════════════════════════════════════════════
            RIGHT COLUMN (7 COLS): Top 2 Cards + Bottom Wide Card
            ══════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 flex flex-col gap-6 justify-between">

          {/* ── TOP ROW: 2 Cards Side-by-Side ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* CARD 2: ઝડપી RC Transfer */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[28px] sm:rounded-[32px] border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_22px_45px_rgba(15,23,42,0.08)] transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Top Visual Widget Canvas */}
              <div className="p-5 bg-gradient-to-b from-[#F5F6FD] via-[#F8F9FE] to-white border-b border-slate-100 relative overflow-hidden min-h-[190px] flex flex-col justify-between">
                {/* Floating Widget Card */}
                <div className="bg-white rounded-2xl p-4 shadow-[0_8px_25px_rgba(15,23,42,0.05)] border border-slate-150">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200/80 text-sky-600 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-heading font-black text-slate-900 block leading-tight">
                          RTO Transfer
                        </span>
                        <span className="text-[9px] font-mono text-slate-400">Surat Authority</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-heading font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                      ₹0 મફત સેવા
                    </span>
                  </div>

                  {/* 3-Step RTO Progress Flow */}
                  <div className="space-y-1.5 mt-2">
                    <div className="flex items-center justify-between text-[10px] font-heading font-bold text-slate-600">
                      <span className="flex items-center gap-1 text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                        દસ્તાવેજ ચકાસણી
                      </span>
                      <span className="text-slate-400">3-5 દિવસ</span>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '85%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-sky-400 to-indigo-600 rounded-full"
                      />
                    </div>

                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-0.5">
                      <span>RTO NOC Pass</span>
                      <span className="text-indigo-600 font-bold">હેન્ડઓવર રેડી</span>
                    </div>
                  </div>
                </div>

                {/* Micro speed bars (Matches Card 2 in reference image) */}
                <div className="flex items-end justify-between gap-1 h-7 mt-3 px-1">
                  {[40, 60, 80, 100, 75, 90, 85, 95, 70, 85].map((val, idx) => (
                    <div key={idx} className="flex-1 bg-slate-100 rounded-full overflow-hidden h-full flex flex-col justify-end">
                      <div
                        style={{ height: `${val}%` }}
                        className="w-full rounded-full bg-indigo-500/30 group-hover:bg-indigo-500/70 transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Content */}
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    02 / LEGAL · 100% FREE RTO
                  </span>
                  <h3 className="text-lg font-black font-heading text-slate-950 group-hover:text-brand-orange transition-colors">
                    {rcTransfer.title}
                  </h3>
                  <span className="text-[11px] font-heading font-bold text-sky-600 block mt-0.5">
                    {rcTransfer.gujSub}
                  </span>
                  <p className="mt-2 text-xs text-slate-600 font-medium leading-relaxed font-body">
                    {rcTransfer.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-heading font-black text-slate-900">
                    સમયમર્યાદા: 3-5 દિવસ
                  </span>
                  <button
                    onClick={() => onOpenModal(rcTransfer)}
                    className="inline-flex items-center gap-1 text-xs font-heading font-black text-indigo-600 hover:text-brand-orange transition-colors cursor-pointer"
                  >
                    <span>વિગતવાર જુઓ</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>


            {/* CARD 3: 100% Transparent Pricing */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-[28px] sm:rounded-[32px] border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_22px_45px_rgba(15,23,42,0.08)] transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Top Visual Widget Canvas (Smooth Wave Line Chart like Reference Image) */}
              <div className="p-5 bg-gradient-to-b from-[#F5F6FD] via-[#F8F9FE] to-white border-b border-slate-100 relative overflow-hidden min-h-[190px] flex flex-col justify-between">
                {/* Floating Wave Chart Card */}
                <div className="bg-white rounded-2xl p-4 shadow-[0_8px_25px_rgba(15,23,42,0.05)] border border-slate-150 relative">
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="font-heading font-bold text-slate-800">
                      Fair Market Value
                    </span>
                    <span className="font-mono text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                      Zero Brokerage
                    </span>
                  </div>

                  {/* Smooth Wave Chart SVG with Tooltip Pin */}
                  <div className="relative h-16 w-full">
                    {/* Floating Black Tooltip Pin (Matches Card 3 in reference image!) */}
                    <div className="absolute top-0 right-1/4 -translate-y-1 z-10 bg-slate-950 text-white text-[10px] font-heading font-bold px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                      <span>₹0 Hidden Cost</span>
                    </div>

                    <svg className="w-full h-full overflow-visible" viewBox="0 0 160 50" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="pricingWaveGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Area Fill */}
                      <path
                        d="M 0 45 Q 25 15, 50 30 T 100 15 T 160 25 L 160 50 L 0 50 Z"
                        fill="url(#pricingWaveGrad)"
                      />
                      {/* Line Stroke */}
                      <path
                        d="M 0 45 Q 25 15, 50 30 T 100 15 T 160 25"
                        fill="none"
                        stroke="#8B5CF6"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      {/* Target Pin Marker */}
                      <circle cx="100" cy="15" r="3.5" fill="#8B5CF6" className="animate-pulse" />
                    </svg>
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mt-1">
                    <span>Market Value</span>
                    <span className="text-slate-900 font-bold">100% Itemized Bill</span>
                  </div>
                </div>

                {/* 2 Micro status chips */}
                <div className="flex items-center justify-between gap-2 mt-2 px-1 text-[10px] font-heading font-bold">
                  <span className="text-slate-500">બ્રોકરેજ ફી: <strong className="text-emerald-600">₹0 (Zero)</strong></span>
                  <span className="text-slate-500">હિડન ચાર્જ: <strong className="text-emerald-600">0%</strong></span>
                </div>
              </div>

              {/* Bottom Card Content */}
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    03 / TRUST · ZERO BROKERAGE
                  </span>
                  <h3 className="text-lg font-black font-heading text-slate-950 group-hover:text-brand-orange transition-colors">
                    {pricing.title}
                  </h3>
                  <span className="text-[11px] font-heading font-bold text-emerald-600 block mt-0.5">
                    {pricing.gujSub}
                  </span>
                  <p className="mt-2 text-xs text-slate-600 font-medium leading-relaxed font-body">
                    {pricing.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-heading font-black text-slate-900">
                    જે જુઓ છો તે જ ફાઇનલ કિંમત
                  </span>
                  <button
                    onClick={() => onOpenModal(pricing)}
                    className="inline-flex items-center gap-1 text-xs font-heading font-black text-indigo-600 hover:text-brand-orange transition-colors cursor-pointer"
                  >
                    <span>વિગતવાર જુઓ</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>

          </div>


          {/* ══════════════════════════════════════════════════════════════
              CARD 4: BOTTOM WIDE FEATURE CARD (સરળ Loan Approvals)
              (Matches the bottom wide card layout with stacked visual + checklist)
              ══════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
            transition={{ delay: 0.2 }}
            className="w-full bg-white rounded-[28px] sm:rounded-[32px] border border-slate-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_22px_45px_rgba(15,23,42,0.08)] transition-all duration-300 overflow-hidden group"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">

              {/* Left Column: Stacked Telemetry & Banking Visual (Matches Reference Image) */}
              <div className="md:col-span-6 p-6 sm:p-7 bg-gradient-to-b md:bg-gradient-to-r from-[#F5F6FD] via-[#F8F9FE] to-white border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-between relative overflow-hidden">
                {/* Floating Summary Card (Matches "Overall 142 items" in reference image!) */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_8px_25px_rgba(15,23,42,0.05)] border border-slate-150 relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-heading font-black text-slate-800">
                      બેંક જોડાણ પાર્ટનર્સ
                    </span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                      30 Min Sanction
                    </span>
                  </div>

                  {/* Bank Badges Pill Row */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {['SBI', 'HDFC', 'ICICI', 'Axis', 'BoB'].map((b) => (
                      <span
                        key={b}
                        className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-[10px] font-heading font-black text-slate-800"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Key Stats Chips */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block">ડાઉન પેમેન્ટ</span>
                      <span className="text-xs font-heading font-black text-slate-900">0% ડાઉન પેમેન્ટ</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block">ફંડિંગ સુવિધા</span>
                      <span className="text-xs font-heading font-black text-emerald-600">100% સુધી સરળ લોન</span>
                    </div>
                  </div>
                </div>

                {/* Stacked Multi-Tone Vertical Bars (Matches Reference Image) */}
                <div className="relative z-10 mt-5 pt-1">
                  <div className="flex items-end justify-between gap-2.5 h-16 px-1">
                    {[
                      { seg1: '30%', seg2: '35%', seg3: '35%' },
                      { seg1: '20%', seg2: '45%', seg3: '35%' },
                      { seg1: '40%', seg2: '30%', seg3: '30%' },
                      { seg1: '15%', seg2: '35%', seg3: '50%' },
                      { seg1: '35%', seg2: '40%', seg3: '25%' },
                      { seg1: '25%', seg2: '50%', seg3: '25%' }
                    ].map((st, i) => (
                      <div key={i} className="flex-1 bg-slate-100 rounded-full overflow-hidden flex flex-col justify-end h-full">
                        <div style={{ height: st.seg1 }} className="w-full bg-indigo-600/80" />
                        <div style={{ height: st.seg2 }} className="w-full bg-purple-500/70" />
                        <div style={{ height: st.seg3 }} className="w-full bg-amber-400/80" />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mt-2 px-1">
                    <span>12 Months</span>
                    <span>36 Months</span>
                    <span>60 Months EMI</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Copy + 3 Clean Checklist Items + Pill Button (Matches Reference Image) */}
              <div className="md:col-span-6 p-6 sm:p-7 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    04 / FINANCE · INSTANT SANCTION
                  </span>
                  <h3 className="text-xl font-black font-heading text-slate-950 group-hover:text-brand-orange transition-colors">
                    {loan.title}
                  </h3>
                  <span className="text-xs font-heading font-bold text-purple-600 block mt-0.5">
                    {loan.gujSub}
                  </span>
                  <p className="mt-2 text-xs text-slate-600 font-medium leading-relaxed font-body">
                    {loan.description}
                  </p>

                  {/* 3 Checklist Items with Soft Tinted Checkbox Icon (Matches Reference Image) */}
                  <div className="mt-4 space-y-2">
                    {[
                      '0 ડાઉન પેમેન્ટ અને 100% સુધી સરળ લોન સુવિધા',
                      'માત્ર 30 મિનિટમાં ઇન-પ્રિન્સિપલ લોન મંજૂરી',
                      'ન્યૂનતમ દસ્તાવેજો સાથે ઝડપી પેપરલેસ પ્રક્રિયા'
                    ].map((item, idx) => (
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

                {/* Pill Action Button */}
                <div className="mt-6 pt-2">
                  <button
                    onClick={() => onOpenModal(loan)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-slate-950 hover:bg-brand-orange text-white font-heading font-bold text-xs sm:text-sm shadow-sm hover:shadow-md active:scale-98 transition-all duration-300 cursor-pointer"
                  >
                    <span>વિગતવાર સ્ટાન્ડર્ડ જુઓ</span>
                    <ChevronRight className="w-4 h-4 text-brand-orange group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
