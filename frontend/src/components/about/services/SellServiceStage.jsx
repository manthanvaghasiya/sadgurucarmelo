/**
 * @file frontend/src/components/about/services/SellServiceStage.jsx
 * @description Light-mode interactive Sell stage presenting instant fair valuation features,
 * 15-minute direct bank payout simulator, and legal transfer protections.
 */

// External dependencies
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Banknote,
  ChevronRight,
  Zap,
  Tag,
  Car,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

import WhatsAppIcon from '../../WhatsAppIcon';
import { buildWhatsAppUrl } from '../../../utils/whatsapp';

// Constants
const getWhatsappSellUrl = () =>
  buildWhatsAppUrl('નમસ્તે, હું મારી કાર વેચવા માટે ઇન્સ્ટન્ટ વેલ્યુએશન જાણવા માગું છું.');

const SELL_BENTO_TILES = [
  {
    title: 'Instant Fair Valuation',
    gujarati: 'માર્કેટ મુજબ સાચી કિંમતનું ડેટાબેઝ્ડ અને નિષ્ણાતો દ્વારા વેરિફિકેશન.',
    tag: 'Best Price',
    icon: Banknote,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  {
    title: '15 મિનિટમાં Payment',
    gujarati: 'ડીલ ફાઇનલ થતાં જ સીધા બેંક એકાઉન્ટમાં Immediate Transfer.',
    tag: '15-Min Payout',
    icon: Zap,
    color: 'text-amber-600',
    bg: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  {
    title: 'No Hidden Charges',
    gujarati: 'કાર વેચવાની પ્રક્રિયા સંપૂર્ણપણે ફ્રી છે, કોઈ કમિશન લેવાતું નથી.',
    tag: '₹0 Commission',
    icon: Tag,
    color: 'text-sky-600',
    bg: 'bg-sky-50 text-sky-600 border-sky-200',
  },
  {
    title: 'Doorstep Evaluation',
    gujarati: 'ઝડપી અને ફ્રી કાર ચેકિંગ માટે અમે તમારા લોકેશન પર આવીશું.',
    tag: 'Free Visit',
    icon: Car,
    color: 'text-purple-600',
    bg: 'bg-purple-50 text-purple-600 border-purple-200',
  },
];

const SETTLEMENT_STEPS = [
  { step: '1', title: 'કાર ડિટેઇલ્સ & ઇન્સ્પેક્શન', status: 'Completed', color: 'text-emerald-600' },
  { step: '2', title: 'ઓન-પેપર પારદર્શક કિંમત', status: 'Instant Valuation', color: 'text-amber-600' },
  { step: '3', title: 'સીધા ખાતામાં Instant Payment', status: '15-Min RTGS', color: 'text-emerald-600' },
];

/**
 * Sell Service Interactive Stage Component (Light Mode)
 */
export default function SellServiceStage() {
  return (
    <motion.div
      key="sell-service-stage"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch"
    >
      {/* ── LEFT COLUMN: Core Narrative & Feature Bento ── */}
      <div className="lg:col-span-7 flex flex-col justify-between">
        <div>
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>02 / SELL · 15-MINUTE PAYMENT</span>
          </div>

          {/* Headline */}
          <h3 className="text-2xl sm:text-4xl lg:text-[38px] font-black font-heading text-slate-950 tracking-tight leading-[1.2]">
            શ્રેષ્ઠ કિંમતે કાર વેચો અને{' '}
            <span className="text-emerald-600">
              Instant Payment
            </span>{' '}
            મેળવો
          </h3>

          <p className="mt-3.5 text-sm sm:text-base text-slate-600 font-medium leading-relaxed font-body">
            ભાવતાલની કોઈ ઝંઝટ નહીં. સૌથી સાચો ભાવ મેળવો અને કોઈ પણ રિસ્ક વગર સીધા તમારા બેંક ખાતામાં Instant Payment મેળવો. કાગળ અને RTO ની તમામ જવાબદારી અમારી.
          </p>

          {/* 4 Clean Bento Feature Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
            {SELL_BENTO_TILES.map((tile, idx) => {
              const TileIcon = tile.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50/80 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-500/30 transition-all duration-300 shadow-xs group"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-xl ${tile.bg} border flex items-center justify-center shrink-0`}>
                      <TileIcon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {tile.tag}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-heading font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
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
            to="/sell-your-car"
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-black text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Banknote className="w-4 h-4" />
            <span>ઓનલાઇન કાર વેલ્યુએશન મેળવો · Sell Car Online</span>
            <ChevronRight className="w-4 h-4" />
          </Link>

          <a
            href={getWhatsappSellUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-heading font-bold text-xs sm:text-sm border border-slate-300 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>WhatsApp ક્વોટેશન</span>
          </a>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Instant Settlement Simulator Card ── */}
      <div className="lg:col-span-5 flex flex-col justify-center">
        <div className="relative rounded-3xl bg-slate-50 border border-slate-200/90 shadow-lg p-5 sm:p-6 overflow-hidden group">
          {/* Top Status Header */}
          <div className="flex items-center justify-between gap-2 mb-3.5 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Direct Bank Settlement
            </span>
            <span className="text-[11px] font-mono text-emerald-800 font-bold bg-white px-2.5 py-1 rounded-full border border-slate-200">
              15-Min Payout
            </span>
          </div>

          {/* 3-Step Live Settlement Timeline */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs relative z-10 space-y-2.5">
            {SETTLEMENT_STEPS.map((s) => (
              <div key={s.step} className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-mono font-bold text-[10px]">
                    {s.step}
                  </span>
                  <span className="font-heading font-medium text-slate-800">
                    {s.title}
                  </span>
                </div>
                <span className={`font-mono text-[10px] font-bold ${s.color}`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>

          {/* Simulated Bank Voucher Callout */}
          <div className="mt-3.5 p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 relative z-10">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500 font-mono text-[11px]">ટ્રાન્સફર મોડ: RTGS / IMPS</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% સુરક્ષિત
              </span>
            </div>
            <p className="text-xs font-heading font-bold text-slate-900 mt-0.5">
              ડીલ ફાઇનલ થતાં જ સીધા તમારા બેંક એકાઉન્ટમાં ઇન્સ્ટન્ટ પેમેન્ટ
            </p>
          </div>

          {/* Active Bank Loan Reassurance */}
          <div className="mt-3.5 p-3 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-600 relative z-10 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              જો તમારી કાર પર લોન ચાલુ હોય, તો અમે તેનું સીધું બેંક સેટલમેન્ટ કરી આપીએ છીએ.
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
