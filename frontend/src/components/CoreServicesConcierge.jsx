import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Car, Banknote, RefreshCw, ChevronRight, CheckCircle2,
  ShieldCheck, ArrowUpRight, Zap, Star, Sparkles, Clock,
  FileText, Check, Award
} from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';

/**
 * CoreServicesConcierge
 * Inspired by the award-winning Brand Beast / Pinterest stacked card deck animation.
 * Features 3 massive, high-impact saturated cards (Royal Indigo, Warm Tangerine Orange, Crimson Red)
 * that stack seamlessly on scroll, featuring real customer quotes and large, perfectly-set showcase preview cards.
 */
export default function CoreServicesConcierge({ activeTab, onTabClick }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Dynamic 3D stack transforms
  const card0Scale = useTransform(scrollYProgress, [0.1, 0.45, 0.8], [1, 0.96, 0.92]);
  const card0Dim = useTransform(scrollYProgress, [0.15, 0.5], [0, 0.15]);

  const card1Scale = useTransform(scrollYProgress, [0.45, 0.85], [1, 0.96]);
  const card1Dim = useTransform(scrollYProgress, [0.55, 0.88], [0, 0.12]);

  // Data for Card 1 (BUY) showcase preview vehicles
  const buyShowcaseCars = [
    {
      name: 'Hyundai Creta SX (O)',
      variant: 'Turbo DCT · Sunroof',
      price: '₹14.80 L',
      badge: '120-Point Pass',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      specs: '2025 · Petrol · Auto'
    },
    {
      name: 'Kia Seltos GTX+',
      variant: 'Panoramic Roof · GJ-05',
      price: '₹18.50 L',
      badge: 'Certified Clean',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
      specs: '2025 · Diesel · Auto'
    },
    {
      name: 'Tata Safari XZA+',
      variant: 'Dark Edition · 7-Seater',
      price: '₹16.50 L',
      badge: 'Non-Accidental',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
      specs: '2025 · Diesel · Auto'
    },
    {
      name: 'Maruti Grand Vitara',
      variant: 'Alpha+ Strong Hybrid',
      price: '₹15.80 L',
      badge: '100% Genuine KM',
      image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80',
      specs: '2025 · Hybrid · Auto'
    }
  ];

  // Data for Card 2 (SELL) showcase preview features
  const sellShowcaseFeatures = [
    {
      title: 'Instant Fair Valuation',
      subtitle: 'ડિજિટલ માર્કેટ રેટ એનાલિસિસ',
      highlight: 'Best Market Price',
      icon: Banknote,
      color: 'bg-emerald-500/20 text-emerald-300'
    },
    {
      title: '15-Minute Payment',
      subtitle: 'તાત્કાલિક RTGS / IMPS બેંક ટ્રાન્સફર',
      highlight: 'Zero Risk Pay',
      icon: Zap,
      color: 'bg-amber-500/20 text-amber-300'
    },
    {
      title: '100% Free RTO',
      subtitle: 'કાનૂની માલિકી ફેરબદલની જવાબદારી',
      highlight: '₹0 Paperwork Fee',
      icon: FileText,
      color: 'bg-sky-500/20 text-sky-300'
    },
    {
      title: 'Doorstep Evaluation',
      subtitle: 'તમારા લોકેશન પર ફ્રી કાર ચેકિંગ',
      highlight: 'Free Home Visit',
      icon: Car,
      color: 'bg-purple-500/20 text-purple-300'
    }
  ];

  // Data for Card 3 (EXCHANGE) showcase preview benefits
  const exchangeShowcaseBenefits = [
    {
      title: 'Same-Day Delivery',
      subtitle: 'માત્ર 2 કલાકમાં ચાવી સાથે હેન્ડઓવર',
      highlight: 'Drive Out Today',
      icon: Clock,
      color: 'bg-amber-500/20 text-amber-300'
    },
    {
      title: 'Special Exchange Bonus',
      subtitle: 'બજાર કિંમત ઉપરાંત રોકડ બોનસ',
      highlight: '₹25,000+ Extra Value',
      icon: Award,
      color: 'bg-emerald-500/20 text-emerald-300'
    },
    {
      title: 'Single Window Deal',
      subtitle: 'જૂનીનું વેચાણ & નવીની ખરીદી એક જ છત નીચે',
      highlight: 'Zero Hassle',
      icon: RefreshCw,
      color: 'bg-sky-500/20 text-sky-300'
    },
    {
      title: '0% Down Payment',
      subtitle: 'જૂની કારનું મૂલ્ય સીધું ડાઉન પેમેન્ટમાં',
      highlight: '100% Funding',
      icon: ShieldCheck,
      color: 'bg-yellow-500/20 text-yellow-300'
    }
  ];

  return (
    <div ref={containerRef} className="relative w-full">

      {/* ═════════════════════════════════════════════════════════════════════
          CARD 01: BUY CAR (Royal Indigo / Sapphire - Matches Video Screenshot 1)
          ═════════════════════════════════════════════════════════════════════ */}
      <div id="service-anchor-buy" className="scroll-mt-28" />
      <motion.div
        id="service-card-buy"
        style={{
          top: 'clamp(72px, 8.5vh, 90px)',
          scale: card0Scale,
          transformOrigin: 'top center',
          zIndex: 10,
        }}
        className="sticky w-full rounded-[32px] sm:rounded-[42px] lg:rounded-[48px] bg-[#1E2378] text-white p-6 sm:p-10 lg:p-12 shadow-[0_30px_70px_-15px_rgba(30,35,120,0.5),0_10px_25px_-5px_rgba(0,0,0,0.2)] overflow-hidden transition-all duration-300 relative border border-white/10"
      >
        {/* Subtle Dimming layer when overlapped */}
        <motion.div
          style={{ opacity: card0Dim }}
          className="absolute inset-0 bg-black pointer-events-none rounded-[inherit] z-20"
        />

        {/* Ambient Top Glow Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-indigo-500/25 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between min-h-[540px] lg:min-h-[580px]">

          {/* ── Top Bar: Tag & Large Numeral (01) ── */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/15">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs sm:text-sm font-black text-amber-300 tracking-widest uppercase bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20">
                [01 / BUY]
              </span>
              <span className="text-xs sm:text-sm font-heading font-bold text-white/90">
                સુરતનું સૌથી મોટું વેરિફાઇડ કાર હબ · 150+ Live Stock
              </span>
            </div>

            {/* Stylized Numeral (Matches Video Screenshot) */}
            <span className="font-heading font-black text-2xl sm:text-3xl text-white/40 tracking-wider">
              (01)
            </span>
          </div>

          {/* ── Main Headline & Editorial Description ── */}
          <div className="my-6 lg:my-8 max-w-4xl">
            <h3 className="text-3xl sm:text-5xl lg:text-[56px] font-black font-heading text-white tracking-tight leading-[1.12]">
              100% વેરિફાઇડ સાથે તમારી <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-200">
                Dream Car
              </span> ખરીદો.
            </h3>
            <p className="mt-4 text-sm sm:text-base lg:text-lg text-white/85 font-medium leading-relaxed font-body max-w-3xl">
              Pre-owned કાર ખરીદવી હવે ચિંતાનો વિષય નથી. દરેક કાર 120-પોઇન્ટ કડક ટેકનિકલ તપાસ અને રોડ ટેસ્ટિંગ પાસ કર્યા પછી જ ડિસ્પ્લે થાય છે. 100% નોન-એક્સિડેન્ટલ સર્ટિફિકેશન, ₹0 RTO ટ્રાન્સફર અને સંપૂર્ણ પારદર્શિતા.
            </p>
          </div>

          {/* ── Bottom Section: Testimonial (Left) + 4 Large Showcase Preview Cards (Right) ── */}
          <div className="pt-6 border-t border-white/15 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">

            {/* Left: Customer Trust Quote (Matches Screenshot 1 Left) */}
            <div className="lg:col-span-5 flex flex-col justify-between pr-0 lg:pr-4">
              <div className="flex items-center gap-1 text-amber-300 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-300 text-amber-300" />
                ))}
                <span className="text-xs font-mono font-bold text-white ml-1.5">5.0 Star Verified</span>
              </div>

              <blockquote className="text-xs sm:text-sm text-white/90 leading-relaxed font-body italic mb-4">
                "સદગુરુ કાર મેળામાંથી Hyundai Creta લીધી. 120-પોઇન્ટ ટેકનિકલ હેલ્થ રિપોર્ટ, નોન-એક્સિડેન્ટલ ગેરંટી અને 100% ફ્રી RTO ટ્રાન્સફર સાથે સેમ ડે ડિલિવરી મળી. સુરતમાં સૌથી ભરોસાપાત્ર ટીમ!"
              </blockquote>

              <div className="flex items-center gap-3">
                <img
                  src="https://res.cloudinary.com/dijf9umhc/image/upload/v1776927906/sadguru_cars/maqpmlzrkhwdjgfbx4qm.jpg"
                  alt="Nikulbhai Delivery"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/50 shadow-md shrink-0"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-heading font-black text-white">
                    નિકુલભાઈ (ભાવનગર / સુરત)
                  </h4>
                  <p className="text-[11px] text-white/70 font-mono">
                    Hyundai Creta SX · Verified Buyer
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Floating Action Pill + 4 Large Showcase Preview Cards (Matches Screenshot 1 Right) */}
            <div className="lg:col-span-7 flex flex-col gap-3.5">
              {/* Floating Action Pill */}
              <div className="flex items-center justify-end">
                <Link
                  to="/inventory"
                  className="group/btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-amber-300 text-slate-950 font-heading font-black text-xs sm:text-sm shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Car className="w-4 h-4 text-indigo-700" />
                  <span>સંપૂર્ણ 150+ વેરિફાઇડ સ્ટોક જુઓ</span>
                  <ChevronRight className="w-4 h-4 text-slate-950 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* 4 Large Showcase Preview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {buyShowcaseCars.map((car, idx) => (
                  <Link
                    key={idx}
                    to="/inventory"
                    className="group/car relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 block"
                  >
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover/car:scale-110 transition-transform duration-700 opacity-90 group-hover/car:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />

                    {/* Top Badge */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                        {car.badge}
                      </span>
                    </div>

                    {/* Bottom Car Details */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <h5 className="text-xs font-heading font-black truncate leading-tight">
                        {car.name}
                      </h5>
                      <span className="text-[10px] text-white/70 block truncate mt-0.5">
                        {car.variant}
                      </span>
                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/20">
                        <span className="text-xs font-mono font-black text-amber-300">
                          {car.price}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-white/60 group-hover/car:text-amber-300 group-hover/car:translate-x-0.5 group-hover/car:-translate-y-0.5 transition-all" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>
      </motion.div>

      {/* Scroll Spacer to trigger sticky transition */}
      <div className="h-[28vh] sm:h-[35vh] pointer-events-none" />


      {/* ═════════════════════════════════════════════════════════════════════
          CARD 02: SELL CAR (Warm Tangerine Orange - Matches Video Screenshot 3 & 4)
          ═════════════════════════════════════════════════════════════════════ */}
      <div id="service-anchor-sell" className="scroll-mt-28" />
      <motion.div
        id="service-card-sell"
        style={{
          top: 'calc(clamp(72px, 8.5vh, 90px) + 38px)',
          scale: card1Scale,
          transformOrigin: 'top center',
          zIndex: 20,
        }}
        className="sticky w-full rounded-[32px] sm:rounded-[42px] lg:rounded-[48px] bg-[#E85D04] text-white p-6 sm:p-10 lg:p-12 shadow-[0_30px_70px_-15px_rgba(232,93,4,0.55),0_10px_25px_-5px_rgba(0,0,0,0.25)] overflow-hidden transition-all duration-300 relative border border-white/15"
      >
        {/* Subtle Dimming layer when overlapped */}
        <motion.div
          style={{ opacity: card1Dim }}
          className="absolute inset-0 bg-black pointer-events-none rounded-[inherit] z-20"
        />

        {/* Ambient Top Glow Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-yellow-300/25 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-red-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between min-h-[540px] lg:min-h-[580px]">

          {/* ── Top Bar: Tag & Large Numeral (02) ── */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/20">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs sm:text-sm font-black text-slate-950 tracking-widest uppercase bg-white px-3.5 py-1.5 rounded-full shadow-xs">
                [02 / SELL]
              </span>
              <span className="text-xs sm:text-sm font-heading font-bold text-white">
                ઇન્સ્ટન્ટ પેમેન્ટ & 100% ફ્રી RTO · Zero Brokerage
              </span>
            </div>

            {/* Stylized Numeral (Matches Video Screenshot) */}
            <span className="font-heading font-black text-2xl sm:text-3xl text-white/50 tracking-wider">
              (02)
            </span>
          </div>

          {/* ── Main Headline & Editorial Description ── */}
          <div className="my-6 lg:my-8 max-w-4xl">
            <h3 className="text-3xl sm:text-5xl lg:text-[56px] font-black font-heading text-white tracking-tight leading-[1.12]">
              શ્રેષ્ઠ કિંમતે કાર વેચો અને <br className="hidden sm:inline" />
              <span className="text-slate-950 bg-white/95 px-3 py-0.5 rounded-2xl inline-block mt-1 sm:mt-0 shadow-md">
                15 મિનિટમાં Payment
              </span> મેળવો.
            </h3>
            <p className="mt-4 text-sm sm:text-base lg:text-lg text-white/90 font-medium leading-relaxed font-body max-w-3xl">
              કોઈ પણ મધ્યસ્થી કે કમિશન વગર તમારી કારનું સચોટ ડિજિટલ વેલ્યુએશન મેળવો. સ્થળ પર જ ટેકનિકલ ઇન્સ્પેક્શન, 15 મિનિટમાં સીધા તમારા બેંક ખાતામાં Immediate Transfer અને RTO કાનૂની દસ્તાવેજોની સંપૂર્ણ જવાબદારી અમારી.
            </p>
          </div>

          {/* ── Bottom Section: Testimonial (Left) + 4 Large Feature Showcase Cards (Right) ── */}
          <div className="pt-6 border-t border-white/20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">

            {/* Left: Customer Trust Quote (Matches Screenshot 3 Left) */}
            <div className="lg:col-span-5 flex flex-col justify-between pr-0 lg:pr-4">
              <div className="flex items-center gap-1 text-white mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-white text-white" />
                ))}
                <span className="text-xs font-mono font-bold text-white ml-1.5">5.0 Verified Settlement</span>
              </div>

              <blockquote className="text-xs sm:text-sm text-white leading-relaxed font-body italic mb-4">
                "મારી જૂની કાર વેચવા માટે સુરતમાં ઘણા ડીલર્સ પાસે ગયો, પણ સદગુરુ કાર મેળામાં સૌથી સાચી બજાર કિંમત મળી અને ડીલ ફાઇનલ થતાં જ 15 મિનિટમાં બેંકમાં RTGS થઈ ગયું. કાગળની ઝંઝટ બિલકુલ નહીં!"
              </blockquote>

              <div className="flex items-center gap-3">
                <img
                  src="https://res.cloudinary.com/dijf9umhc/image/upload/v1776927825/sadguru_cars/hrjlqzfexc1bciifiumo.jpg"
                  alt="Surat Family Delivery"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md shrink-0"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-heading font-black text-white">
                    સુરત અડાજણ ફેમિલી
                  </h4>
                  <p className="text-[11px] text-white/80 font-mono">
                    Instant Bank Transfer Verified
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Floating Action Pill + 4 Large Feature Showcase Cards (Matches Screenshot 3 Right) */}
            <div className="lg:col-span-7 flex flex-col gap-3.5">
              {/* Floating Action Pill */}
              <div className="flex items-center justify-end">
                <Link
                  to="/sell-your-car"
                  className="group/btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-slate-950 hover:text-white text-slate-950 font-heading font-black text-xs sm:text-sm shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Banknote className="w-4 h-4 text-emerald-600 group-hover/btn:text-emerald-400" />
                  <span>ઓનલાઇન કાર વેલ્યુએશન મેળવો</span>
                  <ChevronRight className="w-4 h-4 text-slate-950 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* 4 Large Feature Showcase Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {sellShowcaseFeatures.map((feat, idx) => {
                  const IconComp = feat.icon;
                  return (
                    <div
                      key={idx}
                      className="group/feat relative aspect-[4/5] rounded-2xl p-4 bg-black/25 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${feat.color} border border-white/10`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] font-mono font-bold text-white/90 bg-white/15 px-2 py-0.5 rounded-md">
                          0{idx + 1}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono font-bold text-amber-200 block uppercase tracking-wider mb-0.5">
                          {feat.highlight}
                        </span>
                        <h5 className="text-xs sm:text-sm font-heading font-black text-white leading-snug">
                          {feat.title}
                        </h5>
                        <p className="text-[10px] text-white/75 font-body leading-tight mt-1 line-clamp-2">
                          {feat.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </motion.div>

      {/* Scroll Spacer to trigger sticky transition */}
      <div className="h-[28vh] sm:h-[35vh] pointer-events-none" />


      {/* ═════════════════════════════════════════════════════════════════════
          CARD 03: EXCHANGE (Fiery Crimson Red - Matches Video Screenshot 5)
          ═════════════════════════════════════════════════════════════════════ */}
      <div id="service-anchor-exchange" className="scroll-mt-28" />
      <motion.div
        id="service-card-exchange"
        style={{
          top: 'calc(clamp(72px, 8.5vh, 90px) + 76px)',
          scale: 1,
          transformOrigin: 'top center',
          zIndex: 30,
        }}
        className="sticky w-full rounded-[32px] sm:rounded-[42px] lg:rounded-[48px] bg-[#DC2626] text-white p-6 sm:p-10 lg:p-12 shadow-[0_30px_70px_-15px_rgba(220,38,38,0.55),0_10px_25px_-5px_rgba(0,0,0,0.25)] overflow-hidden transition-all duration-300 relative border border-white/15"
      >
        {/* Ambient Top Glow Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-orange-400/25 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-amber-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between min-h-[540px] lg:min-h-[580px]">

          {/* ── Top Bar: Tag & Large Numeral (03) ── */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/20">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs sm:text-sm font-black text-slate-950 tracking-widest uppercase bg-white px-3.5 py-1.5 rounded-full shadow-xs">
                [03 / EXCHANGE]
              </span>
              <span className="text-xs sm:text-sm font-heading font-bold text-white">
                સેમ-ડે ડિલિવરી બોનસ · જૂની કાર આપો, નવી કાર ઘરે લાવો
              </span>
            </div>

            {/* Stylized Numeral (Matches Video Screenshot) */}
            <span className="font-heading font-black text-2xl sm:text-3xl text-white/50 tracking-wider">
              (03)
            </span>
          </div>

          {/* ── Main Headline & Editorial Description ── */}
          <div className="my-6 lg:my-8 max-w-4xl">
            <h3 className="text-3xl sm:text-5xl lg:text-[56px] font-black font-heading text-white tracking-tight leading-[1.12]">
              જૂની કાર આપી તે જ દિવસે નવી <br className="hidden sm:inline" />
              <span className="text-slate-950 bg-white/95 px-3 py-0.5 rounded-2xl inline-block mt-1 sm:mt-0 shadow-md">
                Dream Car
              </span> ઘરે લાવો.
            </h3>
            <p className="mt-4 text-sm sm:text-base lg:text-lg text-white/90 font-medium leading-relaxed font-body max-w-3xl">
              તમારી જૂની કાર કોઈપણ કંપની કે સ્થિતિમાં હોય, તેની સાચી કિંમત મેળવી તે જ દિવસે સ્પેશિયલ એક્સચેન્જ બોનસ સાથે નવી પ્રીમિયમ કાર ઘરે લઈ જાવ. જૂની કારનું વેચાણ અને નવીની ડિલિવરી એક જ સ્થળે માત્ર 2 કલાકમાં પૂર્ણ.
            </p>
          </div>

          {/* ── Bottom Section: Testimonial (Left) + 4 Large Benefit Showcase Cards (Right) ── */}
          <div className="pt-6 border-t border-white/20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">

            {/* Left: Customer Trust Quote (Matches Screenshot 5 Left) */}
            <div className="lg:col-span-5 flex flex-col justify-between pr-0 lg:pr-4">
              <div className="flex items-center gap-1 text-white mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-white text-white" />
                ))}
                <span className="text-xs font-mono font-bold text-white ml-1.5">5.0 Verified Exchange</span>
              </div>

              <blockquote className="text-xs sm:text-sm text-white leading-relaxed font-body italic mb-4">
                "મારી જૂની કાર એક્સચેન્જ કરીને તે જ દિવસે નવી Creta ની ડિલિવરી મળી. એક્સચેન્જ બોનસ મળ્યું અને જૂની કારની ચાલુ લોન પણ સદગુરુ ટીમે જ સેટલ કરી આપી. સુપર ફાસ્ટ અને વંડરફુલ સર્વિસ!"
              </blockquote>

              <div className="flex items-center gap-3">
                <img
                  src="https://res.cloudinary.com/dijf9umhc/image/upload/v1776927822/sadguru_cars/zrkzpjqllkfxr4z0v4w4.jpg"
                  alt="Swapnilbhai Delivery"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md shrink-0"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-heading font-black text-white">
                    સ્વપ્નિલભાઈ (મહારાષ્ટ્ર)
                  </h4>
                  <p className="text-[11px] text-white/80 font-mono">
                    Same-Day Exchange Upgrade
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Floating Action Pill + 4 Large Benefit Showcase Cards (Matches Screenshot 5 Right) */}
            <div className="lg:col-span-7 flex flex-col gap-3.5">
              {/* Floating Action Pill */}
              <div className="flex items-center justify-end">
                <Link
                  to="/inventory"
                  className="group/btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-slate-950 hover:text-white text-slate-950 font-heading font-black text-xs sm:text-sm shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-red-600 group-hover/btn:text-red-400" />
                  <span>તમારી કાર એક્સચેન્જ અપગ્રેડ કરો</span>
                  <ChevronRight className="w-4 h-4 text-slate-950 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* 4 Large Benefit Showcase Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {exchangeShowcaseBenefits.map((ben, idx) => {
                  const IconComp = ben.icon;
                  return (
                    <div
                      key={idx}
                      className="group/ben relative aspect-[4/5] rounded-2xl p-4 bg-black/25 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${ben.color} border border-white/10`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] font-mono font-bold text-white/90 bg-white/15 px-2 py-0.5 rounded-md">
                          0{idx + 1}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono font-bold text-amber-200 block uppercase tracking-wider mb-0.5">
                          {ben.highlight}
                        </span>
                        <h5 className="text-xs sm:text-sm font-heading font-black text-white leading-snug">
                          {ben.title}
                        </h5>
                        <p className="text-[10px] text-white/75 font-body leading-tight mt-1 line-clamp-2">
                          {ben.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </motion.div>

    </div>
  );
}
