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
    _id: 'showcase-1',
    make: 'Hyundai',
    model: 'Creta SX (O)',
    year: 2022,
    price: 1375000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    kms: 38000,
    owner: '1st Owner',
    isKmGenuine: true,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
    category: 'suv'
  },
  {
    _id: 'showcase-2',
    make: 'Honda',
    model: 'City ZX',
    year: 2021,
    price: 1050000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    kms: 42000,
    owner: '1st Owner',
    isKmGenuine: true,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
    category: 'sedan'
  },
  {
    _id: 'showcase-3',
    make: 'Maruti Suzuki',
    model: 'Swift ZXi+',
    year: 2023,
    price: 725000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    kms: 18000,
    owner: '1st Owner',
    isKmGenuine: true,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
    category: 'hatchback'
  },
  {
    _id: 'showcase-4',
    make: 'Kia',
    model: 'Seltos GTX+',
    year: 2022,
    price: 1450000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    kms: 32000,
    owner: '1st Owner',
    isKmGenuine: true,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1000&q=80',
    category: 'suv'
  }
];

const ARC_CATEGORIES = [
  { id: 'all', label: 'બધી કાર · All Cars', icon: '🚙' },
  { id: 'suv', label: 'SUV · સ્પોર્ટ્સ યુટિલિટી', icon: '🚘' },
  { id: 'sedan', label: 'Sedan · સેડાન', icon: '🚗' },
  { id: 'hatchback', label: 'Hatchback · ફેમિલી કાર', icon: '🛞' },
  { id: 'automatic', label: 'Automatic · ઓટોમેટિક', icon: '⚡' }
];

export default function HeroSection() {
  const navigate = useNavigate();
  const { cars } = useCars();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentCarIndex, setCurrentCarIndex] = useState(0);

  // Test Drive / Inquiry Modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter cars from inventory or fall back
  const displayCars = useMemo(() => {
    let list = cars && cars.length > 0
      ? cars.filter(c => c.status === 'Available' && c.image)
      : [];

    if (list.length === 0) {
      list = FALLBACK_SHOWCASE;
    }

    if (selectedCategory === 'suv') {
      const suvs = list.filter(c =>
        c.bodyType?.toLowerCase().includes('suv') ||
        /creta|brezza|seltos|scorpio|thar|fortuner|harrier|venue|nexon|xuv|safari|innova/i.test(`${c.make} ${c.model}`)
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

  const activeCar = displayCars[currentCarIndex] || displayCars[0];

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
    : 'https://wa.me/919913634447';

  return (
    <section className="relative w-full bg-gradient-to-b from-[#f8fafc] via-[#ffffff] to-[#f8fafc] overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">

      {/* ═══════════════════════════════════════════════════════════════════
          BACKGROUND AMBIENT TEXTURE & GLOW
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Warm Radial Orb */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-brand-orange/[0.08] via-amber-400/[0.04] to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -top-20 left-10 w-96 h-96 bg-sky-200/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-[120px] pointer-events-none" />

        {/* Subtle dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-35" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ═══════════════════════════════════════════════════════════════════
            1. TOP HEADLINE & REFERENCE-INSPIRED DUAL CTA WITH DOTTED ARROW
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="text-center max-w-4xl mx-auto mb-10 lg:mb-14">
          {/* Top Pill */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-brand-orange/20 shadow-xs mb-5"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            <span className="text-xs font-black uppercase tracking-[0.16em] text-brand-orange">
              સુરતનો #1 ભરોસાપાત્ર કાર મેળો · Trusted Car Partner
            </span>
          </motion.div>

          {/* Centered Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-[3.75rem] font-black text-slate-900 tracking-tight leading-[1.14]"
          >
            સુરતનો સૌથી વિશ્વાસપાત્ર &amp; <br className="hidden sm:inline" />
            <span className="text-slate-900">Certified Used Car </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">
              Showroom
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto mt-4 sm:mt-5 leading-relaxed"
          >
            ૧૫૦+ વેરિફાઇડ કાર, ૧૨૦+ પોઈન્ટ ટેકનિકલ ઈન્સ્પેક્શન અને સંપૂર્ણ ભરોસા સાથે તમારા પરિવાર માટે શ્રેષ્ઠ કાર મેળવવી હવે સાવ સરળ.
          </motion.p>

          {/* Dual Action CTAs + Dotted Curved Arrow & Badge */}
          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
          >
            {/* Primary Action Button: Explore Cars */}
            <button
              onClick={() => navigate('/inventory')}
              className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-4.5 rounded-2xl bg-gradient-to-r from-brand-orange to-[#e68415] text-white font-heading font-black text-sm sm:text-base shadow-[0_12px_32px_rgba(245,148,35,0.35)] hover:shadow-[0_18px_45px_rgba(245,148,35,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
              <Car className="w-5 h-5 text-white" />
              <span>ગાડીઓ શોધો · Explore 150+ Cars</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Elevated Secondary Action: Instant Test Drive (Feels 100% like a luxury interactive button!) */}
            <div className="relative">
              {/* Floating Live Indicator Badge */}
              <div className="absolute -top-3 right-4 z-10 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md shadow-emerald-500/25">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                  </span>
                  Takes 2-3 Mins
                </span>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="group relative inline-flex items-center gap-3.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-heading font-bold text-sm sm:text-base border-2 border-emerald-500/35 hover:border-emerald-500 shadow-[0_8px_25px_rgba(16,185,129,0.12)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.22)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
              >
                {/* Radar Icon Box */}
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>

                <div className="flex flex-col text-left">
                  <span className="font-heading font-black text-slate-900 group-hover:text-emerald-700 transition-colors text-sm sm:text-base leading-tight">
                    ટેસ્ટ ડ્રાઈવ બુક કરો · Book Test Drive
                  </span>
                  <span className="text-[11px] font-body text-slate-500 font-medium leading-tight">
                    ડોરસ્ટેપ અથવા શોરૂમ વિઝિટ
                  </span>
                </div>

                <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform ml-1" />
              </button>
            </div>
          </motion.div>
        </div>


        {/* ═══════════════════════════════════════════════════════════════════
            2. THE AUTOMOTIVE RADIAL ARC STAGE SHOWCASE (Reference-Inspired)
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="relative w-full max-w-[1360px] mx-auto mt-6">

          {/* SVG CIRCUIT TRACER WIRES (Desktop Only) */}
          <div className="hidden xl:block absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 1360 620" fill="none" preserveAspectRatio="none">
              <defs>
                <linearGradient id="wireGradientLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#F59423" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#F59423" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="wireGradientRight" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F59423" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#F59423" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Left Lines connecting Nodes to Center Arc */}
              <path d="M 230 110 C 310 110, 360 210, 440 220" stroke="url(#wireGradientLeft)" strokeWidth="1.5" className="animate-wire-dash" />
              <path d="M 240 220 C 320 220, 370 240, 430 250" stroke="url(#wireGradientLeft)" strokeWidth="1.5" className="animate-wire-dash" />
              <path d="M 230 330 C 310 330, 360 290, 440 280" stroke="url(#wireGradientLeft)" strokeWidth="1.5" className="animate-wire-dash" />
              <path d="M 220 440 C 320 440, 370 340, 450 320" stroke="url(#wireGradientLeft)" strokeWidth="1.5" className="animate-wire-dash" />

              {/* Right Lines connecting Center Arc to Milestone Cards */}
              <path d="M 920 220 C 990 210, 1040 120, 1110 120" stroke="url(#wireGradientRight)" strokeWidth="1.5" className="animate-wire-dash" />
              <path d="M 930 260 C 1000 260, 1030 260, 1100 260" stroke="url(#wireGradientRight)" strokeWidth="1.5" className="animate-wire-dash" />
              <path d="M 920 310 C 990 310, 1040 400, 1110 400" stroke="url(#wireGradientRight)" strokeWidth="1.5" className="animate-wire-dash" />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">

            {/* ── LEFT COLUMN: ORBITING CONNECTED NODES ── */}
            <div className="hidden xl:flex xl:col-span-3 flex-col gap-6 justify-center">
              {/* Node 1 */}
              <div className="animate-node-float-1 flex items-center gap-3.5 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-gray-100 shadow-[0_8px_25px_rgba(15,23,42,0.06)] hover:border-brand-orange/40 hover:shadow-lg transition-all group">
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-heading font-black text-xs text-slate-800 uppercase tracking-wider">૧૨૦+ પોઈન્ટ ચેક</h4>
                  <p className="text-[11px] font-body text-slate-500 font-medium">સંપૂર્ણ ટેકનિકલ ઈન્સ્પેક્શન</p>
                </div>
              </div>

              {/* Node 2 */}
              <div className="animate-node-float-2 flex items-center gap-3.5 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-gray-100 shadow-[0_8px_25px_rgba(15,23,42,0.06)] hover:border-brand-orange/40 hover:shadow-lg transition-all group ml-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Gauge className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-heading font-black text-xs text-slate-800 uppercase tracking-wider">૧૦૦% જેન્યુઇન KM</h4>
                  <p className="text-[11px] font-body text-slate-500 font-medium">ઓરિજિનલ સર્વિસ રેકોર્ડ</p>
                </div>
              </div>

              {/* Node 3 */}
              <div className="animate-node-float-3 flex items-center gap-3.5 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-gray-100 shadow-[0_8px_25px_rgba(15,23,42,0.06)] hover:border-brand-orange/40 hover:shadow-lg transition-all group ml-1">
                <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Landmark className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <h4 className="font-heading font-black text-xs text-slate-800 uppercase tracking-wider">૦ ડાઉન પેમેન્ટ લોન</h4>
                  <p className="text-[11px] font-body text-slate-500 font-medium">ઝડપી બેંક લોન એપ્રૂવલ</p>
                </div>
              </div>

              {/* Node 4 */}
              <div className="animate-node-float-1 flex items-center gap-3.5 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-gray-100 shadow-[0_8px_25px_rgba(15,23,42,0.06)] hover:border-brand-orange/40 hover:shadow-lg transition-all group">
                <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-heading font-black text-xs text-slate-800 uppercase tracking-wider">૧૦૦% ફ્રી RTO ટ્રાન્સફર</h4>
                  <p className="text-[11px] font-body text-slate-500 font-medium">સરળ અને કાયદેસર પ્રક્રિયા</p>
                </div>
              </div>
            </div>


            {/* ── CENTER COLUMN: THE LUMINOUS RADIAL ARC STAGE WITH DYNAMIC CAR ── */}
            <div className="col-span-1 xl:col-span-6 flex flex-col items-center">

              {/* Circular Arc Stage Frame */}
              <div className="relative w-full max-w-[680px] rounded-t-[340px] sm:rounded-t-[380px] pt-8 pb-4 px-4 sm:px-6 bg-gradient-to-b from-brand-orange/[0.07] via-amber-300/[0.04] to-white/90 border-t-2 border-l-2 border-r-2 border-amber-400/50 shadow-[0_20px_60px_-15px_rgba(245,148,35,0.18)] backdrop-blur-sm">

                {/* Subtle Arc Laser Highlight */}
                <div className="absolute top-0 inset-x-12 h-[2px] bg-gradient-to-r from-transparent via-brand-orange to-transparent animate-pulse" />

                {/* Arc Category Selector Tabs (Curved Header inside Arc) */}
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap mb-4 z-20 relative">
                  {ARC_CATEGORIES.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setCurrentCarIndex(0);
                        }}
                        className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full font-heading text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/30 scale-105'
                            : 'bg-white/80 hover:bg-white text-slate-700 border border-gray-200 shadow-xs'
                        }`}
                      >
                        <span>{cat.icon} {cat.label.split('·')[0]}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Central Car Stage & Animated Transition */}
                <div className="relative w-full h-[220px] sm:h-[290px] md:h-[330px] flex items-center justify-center my-2">
                  <AnimatePresence mode="wait">
                    {activeCar && (
                      <motion.div
                        key={activeCar._id || currentCarIndex}
                        initial={{ opacity: 0, scale: 0.88, y: 15, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.92, y: -15, filter: 'blur(8px)' }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer"
                        onClick={() => activeCar._id && navigate(`/car-details/${activeCar._id}`)}
                      >
                        {/* Floor Spotlight Reflection */}
                        <div className="absolute bottom-2 w-3/4 h-8 bg-black/20 rounded-full blur-xl pointer-events-none" />

                        {/* Car Image with Floating Animation */}
                        <motion.img
                          animate={{ y: [0, -6, 0] }}
                          transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                          src={getOptimizedUrl(activeCar.image, 800)}
                          alt={`${activeCar.make} ${activeCar.model}`}
                          className="w-full max-h-[190px] sm:max-h-[250px] md:max-h-[290px] object-contain drop-shadow-[0_20px_30px_rgba(15,23,42,0.22)] select-none hover:scale-105 transition-transform duration-500"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  <button
                    onClick={(e) => { e.stopPropagation(); prevCar(); }}
                    className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md border border-gray-100 flex items-center justify-center transition-all active:scale-95 z-20 cursor-pointer"
                    title="Previous Car"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); nextCar(); }}
                    className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md border border-gray-100 flex items-center justify-center transition-all active:scale-95 z-20 cursor-pointer"
                    title="Next Car"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* ── CAR HUD CONTROL CARD (Embedded at Base of Arc) ── */}
                {activeCar && (
                  <div className="relative z-20 w-full bg-white/95 backdrop-blur-xl border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-[0_15px_40px_rgba(15,23,42,0.08)]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                            VERIFIED CAR
                          </span>
                          {activeCar.year && (
                            <span className="text-xs font-bold text-slate-500">
                              {activeCar.year} Model
                            </span>
                          )}
                        </div>
                        <h3 className="font-heading font-black text-lg sm:text-xl text-slate-900 leading-tight">
                          {activeCar.make} {activeCar.model}
                        </h3>
                      </div>

                      {/* Price & EMI Pill */}
                      <div className="text-left sm:text-right shrink-0">
                        <p className="font-heading font-black text-xl sm:text-2xl text-brand-orange">
                          {formatPrice(activeCar.price)}
                        </p>
                        <p className="text-[11px] font-body text-slate-500 font-semibold">
                          EMI from <span className="text-slate-800 font-bold">{calculateEmi(activeCar.price)}</span>/mo*
                        </p>
                      </div>
                    </div>

                    {/* Spec Chips Row */}
                    <div className="grid grid-cols-4 gap-2 my-3 text-center text-xs font-body font-semibold text-slate-700">
                      <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 truncate">
                        <Fuel className="w-3.5 h-3.5 text-brand-orange mx-auto mb-0.5" />
                        <span className="text-[11px] truncate block">{activeCar.fuelType || 'Petrol'}</span>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 truncate">
                        <Settings2 className="w-3.5 h-3.5 text-brand-orange mx-auto mb-0.5" />
                        <span className="text-[11px] truncate block">{activeCar.transmission || 'Manual'}</span>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 truncate">
                        <Gauge className="w-3.5 h-3.5 text-brand-orange mx-auto mb-0.5" />
                        <span className="text-[11px] truncate block">{(activeCar.kms || 35000).toLocaleString('en-IN')} KM</span>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 truncate">
                        <User className="w-3.5 h-3.5 text-brand-orange mx-auto mb-0.5" />
                        <span className="text-[11px] truncate block">{activeCar.owner || '1st Owner'}</span>
                      </div>
                    </div>

                    {/* Action Row */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => navigate(activeCar._id ? `/car-details/${activeCar._id}` : '/inventory')}
                        className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-slate-800 text-white font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>ગાડી જુઓ · View Car Details</span>
                      </button>

                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    {/* Dot Pagination */}
                    <div className="flex items-center justify-center gap-1.5 mt-3">
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
            </div>


            {/* ── RIGHT COLUMN: FLOATING MILESTONE NOTIFICATION CARDS ── */}
            <div className="hidden xl:flex xl:col-span-3 flex-col gap-6 justify-center">
              {/* Card 1 */}
              <div className="animate-node-float-1 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-[0_8px_25px_rgba(15,23,42,0.06)] hover:border-emerald-300 hover:shadow-lg transition-all group">
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h4 className="font-heading font-black text-xs text-slate-800">
                    Quality Inspection Certified
                  </h4>
                </div>
                <p className="text-[11px] font-body text-slate-500 pl-12 leading-relaxed">
                  ૧૨૦+ પોઈન્ટ ટેકનિકલ ઈન્સ્પેક્શન સફળતાપૂર્વક પાસ થયેલ વાહનો.
                </p>
              </div>

              {/* Card 2 */}
              <div className="animate-node-float-2 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-[0_8px_25px_rgba(15,23,42,0.06)] hover:border-amber-300 hover:shadow-lg transition-all group mr-2">
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-amber-600" />
                  </div>
                  <h4 className="font-heading font-black text-xs text-slate-800">
                    Instant Loan Approval in 2h
                  </h4>
                </div>
                <p className="text-[11px] font-body text-slate-500 pl-12 leading-relaxed">
                  ટોપ બેંકો દ્વારા સરળ કાગળિયાં સાથે ઝડપી લોન મંજૂરી.
                </p>
              </div>

              {/* Card 3 */}
              <div className="animate-node-float-3 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-[0_8px_25px_rgba(15,23,42,0.06)] hover:border-orange-300 hover:shadow-lg transition-all group">
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 text-brand-orange" />
                  </div>
                  <h4 className="font-heading font-black text-xs text-slate-800">
                    10,000+ Happy Surat Families
                  </h4>
                </div>
                <p className="text-[11px] font-body text-slate-500 pl-12 leading-relaxed">
                  ૪.૮★ રેટિંગ સાથે સુરતનો સૌથી ભરોસાપાત્ર કાર મેળો (Trusted Dealer).
                </p>
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