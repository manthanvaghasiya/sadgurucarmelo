import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fuel,
  Gauge,
  User,
  Settings2,
  Car,
  Bell,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  X,
  CheckCircle2,
  Clock,
  Award,
  Zap,
  Star,
  MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCars } from '../context/CarContext';
import { FALLBACK_SHOWCASE } from '../data/showcaseData';
import { getOptimizedUrl } from '../utils/imageUtils';
import WhatsAppIcon from './WhatsAppIcon';
import axiosInstance from '../api/axiosConfig';

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────────────────────────────────────── */
const formatCarPrice = (price) => {
  if (!price || price <= 0) return 'કિંમત સંપર્ક પર · On Arrival';
  return price >= 100000
    ? `₹${(price / 100000).toFixed(2)} Lakh`
    : `₹${Number(price).toLocaleString('en-IN')}`;
};

const getCarWhatsAppUrl = (car) => {
  if (!car) return 'https://wa.me/919879525627';
  const name = `${car.make || ''} ${car.model || ''} (${car.year || ''})`.trim();
  const text = encodeURIComponent(
    `નમસ્તે સદગુરુ કાર મેળો (સુરત),\n\nમને જલ્દી આવી રહેલી ગાડી *${name}* માં રસ છે.\nગાડી શોરૂમ પર પહોંચે ત્યારે મને સૌથી પહેલા વિગતો અને અપડેટ આપશો.\n\nઆભાર!`
  );
  return `https://wa.me/919879525627?text=${text}`;
};

/* ═════════════════════════════════════════════════════════════════════════════
   POSTER DESIGN 1: "MIDNIGHT OBSIDIAN & AMBER STUDIO"
   - Cinematic executive showroom atmosphere
   - Warm golden-amber backlight, rich floor reflection
   - Laptop: Spacious studio stage + Bento specs
   - Mobile: Ultra-compact, sleek horizontal rectangle layout
   ═════════════════════════════════════════════════════════════════════════════ */
export function PosterDesign1({ car, onOpenModal }) {
  if (!car) return null;
  const whatsappUrl = getCarWhatsAppUrl(car);

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-[#090D16] via-[#0E1526] to-[#060911] border border-amber-500/20 shadow-[0_15px_45px_-10px_rgba(0,0,0,0.7)] group">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 inset-x-0 h-32 sm:h-44 bg-[radial-gradient(ellipse_at_top,rgba(245,148,35,0.2)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 inset-x-8 sm:inset-x-20 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

      {/* ── MOBILE VIEW: COMPACT HORIZONTAL RECTANGLE (Height: ~195px - 215px) ── */}
      <div className="md:hidden flex flex-row items-center p-2.5 sm:p-3 gap-2.5 sm:gap-3 min-h-[190px] max-h-[225px] relative z-10">
        {/* Left: Car Stage in Rectangle Frame (44% width) */}
        <div className="w-[44%] shrink-0 h-full min-h-[170px] max-h-[195px] rounded-xl relative overflow-hidden border border-amber-500/20 bg-slate-900/80 p-2 flex flex-col items-center justify-between">
          {/* Top Coming Soon Tag */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-heading font-black text-[8px] uppercase tracking-wider border border-amber-500/30 flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5 text-brand-orange shrink-0" />
              <span>COMING SOON</span>
            </span>
            <span className="text-[8px] font-mono font-bold text-white bg-black/60 px-1 py-0.5 rounded border border-white/10">
              {car.year || '2024'}
            </span>
          </div>

          {/* Car Image - Fully Visible, No Lines on Car */}
          <div className="relative w-full my-auto flex items-center justify-center">
            <div className="absolute -bottom-1 w-4/5 h-3 bg-black/60 rounded-full blur-sm pointer-events-none" />
            <img
              src={getOptimizedUrl(car.image, 600)}
              alt={`${car.make} ${car.model}`}
              className="max-w-full max-h-[115px] object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] select-none rounded-lg"
              loading="eager"
            />
          </div>
        </div>

        {/* Right: Info & Actions (56% width) */}
        <div className="w-[56%] flex flex-col justify-between h-full min-h-[170px] max-h-[195px] py-0.5">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <img src="/logo-removebg-preview.png" alt="Sadguru Car Melo" className="h-3.5 sm:h-4 w-auto object-contain shrink-0" />
              <span className="text-[9px] font-heading font-black text-brand-orange uppercase tracking-wider truncate">
                {car.make}
              </span>
            </div>

            <h3 className="font-heading font-black text-sm text-white leading-tight truncate">
              {car.model}
            </h3>

            <p className="font-heading font-black text-xs text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-400 to-yellow-300 mt-0.5">
              {formatCarPrice(car.price)}
            </p>

            {/* Compact Spec Pills (2x2 grid) */}
            <div className="grid grid-cols-2 gap-1 mt-1.5 text-[9px] font-semibold text-slate-300">
              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 truncate flex items-center gap-1">
                <Fuel className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                <span className="truncate">{car.fuelType || 'Diesel'}</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 truncate flex items-center gap-1">
                <Settings2 className="w-2.5 h-2.5 text-sky-400 shrink-0" />
                <span className="truncate">{car.transmission || 'Manual'}</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 truncate flex items-center gap-1">
                <Gauge className="w-2.5 h-2.5 text-purple-400 shrink-0" />
                <span className="truncate">{car.kms ? `${Math.round(car.kms / 1000)}k KM` : '72k KM'}</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 truncate flex items-center gap-1">
                <User className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                <span className="truncate">{car.owner || '1st'}</span>
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-1.5 mt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-7 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-black text-[10px] flex items-center justify-center gap-1 shadow-xs active:scale-95"
            >
              <WhatsAppIcon className="w-3 h-3 shrink-0" />
              <span>WhatsApp</span>
            </a>
            <button
              onClick={() => onOpenModal(car)}
              className="h-7 px-2 rounded-lg bg-gradient-to-r from-brand-orange to-amber-500 text-slate-950 font-heading font-black text-[10px] flex items-center justify-center gap-1 shadow-xs active:scale-95 shrink-0"
              title="Notify Me"
            >
              <Bell className="w-3 h-3 text-slate-950" />
              <span>એલર્ટ</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── DESKTOP VIEW: FULL LUXURY STUDIO PEDESTAL (Laptop Size OK) ── */}
      <div className="hidden md:grid md:grid-cols-12 gap-6 lg:gap-8 p-6 lg:p-8 items-center relative z-10">
        {/* Left Pedestal Stage (7 cols) */}
        <div className="md:col-span-7 flex flex-col items-center justify-center relative">
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-heading font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-orange shrink-0" />
              <span>શોરૂમ પર આવી રહી છે · COMING SOON</span>
            </span>
            <span className="text-xs font-mono font-bold text-slate-300 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
              {car.year || '2024'} MODEL {car.registration ? `· ${car.registration}` : ''}
            </span>
          </div>

          <div className="relative w-full h-[250px] sm:h-[280px] lg:h-[305px] rounded-2xl bg-gradient-to-b from-white/[0.04] to-black/60 border border-amber-500/25 flex items-center justify-center overflow-hidden p-3 shadow-2xl">
            {/* Ambient Backlight Glow */}
            <div className="absolute inset-x-8 bottom-3 h-12 bg-radial from-brand-orange/20 via-black/40 to-transparent blur-xl pointer-events-none" />
            <div className="absolute bottom-4 w-3/4 h-5 bg-black/70 rounded-full blur-md pointer-events-none" />

            {/* Hero Car Image — 100% Unobstructed, Full Car Perfectly Shown */}
            <motion.img
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              src={getOptimizedUrl(car.image, 1000)}
              alt={`${car.make} ${car.model}`}
              className="relative z-10 max-w-full max-h-full object-contain filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.85)] select-none rounded-xl"
              loading="eager"
            />
          </div>
        </div>

        {/* Right Info & Bento Specs (5 cols) */}
        <div className="md:col-span-5 flex flex-col justify-between h-full space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <img src="/logo-removebg-preview.png" alt="Sadguru Car Melo" className="h-6 w-auto object-contain shrink-0" />
              <span className="text-[11px] font-heading font-black tracking-widest text-brand-orange uppercase">
                {car.make} · SADGURU CAR MELO
              </span>
            </div>

            <h3 className="text-2xl lg:text-3xl font-heading font-black text-white tracking-tight leading-tight">
              {car.model}
            </h3>

            {car.variant && (
              <span className="inline-block px-2 py-0.5 rounded bg-white/5 border border-white/10 text-amber-300 text-xs font-semibold mt-1">
                {car.variant}
              </span>
            )}

            <div className="mt-2 pt-2 border-t border-white/10 flex items-baseline gap-2">
              <span className="text-2xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-400 to-yellow-300">
                {formatCarPrice(car.price)}
              </span>
              <span className="text-xs text-slate-400">(સરળ લોન સુવિધા ઉપલબ્ધ)</span>
            </div>
          </div>

          {/* 4 Bento Specs */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-2">
              <Fuel className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block font-bold">ઈંધણ</span>
                <span className="font-heading font-black text-white truncate block">{car.fuelType || 'Diesel'}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-sky-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block font-bold">ગીયર</span>
                <span className="font-heading font-black text-white truncate block">{car.transmission || 'Manual'}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-purple-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block font-bold">કિલોમીટર</span>
                <span className="font-heading font-black text-white truncate block">
                  {car.kms ? `${Number(car.kms).toLocaleString('en-IN')} KM` : '72,000 KM'}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block font-bold">માલિક</span>
                <span className="font-heading font-black text-white truncate block">{car.owner || '1st Owner'}</span>
              </div>
            </div>
          </div>

          {/* Action Suite */}
          <div className="flex items-center gap-2.5 pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-11 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-black text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-green-500/25 transition-all cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0" />
              <span>WhatsApp VIP એલર્ટ</span>
            </a>
            <button
              onClick={() => onOpenModal(car)}
              className="h-11 px-4 rounded-xl bg-gradient-to-r from-brand-orange to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-heading font-black text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-amber-500/25 transition-all cursor-pointer shrink-0"
            >
              <Bell className="w-4 h-4 text-slate-950" />
              <span>સૌપ્રથમ નોટિફાય કરો</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   POSTER DESIGN 2: "CHAMPAGNE ROYALE & SMOKED BRONZE"
   - Architectural executive luxury dealership aesthetic
   - Champagne gold metallic hairline accents, warm dark bronze backdrop
   - Laptop: Elegant wide layout with champagne framed badges
   - Mobile: Ultra-compact, sleek horizontal rectangle layout
   ═════════════════════════════════════════════════════════════════════════════ */
export function PosterDesign2({ car, onOpenModal }) {
  if (!car) return null;
  const whatsappUrl = getCarWhatsAppUrl(car);

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-[#14110C] via-[#1D1711] to-[#0A0907] border border-amber-400/30 shadow-[0_15px_45px_-10px_rgba(0,0,0,0.75)] group">
      {/* Subtle metallic champagne corner flares */}
      <div className="absolute top-0 right-0 w-48 sm:w-72 h-48 sm:h-72 bg-[radial-gradient(circle,rgba(212,175,55,0.15)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 inset-x-8 sm:inset-x-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#ffd700]/70 to-transparent" />

      {/* ── MOBILE VIEW: COMPACT HORIZONTAL RECTANGLE (Height: ~190px - 215px) ── */}
      <div className="md:hidden flex flex-row items-center p-2.5 sm:p-3 gap-2.5 sm:gap-3 min-h-[190px] max-h-[225px] relative z-10">
        {/* Left: Car Stage in Rectangle Frame (44% width) */}
        <div className="w-[44%] shrink-0 h-full min-h-[170px] max-h-[195px] rounded-xl relative overflow-hidden border border-amber-400/20 bg-black/60 p-2 flex flex-col items-center justify-between">
          {/* Top Coming Soon Tag */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-[#ffd700] font-heading font-black text-[8px] uppercase tracking-wider border border-amber-400/30 flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5 text-[#ffd700] shrink-0" />
              <span>COMING SOON</span>
            </span>
            <span className="text-[8px] font-mono font-bold text-amber-200 bg-black/60 px-1 py-0.5 rounded border border-amber-400/20">
              {car.year || '2024'}
            </span>
          </div>

          {/* Car Image - Fully Visible, No Lines on Car */}
          <div className="relative w-full my-auto flex items-center justify-center">
            <div className="absolute -bottom-1 w-4/5 h-3 bg-black/60 rounded-full blur-sm pointer-events-none" />
            <img
              src={getOptimizedUrl(car.image, 600)}
              alt={`${car.make} ${car.model}`}
              className="max-w-full max-h-[115px] object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] select-none rounded-lg"
              loading="eager"
            />
          </div>
        </div>

        {/* Right: Info & Actions (56% width) */}
        <div className="w-[56%] flex flex-col justify-between h-full min-h-[170px] max-h-[195px] py-0.5">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <img src="/logo-removebg-preview.png" alt="Sadguru Car Melo" className="h-3.5 sm:h-4 w-auto object-contain shrink-0" />
              <span className="text-[9px] font-heading font-black text-amber-400 uppercase tracking-wider truncate">
                {car.make}
              </span>
            </div>

            <h3 className="font-heading font-black text-sm text-[#fcf6eb] leading-tight truncate">
              {car.model}
            </h3>

            <p className="font-heading font-black text-xs text-[#ffd700] mt-0.5">
              {formatCarPrice(car.price)}
            </p>

            {/* Compact Specs Chips */}
            <div className="grid grid-cols-2 gap-1 mt-1.5 text-[9px] font-semibold text-[#e8ded0]">
              <span className="px-1.5 py-0.5 rounded bg-black/40 border border-amber-400/15 truncate flex items-center gap-1">
                <Fuel className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                <span className="truncate">{car.fuelType || 'Diesel'}</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-black/40 border border-amber-400/15 truncate flex items-center gap-1">
                <Settings2 className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                <span className="truncate">{car.transmission || 'Manual'}</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-black/40 border border-amber-400/15 truncate flex items-center gap-1">
                <Gauge className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                <span className="truncate">{car.kms ? `${Math.round(car.kms / 1000)}k KM` : '72k KM'}</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-black/40 border border-amber-400/15 truncate flex items-center gap-1">
                <User className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                <span className="truncate">{car.owner || '1st'}</span>
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-1.5 mt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-7 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-black text-[10px] flex items-center justify-center gap-1 shadow-xs active:scale-95"
            >
              <WhatsAppIcon className="w-3 h-3 shrink-0" />
              <span>WhatsApp</span>
            </a>
            <button
              onClick={() => onOpenModal(car)}
              className="h-7 px-2 rounded-lg bg-gradient-to-r from-amber-400 to-[#d4af37] text-slate-950 font-heading font-black text-[10px] flex items-center justify-center gap-1 shadow-xs active:scale-95 shrink-0"
              title="Reserve Alert"
            >
              <Bell className="w-3 h-3 text-slate-950" />
              <span>એલર્ટ</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── DESKTOP VIEW: ARCHITECTURAL LUXURY SHOWCASE (Laptop Size OK) ── */}
      <div className="hidden md:grid md:grid-cols-12 gap-6 lg:gap-8 p-6 lg:p-8 items-center relative z-10">
        {/* Left Pedestal Stage (7 cols) */}
        <div className="md:col-span-7 flex flex-col items-center justify-center relative">
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-heading font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
              <span>શોરૂમ પર આવી રહી છે · COMING SOON</span>
            </span>
            <span className="text-xs font-mono font-bold text-amber-200/80 bg-black/40 px-2.5 py-1 rounded-md border border-amber-400/20">
              {car.year || '2024'} EDITION
            </span>
          </div>

          <div className="relative w-full h-[250px] sm:h-[280px] lg:h-[305px] rounded-2xl bg-gradient-to-b from-white/[0.04] to-black/60 border border-amber-400/25 flex items-center justify-center overflow-hidden p-3 shadow-2xl">
            {/* Ambient Backlight Glow */}
            <div className="absolute inset-x-8 bottom-3 h-12 bg-radial from-amber-500/20 via-black/40 to-transparent blur-xl pointer-events-none" />
            <div className="absolute bottom-4 w-3/4 h-5 bg-black/70 rounded-full blur-md pointer-events-none" />

            {/* Hero Car Image — 100% Unobstructed, Full Car Perfectly Shown */}
            <motion.img
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              src={getOptimizedUrl(car.image, 1000)}
              alt={`${car.make} ${car.model}`}
              className="relative z-10 max-w-full max-h-full object-contain filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.85)] select-none rounded-xl"
              loading="eager"
            />
          </div>
        </div>

        {/* Right Info & Specs (5 cols) */}
        <div className="md:col-span-5 flex flex-col justify-between h-full space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <img src="/logo-removebg-preview.png" alt="Sadguru Car Melo" className="h-6 w-auto object-contain shrink-0" />
              <span className="text-[11px] font-heading font-black tracking-widest text-amber-400 uppercase">
                {car.make} · SADGURU CAR MELO
              </span>
            </div>

            <h3 className="text-2xl lg:text-3xl font-heading font-black text-[#fcf6eb] tracking-tight leading-tight">
              {car.model}
            </h3>

            {car.variant && (
              <span className="inline-block px-2 py-0.5 rounded bg-amber-500/10 border border-amber-400/20 text-[#ffd700] text-xs font-semibold mt-1">
                {car.variant}
              </span>
            )}

            <div className="mt-2 pt-2 border-t border-amber-400/15 flex items-baseline gap-2">
              <span className="text-2xl font-heading font-black text-[#ffd700]">
                {formatCarPrice(car.price)}
              </span>
              <span className="text-xs text-amber-200/70">(પ્રીમિયમ એક્સચેન્જ બોનસ ઉપલબ્ધ)</span>
            </div>
          </div>

          {/* 4 Elegant Gold-Bordered Specs */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-black/40 border border-amber-400/20 flex items-center gap-2">
              <Fuel className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-amber-200/70 block font-bold">ઈંધણ</span>
                <span className="font-heading font-black text-[#fcf6eb] truncate block">{car.fuelType || 'Diesel'}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-black/40 border border-amber-400/20 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-amber-300 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-amber-200/70 block font-bold">ગીયર</span>
                <span className="font-heading font-black text-[#fcf6eb] truncate block">{car.transmission || 'Manual'}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-black/40 border border-amber-400/20 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-amber-200/70 block font-bold">કિલોમીટર</span>
                <span className="font-heading font-black text-[#fcf6eb] truncate block">
                  {car.kms ? `${Number(car.kms).toLocaleString('en-IN')} KM` : '72,000 KM'}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-black/40 border border-amber-400/20 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-300 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-amber-200/70 block font-bold">માલિક</span>
                <span className="font-heading font-black text-[#fcf6eb] truncate block">{car.owner || '1st Owner'}</span>
              </div>
            </div>
          </div>

          {/* Action Suite */}
          <div className="flex items-center gap-2.5 pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-11 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-black text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-green-500/25 transition-all cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0" />
              <span>WhatsApp VIP એલર્ટ</span>
            </a>
            <button
              onClick={() => onOpenModal(car)}
              className="h-11 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-[#d4af37] hover:brightness-110 text-slate-950 font-heading font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
            >
              <Bell className="w-4 h-4 text-slate-950" />
              <span>સૌપ્રથમ નોટિફાય કરો</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   POSTER DESIGN 3: "AERO CARBON & EMERALD TITANIUM"
   - High-performance sports / precision verification theme
   - Deep carbon slate & dark navy, vibrant emerald certification accents
   - Laptop: Precision radar & telemetry style
   - Mobile: Ultra-compact, sleek horizontal rectangle layout
   ═════════════════════════════════════════════════════════════════════════════ */
export function PosterDesign3({ car, onOpenModal }) {
  if (!car) return null;
  const whatsappUrl = getCarWhatsAppUrl(car);

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-[#080E18] via-[#0B1524] to-[#05080E] border border-emerald-500/25 shadow-[0_15px_45px_-10px_rgba(0,0,0,0.7)] group">
      {/* Cool emerald top glow */}
      <div className="absolute top-0 inset-x-0 h-32 sm:h-44 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.18)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 inset-x-8 sm:inset-x-20 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

      {/* ── MOBILE VIEW: COMPACT HORIZONTAL RECTANGLE (Height: ~190px - 215px) ── */}
      <div className="md:hidden flex flex-row items-center p-2.5 sm:p-3 gap-2.5 sm:gap-3 min-h-[190px] max-h-[225px] relative z-10">
        {/* Left: Car Stage in Rectangle Frame (44% width) */}
        <div className="w-[44%] shrink-0 h-full min-h-[170px] max-h-[195px] rounded-xl relative overflow-hidden border border-emerald-500/20 bg-slate-950 p-2 flex flex-col items-center justify-between">
          {/* Top Coming Soon Tag */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-heading font-black text-[8px] uppercase tracking-wider border border-emerald-500/30 flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
              <span>COMING SOON</span>
            </span>
            <span className="text-[8px] font-mono font-bold text-white bg-black/60 px-1 py-0.5 rounded border border-white/10">
              {car.year || '2024'}
            </span>
          </div>

          {/* Car Image - Fully Visible, No Lines on Car */}
          <div className="relative w-full my-auto flex items-center justify-center">
            <div className="absolute -bottom-1 w-4/5 h-3 bg-black/60 rounded-full blur-sm pointer-events-none" />
            <img
              src={getOptimizedUrl(car.image, 600)}
              alt={`${car.make} ${car.model}`}
              className="max-w-full max-h-[115px] object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] select-none rounded-lg"
              loading="eager"
            />
          </div>
        </div>

        {/* Right: Info & Actions (56% width) */}
        <div className="w-[56%] flex flex-col justify-between h-full min-h-[170px] max-h-[195px] py-0.5">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <img src="/logo-removebg-preview.png" alt="Sadguru Car Melo" className="h-3.5 sm:h-4 w-auto object-contain shrink-0" />
              <span className="text-[9px] font-heading font-black text-emerald-400 uppercase tracking-wider truncate">
                {car.make}
              </span>
            </div>

            <h3 className="font-heading font-black text-sm text-white leading-tight truncate">
              {car.model}
            </h3>

            <p className="font-heading font-black text-xs text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 mt-0.5">
              {formatCarPrice(car.price)}
            </p>

            {/* Compact Spec Chips */}
            <div className="grid grid-cols-2 gap-1 mt-1.5 text-[9px] font-semibold text-slate-300">
              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 truncate flex items-center gap-1">
                <Fuel className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                <span className="truncate">{car.fuelType || 'Diesel'}</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 truncate flex items-center gap-1">
                <Settings2 className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                <span className="truncate">{car.transmission || 'Manual'}</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 truncate flex items-center gap-1">
                <Gauge className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                <span className="truncate">{car.kms ? `${Math.round(car.kms / 1000)}k KM` : '72k KM'}</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 truncate flex items-center gap-1">
                <User className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                <span className="truncate">{car.owner || '1st'}</span>
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-1.5 mt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-7 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-black text-[10px] flex items-center justify-center gap-1 shadow-xs active:scale-95"
            >
              <WhatsAppIcon className="w-3 h-3 shrink-0" />
              <span>WhatsApp</span>
            </a>
            <button
              onClick={() => onOpenModal(car)}
              className="h-7 px-2 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-heading font-black text-[10px] flex items-center justify-center gap-1 shadow-xs active:scale-95 shrink-0"
              title="Notify Me"
            >
              <Bell className="w-3 h-3 text-slate-950" />
              <span>એલર્ટ</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── DESKTOP VIEW: PERFORMANCE PRECISION STAGE (Laptop Size OK) ── */}
      <div className="hidden md:grid md:grid-cols-12 gap-6 lg:gap-8 p-6 lg:p-8 items-center relative z-10">
        {/* Left Pedestal Stage (7 cols) */}
        <div className="md:col-span-7 flex flex-col items-center justify-center relative">
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-heading font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>શોરૂમ પર આવી રહી છે · COMING SOON</span>
            </span>
            <span className="text-xs font-mono font-bold text-slate-300 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
              {car.year || '2024'} MODEL
            </span>
          </div>

          <div className="relative w-full h-[250px] sm:h-[280px] lg:h-[305px] rounded-2xl bg-gradient-to-b from-white/[0.04] to-black/60 border border-emerald-500/25 flex items-center justify-center overflow-hidden p-3 shadow-2xl">
            {/* Ambient Backlight Glow */}
            <div className="absolute inset-x-8 bottom-3 h-12 bg-radial from-emerald-500/20 via-black/40 to-transparent blur-xl pointer-events-none" />
            <div className="absolute bottom-4 w-3/4 h-5 bg-black/70 rounded-full blur-md pointer-events-none" />

            {/* Hero Car Image — 100% Unobstructed, Full Car Perfectly Shown */}
            <motion.img
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              src={getOptimizedUrl(car.image, 1000)}
              alt={`${car.make} ${car.model}`}
              className="relative z-10 max-w-full max-h-full object-contain filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.85)] select-none rounded-xl"
              loading="eager"
            />
          </div>
        </div>

        {/* Right Info & Bento Specs (5 cols) */}
        <div className="md:col-span-5 flex flex-col justify-between h-full space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <img src="/logo-removebg-preview.png" alt="Sadguru Car Melo" className="h-6 w-auto object-contain shrink-0" />
              <span className="text-[11px] font-heading font-black tracking-widest text-emerald-400 uppercase">
                {car.make} · SADGURU CAR MELO
              </span>
            </div>

            <h3 className="text-2xl lg:text-3xl font-heading font-black text-white tracking-tight leading-tight">
              {car.model}
            </h3>

            {car.variant && (
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mt-1">
                {car.variant}
              </span>
            )}

            <div className="mt-2 pt-2 border-t border-white/10 flex items-baseline gap-2">
              <span className="text-2xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                {formatCarPrice(car.price)}
              </span>
              <span className="text-xs text-slate-400">(સરળ બેંક લોન ઉપલબ્ધ)</span>
            </div>
          </div>

          {/* 4 Titanium Spec Chips */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-2">
              <Fuel className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block font-bold">ઈંધણ</span>
                <span className="font-heading font-black text-white truncate block">{car.fuelType || 'Diesel'}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block font-bold">ગીયર</span>
                <span className="font-heading font-black text-white truncate block">{car.transmission || 'Manual'}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block font-bold">કિલોમીટર</span>
                <span className="font-heading font-black text-white truncate block">
                  {car.kms ? `${Number(car.kms).toLocaleString('en-IN')} KM` : '72,000 KM'}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block font-bold">માલિક</span>
                <span className="font-heading font-black text-white truncate block">{car.owner || '1st Owner'}</span>
              </div>
            </div>
          </div>

          {/* Action Suite */}
          <div className="flex items-center gap-2.5 pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-11 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-black text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-green-500/25 transition-all cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0" />
              <span>WhatsApp VIP એલર્ટ</span>
            </a>
            <button
              onClick={() => onOpenModal(car)}
              className="h-11 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:brightness-110 text-slate-950 font-heading font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
            >
              <Bell className="w-4 h-4 text-slate-950" />
              <span>સૌપ્રથમ નોટિફાય કરો</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT: COMING SOON CAROUSEL
   - Cycles through the 3 Top-Level Luxury Poster Designs!
   - On Laptop: Spacious studio format
   - On Mobile: Compact, rectangular size with decreased height
   - Full touch swipe and navigation controls
   ═════════════════════════════════════════════════════════════════════════════ */
export default function ComingSoonCarousel({ noPadding = false, className = '' }) {
  const { cars, isLoading } = useCars();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(1);

  // VIP Alert / Inquiry Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCarForModal, setSelectedCarForModal] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', note: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract all Coming Soon cars from inventory, or fallback to curated models
  const displayCars = useMemo(() => {
    const list = (cars || []).filter((c) => {
      if (!c || !c.image) return false;
      const status = (c.status || '').trim().toLowerCase();
      return (
        status === 'coming soon' ||
        status.includes('soon') ||
        status.includes('upcoming') ||
        c.isComingSoon === true
      );
    });

    if (list.length > 0) {
      return list;
    }
    return FALLBACK_SHOWCASE;
  }, [cars]);

  // Keep index within bounds
  useEffect(() => {
    if (currentIndex >= displayCars.length) {
      setCurrentIndex(0);
    }
  }, [displayCars.length, currentIndex]);

  // Auto-play timer with pause on hover
  useEffect(() => {
    if (displayCars.length <= 1 || isHovered || isModalOpen) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % displayCars.length);
    }, 6500);

    return () => clearInterval(timer);
  }, [displayCars.length, isHovered, isModalOpen]);

  const activeCar = displayCars[currentIndex] || displayCars[0];

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % displayCars.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? displayCars.length - 1 : prev - 1));
  };

  const handleSwipe = (event, info) => {
    const threshold = 40;
    if (info.offset.x < -threshold || info.velocity.x < -300) {
      handleNext();
    } else if (info.offset.x > threshold || info.velocity.x > 300) {
      handlePrev();
    }
  };

  // Open VIP modal
  const openVipModal = (car) => {
    setSelectedCarForModal(car || activeCar);
    setIsModalOpen(true);
  };

  // Submit VIP Inquiry
  const handleVipSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error('કૃપા કરી તમારું નામ અને મોબાઈલ નંબર દાખલ કરો.');
      return;
    }

    try {
      setIsSubmitting(true);
      const carInfo = selectedCarForModal || activeCar;
      const message = `VIP Priority Alert for Upcoming Car: ${carInfo?.make} ${carInfo?.model} (${carInfo?.year || ''}) - Fuel: ${carInfo?.fuelType || 'N/A'}, Price: ${carInfo?.price ? formatCarPrice(carInfo.price) : 'On Arrival'}${formData.note ? ` | Note: ${formData.note}` : ''}`;

      await axiosInstance.post('/messages', {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        message,
        type: 'Coming Soon VIP Alert'
      });

      toast.success('તમારી VIP પ્રાયોરિટી એલર્ટ રજિસ્ટર થઈ ગઈ છે! કાર આવતા જ અમે સૌથી પહેલા સંપર્ક કરીશું.', {
        duration: 4500,
        icon: '✨'
      });

      setIsModalOpen(false);
      setFormData({ name: '', phone: '', note: '' });
    } catch (err) {
      console.error('VIP Alert submit error:', err);
      toast.error('સબમિટ કરવામાં ભૂલ આવી. કૃપા કરી WhatsApp દ્વારા સંપર્ક કરો.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!activeCar) return null;

  // Render one of the 3 top-level poster designs based on index!
  const renderPosterTemplate = (car, index) => {
    const designIndex = index % 3;
    switch (designIndex) {
      case 0:
        return <PosterDesign1 car={car} onOpenModal={openVipModal} />;
      case 1:
        return <PosterDesign2 car={car} onOpenModal={openVipModal} />;
      case 2:
        return <PosterDesign3 car={car} onOpenModal={openVipModal} />;
      default:
        return <PosterDesign1 car={car} onOpenModal={openVipModal} />;
    }
  };

  // Slide Animation Variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
      scale: 0.99
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 32 },
        opacity: { duration: 0.28 },
        scale: { duration: 0.28 }
      }
    },
    exit: (dir) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      scale: 0.99,
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 32 },
        opacity: { duration: 0.22 },
        scale: { duration: 0.22 }
      }
    })
  };

  return (
    <div
      className={`relative w-full ${noPadding ? 'my-2 sm:my-3' : 'py-4 sm:py-6'} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full relative group/carousel">

        {/* Carousel Window with touch swipe */}
        <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeCar._id ? `${activeCar._id}-${currentIndex}` : currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleSwipe}
              className="w-full cursor-grab active:cursor-grabbing"
            >
              {renderPosterTemplate(activeCar, currentIndex)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows (Show when more than 1 car) */}
        {displayCars.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-1.5 sm:left-3 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg z-20 transition-all active:scale-95 cursor-pointer opacity-80 hover:opacity-100"
              aria-label="Previous Car"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg z-20 transition-all active:scale-95 cursor-pointer opacity-80 hover:opacity-100"
              aria-label="Next Car"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-1.5 mt-2 sm:mt-2.5">
              {displayCars.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-6 sm:w-8 bg-brand-orange'
                      : 'w-1.5 bg-slate-400/50 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          VIP PRIORITY ALERT MODAL
          ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-slate-900 border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl z-10 overflow-hidden text-white"
            >
              <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-brand-orange to-transparent" />

              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-heading font-black tracking-widest uppercase text-brand-orange block">
                    VIP PRIORITY ALERT
                  </span>
                  <h3 className="text-lg font-heading font-black text-white">
                    સૌપ્રથમ નોટિફિકેશન અને બુકિંગ
                  </h3>
                </div>
              </div>

              {selectedCarForModal && (
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 mb-3.5">
                  <img
                    src={getOptimizedUrl(selectedCarForModal.image, 200)}
                    alt={selectedCarForModal.model}
                    className="w-14 h-10 object-contain rounded-lg bg-black/30 p-1 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-heading font-black text-xs text-white truncate">
                      {selectedCarForModal.make} {selectedCarForModal.model} ({selectedCarForModal.year || '2024'})
                    </h4>
                    <p className="text-[11px] text-amber-400 font-semibold truncate">
                      {formatCarPrice(selectedCarForModal.price)} • {selectedCarForModal.fuelType || 'Diesel'}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleVipSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    તમારું પૂરું નામ *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="દા.ત. રમેશભાઈ પટેલ"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/90 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    WhatsApp નંબર *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="દા.ત. 98795 25627"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/90 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    નોંધ (Optional Note)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="દા.ત. સાંજે કોલ કરશો / લોનની માહિતી જોઈએ છે"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-brand-orange resize-none"
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500 text-slate-950 font-heading font-black text-xs sm:text-sm tracking-wide shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>સબમિટ થઈ રહ્યું છે...</span>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5" />
                        <span>VIP પ્રાયોરિટી બુક કરો</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
