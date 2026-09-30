/**
 * @file frontend/src/components/about/AboutHeroSection.jsx
 * @description Luxury Pinterest-inspired hero section featuring editorial typography,
 * playful agency sketch annotations, showroom navigation CTAs, and a curved smile arc showcase.
 */

// External dependencies
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Car,
  ChevronRight,
  MapPin,
  ArrowUpRight,
  Sparkles,
  Star,
  Quote,
} from 'lucide-react';

// Internal local imports
import { getOptimizedUrl } from '../../utils/imageUtils';
import { ARC_CARD_CONFIGS } from '../../data/aboutData';

// Constants
const SHOWROOM_MAPS_URL = 'https://maps.google.com/?q=Sadguru+Car+Melo+Surat';

/**
 * About Hero Section Component
 * @param {Object} props
 * @param {Array} props.heroCustomers - Verified customer delivery records
 * @param {Function} props.onSelectCustomer - Handler for clicking a customer card
 */
export default function AboutHeroSection({ heroCustomers, onSelectCustomer }) {
  return (
    <section className="relative bg-gradient-to-b from-white via-[#FAF9F6] to-white pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden border-b border-slate-100">
      {/* Soft Warm Luxury Ambient Radiance Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-[radial-gradient(ellipse_75%_55%_at_50%_0%,rgba(245,148,35,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute -top-28 -left-28 w-96 h-96 bg-amber-100/50 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -top-28 -right-28 w-96 h-96 bg-orange-100/40 rounded-full blur-[130px] pointer-events-none" />

      {/* Subtle Luxury Pattern Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_50%,transparent_100%)] pointer-events-none" />

      {/* Left Sketch Annotation */}
      <div className="hidden xl:flex absolute left-6 2xl:left-14 top-24 flex-col items-center pointer-events-none select-none z-10">
        <span className="font-script text-2xl lg:text-[28px] text-slate-700 -rotate-6 tracking-wide drop-shadow-sm font-bold">
          5,000+ Happy Families ✨
        </span>
        <svg className="w-20 h-16 text-slate-600/70 mt-1 -rotate-6" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M 25 15 Q 55 25 75 62" />
          <path d="M 64 56 L 75 62 L 73 48" />
        </svg>
      </div>

      {/* Right Sketch Annotation */}
      <div className="hidden xl:flex absolute right-6 2xl:left-auto 2xl:right-14 top-24 flex-col items-center pointer-events-none select-none z-10">
        <span className="font-script text-2xl lg:text-[28px] text-slate-700 rotate-6 tracking-wide drop-shadow-sm font-bold">
          100% Verified Quality 🚗
        </span>
        <svg className="w-20 h-16 text-slate-600/70 mt-1 rotate-6" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M 75 15 Q 45 30 25 62" />
          <path d="M 36 56 L 25 62 L 27 48" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center">
        {/* Top Pill Seal */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-white/90 border border-slate-200/90 shadow-sm backdrop-blur-md mb-6 hover:border-brand-orange/40 transition-colors"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-orange" />
          </span>
          <span className="font-heading font-bold text-xs sm:text-sm text-slate-800 tracking-wide">
            5,000+ ખુશ પરિવારો · સુરતનું નંબર 1 વેરિફાઇડ કાર હબ Established 2011
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-[68px] font-black tracking-tight leading-[1.12] max-w-4xl text-slate-950 font-heading"
        >
          સુરતમાં વેરિફાઇડ કાર માટેનું <br className="hidden sm:inline" />
          <span className="text-slate-950">સૌથી </span>
          <span className="text-brand-orange">વિશ્વાસપાત્ર</span>
          <span className="text-slate-950"> નામ એટલે </span>
          <span className="relative inline-block whitespace-nowrap text-slate-950">
            <span className="relative z-10">સદગુરુ</span>
            <svg
              className="absolute -bottom-2.5 sm:-bottom-4 left-0 w-full h-3 sm:h-4 text-brand-orange overflow-visible pointer-events-none"
              viewBox="0 0 160 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 9C45 19 115 19 157 8"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </motion.h1>

        {/* Editorial Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.2 }}
          className="mt-5 text-base sm:text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed px-2 font-body"
        >
          150+ વેરિફાઇડ કાર, 120+ પોઈન્ટ્સ ટેકનિકલ ઈન્સ્પેક્શન અને સંપૂર્ણ પારદર્શિતા સાથે સુરતના 5,000+ પરિવારોની પ્રથમ પસંદગી.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-7 flex flex-col items-center justify-center gap-3 relative z-20"
        >
          <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
            <Link
              to="/inventory"
              className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-slate-950 hover:bg-slate-900 text-white font-heading font-black text-sm sm:text-base shadow-[0_12px_28px_rgba(15,23,42,0.22)] hover:shadow-[0_18px_36px_rgba(15,23,42,0.32)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden border border-slate-800"
            >
              <Car className="w-4 h-4 sm:w-5 sm:h-5 text-brand-orange" />
              <span>સંપૂર્ણ સ્ટોક જુઓ · Browse 150+ Cars</span>
              <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href={SHOWROOM_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/95 hover:bg-white text-slate-800 font-heading font-bold text-sm sm:text-base border border-slate-300 shadow-sm hover:shadow-md hover:border-slate-400 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
            >
              <MapPin className="w-4 h-4 text-brand-orange" />
              <span>શોરૂમ લોકેશન · Showroom Visit</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Under-Button Annotation */}
          <div className="hidden sm:flex items-center justify-center gap-2 mt-2 pointer-events-none select-none">
            <svg className="w-7 h-7 text-brand-orange -rotate-12" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M 28 8 Q 14 18 18 30" />
              <path d="M 12 24 L 18 30 L 25 26" />
            </svg>
            <span className="font-script text-xl sm:text-2xl text-slate-700 font-bold">
              100% Free RTO & Paperwork Guarantee ✨
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── Curved Smile Arc Customer Showcase ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12 sm:mt-14 max-w-7xl mx-auto relative z-10"
      >
        {/* Desktop & Tablet Curved Arc */}
        <div className="hidden md:flex justify-center items-center gap-3 lg:gap-4 xl:gap-5 px-2 overflow-visible pt-4 pb-8">
          {heroCustomers.slice(0, 6).map((customer, idx) => {
            const config = ARC_CARD_CONFIGS[idx] || ARC_CARD_CONFIGS[0];
            return (
              <div
                key={customer._id || idx}
                onClick={() => onSelectCustomer(customer)}
                className={`group relative shrink-0 w-44 sm:w-48 lg:w-52 xl:w-56 aspect-[4/5] rounded-[24px] lg:rounded-[28px] overflow-hidden cursor-pointer bg-slate-900 border-2 border-white shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${config.rotation} ${config.translate} ${config.hover}`}
              >
                {/* Delivery Photo */}
                <img
                  src={getOptimizedUrl(customer.photo, 600)}
                  alt={customer.customerName}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />

                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-black/15 pointer-events-none transition-opacity duration-300 group-hover:opacity-75" />

                {/* Top Badges */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/20 text-white text-[10px] lg:text-[11px] font-semibold flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{customer.deliveryTag}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] lg:text-[11px] font-black flex items-center gap-0.5 shadow-sm">
                    <Star className="w-2.5 h-2.5 fill-slate-950 text-slate-950" />
                    <span>{customer.rating || '5.0'}</span>
                  </span>
                </div>

                {/* Bottom Caption Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-3.5 lg:p-4 text-left pointer-events-none">
                  <h4 className="font-heading font-black text-white text-xs lg:text-sm tracking-wide drop-shadow-md truncate">
                    {customer.customerName}
                  </h4>
                  <p className="text-[10px] lg:text-[11px] text-amber-300 font-semibold tracking-wider uppercase mt-0.5 truncate">
                    {customer.carModel || 'Verified Car'}
                  </p>
                  <p className="text-[10px] text-white/70 font-medium truncate">
                    {customer.location}
                  </p>
                </div>

                {/* Hover Quote Preview */}
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm p-4 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                  <Quote className="w-6 h-6 text-brand-orange mb-2" />
                  <p className="font-body text-white font-medium text-xs leading-relaxed line-clamp-4">
                    "{customer.reviewText}"
                  </p>
                  <span className="mt-3 text-[11px] font-heading font-bold text-amber-300 underline underline-offset-2">
                    વિગતવાર જુઓ · View Details
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Swipeable Gallery */}
        <div className="md:hidden">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 px-4 pb-4 pt-1 no-scrollbar">
            {heroCustomers.slice(0, 6).map((customer, idx) => (
              <div
                key={customer._id || idx}
                onClick={() => onSelectCustomer(customer)}
                className="snap-center shrink-0 w-[240px] aspect-[4/5] rounded-[24px] overflow-hidden relative shadow-lg bg-slate-900 border-2 border-white cursor-pointer active:scale-98 transition-transform"
              >
                <img
                  src={getOptimizedUrl(customer.photo, 600)}
                  alt={customer.customerName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/20" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{customer.deliveryTag}</span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-4 text-left">
                  <h4 className="font-heading font-black text-white text-sm">
                    {customer.customerName}
                  </h4>
                  <p className="text-xs text-amber-300 font-semibold mt-0.5">
                    {customer.carModel || 'Verified Car'}
                  </p>
                  <p className="text-[11px] text-white/70">
                    {customer.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs font-semibold text-slate-500 mt-2 flex items-center justify-center gap-1.5">
            <span>← સ્વાઇપ કરો · 5,000+ હેપ્પી ડિલિવરી →</span>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
