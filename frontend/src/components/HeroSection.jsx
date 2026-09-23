import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car, MapPin, ChevronRight, ChevronLeft, Sparkles, ArrowRight,
  ShieldCheck, Zap, Landmark, FileText, CheckCircle2, Award,
  Fuel, Settings2, Gauge, User, MessageCircle, Eye, Calendar,
  ArrowUpRight, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCars } from '../context/CarContext';
import { getCarWhatsAppLink } from '../utils/whatsapp';
import { getOptimizedUrl } from '../utils/imageUtils';
import axiosInstance from '../api/axiosConfig';
import toast from 'react-hot-toast';

import { FALLBACK_SHOWCASE } from '../data/showcaseData';

// Dynamic Brand Logo SVG Renderer
const renderBrandLogo = (make = '') => {
  const m = (make || '').toLowerCase();
  if (m.includes('kia')) {
    return (
      <svg viewBox="0 0 36 18" className="w-6 h-3.5 fill-current">
        <text x="18" y="14" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="13" letterSpacing="1.2">KIA</text>
      </svg>
    );
  }
  if (m.includes('hyundai')) {
    return (
      <svg viewBox="0 0 36 22" className="w-6 h-4 fill-none stroke-current" strokeWidth="2.2">
        <ellipse cx="18" cy="11" rx="15" ry="9" />
        <path d="M13 6 C13 11, 16 16, 16 16 M23 6 C23 11, 20 16, 20 16 M11 11 L25 11" strokeLinecap="round" />
      </svg>
    );
  }
  if (m.includes('tata')) {
    return (
      <svg viewBox="0 0 36 20" className="w-6 h-3.5 fill-current">
        <text x="18" y="15" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="12" letterSpacing="1.5">TATA</text>
      </svg>
    );
  }
  if (m.includes('ford')) {
    return (
      <svg viewBox="0 0 36 20" className="w-6 h-3.5 fill-none stroke-current" strokeWidth="1.8">
        <ellipse cx="18" cy="10" rx="16" ry="8" />
        <text x="18" y="13" textAnchor="middle" fontFamily="serif" fontStyle="italic" fontWeight="bold" fontSize="9" fill="currentColor" stroke="none">Ford</text>
      </svg>
    );
  }
  if (m.includes('maruti') || m.includes('suzuki')) {
    return (
      <svg viewBox="0 0 30 22" className="w-5 h-4 fill-current">
        <path d="M 20 3 L 10 3 C 7 3 7 8 10 9 L 19 10 C 22 11 22 15 19 16 L 9 16 L 9 18 L 19 18 C 24 18 24 13 21 12 L 12 11 C 9 10 9 5 12 5 L 20 5 Z" />
      </svg>
    );
  }
  if (m.includes('honda')) {
    return (
      <svg viewBox="0 0 32 24" className="w-5 h-4 fill-none stroke-current" strokeWidth="2.2">
        <rect x="4" y="3" width="24" height="18" rx="3" />
        <path d="M 10 6 L 10 18 M 22 6 L 22 18 M 10 12 L 22 12" strokeLinecap="round" />
      </svg>
    );
  }
  if (m.includes('mahindra')) {
    return (
      <svg viewBox="0 0 36 22" className="w-6 h-4 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 7 17 L 12 5 L 18 13 L 24 5 L 29 17" />
      </svg>
    );
  }
  if (m.includes('toyota')) {
    return (
      <svg viewBox="0 0 36 22" className="w-6 h-4 fill-none stroke-current" strokeWidth="1.8">
        <ellipse cx="18" cy="11" rx="15" ry="9" />
        <ellipse cx="18" cy="8.5" rx="9" ry="4.5" />
        <ellipse cx="18" cy="11" rx="4" ry="7.5" />
      </svg>
    );
  }
  return <Car className="w-5 h-5 text-current" />;
};

export default function HeroSection() {
  const navigate = useNavigate();
  const { cars } = useCars();

  const [currentCarIndex, setCurrentCarIndex] = useState(0);

  // Test Drive / Inquiry Modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter cars to ONLY display Coming Soon vehicles in this showcase
  const displayCars = useMemo(() => {
    // 1. Extract only Coming Soon inventory vehicles
    const comingSoonList = (cars || []).filter(c => {
      if (!c.image) return false;
      const status = (c.status || '').trim().toLowerCase();
      return (
        status === 'coming soon' ||
        status.includes('soon') ||
        status.includes('upcoming') ||
        c.isComingSoon === true
      );
    });

    if (comingSoonList.length > 0) {
      return comingSoonList;
    }

    // 2. If no Coming Soon cars exist in database yet, fallback to curated Coming Soon models
    return FALLBACK_SHOWCASE;
  }, [cars]);

  // Ensure currentCarIndex is in bounds
  useEffect(() => {
    if (currentCarIndex >= displayCars.length) {
      setCurrentCarIndex(0);
    }
  }, [displayCars.length, currentCarIndex]);

  // Auto-slide every 6.5 seconds
  useEffect(() => {
    if (displayCars.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentCarIndex((prev) => (prev + 1) % displayCars.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [displayCars.length]);

  const activeCar = displayCars[currentCarIndex] || displayCars[0] || FALLBACK_SHOWCASE[0];

  const formatPrice = (price) => {
    return price >= 100000
      ? `₹${(price / 100000).toFixed(2)} Lakhs`
      : `₹${(price || 0).toLocaleString('en-IN')}`;
  };

  const calculateEmi = (price) => {
    if (!price) return '₹9,500';
    const loanAmount = price * 0.8;
    const monthlyRate = 0.095 / 12;
    const months = 60;
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return `₹${Math.round(emi).toLocaleString('en-IN')}`;
  };

  const nextCar = () => {
    setCurrentCarIndex((prev) => (prev + 1) % displayCars.length);
  };

  const prevCar = () => {
    setCurrentCarIndex((prev) => (prev - 1 + displayCars.length) % displayCars.length);
  };

  const handleTestDriveSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return toast.error('Please enter name and phone');
    try {
      setIsSubmitting(true);
      const message = `Coming Soon Car Inquiry for: ${activeCar?.make} ${activeCar?.model} (${activeCar?.year || ''})`;
      await axiosInstance.post('/messages', {
        name: formData.name,
        phone: formData.phone,
        message,
        type: 'Test Drive'
      });
      toast.success('ટેસ્ટ ડ્રાઈવ / ઇન્ક્વાયરી બુકિંગ વિગત મળી ગઈ છે! અમે ટૂંક સમયમાં સંપર્ક કરીશું.');
      setShowModal(false);
      setFormData({ name: '', phone: '' });
    } catch {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappUrl = activeCar
    ? `https://wa.me/919913634447?text=${encodeURIComponent(
      `Hello Sadguru Car Surat, I am interested in the upcoming/coming soon ${activeCar.make} ${activeCar.model} (${activeCar.year}) priced at ${formatPrice(activeCar.price)}. Please share more details and arrival update!`
    )}`
    : 'https://wa.me/919913634447?text=Hello%20Sadguru%20Car%20Surat%2C%20I%20am%20interested%20in%20your%20upcoming%20verified%20cars.';

  return (
    <section className="relative w-full bg-gradient-to-b from-[#f8fafc] via-[#ffffff] to-[#f8fafc] overflow-hidden pt-6 pb-12 lg:pt-8 lg:pb-16">

      {/* ═══════════════════════════════════════════════════════════════════
          BACKGROUND AMBIENT TEXTURE & GLOW
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Warm Radial Orb */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-gradient-to-b from-brand-orange/[0.08] via-amber-400/[0.03] to-transparent rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -top-20 left-10 w-96 h-96 bg-sky-200/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-[120px] pointer-events-none" />

        {/* Subtle dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-35" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ═══════════════════════════════════════════════════════════════════
            1. TOP HEADLINE & COMPACT DUAL ACTION CTAs
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="text-center max-w-3xl mx-auto mb-6 lg:mb-8">
          {/* Top Pill */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-brand-orange/20 shadow-2xs mb-3"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            <span className="text-[11px] font-black uppercase tracking-[0.14em] text-brand-orange">
              સુરતનો #1 ભરોસાપાત્ર કાર મેળો · Trusted Car Partner
            </span>
          </motion.div>

          {/* Centered Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-4xl lg:text-[2.85rem] font-black text-slate-900 tracking-tight leading-[1.15]"
          >
            સુરતનો સૌથી વિશ્વાસપાત્ર &amp; <br className="hidden sm:inline" />
            <span className="text-slate-900">Certified Used Car </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">
              Showroom
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto mt-2.5 sm:mt-3 leading-relaxed"
          >
            ૧૫૦+ વેરિફાઇડ કાર, ૧૨૦+ પોઈન્ટ ટેકનિકલ ઈન્સ્પેક્શન અને સંપૂર્ણ ભરોસા સાથે તમારા પરિવાર માટે શ્રેષ્ઠ કાર.
          </motion.p>

          {/* Action CTA: Book Test Drive in Rich Brand Orange */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="relative mt-5 sm:mt-6 flex items-center justify-center"
          >
            <div className="relative inline-block">
              {/* Floating Live Indicator Badge */}
              <div className="absolute -top-2.5 right-4 z-10 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[9px] font-black uppercase tracking-wider shadow-sm border border-brand-orange/40">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-orange" />
                  </span>
                  ⚡ Takes 30 Sec
                </span>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="group relative inline-flex items-center gap-3 px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-brand-orange via-[#f79e32] to-[#e68415] text-white font-heading shadow-[0_10px_28px_rgba(245,148,35,0.4)] hover:shadow-[0_14px_38px_rgba(245,148,35,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer overflow-hidden border border-amber-300/50"
              >
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

                {/* Impressive Automotive Steering Wheel Icon with Interactive Turn on Hover */}
                <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/25 backdrop-blur-md text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] border border-white/25 shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9.5" />
                    <circle cx="12" cy="12" r="2.8" className="fill-white/35" />
                    <path d="M12 2.5v6.7" />
                    <path d="M5.2 16.7l5.2-3" />
                    <path d="M18.8 16.7l-5.2-3" />
                  </svg>
                </div>

                <span className="font-heading font-black text-white text-sm sm:text-base leading-none tracking-tight drop-shadow-2xs">
                  ટેસ્ટ ડ્રાઈવ બુક કરો · Book Test Drive
                </span>

                <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform ml-0.5" />
              </button>
            </div>
          </motion.div>
        </div>


        {/* ═══════════════════════════════════════════════════════════════════
            2. THE AUTOMOTIVE TELEMETRY SHOWCASE:
               Left Side (Specs & Brand) — Center Arc (Clean Car HUD) — Right Side (Performance & Trust)
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="relative w-full max-w-[1180px] mx-auto mt-2 sm:mt-4">

          {/* SVG CIRCUIT TRACER WIRES (Desktop Only) */}
          <div className="hidden xl:block absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 1180 480" fill="none" preserveAspectRatio="none">
              <defs>
                <linearGradient id="wireGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.2" />
                  <stop offset="60%" stopColor="#F59423" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#F59423" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="wireGradRight" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F59423" stopOpacity="0.3" />
                  <stop offset="40%" stopColor="#F59423" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Left Connector Lines from Spec Cards to Square Showcase */}
              <path d="M 285 75 L 302 75" stroke="url(#wireGradLeft)" strokeWidth="1.8" className="animate-wire-dash" />
              <path d="M 285 165 L 302 165" stroke="url(#wireGradLeft)" strokeWidth="1.8" className="animate-wire-dash" />
              <path d="M 285 255 L 302 255" stroke="url(#wireGradLeft)" strokeWidth="1.8" className="animate-wire-dash" />
              <path d="M 285 345 L 302 345" stroke="url(#wireGradLeft)" strokeWidth="1.8" className="animate-wire-dash" />

              {/* Right Connector Lines from Square Showcase to Performance Nodes */}
              <path d="M 878 75 L 895 75" stroke="url(#wireGradRight)" strokeWidth="1.8" className="animate-wire-dash" />
              <path d="M 878 165 L 895 165" stroke="url(#wireGradRight)" strokeWidth="1.8" className="animate-wire-dash" />
              <path d="M 878 255 L 895 255" stroke="url(#wireGradRight)" strokeWidth="1.8" className="animate-wire-dash" />
              <path d="M 878 345 L 895 345" stroke="url(#wireGradRight)" strokeWidth="1.8" className="animate-wire-dash" />
            </svg>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6 items-center relative z-10">

            {/* ═══════════════════════════════════════════════════════════════════
                LEFT COLUMN: 4 VEHICLE SPECIFICATIONS & BRAND IDENTITY NODES
                ═══════════════════════════════════════════════════════════════════ */}
            <div className="hidden xl:flex xl:col-span-3 flex-col gap-3 justify-center">
              {/* Column Header */}
              <div className="flex items-center gap-1.5 mb-1 pl-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                <span className="text-[11px] font-heading font-black uppercase tracking-wider text-slate-700">
                  કાર સ્પેસિફિકેશન · Vehicle Specs
                </span>
              </div>

              {/* Node 1: Brand & Logo */}
              <div className="animate-node-float-1 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-[0_6px_20px_rgba(15,23,42,0.06)] hover:shadow-lg hover:border-brand-orange/50 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-800 group-hover:text-brand-orange group-hover:bg-orange-50 transition-colors">
                    {renderBrandLogo(activeCar.make)}
                  </div>
                  <div>
                    <span className="text-[10px] font-heading font-black text-brand-orange uppercase tracking-wider block">
                      ટોપ વેરિફાઇડ બ્રાન્ડ
                    </span>
                    <h4 className="font-heading font-black text-sm text-slate-900 leading-tight">
                      {activeCar.make} {activeCar.model?.split(' ')[0]}
                    </h4>
                    <span className="text-[10px] font-body text-slate-400 font-semibold block">
                      100% Certified Inspection
                    </span>
                  </div>
                </div>
              </div>

              {/* Node 2: Fuel Type */}
              <div className="animate-node-float-2 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-[0_6px_20px_rgba(15,23,42,0.06)] hover:shadow-lg hover:border-amber-300 transition-all group ml-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 text-amber-600 group-hover:scale-105 transition-transform">
                    <Fuel className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-heading font-bold text-slate-400 uppercase tracking-wider block">
                      Fuel · ઈંધણ
                    </span>
                    <h4 className="font-heading font-black text-sm text-slate-900 leading-tight">
                      {activeCar.fuelType || 'Petrol / Diesel'}
                    </h4>
                    <span className="text-[10px] font-body text-slate-500 font-medium block">
                      હાઇ માઇલેજ &amp; બેસ્ટ પર્ફોર્મન્સ
                    </span>
                  </div>
                </div>
              </div>

              {/* Node 3: Body Style & Color */}
              <div className="animate-node-float-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-[0_6px_20px_rgba(15,23,42,0.06)] hover:shadow-lg hover:border-sky-300 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 text-sky-600 group-hover:scale-105 transition-transform">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-heading font-bold text-slate-400 uppercase tracking-wider block">
                      Body &amp; Color · બોડી લાઈન
                    </span>
                    <h4 className="font-heading font-black text-sm text-slate-900 leading-tight">
                      {activeCar.bodyType || 'SUV / Sedan'} • {activeCar.color || 'SILVER'}
                    </h4>
                    <span className="text-[10px] font-body text-slate-500 font-medium block">
                      ઓરિજિનલ પેઇન્ટ &amp; ક્લીન બોડી
                    </span>
                  </div>
                </div>
              </div>

              {/* Node 4: 120+ Point Inspection */}
              <div className="animate-node-float-1 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-[0_6px_20px_rgba(15,23,42,0.06)] hover:shadow-lg hover:border-emerald-300 transition-all group ml-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-heading font-black text-emerald-600 uppercase tracking-wider block">
                      ટેકનિકલ સર્ટિફિકેશન
                    </span>
                    <h4 className="font-heading font-black text-sm text-slate-900 leading-tight">
                      🛡️ ૧૨૦+ પોઈન્ટ ચેક પાસ
                    </h4>
                    <span className="text-[10px] font-body text-slate-500 font-medium block">
                      ઈન્સ્પેક્શન પાસ &amp; નોન-એક્સિડેન્ટલ
                    </span>
                  </div>
                </div>
              </div>
            </div>


            {/* ═══════════════════════════════════════════════════════════════════
                CENTER COLUMN: SQUARE SHOWROOM SHOWCASE WITH ENLARGED FRAMED CAR & HUD
                ═══════════════════════════════════════════════════════════════════ */}
            <div className="col-span-1 xl:col-span-6 flex flex-col items-center">
              {/* Square / Rectangular Showroom Shape with Amber/Yellow Neon Border */}
              <div className="relative w-full max-w-[580px] rounded-3xl p-3.5 sm:p-5 bg-gradient-to-b from-amber-500/[0.06] via-orange-500/[0.02] to-white/98 border-2 border-brand-orange/45 shadow-[0_0_35px_rgba(245,148,35,0.14),0_15px_40px_-10px_rgba(15,23,42,0.12)] backdrop-blur-md">

                {/* Subtle top laser glow line */}
                <div className="absolute top-0 inset-x-12 h-[2.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse rounded-full" />

                {/* ONLY SHOW THIS BADGE (As Explicitly Requested) */}
                <div className="flex items-center justify-center mb-3.5 z-20 relative">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/20 to-amber-500/15 border border-brand-orange/40 text-slate-900 text-xs sm:text-sm font-heading font-black uppercase tracking-wider shadow-xs">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-orange" />
                    </span>
                    ✨ નવું સ્ટોક આગમન / COMING SOON SHOWCASE
                  </span>
                </div>

                {/* HIGH-TECH LUXURY AUTOMOTIVE STUDIO CAR FRAME */}
                <div className="relative w-full rounded-2xl border-2 border-amber-400/50 bg-gradient-to-b from-slate-900/[0.03] via-amber-500/[0.015] to-slate-900/[0.04] p-3 sm:p-4 mb-3 overflow-hidden shadow-inner group">
                  {/* 4 Luxury Corner Frame Accent Brackets */}
                  <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-brand-orange rounded-tl-xs pointer-events-none" />
                  <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-brand-orange rounded-tr-xs pointer-events-none" />
                  <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-brand-orange rounded-bl-xs pointer-events-none" />
                  <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-brand-orange rounded-br-xs pointer-events-none" />

                  {/* Corner Coming Soon Tag */}
                  <div className="absolute top-2.5 right-3 px-2 py-0.5 rounded-md bg-amber-50/95 backdrop-blur-sm border border-amber-300/70 shadow-2xs text-[9px] font-heading font-black tracking-wider text-amber-800 uppercase pointer-events-none flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-brand-orange" />
                    <span>COMING SOON</span>
                  </div>

                  {/* Significantly Increased Stage Height for Large Car Display */}
                  <div className="relative w-full h-[235px] sm:h-[285px] md:h-[315px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {activeCar && (
                        <motion.div
                          key={activeCar._id || currentCarIndex}
                          initial={{ opacity: 0, scale: 0.92, y: 8, filter: 'blur(5px)' }}
                          animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, scale: 0.94, y: -8, filter: 'blur(5px)' }}
                          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                          className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer"
                          onClick={() => activeCar._id && navigate(`/car-details/${activeCar._id}`)}
                        >
                          {/* Floor Spotlight Shadow */}
                          <div className="absolute bottom-2 w-4/5 h-6 bg-black/20 rounded-full blur-xl pointer-events-none" />

                          {/* Large Car Image with Gentle Float */}
                          <motion.img
                            animate={{ y: [0, -6, 0] }}
                            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                            src={getOptimizedUrl(activeCar.image, 1000)}
                            alt={`${activeCar.make} ${activeCar.model}`}
                            className="w-full max-h-[215px] sm:max-h-[265px] md:max-h-[295px] object-contain drop-shadow-[0_16px_28px_rgba(15,23,42,0.22)] select-none hover:scale-105 transition-transform duration-500"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation Controls */}
                    <button
                      onClick={(e) => { e.stopPropagation(); prevCar(); }}
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-brand-orange shadow-md border border-amber-200/90 flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-20 cursor-pointer"
                      title="Previous Car"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); nextCar(); }}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-brand-orange shadow-md border border-amber-200/90 flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-20 cursor-pointer"
                      title="Next Car"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* ── CLEAN CENTER CAR HUD CARD (Strictly Focused As User Requested) ── */}
                {activeCar && (
                  <div className="relative z-20 w-full bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                    {/* Header + Price */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75" />
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-orange" />
                            </span>
                            COMING SOON
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                            VERIFIED CAR
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {activeCar.year || '2025'} Model
                          </span>
                        </div>
                        <h3 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight leading-tight">
                          {activeCar.make} {activeCar.model}
                        </h3>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <p className="font-heading font-black text-2xl sm:text-3xl text-brand-orange leading-none">
                          {formatPrice(activeCar.price)}
                        </p>
                        <p className="text-xs font-body text-slate-500 font-semibold mt-1">
                          EMI from <span className="text-slate-900 font-bold">{calculateEmi(activeCar.price)}</span>/mo*
                        </p>
                      </div>
                    </div>

                    {/* Direct Action Buttons & Controls */}
                    <div className="flex items-center gap-2.5 pt-3">
                      <button
                        onClick={() => navigate(activeCar._id ? `/car-details/${activeCar._id}` : '/inventory')}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-brand-orange" />
                        <span>ગાડી જુઓ · View Car</span>
                      </button>

                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-4 sm:px-5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    {/* Dot Pagination */}
                    <div className="flex items-center justify-center gap-1 mt-2.5">
                      {displayCars.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentCarIndex(idx)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            currentCarIndex === idx ? 'w-6 bg-brand-orange' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                          }`}
                          aria-label={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* ── MOBILE / TABLET SPECS TELEMETRY GRID (Under Dome on smaller screens) ── */}
              <div className="xl:hidden grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 w-full max-w-[560px]">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Fuel</span>
                  <p className="text-xs font-heading font-black text-slate-800">{activeCar.fuelType || 'Petrol'}</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Transmission</span>
                  <p className="text-xs font-heading font-black text-slate-800">{activeCar.transmission || 'Automatic'}</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Owner</span>
                  <p className="text-xs font-heading font-black text-slate-800">{activeCar.owner || '1st Owner'}</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Genuine KM</span>
                  <p className="text-xs font-heading font-black text-slate-800">{(activeCar.kms || 32000).toLocaleString('en-IN')} KM</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Body &amp; Color</span>
                  <p className="text-xs font-heading font-black text-slate-800">{activeCar.bodyType || 'SUV'} • {activeCar.color || 'SILVER'}</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase block">120+ Point</span>
                  <p className="text-xs font-heading font-black text-slate-800">Inspection Pass</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs">
                  <span className="text-[10px] text-brand-orange font-bold uppercase block">Bank Finance</span>
                  <p className="text-xs font-heading font-black text-slate-800">0 Down Payment</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs">
                  <span className="text-[10px] text-indigo-600 font-bold uppercase block">RTO Process</span>
                  <p className="text-xs font-heading font-black text-slate-800">100% Free Transfer</p>
                </div>
              </div>
            </div>


            {/* ═══════════════════════════════════════════════════════════════════
                RIGHT COLUMN: 4 VEHICLE PERFORMANCE, OWNERSHIP & FINANCE NODES
                ═══════════════════════════════════════════════════════════════════ */}
            <div className="hidden xl:flex xl:col-span-3 flex-col gap-3 justify-center">
              {/* Column Header */}
              <div className="flex items-center gap-1.5 mb-1 pl-1">
                <Award className="w-3.5 h-3.5 text-brand-orange" />
                <span className="text-[11px] font-heading font-black uppercase tracking-wider text-slate-700">
                  ઓનરશિપ &amp; ફાઇનાન્સ · Ownership &amp; Loan
                </span>
              </div>

              {/* Node 1: Transmission */}
              <div className="animate-node-float-1 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-[0_6px_20px_rgba(15,23,42,0.06)] hover:shadow-lg hover:border-indigo-300 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 group-hover:scale-105 transition-transform">
                    <Settings2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-heading font-bold text-slate-400 uppercase tracking-wider block">
                      Transmission · ગિયરબોક્સ
                    </span>
                    <h4 className="font-heading font-black text-sm text-slate-900 leading-tight">
                      {activeCar.transmission || 'Automatic'}
                    </h4>
                    <span className="text-[10px] font-body text-slate-500 font-medium block">
                      સ્મૂથ ડ્રાઇવિંગ એક્સપીરિયન્સ
                    </span>
                  </div>
                </div>
              </div>

              {/* Node 2: Ownership */}
              <div className="animate-node-float-2 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-[0_6px_20px_rgba(15,23,42,0.06)] hover:shadow-lg hover:border-purple-300 transition-all group mr-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 text-purple-600 group-hover:scale-105 transition-transform">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-heading font-bold text-slate-400 uppercase tracking-wider block">
                      Owner · માલિકી
                    </span>
                    <h4 className="font-heading font-black text-sm text-slate-900 leading-tight">
                      {activeCar.owner || '1st Owner'}
                    </h4>
                    <span className="text-[10px] font-body text-slate-500 font-medium block">
                      સિંગલ ઓનર જેન્યુઇન કાર
                    </span>
                  </div>
                </div>
              </div>

              {/* Node 3: Genuine Mileage */}
              <div className="animate-node-float-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-[0_6px_20px_rgba(15,23,42,0.06)] hover:shadow-lg hover:border-emerald-300 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 group-hover:scale-105 transition-transform">
                    <Gauge className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-heading font-black text-emerald-600 uppercase tracking-wider block">
                      ઓરિજિનલ સર્વિસ રેકોર્ડ
                    </span>
                    <h4 className="font-heading font-black text-sm text-slate-900 leading-tight">
                      ⚡ {(activeCar.kms || 87000).toLocaleString('en-IN')} KM
                    </h4>
                    <span className="text-[10px] font-body text-slate-500 font-medium block">
                      ૧૦૦% જેન્યુઇન કિલોમીટર
                    </span>
                  </div>
                </div>
              </div>

              {/* Node 4: 0 Down Payment & Free RTO */}
              <div className="animate-node-float-1 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-[0_6px_20px_rgba(15,23,42,0.06)] hover:shadow-lg hover:border-brand-orange/40 transition-all group mr-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-brand-orange group-hover:scale-105 transition-transform">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-heading font-black text-brand-orange uppercase tracking-wider block">
                      સરળ લોન &amp; કાગળિયાં
                    </span>
                    <h4 className="font-heading font-black text-sm text-slate-900 leading-tight">
                      🏦 ૦ ડાઉન પેમેન્ટ • 📄 ફ્રી RTO
                    </h4>
                    <span className="text-[10px] font-body text-slate-500 font-medium block">
                      ૨ કલાકમાં લોન &amp; લીગલ ટ્રાન્સફર
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          TEST DRIVE BOOKING MODAL
          ═══════════════════════════════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-20 sm:p-4 animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl sm:rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-brand-orange" />
                <h3 className="font-heading font-black text-lg text-slate-800">ટેસ્ટ ડ્રાઈવ બુક કરો</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleTestDriveSubmit} className="p-6 space-y-4 font-body">
              {activeCar && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                  <img src={getOptimizedUrl(activeCar.image, 200)} alt={activeCar.model} className="w-16 h-12 object-contain" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{activeCar.make} {activeCar.model}</p>
                    <p className="text-xs font-semibold text-brand-orange">{formatPrice(activeCar.price)}</p>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">તમારું પૂરું નામ *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all text-slate-800 text-sm"
                  placeholder="e.g. રમેશભાઈ પટેલ"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">મોબાઇલ નંબર *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all text-slate-800 text-sm"
                  placeholder="+91 99136 34447"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-orange hover:bg-orange-600 text-white font-heading font-black py-3 rounded-xl transition-all shadow-md disabled:opacity-70 mt-2 cursor-pointer"
              >
                {isSubmitting ? 'સબમિટ થઈ રહ્યું છે...' : 'ટેસ્ટ ડ્રાઈવ કન્ફર્મ કરો (Takes 30 sec)'}
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}