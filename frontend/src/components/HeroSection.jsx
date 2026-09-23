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

// High-definition fallback showcase vehicles in case inventory is loading
const FALLBACK_SHOWCASE = [
  {
    _id: 'showcase-kia-seltos',
    make: 'Kia',
    model: 'SELTOS',
    variant: 'GTX+ Sunroof',
    year: 2025,
    price: 1850000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    kms: 13000,
    owner: '1st Owner',
    color: 'SILVER',
    bodyType: 'SUV',
    isKmGenuine: true,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1000&q=80',
    category: 'suv',
    isComingSoon: true
  },
  {
    _id: 'showcase-ford-ecosport',
    make: 'Ford',
    model: 'ECOSPORT',
    variant: 'Titanium S',
    year: 2020,
    price: 750000,
    fuelType: 'Diesel',
    transmission: 'Manual',
    kms: 68000,
    owner: '1st Owner',
    color: 'Panther Black',
    bodyType: 'SUV',
    isKmGenuine: true,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
    category: 'suv'
  },
  {
    _id: 'showcase-honda-city',
    make: 'Honda',
    model: 'CITY ZX',
    variant: 'Sunroof Edition',
    year: 2022,
    price: 1120000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    kms: 31000,
    owner: '1st Owner',
    color: 'SILVER',
    bodyType: 'Sedan',
    isKmGenuine: true,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
    category: 'sedan'
  },
  {
    _id: 'showcase-hyundai-creta',
    make: 'Hyundai',
    model: 'CRETA SX (O)',
    variant: 'Turbo DCT',
    year: 2023,
    price: 1480000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    kms: 24000,
    owner: '1st Owner',
    color: 'Polar White',
    bodyType: 'SUV',
    isKmGenuine: true,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
    category: 'suv'
  },
  {
    _id: 'showcase-maruti-swift',
    make: 'Maruti Suzuki',
    model: 'SWIFT ZXi+',
    variant: 'Dual Tone',
    year: 2023,
    price: 780000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    kms: 18000,
    owner: '1st Owner',
    color: 'Solid Red',
    bodyType: 'Hatchback',
    isKmGenuine: true,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
    category: 'hatchback'
  }
];

const ARC_CATEGORIES = [
  { id: 'all', label: 'બધી કાર · All Cars', icon: '🚙' },
  { id: 'coming_soon', label: 'કમિંગ સૂન · Coming Soon', icon: '✨' },
  { id: 'suv', label: 'SUV · સ્પોર્ટ્સ યુટિલિટી', icon: '🚘' },
  { id: 'sedan', label: 'Sedan · સેડાન', icon: '🚗' },
  { id: 'hatchback', label: 'Hatchback · ફેમિલી કાર', icon: '🛞' },
  { id: 'automatic', label: 'Automatic · ઓટોમેટિક', icon: '⚡' }
];

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

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentCarIndex, setCurrentCarIndex] = useState(0);

  // Test Drive / Inquiry Modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter cars from inventory or fall back with priority for featured models
  const displayCars = useMemo(() => {
    let list = cars && cars.length > 0
      ? cars.filter(c => c.status === 'Available' && c.image)
      : [];

    if (list.length === 0) {
      list = FALLBACK_SHOWCASE;
    } else {
      // Ensure our flagship Kia Seltos and Ford EcoSport are easily discoverable
      const hasKia = list.some(c => /seltos/i.test(`${c.make} ${c.model}`));
      if (!hasKia) {
        list = [FALLBACK_SHOWCASE[0], ...list];
      }
    }

    if (selectedCategory === 'coming_soon') {
      const upcoming = list.filter(c =>
        c.status?.toLowerCase().includes('soon') ||
        c.isComingSoon ||
        /2024|2025/i.test(String(c.year || ''))
      );
      return upcoming.length > 0 ? upcoming : [FALLBACK_SHOWCASE[0]];
    }
    if (selectedCategory === 'suv') {
      const suvs = list.filter(c =>
        c.bodyType?.toLowerCase().includes('suv') ||
        /creta|brezza|seltos|scorpio|thar|fortuner|harrier|venue|nexon|xuv|safari|innova|ecosport/i.test(`${c.make} ${c.model}`)
      );
      return suvs.length > 0 ? suvs : list;
    }
    if (selectedCategory === 'sedan') {
      const sedans = list.filter(c =>
        c.bodyType?.toLowerCase().includes('sedan') ||
        /city|verna|ciaz|dzire|amaze|aura|slavia|virtus/i.test(`${c.make} ${c.model}`)
      );
      return sedans.length > 0 ? sedans : list;
    }
    if (selectedCategory === 'hatchback') {
      const hatch = list.filter(c =>
        c.bodyType?.toLowerCase().includes('hatchback') ||
        /swift|baleno|i20|wagon|tiago|alto|i10|kwid/i.test(`${c.make} ${c.model}`)
      );
      return hatch.length > 0 ? hatch : list;
    }
    if (selectedCategory === 'automatic') {
      const autos = list.filter(c => c.transmission?.toLowerCase() === 'automatic');
      return autos.length > 0 ? autos : list;
    }

    return list.slice(0, 6);
  }, [cars, selectedCategory]);

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
      const message = `Test Drive Inquiry for: ${activeCar?.make} ${activeCar?.model} (${activeCar?.year || ''})`;
      await axiosInstance.post('/messages', {
        name: formData.name,
        phone: formData.phone,
        message,
        type: 'Test Drive'
      });
      toast.success('ટેસ્ટ ડ્રાઈવ બુકિંગ વિગત મળી ગઈ છે! અમે ટૂંક સમયમાં સંપર્ક કરીશું.');
      setShowModal(false);
      setFormData({ name: '', phone: '' });
    } catch {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappUrl = activeCar
    ? getCarWhatsAppLink({
      title: `${activeCar.make} ${activeCar.model} (${activeCar.year})`,
      price: formatPrice(activeCar.price)
    })
    : 'https://wa.me/919913634447?text=Hello%20Sadguru%20Car%20Surat%2C%20I%20am%20interested%20in%20your%20verified%20cars.';

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

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="relative mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-5"
          >
            {/* Primary Action Button: Explore Cars */}
            <button
              onClick={() => navigate('/inventory')}
              className="group relative inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-brand-orange to-[#e68415] text-white font-heading font-black text-xs sm:text-sm shadow-[0_10px_25px_rgba(245,148,35,0.32)] hover:shadow-[0_14px_35px_rgba(245,148,35,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
              <Car className="w-4 h-4 text-white" />
              <span>ગાડીઓ શોધો · Explore 150+ Cars</span>
              <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Elevated Secondary Action: Instant Test Drive */}
            <div className="relative">
              {/* Floating Live Indicator Badge */}
              <div className="absolute -top-2.5 right-3 z-10 pointer-events-none">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                  </span>
                  Takes 2-3 Mins
                </span>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="group relative inline-flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-heading font-bold text-xs sm:text-sm border-2 border-emerald-500/35 hover:border-emerald-500 shadow-[0_6px_20px_rgba(16,185,129,0.1)] hover:shadow-[0_10px_28px_rgba(16,185,129,0.18)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>

                <div className="flex flex-col text-left">
                  <span className="font-heading font-black text-slate-900 group-hover:text-emerald-700 transition-colors text-xs sm:text-sm leading-tight">
                    ટેસ્ટ ડ્રાઈવ બુક કરો · Book Test Drive
                  </span>
                  <span className="text-[10px] font-body text-slate-500 font-medium leading-tight">
                    ડોરસ્ટેપ અથવા શોરૂમ વિઝિટ
                  </span>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform ml-0.5" />
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
                  <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.25" />
                  <stop offset="60%" stopColor="#F59423" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#F59423" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="wireGradRight" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F59423" stopOpacity="0.2" />
                  <stop offset="40%" stopColor="#F59423" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.25" />
                </linearGradient>
              </defs>

              {/* Left Connector Lines from Spec Cards to Center Arc */}
              <path d="M 280 65 C 320 65, 335 120, 360 140" stroke="url(#wireGradLeft)" strokeWidth="1.5" className="animate-wire-dash" />
              <path d="M 280 150 C 315 150, 330 180, 350 200" stroke="url(#wireGradLeft)" strokeWidth="1.5" className="animate-wire-dash" />
              <path d="M 280 235 C 315 235, 330 240, 350 250" stroke="url(#wireGradLeft)" strokeWidth="1.5" className="animate-wire-dash" />
              <path d="M 280 320 C 320 320, 335 290, 360 280" stroke="url(#wireGradLeft)" strokeWidth="1.5" className="animate-wire-dash" />

              {/* Right Connector Lines from Center Arc to Performance Nodes */}
              <path d="M 820 140 C 845 120, 860 65, 900 65" stroke="url(#wireGradRight)" strokeWidth="1.5" className="animate-wire-dash" />
              <path d="M 830 200 C 850 180, 865 150, 900 150" stroke="url(#wireGradRight)" strokeWidth="1.5" className="animate-wire-dash" />
              <path d="M 830 250 C 850 240, 865 235, 900 235" stroke="url(#wireGradRight)" strokeWidth="1.5" className="animate-wire-dash" />
              <path d="M 820 280 C 845 290, 860 320, 900 320" stroke="url(#wireGradRight)" strokeWidth="1.5" className="animate-wire-dash" />
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
                CENTER COLUMN: THE RADIAL ARC STAGE SHOWCASE WITH FOCUSED CAR HUD
                ═══════════════════════════════════════════════════════════════════ */}
            <div className="col-span-1 xl:col-span-6 flex flex-col items-center">
              <div className="relative w-full max-w-[560px] rounded-t-[280px] pt-4 pb-3 px-3 sm:px-4 bg-gradient-to-b from-brand-orange/[0.06] via-amber-200/[0.02] to-white/95 border-t-2 border-l-2 border-r-2 border-amber-400/40 shadow-[0_15px_40px_-10px_rgba(245,148,35,0.14)] backdrop-blur-sm">

                {/* Subtle top laser glow */}
                <div className="absolute top-0 inset-x-14 h-[2px] bg-gradient-to-r from-transparent via-brand-orange to-transparent animate-pulse" />

                {/* Coming Soon & Live Stock Flag Badge */}
                <div className="flex items-center justify-center mb-2 z-20 relative">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/20 to-amber-500/15 border border-brand-orange/30 text-slate-900 text-[10px] sm:text-xs font-heading font-black uppercase tracking-wider shadow-2xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange" />
                    </span>
                    ✨ નવું સ્ટોક આગમન / COMING SOON SHOWCASE
                  </span>
                </div>

                {/* Arc Top Segment Ribbon */}
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2 z-20 relative text-[10px] font-heading font-black uppercase tracking-wider text-slate-600">
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/85 border border-slate-200/80 shadow-2xs">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> વેરિફાઇડ કાર
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 shadow-2xs">
                    ⭐ ૪.૮★ વિશ્વાસપાત્ર ડીલર
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/85 border border-slate-200/80 shadow-2xs">
                    🚗 ૧૫૦+ કાર સ્ટોક
                  </span>
                </div>

                {/* Category Pills (Including Coming Soon) */}
                <div className="flex items-center justify-center gap-1 sm:gap-1.5 flex-wrap mb-1 z-20 relative">
                  {ARC_CATEGORIES.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setCurrentCarIndex(0);
                        }}
                        className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full font-heading text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-brand-orange text-white shadow-xs scale-105'
                            : 'bg-white/90 hover:bg-white text-slate-700 border border-gray-200 shadow-2xs'
                        }`}
                      >
                        <span>{cat.icon} {cat.label.split('·')[0]}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Car Showcase Stage */}
                <div className="relative w-full h-[165px] sm:h-[200px] flex items-center justify-center my-0.5">
                  <AnimatePresence mode="wait">
                    {activeCar && (
                      <motion.div
                        key={activeCar._id || currentCarIndex}
                        initial={{ opacity: 0, scale: 0.9, y: 8, filter: 'blur(5px)' }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.94, y: -8, filter: 'blur(5px)' }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer"
                        onClick={() => activeCar._id && navigate(`/car-details/${activeCar._id}`)}
                      >
                        {/* Floor Spotlight Reflection */}
                        <div className="absolute bottom-1 w-3/4 h-5 bg-black/15 rounded-full blur-lg pointer-events-none" />

                        {/* Car Image with Floating Animation */}
                        <motion.img
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                          src={getOptimizedUrl(activeCar.image, 800)}
                          alt={`${activeCar.make} ${activeCar.model}`}
                          className="w-full max-h-[150px] sm:max-h-[185px] object-contain drop-shadow-[0_12px_22px_rgba(15,23,42,0.18)] select-none hover:scale-105 transition-transform duration-500"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Controls */}
                  <button
                    onClick={(e) => { e.stopPropagation(); prevCar(); }}
                    className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow border border-gray-100 flex items-center justify-center transition-all active:scale-95 z-20 cursor-pointer"
                    title="Previous Car"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); nextCar(); }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow border border-gray-100 flex items-center justify-center transition-all active:scale-95 z-20 cursor-pointer"
                    title="Next Car"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* ── CLEAN CENTER CAR HUD CARD (Strictly Focused As User Requested) ── */}
                {activeCar && (
                  <div className="relative z-20 w-full bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                    {/* Header + Price */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
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
                {isSubmitting ? 'સબમિટ થઈ રહ્યું છે...' : 'ટેસ્ટ ડ્રાઈવ કન્ફર્મ કરો (Takes 2 mins)'}
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}