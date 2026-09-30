/**
 * @file frontend/src/components/about/services/BuyServiceStage.jsx
 * @description Light-mode interactive Buy stage presenting certified pre-owned car highlights,
 * 120-point quality bento tiles, and live verified vehicle telemetry card.
 */

// External dependencies
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Car,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Gauge,
  FileText,
  Landmark,
  Sparkles,
} from 'lucide-react';

import WhatsAppIcon from '../../WhatsAppIcon';
import { buildWhatsAppUrl } from '../../../utils/whatsapp';

// Constants
const getWhatsappBuyUrl = () =>
  buildWhatsAppUrl('નમસ્તે, હું સદગુરુ કાર મેળામાંથી વેરિફાઇડ કાર ખરીદવા માટે માહિતી મેળવવા માગું છું.');

const BUY_BENTO_TILES = [
  {
    title: '110-Point Inspection',
    gujarati: 'બમ્પરથી બમ્પર સુધી Mechanical પરફેક્શન માટે કડક ટેસ્ટિંગ.',
    tag: '100% Pass',
    icon: ShieldCheck,
    color: 'text-amber-600',
    bg: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  {
    title: 'Non-Accidental',
    gujarati: 'સ્ટ્રક્ચરલ મજબૂતાઈ અને 100% Genuine હિસ્ટ્રીની ખાતરી.',
    tag: 'Chassis Clear',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  {
    title: 'Zero Downpayment',
    gujarati: '100% સુધી સરળ અને Fast-track ફાઇનાન્સિંગ ઓપ્શન્સ.',
    tag: 'Instant Sanction',
    icon: Landmark,
    color: 'text-purple-600',
    bg: 'bg-purple-50 text-purple-600 border-purple-200',
  },
  {
    title: 'Free RC Transfer',
    gujarati: 'કાગળની કાર્યવાહીની સંપૂર્ણ જવાબદારી અમારી, 100% મફત સેવા.',
    tag: '₹0 Paperwork',
    icon: FileText,
    color: 'text-sky-600',
    bg: 'bg-sky-50 text-sky-600 border-sky-200',
  },
];

/**
 * Buy Service Interactive Stage Component (Light Mode)
 */
export default function BuyServiceStage() {
  return (
    <motion.div
      key="buy-service-stage"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch"
    >
      {/* ── LEFT COLUMN: Core Narrative & Bento Feature Tiles ── */}
      <div className="lg:col-span-7 flex flex-col justify-between">
        <div>
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/25 text-brand-orange font-mono text-xs uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            <span>01 / BUY · 150+ LIVE INVENTORY</span>
          </div>

          {/* Headline */}
          <h3 className="text-2xl sm:text-4xl lg:text-[38px] font-black font-heading text-slate-950 tracking-tight leading-[1.2]">
            100% ભરોસા સાથે{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">
              Dream Car
            </span>{' '}
            ખરીદો
          </h3>

          <p className="mt-3.5 text-sm sm:text-base text-slate-600 font-medium leading-relaxed font-body">
            Pre-owned ખરીદવી હવે ચિંતાનો વિષય નથી. અમે તમને સંપૂર્ણ પારદર્શક અને Premium Buying Experience આપીએ છીએ. દરેક વાહન કડક 120-પોઇન્ટ ગુણવત્તા તપાસ પાસ કર્યા પછી જ ડિસ્પ્લે થાય છે.
          </p>

          {/* 4 Clean Bento Feature Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
            {BUY_BENTO_TILES.map((tile, idx) => {
              const TileIcon = tile.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50/80 hover:bg-orange-50/40 border border-slate-200/80 hover:border-brand-orange/30 transition-all duration-300 shadow-xs group"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-xl ${tile.bg} border flex items-center justify-center shrink-0`}>
                      <TileIcon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {tile.tag}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-heading font-black text-slate-900 group-hover:text-brand-orange transition-colors">
                    {tile.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 font-body leading-relaxed">
                    {tile.gujarati}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3.5 mt-8 pt-6 border-t border-slate-100">
          <Link
            to="/inventory"
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl sm:rounded-2xl bg-slate-950 hover:bg-brand-orange text-white font-heading font-black text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Car className="w-4 h-4 text-brand-orange group-hover:text-white" />
            <span>સંપૂર્ણ ઇન્વેન્ટરી જુઓ · View All 150+ Cars</span>
            <ChevronRight className="w-4 h-4" />
          </Link>

          <a
            href={getWhatsappBuyUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-heading font-bold text-xs sm:text-sm border border-slate-300 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>WhatsApp કન્સલ્ટેશન</span>
          </a>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Certified Vehicle Showcase Card ── */}
      <div className="lg:col-span-5 flex flex-col justify-center">
        <div className="relative rounded-3xl bg-slate-50 border border-slate-200/90 shadow-lg p-5 sm:p-6 overflow-hidden group">
          {/* Top Status Header */}
          <div className="flex items-center justify-between gap-2 mb-3.5 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              120 / 120 Points Pass
            </span>
            <span className="text-[11px] font-mono text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80">
              Verified Stock
            </span>
          </div>

          {/* Vehicle Showcase Image Container */}
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm group-hover:border-brand-orange/40 transition-colors">
            <img
              src="https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1000&auto=format&fit=crop"
              alt="Certified Pre-Owned Car in Surat"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
              <span className="font-heading font-black text-sm">Hyundai Creta SX (O)</span>
              <span className="font-mono text-amber-300 font-bold">150+ કાર હાજર</span>
            </div>
          </div>

          {/* Key Specs Pills Grid */}
          <div className="grid grid-cols-2 gap-2 mt-3.5 relative z-10">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
              <span className="text-[10px] font-mono text-slate-400 block">કિલોમીટર રીડિંગ</span>
              <span className="text-xs font-heading font-black text-slate-900 flex items-center gap-1 mt-0.5">
                <Gauge className="w-3.5 h-3.5 text-brand-orange" />
                100% Genuine KM
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
              <span className="text-[10px] font-mono text-slate-400 block">સ્ટ્રક્ચરલ ફ્રેમ</span>
              <span className="text-xs font-heading font-black text-slate-900 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Non-Accidental
              </span>
            </div>
          </div>

          {/* Financial Feasibility Chip */}
          <div className="mt-3.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between relative z-10 text-xs">
            <div>
              <span className="text-[10px] font-mono text-amber-800 block uppercase font-bold">
                Easy EMI Option
              </span>
              <span className="font-heading font-bold text-slate-900">
                0% ડાઉન પેમેન્ટ અને સરળ લોન સુવિધા
              </span>
            </div>
            <Link
              to="/inventory"
              className="text-xs font-heading font-black text-brand-orange hover:text-orange-700 underline underline-offset-2 shrink-0 cursor-pointer"
            >
              જુઓ →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
