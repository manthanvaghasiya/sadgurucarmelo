import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  CheckCircle, Banknote, ShieldCheck,
  Search, Star, MapPin, Phone, RefreshCw,
  Clock, ArrowRight, Sparkles, Award, ArrowUpRight,
  MessageCircle, Car, ChevronRight
} from 'lucide-react';
import { motion } from "framer-motion";
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

const CATEGORIES = [
  { id: 'all', label: 'બધી કાર · All Cars', icon: '🚙' },
  { id: 'suv', label: 'SUV · સ્પોર્ટ્સ યુટિલિટી', icon: '🚘' },
  { id: 'sedan', label: 'Sedan · સેડાન', icon: '🚗' },
  { id: 'hatchback', label: 'Hatchback · ફેમિલી કાર', icon: '🛞' },
  { id: 'automatic', label: 'Automatic · ઓટોમેટિક', icon: '⚡' }
];

export default function Home() {
  const { cars, isLoading } = useCars();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter available cars based on category
  const availableCars = useMemo(() => {
    return cars ? cars.filter(car => car.status === 'Available') : [];
  }, [cars]);

  const filteredCars = useMemo(() => {
    if (!availableCars.length) return [];

    switch (selectedCategory) {
      case 'suv':
        return availableCars.filter(c =>
          c.bodyType?.toLowerCase().includes('suv') ||
          /creta|brezza|seltos|scorpio|thar|fortuner|harrier|venue|nexon|xuv|safari|innova|bolero|ecosport|duster|punch|taigun|kushaq|grand vitara|jimny/i.test(`${c.make} ${c.model}`)
        );
      case 'sedan':
        return availableCars.filter(c =>
          c.bodyType?.toLowerCase().includes('sedan') ||
          /city|verna|ciaz|dzire|amaze|aura|slavia|virtus|accent|corolla|civic|rapid|octavia|etios/i.test(`${c.make} ${c.model}`)
        );
      case 'hatchback':
        return availableCars.filter(c =>
          c.bodyType?.toLowerCase().includes('hatchback') ||
          /swift|baleno|i20|wagon|tiago|alto|i10|kwid|ignis|polo|glanza|celerio|s-presso|altroz|brio/i.test(`${c.make} ${c.model}`)
        );
      case 'automatic':
        return availableCars.filter(c => c.transmission?.toLowerCase() === 'automatic');
      case 'all':
      default: {
        const featured = availableCars.filter(c => c.isFeaturedOnHome);
        return featured.length > 0 ? featured : availableCars;
      }
    }
  }, [availableCars, selectedCategory]);

  const displayedCars = filteredCars.slice(0, 8);

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
        <section className="inventory-grid-section py-20 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden">
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
                  ૧૫૦+ ગુણવત્તાયુક્ત વેરિફાઇડ કાર (Verified Cars), સંપૂર્ણ સર્વિસ હિસ્ટ્રી અને ૧૨૦+ પોઈન્ટ ટેકનિકલ ઈન્સ્પેક્શન સાથે.
                </p>
              </div>

              {/* Quick Search Component */}
              <div className="w-full xl:w-[680px] shrink-0">
                <QuickSearch compact={true} />
              </div>
            </div>

            {/* Interactive Category Filter Pills */}
            <div className="mb-10 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/30 scale-102 ring-2 ring-brand-orange/30'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-gray-200 hover:border-brand-orange/40 shadow-xs'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Car Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                    આ કેટેગરીમાં કાર ઉપલબ્ધ નથી
                  </p>
                  <p className="font-body text-slate-500 text-sm mb-5">
                    બીજી કેટેગરી પસંદ કરો અથવા સંપૂર્ણ ઇન્વેન્ટરી જુઓ.
                  </p>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="px-6 py-2.5 rounded-full bg-brand-orange text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-orange-600 transition-all"
                  >
                    બધી કાર જુઓ (View All)
                  </button>
                </div>
              ) : (
                displayedCars.map((car) => (
                  <div key={car._id} className="car-card-premium">
                    <CarCard
                      id={car._id}
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
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-transparent relative">
          <div className="max-w-7xl mx-auto">
            {/* Heading */}
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-heading font-bold text-xs uppercase tracking-[0.2em] mb-4 shadow-xs">
                વિશ્વાસપાત્ર ડીલર સેવાઓ · TRUSTED DEALERSHIP SERVICES
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                સુરતમાં <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">ખરીદ, વેચાણ અને Exchange</span> માટેનું સંપૂર્ણ Solution
              </h2>
              <p className="font-body text-slate-600 text-base sm:text-lg leading-relaxed">
                પારદર્શક પ્રક્રિયા અને સુરતના હજારો પરિવારોના વિશ્વાસ સાથે. તમારી દરેક જરૂરિયાત માટે ૧૦૦% સેફ અને સરળ કાર ડીલિંગનો અનુભવ (Trusted Dealer).
              </p>
            </div>

            {/* 3 Luxury Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Buy Certified Cars */}
              <div className="relative group bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-gray-100 hover:border-slate-300 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
                <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-slate-800 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-2xl bg-slate-100 text-primary flex items-center justify-center mb-6 group-hover:scale-110 shadow-sm transition-transform">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-black text-slate-900 mb-3">સર્ટિફાઈડ કાર ખરીદો</h3>
                <p className="font-body text-slate-600 text-sm leading-relaxed mb-6">
                  તમારા પરિવારના ભરોસા માટે ૧૫૦+ વેરિફાઇડ કાર (Verified Cars). દરેક કારનું ૧૨૦+ પોઈન્ટ ટેકનિકલ ઈન્સ્પેક્શન અને વાજબી કિંમત.
                </p>
                <div className="space-y-2 mb-8 mt-auto text-xs font-semibold text-slate-700 font-body">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>૧૨૦+ પોઈન્ટ ટેકનિકલ ચેક</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>૧૦૦% સચોટ કિલોમીટર (Genuine KM)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>સરળ બેંક લોન અને ફાઇનાન્સ સુવિધા</span>
                  </div>
                </div>
                <Link
                  to="/inventory"
                  className="inline-flex items-center justify-between w-full px-5 py-3 rounded-xl bg-slate-50 group-hover:bg-primary text-slate-800 group-hover:text-white font-heading font-bold text-sm transition-all duration-300 shadow-xs"
                >
                  <span>સર્ટિફાઈડ કાર જુઓ</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Card 2: Sell Your Car Instantly */}
              <div className="relative group bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-gray-100 hover:border-emerald-300 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
                <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 shadow-sm transition-transform">
                  <Banknote className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-heading text-2xl font-black text-slate-900 mb-3">તમારી કાર તરત જ વેચો</h3>
                <p className="font-body text-slate-600 text-sm leading-relaxed mb-6">
                  પારદર્શક મૂલ્યાંકન અને તુરંત બેંક પેમેન્ટ સાથે તમારી જૂની કારની મેળવો શ્રેષ્ઠ બજાર કિંમત, કોઈ પણ જાતની ઝંઝટ વગર.
                </p>
                <div className="space-y-2 mb-8 mt-auto text-xs font-semibold text-slate-700 font-body">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>૩૦ મિનિટમાં બેસ્ટ બજાર વેલ્યુએશન</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>સીધું ઇન્સ્ટન્ટ બેંક ટ્રાન્સફર પેમેન્ટ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>૧૦૦% મફત RTO દસ્તાવેજ ટ્રાન્સફર</span>
                  </div>
                </div>
                <Link
                  to="/sell-your-car"
                  className="inline-flex items-center justify-between w-full px-5 py-3 rounded-xl bg-emerald-50/80 group-hover:bg-emerald-600 text-emerald-900 group-hover:text-white font-heading font-bold text-sm transition-all duration-300 shadow-xs"
                >
                  <span>ઓનલાઇન વેલ્યુએશન મેળવો</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Card 3: Hassle-Free Car Exchange */}
              <div className="relative group bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-gray-100 hover:border-orange-300 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
                <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-brand-orange flex items-center justify-center mb-6 group-hover:scale-110 shadow-sm transition-transform">
                  <RefreshCw className="w-8 h-8 text-brand-orange" />
                </div>
                <h3 className="font-heading text-2xl font-black text-slate-900 mb-3">જૂની કારનું શ્રેષ્ઠ એક્સચેન્જ</h3>
                <p className="font-body text-slate-600 text-sm leading-relaxed mb-6">
                  તમારી જૂની કાર આપીને શ્રેષ્ઠ એક્સચેન્જ બોનસ સાથે તમારી મનપસંદ વેરિફાઇડ કારમાં અપગ્રેડ કરો (Trusted Dealer).
                </p>
                <div className="space-y-2 mb-8 mt-auto text-xs font-semibold text-slate-700 font-body">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>કોઈ પણ કંપની/મોડેલનું એક્સચેન્જ સ્વીકાર્ય</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>આકર્ષક એક્સચેન્જ બોનસ અને ડિસ્કાઉન્ટ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>સેમ-ડે ડિલિવરી અને ઝીરો ડાઉન પેમેન્ટ</span>
                  </div>
                </div>
                <Link
                  to="/about?service=exchange"
                  className="inline-flex items-center justify-between w-full px-5 py-3 rounded-xl bg-orange-50/80 group-hover:bg-brand-orange text-orange-950 group-hover:text-white font-heading font-bold text-sm transition-all duration-300 shadow-xs"
                >
                  <span>એક્સચેન્જ ઓફર્સ જાણો</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
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

        {/* 9. Showroom Visit & Direct Contact CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-primary to-slate-950 text-white relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Showroom Info */}
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-amber-400 font-heading font-bold text-xs uppercase tracking-widest mb-4">
                  <MapPin className="w-3.5 h-3.5 text-brand-orange" /> સુરત શોરૂમ મુલાકાત
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                  સદગુરુ કાર મેળો, વરાછા સુરતની <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-400 to-yellow-500">મુલાકાત લો</span>
                </h2>
                <p className="font-body text-slate-300 text-base sm:text-lg mb-8 leading-relaxed max-w-2xl">
                  આવો રૂબરૂ મળીને તમારી પસંદગીની કાર જુઓ, ટેસ્ટ ડ્રાઈવ લો અને શ્રેષ્ઠ ડીલ મેળવો. અમારા અનુભવી સ્ટાફ તમારી સેવામાં હંમેશા હાજર છે.
                </p>

                {/* Showroom Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-start gap-3 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-heading font-bold text-sm text-white">સરનામું · Showroom Location</h3>
                      <p className="font-body text-xs text-slate-300 mt-1">વરાછા રોડ, સુરત, ગુજરાત - 395006</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <Clock className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-heading font-bold text-sm text-white">સમય · Working Hours</h3>
                      <p className="font-body text-xs text-slate-300 mt-1">સવારે 9:30 થી રાત્રે 8:30 (દરરોજ ખુલ્લું)</p>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <a
                    href="https://maps.google.com/?q=Sadguru+Car+Melo+Surat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-orange hover:bg-orange-600 text-white font-heading font-bold text-sm shadow-[0_10px_25px_rgba(245,148,35,0.4)] transition-all cursor-pointer"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>ગૂગલ મેપ્સ લોકેશન (Get Directions)</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>

                  <a
                    href="tel:+919913634447"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-heading font-bold text-sm border border-white/15 transition-all cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>+91 99136 34447</span>
                  </a>

                  <a
                    href="https://wa.me/919913634447?text=નમસ્તે,%20હું%20સદગુરુ%20કાર%20મેળામાંથી%20કાર%20વિશે%20માહિતી%20મેળવવા%20માગું%20છું."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Visual Trust Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl bg-white/5 border border-white/15 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-brand-orange/20 border border-brand-orange/30 flex items-center justify-center">
                      <Award className="w-6 h-6 text-brand-orange" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-lg text-white">સદગુરુ કાર મેળો</h4>
                      <p className="text-xs text-slate-400">સુરતનો સૌથી વિશ્વાસપાત્ર વેરિફાઇડ કાર ડીલર (Trusted Dealer)</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-sm font-body text-slate-200">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="text-slate-400">કુલ સર્ટિફાઈડ સ્ટોક</span>
                      <span className="font-bold text-white">૧૫૦+ ઉપલબ્ધ કાર</span>
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="text-slate-400">ગ્રાહક સંતોષ રેટિંગ</span>
                      <span className="font-bold text-amber-400 flex items-center gap-1">4.8 / 5.0 (૫૦૦+ રિવ્યૂ)</span>
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="text-slate-400">સ્થાપના વર્ષ</span>
                      <span className="font-bold text-white">૨૦૧૧ (૧૪+ વર્ષ વિશ્વાસ)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">ફાઇનાન્સ સુવિધા</span>
                      <span className="font-bold text-emerald-400">તમામ મુખ્ય બેંકો દ્વારા</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <button
                      onClick={() => navigate('/contact')}
                      className="w-full py-3.5 rounded-xl bg-white text-primary hover:bg-slate-100 font-heading font-black text-sm tracking-wide transition-all shadow-md cursor-pointer"
                    >
                      સંપર્ક પેજ જુઓ · Contact Us
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
}