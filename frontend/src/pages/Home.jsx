import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  CheckCircle, Banknote, ShieldCheck,
  Search, Star, RefreshCw,
  ArrowRight, Sparkles,
  Car, ChevronRight, ChevronLeft,
  LayoutGrid, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

import CarCard from '../components/CarCard';
import SkeletonCarCard from '../components/SkeletonCarCard';
import { useCars } from '../context/CarContext';
import HeroSection from '../components/HeroSection';
import GoogleReviews from '../components/GoogleReviews';
import HappyCustomers from '../components/HappyCustomers';
import QuickSearch from '../components/QuickSearch';
import WhyChooseUs from '../components/WhyChooseUs';
import LiveTicker from '../components/LiveTicker';
import PromoBanners from '../components/PromoBanners';

// 3 Core Dealership Services
const dealershipServices = [
  {
    id: 'buy',
    tabName: 'કાર ખરીદો',
    tabBadge: '150+ કાર',
    title: 'સર્ટિફાઈડ કાર ખરીદો',
    desc: 'તમારા પરિવારના ભરોસા માટે 150+ વેરિફાઇડ કાર. 120+ પોઈન્ટ ટેકનિકલ ઈન્સ્પેક્શન અને વાજબી કિંમત.',
    icon: ShieldCheck,
    iconBg: 'bg-slate-100 text-primary',
    topLine: 'via-slate-800',
    borderHover: 'hover:border-slate-300',
    btnBg: 'bg-slate-900 group-hover:bg-slate-800 text-white',
    btnLink: '/inventory',
    btnText: 'સર્ટિફાઈડ કાર જુઓ',
    bullets: [
      '120+ પોઈન્ટ ટેકનિકલ ચેક',
      '100% સચોટ કિલોમીટર (Genuine KM)',
      'સરળ બેંક લોન અને ફાઇનાન્સ સુવિધા',
    ],
  },
  {
    id: 'sell',
    tabName: 'કાર વેચો',
    tabBadge: 'ઇન્સ્ટન્ટ પેમેન્ટ',
    title: 'તમારી કાર તરત જ વેચો',
    desc: 'પારદર્શક મૂલ્યાંકન અને તુરંત બેંક પેમેન્ટ સાથે તમારી જૂની કારની મેળવો શ્રેષ્ઠ બજાર કિંમત, કોઈ પણ ઝંઝટ વગર.',
    icon: Banknote,
    iconBg: 'bg-emerald-50 text-emerald-600',
    topLine: 'via-emerald-500',
    borderHover: 'hover:border-emerald-300',
    btnBg: 'bg-emerald-600 group-hover:bg-emerald-700 text-white',
    btnLink: '/sell-your-car',
    btnText: 'ઓનલાઇન વેલ્યુએશન મેળવો',
    bullets: [
      '30 મિનિટમાં બેસ્ટ બજાર વેલ્યુએશન',
      'સીધું ઇન્સ્ટન્ટ બેંક ટ્રાન્સફર પેમેન્ટ',
      '100% મફત RTO દસ્તાવેજ ટ્રાન્સફર',
    ],
  },
  {
    id: 'exchange',
    tabName: 'એક્સચેન્જ',
    tabBadge: 'બેસ્ટ બોનસ',
    title: 'જૂની કારનું શ્રેષ્ઠ એક્સચેન્જ',
    desc: 'તમારી જૂની કાર આપીને શ્રેષ્ઠ એક્સચેન્જ બોનસ સાથે તમારી મનપસંદ વેરિફાઇડ કારમાં અપગ્રેડ કરો (Trusted Dealer).',
    icon: RefreshCw,
    iconBg: 'bg-orange-50 text-brand-orange',
    topLine: 'via-brand-orange',
    borderHover: 'hover:border-orange-300',
    btnBg: 'bg-brand-orange group-hover:bg-orange-600 text-white',
    btnLink: '/about?service=exchange',
    btnText: 'એક્સચેન્જ ઓફર્સ જાણો',
    bullets: [
      'કોઈ પણ કંપની/મોડેલનું એક્સચેન્જ સ્વીકાર્ય',
      'આકર્ષક એક્સચેન્જ બોનસ અને ડિસ્કાઉન્ટ',
      'સેમ-ડે ડિલિવરી અને ઝીરો ડાઉન પેમેન્ટ',
    ],
  },
];

export default function Home() {
  const { cars, isLoading } = useCars();
  const navigate = useNavigate();

  // Active service index for compact mobile view
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);

  // Mobile car view mode: 'reel' (horizontal app snap carousel) or 'grid' (2-column grid)
  const [mobileCarView, setMobileCarView] = useState('reel');

  const handleServiceSwipe = (event, info) => {
    const threshold = 35;
    if (info.offset.x < -threshold || info.velocity.x < -300) {
      setActiveServiceIndex((prev) => (prev + 1) % dealershipServices.length);
    } else if (info.offset.x > threshold || info.velocity.x > 300) {
      setActiveServiceIndex((prev) => (prev - 1 + dealershipServices.length) % dealershipServices.length);
    }
  };

  // Detect mobile view for mobile-only scrolling animations
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scrolling animation applied strictly on mobile view
  const mobileCardAnim = isMobile
    ? {
        initial: { opacity: 0, y: 40, scale: 0.96 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      }
    : {
        initial: false,
      };

  const mobileHeadingAnim = isMobile
    ? {
        initial: { opacity: 0, y: 25 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.5, ease: 'easeOut' },
      }
    : {
        initial: false,
      };

  // Available verified cars
  const availableCars = useMemo(() => {
    return (cars || []).filter(car => car.status === 'Available');
  }, [cars]);

  // Available verified cars with featured cars prioritized
  const displayedCars = useMemo(() => {
    if (!availableCars.length) return [];
    const featured = availableCars.filter(c => c.isFeaturedOnHome);
    const nonFeatured = availableCars.filter(c => !c.isFeaturedOnHome);
    const list = featured.length > 0 ? [...featured, ...nonFeatured] : availableCars;
    return list.slice(0, 8);
  }, [availableCars]);

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Helmet>
        <title>Sadguru Car Surat — Surat's Trusted Pre-Owned Car Dealership</title>
        <meta name="description" content="Buy, sell, or exchange certified pre-owned cars at Sadguru Car Surat, Varachha, Surat. 150+ verified vehicles, transparent pricing, and trusted since 2011." />
        <meta property="og:title" content="Sadguru Car Surat — Surat's Trusted Pre-Owned Car Dealership" />
        <meta property="og:description" content="Buy, sell, or exchange certified pre-owned cars. 150+ verified vehicles with transparent pricing." />
      </Helmet>

      {/* Global Decorative Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-brand-orange/5 blur-[120px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col flex-grow">

        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Live Ticker — Newly Arrived Vehicles */}
        <LiveTicker />

        {/* 3. Inventory Grid Section — Premium Enhanced with Category Tabs */}
        <section className="inventory-grid-section pt-8 sm:pt-10 lg:pt-12 pb-12 sm:pb-14 lg:pb-16 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden">
          {/* Decorative ambient orbs */}
          <div className="inventory-section-orb w-72 h-72 bg-brand-orange/10 -top-20 -left-36" />
          <div className="inventory-section-orb w-56 h-56 bg-amber-300/10 -bottom-16 -right-24" style={{ animationDelay: '3s' }} />

          <div className="max-w-7xl mx-auto relative">
            {/* Header + Quick Search */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-8 gap-6">
              <div className="xl:flex-1 pr-4">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-heading font-black tracking-widest uppercase mb-3 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" /> વેરિફાઇડ કાર કલેક્શન · Verified Cars
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-primary leading-tight">
                  Explore Our <span className="inventory-heading-gradient text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">Verified Cars</span>
                </h2>
                <p className="font-body text-slate-500 mt-2 text-sm sm:text-base max-w-xl">
                  150+ ગુણવત્તાયુક્ત વેરિફાઇડ કાર (Verified Cars), સંપૂર્ણ સર્વિસ હિસ્ટ્રી અને 120+ પોઈન્ટ ટેકનિકલ ઈન્સ્પેક્શન સાથે.
                </p>
              </div>

              {/* Quick Search Component */}
              <div className="w-full xl:w-[680px] shrink-0">
                <QuickSearch compact={true} />
              </div>
            </div>

            {/* ── MOBILE VIEW SUB-HEADER: Segmented Mode Switcher (Reel vs Grid) ── */}
            <div className="flex md:hidden items-center justify-between gap-2 mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs font-heading font-black text-slate-800 uppercase tracking-wider">
                  ટોપ પીક્સ · Top Picks ({displayedCars.length})
                </span>
              </div>

              {/* Segmented Pill Toggle: Reel / Grid */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setMobileCarView('reel')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-heading font-black flex items-center gap-1 transition-all ${
                    mobileCarView === 'reel'
                      ? 'bg-white text-brand-orange shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  aria-label="Reel View"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Reel</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileCarView('grid')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-heading font-black flex items-center gap-1 transition-all ${
                    mobileCarView === 'grid'
                      ? 'bg-white text-brand-orange shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  aria-label="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Grid</span>
                </button>
              </div>
            </div>

            {/* ── MOBILE HORIZONTAL SNAP REEL (Reduced 75% vertical space, Flutter-like feel) ── */}
            {mobileCarView === 'reel' && (
              <div className="md:hidden">
                <div className="mobile-app-snap-reel flex gap-3.5 pb-4 pt-1 px-4 -mx-4">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="w-[78vw] max-w-[285px] snap-start shrink-0">
                        <SkeletonCarCard />
                      </div>
                    ))
                  ) : displayedCars.length === 0 ? (
                    <div className="w-[85vw] snap-start shrink-0 flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border border-dashed border-gray-300 p-6">
                      <Car className="w-10 h-10 text-slate-300 mb-2" />
                      <p className="font-heading text-sm text-primary font-bold">હાલમાં કોઈ કાર ઉપલબ્ધ નથી</p>
                    </div>
                  ) : (
                    <>
                      {displayedCars.map((car) => (
                        <div key={car._id || car.id} className="w-[78vw] max-w-[285px] snap-start shrink-0 flex flex-col">
                          <CarCard
                            id={car._id || car.id}
                            image={car.image}
                            title={`${car.make} ${car.model} (${car.year})`}
                            price={car.price >= 100000 ? `₹${(car.price / 100000).toFixed(2)} Lakhs` : `₹${(car.price || 0).toLocaleString('en-IN')}`}
                            badges={car.badges || []}
                            fuel={car.fuelType}
                            transmission={car.transmission}
                            owner={car.owner || '1st Owner'}
                            kms={`${(car.kms || 0).toLocaleString('en-IN')} KM`}
                            isKmGenuine={car.isKmGenuine}
                          />
                        </div>
                      ))}

                      {/* Final Reel Card: Direct CTA to Full Inventory */}
                      <div
                        onClick={() => navigate('/inventory')}
                        className="w-[66vw] max-w-[245px] snap-start shrink-0 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-5 border border-slate-700/80 shadow-md flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition-transform"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-brand-orange/20 text-brand-orange flex items-center justify-center mb-3 border border-brand-orange/30 shadow-inner">
                          <Car className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-heading font-black tracking-widest uppercase text-amber-300 mb-1">
                          FULL LOT
                        </span>
                        <h4 className="font-heading font-black text-lg text-white mb-1.5 leading-tight">
                          {availableCars.length}+ સર્ટિફાઈડ કાર્સ
                        </h4>
                        <p className="font-body text-xs text-slate-300 mb-4 leading-relaxed">
                          બધા મોડેલ્સ અને પ્રાઈસ રેન્જ જુઓ.
                        </p>
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-orange text-white text-xs font-heading font-bold shadow-md">
                          <span>બધી કાર જુઓ</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile Reel Helper / Navigation Note */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold px-1 mt-1 mb-4">
                  <span>← આંગળીથી સ્વાઇપ કરો · Swipe</span>
                  <button
                    onClick={() => navigate('/inventory')}
                    className="text-brand-orange font-bold flex items-center gap-0.5 active:opacity-75"
                  >
                    <span>બધી કાર ({availableCars.length}+)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* ── MOBILE GRID VIEW (When user clicks Grid view on mobile) ── */}
            {mobileCarView === 'grid' && (
              <div className="grid grid-cols-2 md:hidden gap-3 mb-6">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="car-card-premium">
                      <SkeletonCarCard />
                    </div>
                  ))
                ) : (
                  displayedCars.map((car) => (
                    <div key={car._id || car.id} className="car-card-premium">
                      <CarCard
                        id={car._id || car.id}
                        image={car.image}
                        title={`${car.make} ${car.model} (${car.year})`}
                        price={car.price >= 100000 ? `₹${(car.price / 100000).toFixed(2)} Lakhs` : `₹${(car.price || 0).toLocaleString('en-IN')}`}
                        badges={car.badges || []}
                        fuel={car.fuelType}
                        transmission={car.transmission}
                        owner={car.owner || '1st Owner'}
                        kms={`${(car.kms || 0).toLocaleString('en-IN')} KM`}
                        isKmGenuine={car.isKmGenuine}
                      />
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── DESKTOP GRID VIEW (100% UNTOUCHED & INTACT ON DESKTOP) ── */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {isLoading ? (
                <>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="car-card-premium">
                      <SkeletonCarCard />
                    </div>
                  ))}
                </>
              ) : displayedCars.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-white/80 backdrop-blur-md rounded-3xl border border-dashed border-gray-300 p-8 shadow-sm">
                  <Car className="w-14 h-14 text-slate-300 mb-3" />
                  <p className="font-heading text-lg sm:text-xl text-primary font-bold mb-2">
                    હાલમાં કોઈ કાર ઉપલબ્ધ નથી
                  </p>
                  <p className="font-body text-slate-500 text-sm mb-5">
                    સંપૂર્ણ સ્ટોક તપાસવા માટે ઇન્વેન્ટરી પેજ જુઓ.
                  </p>
                  <button
                    onClick={() => navigate('/inventory')}
                    className="px-6 py-2.5 rounded-full bg-brand-orange text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-orange-600 transition-all cursor-pointer"
                  >
                    બધી કાર જુઓ · View All Cars
                  </button>
                </div>
              ) : (
                displayedCars.map((car) => (
                  <div key={car._id || car.id} className="car-card-premium">
                    <CarCard
                      id={car._id || car.id}
                      image={car.image}
                      title={`${car.make} ${car.model} (${car.year})`}
                      price={car.price >= 100000 ? `₹${(car.price / 100000).toFixed(2)} Lakhs` : `₹${(car.price || 0).toLocaleString('en-IN')}`}
                      badges={car.badges || []}
                      fuel={car.fuelType}
                      transmission={car.transmission}
                      owner={car.owner || '1st Owner'}
                      kms={`${(car.kms || 0).toLocaleString('en-IN')} KM`}
                      isKmGenuine={car.isKmGenuine}
                    />
                  </div>
                ))
              )}
            </div>

            {/* CTA Button to Full Inventory */}
            <div className="mt-12 text-center px-2 sm:px-0">
              <motion.button
                whileHover="hover"
                onClick={() => navigate('/inventory')}
                className="view-inventory-btn group relative inline-flex items-center justify-center gap-3 overflow-hidden px-10 py-4 rounded-full border-2 border-primary text-primary font-heading font-bold hover:text-white transition-colors duration-300 shadow-sm hover:shadow-xl cursor-pointer"
              >
                <motion.span
                  className="absolute inset-0 bg-primary -z-10"
                  initial={{ x: "-100%" }}
                  variants={{ hover: { x: 0 } }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
                <span className="tracking-wide">સંપૂર્ણ સ્ટોક જુઓ · View Full Inventory ({availableCars.length}+ Cars)</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>

          </div>
        </section>

        {/* 4. Core Dealership Services Section */}
        <section className="pt-8 sm:pt-10 lg:pt-12 pb-12 sm:pb-14 lg:pb-16 px-4 sm:px-6 lg:px-8 bg-transparent relative">
          <div className="max-w-7xl mx-auto">
            {/* Heading */}
            <motion.div
              {...mobileHeadingAnim}
              className="text-center mb-6 sm:mb-12 md:mb-16 max-w-3xl mx-auto"
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-heading font-bold text-[11px] sm:text-xs uppercase tracking-[0.18em] mb-3 sm:mb-4 shadow-xs">
                વિશ્વાસપાત્ર ડીલર સેવાઓ · TRUSTED DEALERSHIP SERVICES
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-3 sm:mb-6 leading-tight">
                સુરતમાં <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">ખરીદ, વેચાણ અને Exchange</span> માટેનું સંપૂર્ણ Solution
              </h2>
              <p className="font-body text-slate-600 text-xs sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                પારદર્શક પ્રક્રિયા અને સુરતના હજારો પરિવારોના વિશ્વાસ સાથે. તમારી દરેક જરૂરિયાત માટે 100% સેફ અને સરળ કાર ડીલિંગનો અનુભવ (Trusted Dealer).
              </p>
            </motion.div>

            {/* ── MOBILE VIEW: Interactive Compact Animated Showcase (Reduces ~75% vertical space) ── */}
            <div className="md:hidden max-w-md mx-auto">
              {/* Segmented Liquid Switcher Tabs */}
              <div className="flex items-center p-1 bg-slate-100/90 backdrop-blur-sm rounded-2xl mb-3.5 border border-slate-200/80 shadow-2xs">
                {dealershipServices.map((service, idx) => {
                  const isSelected = activeServiceIndex === idx;
                  const TabIcon = service.icon;
                  return (
                    <button
                      key={service.id}
                      onClick={() => setActiveServiceIndex(idx)}
                      className={`relative flex-1 py-2 px-2 rounded-xl text-xs font-heading font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isSelected ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="activeServiceTabPill"
                          className="absolute inset-0 bg-slate-900 rounded-xl shadow-xs"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        <TabIcon className="w-3.5 h-3.5" />
                        <span>{service.tabName}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Animated Active Service Card with Touch Swipe */}
              {(() => {
                const activeService = dealershipServices[activeServiceIndex];
                const ServiceIcon = activeService.icon;
                return (
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeService.id}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={handleServiceSwipe}
                        initial={{ opacity: 0, x: 20, scale: 0.98 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.98 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="relative bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-md flex flex-col cursor-grab active:cursor-grabbing overflow-hidden"
                      >
                        {/* Top Accent Gradient Line */}
                        <div className={`absolute top-0 inset-x-6 h-[2.5px] bg-gradient-to-r from-transparent ${activeService.topLine} to-transparent`} />

                        {/* Card Header: Icon + Badge + Title */}
                        <div className="flex items-center gap-3 mb-2.5">
                          <div className={`w-11 h-11 rounded-xl ${activeService.iconBg} flex items-center justify-center shrink-0 shadow-2xs`}>
                            <ServiceIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[9px] font-black uppercase tracking-wider mb-0.5">
                              {activeService.tabBadge}
                            </span>
                            <h3 className="font-heading text-lg font-black text-slate-900 leading-tight">
                              {activeService.title}
                            </h3>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="font-body text-slate-600 text-xs leading-relaxed mb-3">
                          {activeService.desc}
                        </p>

                        {/* Bullets Checklist */}
                        <div className="space-y-1.5 mb-3.5 text-xs font-semibold text-slate-700 font-body bg-slate-50/90 p-2.5 rounded-xl border border-slate-100">
                          {activeService.bullets.map((b, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>

                        {/* Action CTA */}
                        <Link
                          to={activeService.btnLink}
                          className={`inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl ${activeService.btnBg} font-heading font-bold text-xs shadow-xs transition-all`}
                        >
                          <span>{activeService.btnText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </motion.div>
                    </AnimatePresence>

                    {/* Pagination Dots + Swipe Hint */}
                    <div className="flex items-center justify-between mt-2.5 px-1">
                      <div className="flex items-center gap-1.5">
                        {dealershipServices.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveServiceIndex(idx)}
                            className={`h-1.5 rounded-full transition-all cursor-pointer ${
                              activeServiceIndex === idx ? 'w-5 bg-brand-orange' : 'w-1.5 bg-slate-300'
                            }`}
                            aria-label={`Service ${idx + 1}`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">⚡ Swipe to switch</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* ── DESKTOP VIEW: Full 3 Side-by-Side Luxury Cards ── */}
            <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
              {dealershipServices.map((service) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={service.id}
                    className={`relative group bg-white/90 backdrop-blur-md rounded-3xl p-7 lg:p-8 border border-gray-100 ${service.borderHover} shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col`}
                  >
                    <div className={`absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent ${service.topLine} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <div className={`w-16 h-16 rounded-2xl ${service.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 shadow-sm transition-transform`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="font-heading text-2xl font-black text-slate-900 mb-3">{service.title}</h3>
                    <p className="font-body text-slate-600 text-sm leading-relaxed mb-6">
                      {service.desc}
                    </p>
                    <div className="space-y-2 mb-8 mt-auto text-xs font-semibold text-slate-700 font-body">
                      {service.bullets.map((point, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      to={service.btnLink}
                      className={`inline-flex items-center justify-between w-full px-5 py-3 rounded-xl ${service.btnBg} font-heading font-bold text-sm transition-all duration-300 shadow-xs`}
                    >
                      <span>{service.btnText}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. Promotional Offers Banner Slider */}
        <PromoBanners />

        {/* 6. Why Choose Us (With Stats Counters and Brand Color Harmonization) */}
        <WhyChooseUs />

        {/* 7. Google Reviews Section (Dynamic API + CSS Marquee) */}
        <GoogleReviews />

        {/* 8. Happy Customers Gallery */}
        <HappyCustomers />



      </div>
    </div>
  );
}