/**
 * @file frontend/src/components/about/services/ExchangeServiceStage.jsx
 * @description Light-mode interactive Exchange stage featuring the trade-in upgrade bridge,
 * same-day 2-hour drive-out delivery, and special exchange bonus callouts.
 */

// External dependencies
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RefreshCw,
  ChevronRight,
  Clock,
  Award,
  ShieldCheck,
  ArrowRightLeft,
  Car,
} from 'lucide-react';

import WhatsAppIcon from '../../WhatsAppIcon';
import { buildWhatsAppUrl } from '../../../utils/whatsapp';

// Constants
const getWhatsappExchangeUrl = () =>
  buildWhatsAppUrl('નમસ્તે, હું મારી જૂની કાર એક્સચેન્જ કરીને નવી કાર લેવા માટે ઓફર જાણવા માગું છું.');

const EXCHANGE_BENTO_TILES = [
  {
    title: 'Drive Out Same Day',
    gujarati: 'જૂની કાર આપો અને માત્ર 2 કલાકમાં નવી વેરિફાઇડ કાર ચાવી સાથે ઘરે લઈ જાવ.',
    tag: 'Same Day',
    icon: Clock,
    color: 'text-sky-600',
    bg: 'bg-sky-50 text-sky-600 border-sky-200',
  },
  {
    title: 'Exchange Bonus',
    gujarati: 'માત્ર એક્સચેન્જ પર મળતા Special Price બેનિફિટ્સનો લાભ લો.',
    tag: 'Special Bonus',
    icon: Award,
    color: 'text-amber-600',
    bg: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  {
    title: 'Hassle-Free Paperwork',
    gujarati: 'જૂની કારનું નામ બદલવું અને નવી કારની લોન/RTO એક જ જગ્યાએ.',
    tag: 'Single-Window',
    icon: ShieldCheck,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  },
  {
    title: 'Any Car, Any Condition',
    gujarati: 'તમારી જૂની કાર કોઈપણ કંપની કે મોડલની હોય, અમે તેને બેસ્ટ વેલ્યુ આપીશું.',
    tag: 'All Makes',
    icon: RefreshCw,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
];

/**
 * Exchange Service Interactive Stage Component (Light Mode)
 */
export default function ExchangeServiceStage() {
  return (
    <motion.div
      key="exchange-service-stage"
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 font-mono text-xs uppercase tracking-wider mb-4">
            <RefreshCw className="w-3.5 h-3.5 text-sky-600" />
            <span>03 / EXCHANGE · TRADE-IN UPGRADE</span>
          </div>

          {/* Headline */}
          <h3 className="text-2xl sm:text-4xl lg:text-[38px] font-black font-heading text-slate-950 tracking-tight leading-[1.2]">
            જૂની કાર આપી નવી{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-brand-orange">
              Dream Car
            </span>{' '}
            ઘરે લાવો
          </h3>

          <p className="mt-3.5 text-sm sm:text-base text-slate-600 font-medium leading-relaxed font-body">
            શું તમે નવી કાર લેવાનું વિચારી રહ્યા છો? તમારી જૂની કારની સાચી કિંમત મેળવો અને તે જ દિવસે તમારી પસંદગીની નવી Premium Car ઘરે લઈ જાવ. બંને ડીલ એક જ સ્થળે પૂર્ણ.
          </p>

          {/* 4 Clean Bento Feature Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
            {EXCHANGE_BENTO_TILES.map((tile, idx) => {
              const TileIcon = tile.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50/80 hover:bg-sky-50/40 border border-slate-200/80 hover:border-sky-500/30 transition-all duration-300 shadow-xs group"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-xl ${tile.bg} border flex items-center justify-center shrink-0`}>
                      <TileIcon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {tile.tag}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-heading font-black text-slate-900 group-hover:text-sky-700 transition-colors">
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
          <a
            href={getWhatsappExchangeUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl sm:rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-black text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>એક્સચેન્જ ઓફર્સ પૂછો · WhatsApp Exchange</span>
            <ChevronRight className="w-4 h-4" />
          </a>

          <Link
            to="/inventory"
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl sm:rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-xs sm:text-sm shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Car className="w-4 h-4 text-sky-400" />
            <span>અપગ્રેડ માટે કાર્સ જુઓ</span>
          </Link>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Trade-in Upgrade Bridge Card ── */}
      <div className="lg:col-span-5 flex flex-col justify-center">
        <div className="relative rounded-3xl bg-slate-50 border border-slate-200/90 shadow-lg p-5 sm:p-6 overflow-hidden group">
          {/* Top Status Header */}
          <div className="flex items-center justify-between gap-2 mb-3.5 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
              Express Car Upgrade Bridge
            </span>
            <span className="text-[11px] font-mono text-sky-800 font-bold bg-white px-2.5 py-1 rounded-full border border-slate-200">
              Same Day
            </span>
          </div>

          {/* 2-Side Swap Visual Cards */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs relative z-10 space-y-3">
            <div className="grid grid-cols-2 gap-3 items-center">
              {/* Left Side: Old Car */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">પગલું 1</span>
                <p className="text-xs font-heading font-black text-slate-900 mt-0.5">તમારી જૂની કાર</p>
                <span className="text-[10px] text-amber-700 font-bold mt-0.5 block">100% ફેર વેલ્યુએશન</span>
              </div>

              {/* Right Side: New Dream Car */}
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-center">
                <span className="text-[10px] font-mono text-sky-600 uppercase block">પગલું 2</span>
                <p className="text-xs font-heading font-black text-slate-900 mt-0.5">નવી વેરિફાઇડ કાર</p>
                <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">120-Point Certified</span>
              </div>
            </div>

            {/* Central Bridge Callout */}
            <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-amber-50 border border-amber-200 text-center text-xs">
              <ArrowRightLeft className="w-4 h-4 text-brand-orange shrink-0" />
              <span className="font-heading font-bold text-slate-800">
                જૂની કારની કિંમત સીધી નવી કારમાં Adjust થાય છે
              </span>
            </div>
          </div>

          {/* Zero Downtime Guarantee Card */}
          <div className="mt-3.5 p-3.5 rounded-2xl bg-sky-50/80 border border-sky-200/80 relative z-10">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-sky-900 font-heading font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-600" /> 2-Hour Handover Guarantee
              </span>
              <span className="text-amber-700 font-mono text-[10px] font-bold">Zero Waiting</span>
            </div>
            <p className="text-xs text-slate-600 font-body leading-relaxed mt-0.5">
              તમારે કાર વગર એક પણ દિવસ રહેવું નહીં પડે. જૂની કાર આપો અને માત્ર 2 કલાકમાં નવી વેરિફાઇડ કાર લઈને ઘરે જાવ.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
