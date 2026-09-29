import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, FileText, Landmark, Tag, Star, Banknote, RefreshCw,
  CarFront, CheckCircle, Clock, SearchCheck, Award, MapPin, Zap,
  Handshake, ShieldAlert, ChevronRight, Phone, ArrowUpRight,
  Sparkles, Check, X as LucideX, Gauge, Shield, Wrench, HeartHandshake,
  Eye, Compass, Car, Building2, UserCheck, Flame, Cpu, CheckCircle2,
  Activity, ArrowRight
} from 'lucide-react';
import GoogleReviews from '../components/GoogleReviews';
import HappyCustomers from '../components/HappyCustomers';
import WhatsAppIcon from '../components/WhatsAppIcon';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

export default function AboutPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read service from URL or default to 'buy'
  const initialService = searchParams.get('service') || 'buy';
  const [activeTab, setActiveTab] = useState(initialService);

  // Sync state and scroll if URL changes
  useEffect(() => {
    const serviceFromUrl = searchParams.get('service');
    if (serviceFromUrl && ['buy', 'sell', 'exchange'].includes(serviceFromUrl)) {
      setActiveTab(serviceFromUrl);

      setTimeout(() => {
        const el = document.getElementById('core-services');
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 300);
    }
  }, [searchParams]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ service: tabId }, { replace: true });
  };

  const tabs = [
    { id: 'buy', label: 'કાર ખરીદો', engLabel: 'Buy Verified Car', icon: CarFront, badge: '૧૫૦+ કાર' },
    { id: 'sell', label: 'કાર વેચો', engLabel: 'Sell with Instant Pay', icon: Banknote, badge: 'ઇન્સ્ટન્ટ પેમેન્ટ' },
    { id: 'exchange', label: 'એક્સચેન્જ', engLabel: 'Trade-in Upgrade', icon: RefreshCw, badge: 'બેસ્ટ બોનસ' },
  ];

  // 120-Point Inspection Architecture categories
  const [selectedProtocol, setSelectedProtocol] = useState(0);

  const inspectionProtocols = [
    {
      id: 'powertrain',
      title: 'એન્જિન & પાવરટ્રેન',
      engTitle: 'Engine & Transmission Diagnostics',
      icon: Wrench,
      score: '28 / 28 Tests Pass',
      badge: '૨૮ પોઈન્ટ્સ',
      description: 'એન્જિન બ્લોક, સિલિન્ડર કમ્પ્રેશન, સ્મૂથ ગિયર શિફ્ટિંગ અને ઝીરો ઓઇલ લીકેજની સંપૂર્ણ ચકાસણી.',
      points: [
        'એન્જિન બ્લોક & સિલિન્ડર કમ્પ્રેશન પ્રેશર ટેસ્ટ',
        'ઓટોમેટિક & મેન્યુઅલ ગિયરબોક્સ સ્મૂથ રિસ્પોન્સ',
        'ઓઇલ, કુલન્ટ & બ્રેક ફ્લુઇડ લીકેજ ડિટેક્શન',
        'ટર્બોચાર્જર બૂસ્ટ & એક્ઝોસ્ટ સ્મોક એનાલિસિસ',
        'બેટરી હેલ્થ & અલ્ટરનેટર વોલ્ટેજ આઉટપુટ',
        'એન્જિન માઉન્ટિંગ & વાઇબ્રેશન હાર્મોનિક્સ ચેક'
      ]
    },
    {
      id: 'chassis',
      title: 'ચેસીસ & બોડી ઇન્ટિગ્રિટી',
      engTitle: '100% Non-Accidental Guarantee',
      icon: ShieldCheck,
      score: '35 / 35 Tests Pass',
      badge: '૩૫ પોઈન્ટ્સ',
      description: '૧૦૦% નોન-એક્સિડેન્ટલ ગેરંટી. એપ્રોન, પિલર્સ અને ઓરિજિનલ ફેક્ટરી પેઇન્ટનું ડિજિટલ માઇક્રોન સ્કેનિંગ.',
      points: [
        'એપ્રોન, ચેસીસ ફ્રેમ & રનિંગ બોર્ડ ફેક્ટરી એલાઈનમેન્ટ',
        'A, B, C પિલર્સનું ઓરિજિનલ સ્પોટ વેલ્ડિંગ ઈન્સ્પેક્શન',
        'ડિજિટલ પેઇન્ટ ગેજ દ્વારા પેઇન્ટ ડેપ્થ માઇક્રોન ચેક',
        'રૂફ, ફ્લોરબોર્ડ & ટ્રંક કમ્પાર્ટમેન્ટ સ્ટ્રક્ચરલ ટેસ્ટ',
        'ફ્રન્ટ & રિયર બમ્પર ક્રોસમેમ્બર ઓરિજિનાલિટી',
        'અંડરબોડી એન્ટી-રસ્ટ પ્રોટેક્શન & વોટર ડેમેજ ચેક'
      ]
    },
    {
      id: 'suspension',
      title: 'સસ્પેન્શન, બ્રેક & સ્ટીયરીંગ',
      engTitle: 'Dynamics, Braking & Road Test',
      icon: Gauge,
      score: '30 / 30 Tests Pass',
      badge: '૩૦ પોઈન્ટ્સ',
      description: 'હાઇ-સ્પીડ સ્ટેબિલિટી, ABS કેલિબ્રેશન અને સુરતના લોકલ તેમજ હાઇવે રસ્તાઓ માટે આરામદાયક રાઇડ.',
      points: [
        'ડિસ્ક બ્રેક્સ થિકનેસ તથા ABS સેન્સર્સ કેલિબ્રેશન',
        'શોક એબ્સોર્બર્સ, સ્ટ્રટ્સ & બુશિંગ્સ રિસ્પોન્સ ટેસ્ટ',
        'પાવર સ્ટીયરીંગ રેક, કોલમ & ટાઈ-રોડ એન્ડ્સ ચેક',
        'હાઇ-સ્પીડ વ્હીલ એલાઈનમેન્ટ & બેલેન્સિંગ સ્કેન',
        'ટાયર્સ ટ્રેડ ડેપ્થ & ઇવન વેર-ટીયર ઓડિટ (>૭૦% લાઈફ)',
        'ડ્રાઇવશાફ્ટ & CV જોઈન્ટ્સ નોઈઝ-ફ્રી ઓપરેશન'
      ]
    },
    {
      id: 'electronics',
      title: 'OBD-II સ્કેનર & લીગલ RTO',
      engTitle: 'OBD-II Scan & 100% Free RTO',
      icon: SearchCheck,
      score: '27 / 27 Tests Pass',
      badge: '૨૭ પોઈન્ટ્સ',
      description: 'ઓન-બોર્ડ કોમ્પ્યુટર ડાયગ્નોસ્ટિક્સ, એસી ક્લાઇમેટ કંટ્રોલ અને ૧૦૦% કાનૂની માલિકી ટ્રાન્સફર.',
      points: [
        'પ્રોફેશનલ OBD-II કમ્પ્યુટર સ્કેનર ફોલ્ટ-કોડ ઓડિટ',
        'એરબેગ્સ, સેન્સર્સ & ઈસીયુ (ECU) ઓરિજિનાલિટી',
        'ડ્યુઅલ-ઝોન ક્લાઇમેટ કંટ્રોલ & એસી કૂલિંગ થર્મો-ટેસ્ટ',
        '૧૦૦% સચોટ ઓરિજિનલ કિલોમીટર (ઓબીડી & સર્વિસ રેકોર્ડ)',
        '૧૦૦% ક્લીન ટાઇટલ, નો-હાઈપોથેકેશન & RTO NOC',
        'ફ્રી & ૧૦૦% કાનૂની માલિકી ટ્રાન્સફર (RC Transfer Guarantee)'
      ]
    }
  ];

  return (
    <div className="flex flex-col flex-grow min-h-screen bg-[#070A11] text-slate-100 font-body overflow-x-hidden selection:bg-brand-orange selection:text-slate-950">
      <Helmet>
        <title>About Sadguru Car Surat — Surat's Premier Certified Pre-Owned Showroom Since 2011</title>
        <meta name="description" content="Discover Sadguru Car Surat — Surat's most reputable certified pre-owned showroom since 2011. 15+ years of trust, 150+ inspected cars, 120-point quality check, and 5000+ happy families." />
        <meta property="og:title" content="About Sadguru Car Surat — 15+ Years of Automotive Trust in Surat" />
        <meta property="og:description" content="Surat's leading certified pre-owned car showroom. 150+ verified vehicles, 120-point inspection, zero hidden charges." />
      </Helmet>

      {/* ═════════════════════════════════════════════════════════════════════
          1. CINEMATIC LUXURY HERO (World-Class Automotive Editorial)
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-24 pb-36 md:pt-32 md:pb-44 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-800/80">
        {/* Soft Ambient Radiance Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-b from-brand-orange/[0.18] via-amber-500/[0.08] to-transparent rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/4 -left-40 w-[420px] h-[420px] bg-sky-500/[0.08] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 -right-40 w-[420px] h-[420px] bg-amber-500/[0.08] rounded-full blur-[140px] pointer-events-none" />

        {/* Precision Micro-Grid Laser Architecture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff07_1px,transparent_1px),linear-gradient(to_bottom,#ffffff07_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_25%,#000_65%,transparent_100%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center flex flex-col items-center">
          {/* Top Heritage Seal */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-slate-900/90 border border-brand-orange/35 shadow-[0_10px_35px_rgba(245,148,35,0.2)] backdrop-blur-xl mb-6 sm:mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange" />
            </span>
            <span className="font-heading font-black text-[11px] sm:text-xs uppercase tracking-[0.22em] text-amber-300">
              સુરતમાં સ્થાપના ૨૦૧૧ · ૧૫+ વર્ષોનો અતૂટ વિશ્વાસ
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-[70px] font-black tracking-tight leading-[1.12] max-w-4xl text-white font-heading"
          >
            સુરતમાં વેરિફાઇડ કાર માટેનું <br className="hidden sm:inline" />
            સૌથી <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-300 to-yellow-200">વિશ્વાસપાત્ર સરનામું</span>
          </motion.h1>

          {/* Editorial Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed px-2 font-body"
          >
            ૧૫૦+ વેરિફાઇડ કાર, ૧૨૦+ પોઈન્ટ્સ ટેકનિકલ ઈન્સ્પેક્શન અને સંપૂર્ણ પારદર્શિતા સાથે સુરતના ૫,૦૦૦+ પરિવારોની પ્રથમ પસંદગી.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.3 }}
            className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3.5 sm:gap-5"
          >
            <Link
              to="/inventory"
              className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-brand-orange via-[#f79e32] to-[#e68415] text-slate-950 font-heading font-black text-sm sm:text-base shadow-[0_12px_32px_rgba(245,148,35,0.45)] hover:shadow-[0_16px_45px_rgba(245,148,35,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden border border-amber-300/40"
            >
              <Car className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
              <span>સંપૂર્ણ સ્ટોક જુઓ · Browse 150+ Cars</span>
              <ChevronRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="https://maps.google.com/?q=Sadguru+Car+Melo+Surat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl sm:rounded-2xl bg-slate-900/90 hover:bg-slate-850 text-white font-heading font-bold text-sm sm:text-base border border-slate-700/80 shadow-md hover:border-brand-orange/40 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <MapPin className="w-4 h-4 text-brand-orange" />
              <span>શોરૂમ લોકેશન · Showroom Visit</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          2. FLOATING STATS TELEMETRY COCKPIT
          ═════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={fadeInUp}
          className="bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.6)] border border-amber-500/25 grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 items-center justify-between text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800"
        >
          {/* Stat 1: Established */}
          <div className="flex flex-col items-center justify-center p-2 group">
            <span className="font-heading font-black text-3xl sm:text-4xl text-white mb-1 group-hover:scale-105 transition-transform flex items-center gap-1">
              ૧૫<span className="text-brand-orange font-bold">+</span>
            </span>
            <span className="text-xs font-heading font-black uppercase tracking-wider text-slate-200">
              વર્ષોનો અતૂટ વિશ્વાસ
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Since 2011 in Surat</span>
          </div>

          {/* Stat 2: Verified Stock */}
          <div className="flex flex-col items-center justify-center p-2 pt-6 sm:pt-2 group">
            <span className="font-heading font-black text-3xl sm:text-4xl text-white mb-1 group-hover:scale-105 transition-transform flex items-center gap-1">
              ૧૫૦<span className="text-brand-orange font-bold">+</span>
            </span>
            <span className="text-xs font-heading font-black uppercase tracking-wider text-slate-200">
              લાઇવ વેરિફાઇડ સ્ટોક
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Ready in Showroom</span>
          </div>

          {/* Stat 3: Families */}
          <div className="flex flex-col items-center justify-center p-2 pt-6 sm:pt-2 group">
            <span className="font-heading font-black text-3xl sm:text-4xl text-white mb-1 group-hover:scale-105 transition-transform flex items-center gap-1">
              ૫,૦૦૦<span className="text-brand-orange font-bold">+</span>
            </span>
            <span className="text-xs font-heading font-black uppercase tracking-wider text-slate-200">
              સંતુષ્ટ પરિવારો
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Delighted Families</span>
          </div>

          {/* Stat 4: Rating */}
          <div className="flex flex-col items-center justify-center p-2 pt-6 sm:pt-2 group">
            <div className="flex items-center gap-1.5 mb-1 group-hover:scale-105 transition-transform">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="font-heading font-black text-3xl sm:text-4xl text-white">૪.૮</span>
            </div>
            <span className="text-xs font-heading font-black uppercase tracking-wider text-slate-200">
              ગૂગલ રેટિંગ
            </span>
            <span className="text-[11px] text-slate-400 font-medium">૫૦૦+ વાસ્તવિક રિવ્યૂ</span>
          </div>

          {/* Stat 5: Technical Check */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center p-2 pt-6 sm:pt-2 group">
            <span className="font-heading font-black text-3xl sm:text-4xl text-emerald-400 mb-1 group-hover:scale-105 transition-transform flex items-center gap-1">
              ૧૨૦<span className="text-white font-bold">+</span>
            </span>
            <span className="text-xs font-heading font-black uppercase tracking-wider text-slate-200">
              ટેકનિકલ ઈન્સ્પેક્શન
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Rigorous Lab Audit</span>
          </div>
        </motion.div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          3. HERITAGE & FOUNDER NARRATIVE (Editorial Luxury Split)
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-[#070A11] via-[#090D17] to-[#070A11]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">

          {/* Left Column: Visual Gallery Showcase Frame */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeInUp}
            className="lg:col-span-5 relative"
          >
            {/* Glowing Accent Border Frame */}
            <div className="relative rounded-3xl p-3 bg-gradient-to-b from-amber-500/30 via-slate-800 to-amber-500/20 shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 h-[380px] sm:h-[480px]">
                <img
                  src="/showroom_lounge.jpg"
                  alt="Sadguru Car Surat VIP Showroom Lounge"
                  className="w-full h-full object-cover select-none hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                {/* Floating Top Trust Badge */}
                <div className="absolute top-4 left-4 right-4 bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-sm text-white leading-tight">
                      ૧૫+ વર્ષોનો અતૂટ વિશ્વાસ
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium">
                      ત્રિલોક કાર બજાર, વરાછા, સુરત
                    </p>
                  </div>
                </div>

                {/* Floating Inset Real Showroom Thumbnail */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/95 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 flex items-center gap-3 text-white">
                  <div className="w-14 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-700">
                    <img src="/about.png" alt="Team Sadguru" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-amber-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate">૧૦૦% સર્ટિફાઇડ નોન-એક્સિડેન્ટલ</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">અમારું વરાછા ખાતેનું વિશાળ શોરૂમ કેમ્પસ</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Narrative & Values */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={staggerContainer}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange font-heading font-bold text-xs uppercase tracking-widest w-fit mb-4">
              <Sparkles className="w-3.5 h-3.5 text-brand-orange" /> અમારો વારસો · THE SADGURU LEGACY
            </motion.div>

            <motion.h2 variants={fadeInUp} className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-[1.18] font-heading tracking-tight mb-5">
              માત્ર એક કાર મેળો નહીં, સુરતના પરિવારોનો <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-300 to-yellow-200">
                દાયકાઓ જૂનો ભરોસો
              </span>
            </motion.h2>

            <motion.div variants={fadeInUp} className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed font-body">
              <p>
                વર્ષ <b>૨૦૧૧</b> માં વરાછા, સુરત ખાતે જ્યારે સદગુરુ કાર મેળોની સ્થાપના થઈ, ત્યારે અમારો એક જ દ્રઢ સંકલ્પ હતો: <span className="text-white font-semibold">"પ્રી-ઓન્ડ કાર ખરીદવી એ નવી કાર ખરીદવા જેટલું જ ગૌરવપૂર્ણ, સુરક્ષિત અને પારદર્શક હોવું જોઈએ."</span>
              </p>
              <p>
                સામાન્ય બ્રોકરો કે અનઓર્ગેનાઈઝ્ડ બજારથી વિપરીત, અમે સુરતમાં એક એવું મોડેલ ઊભું કર્યું જ્યાં દરેક કાર <b>૧૨૦+ પોઈન્ટ ટેકનિકલ ઈન્સ્પેક્શન</b> પાસ કર્યા પછી જ ડિસ્પ્લે થાય છે. કોઈ મીટર ટેમ્પરિંગ નહીં, કોઈ છૂપા ખર્ચા નહીં અને કોઈ અનિશ્ચિતતા નહીં.
              </p>
            </motion.div>

            {/* Founder Quote Card */}
            <motion.div variants={fadeInUp} className="mt-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white border border-amber-500/20 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start gap-3.5">
                <span className="text-4xl text-brand-orange font-serif leading-none select-none">“</span>
                <div>
                  <p className="text-xs sm:text-sm text-slate-200 font-heading font-medium italic leading-relaxed">
                    જ્યારે કોઈ પરિવાર પોતાની બચતમાંથી કાર ખરીદે છે, ત્યારે એ માત્ર કાર નથી હોતી, એમના સપના હોય છે. અમે એ સપનાને ૧૦૦% સાચો, સુરક્ષિત અને પ્રમાણિક ઓટોમોટિવ સપોર્ટ આપવા માટે બંધાયેલા છીએ.
                  </p>
                  <div className="mt-3.5 flex items-center justify-between border-t border-slate-800 pt-2.5">
                    <div>
                      <p className="text-xs font-heading font-bold text-white">સદગુરુ કાર મેળો ટીમ</p>
                      <p className="text-[10px] text-slate-400">ત્રિલોક કાર બજાર, વરાછા, સુરત</p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                      Trusted Showroom
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 3 Core Trust Badges */}
            <motion.div variants={fadeInUp} className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-heading font-black text-slate-200">૧૦૦% નોન-એક્સિડેન્ટલ</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <Gauge className="w-5 h-5 text-brand-orange shrink-0" />
                <span className="text-xs font-heading font-black text-slate-200">ઓરિજિનલ કિલોમીટર</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <FileText className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-xs font-heading font-black text-slate-200">૧૦૦% ફ્રી RTO ટ્રાન્સફર</span>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          4. THE 120-POINT INSPECTION ARCHITECTURE (Aerospace Telemetry Cockpit)
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#070A11] via-[#0C111E] to-[#070A11] text-white relative overflow-hidden border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto relative z-10">

          {/* Section Header with Inspection Hero Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12 sm:mb-16">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-brand-orange/30 text-amber-300 font-heading font-bold text-xs uppercase tracking-widest mb-3.5 shadow-sm">
                <Shield className="w-3.5 h-3.5 text-brand-orange" /> ટેકનિકલ સર્ટિફિકેશન · THE 120-POINT QUALITY STANDARD
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-heading tracking-tight leading-tight">
                અમારું ૧૨૦+ પોઈન્ટ્સ <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-300 to-yellow-200">
                  સઘન લેબોરેટરી &amp; રોડ ટેસ્ટિંગ
                </span>
              </h2>
              <p className="mt-3.5 text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-xl">
                દરેક વાહનની ઓન-બોર્ડ કોમ્પ્યુટરથી લઈને ચેસીસ ફ્રેમ સુધીની કડક મિકેનિકલ ચકાસણી. કોઈપણ સમાધાન વગર, ૧૦૦% પરિણામ.
              </p>
            </div>

            {/* Right Mini Inspection Visual Banner */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl h-44 sm:h-48 group">
                <img
                  src="/inspection_lab.jpg"
                  alt="120 Point Inspection Studio"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-heading font-black text-amber-300 uppercase tracking-wider block">Live Testing Bay</span>
                    <span className="text-xs font-bold text-white">ઓટોમોટિવ ડાયગ્નોસ્ટિક લેબ</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/30">
                    100% Certified Pass
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive 4-Pillar Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {inspectionProtocols.map((protocol, idx) => {
              const IconComp = protocol.icon;
              const isSelected = selectedProtocol === idx;
              return (
                <button
                  key={protocol.id}
                  onClick={() => setSelectedProtocol(idx)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all text-left relative overflow-hidden cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900/95 border-amber-500/60 shadow-[0_12px_35px_rgba(245,148,35,0.22)]'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-orange to-amber-400" />
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-brand-orange text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-heading font-black px-2 py-0.5 rounded-md bg-white/10 text-amber-300">
                      {protocol.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className={`font-heading font-bold text-sm sm:text-base leading-tight ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {protocol.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {protocol.engTitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Protocol Deep-Dive Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedProtocol}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-orange/20 text-brand-orange text-[10px] font-heading font-black uppercase tracking-wider">
                      {inspectionProtocols[selectedProtocol].badge}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {inspectionProtocols[selectedProtocol].score}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-3xl font-heading font-black text-white">
                    {inspectionProtocols[selectedProtocol].title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md sm:text-right">
                  {inspectionProtocols[selectedProtocol].description}
                </p>
              </div>

              {/* Inspection Checklist Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-6">
                {inspectionProtocols[selectedProtocol].points.map((pt, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                      {pt}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          5. THE SADGURU DIFFERENCE: Traditional Broker vs Sadguru Verified
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#090D17] relative overflow-hidden border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/25 text-brand-orange font-heading font-bold text-xs uppercase tracking-widest mb-3.5">
              <Compass className="w-3.5 h-3.5 text-brand-orange" /> શા માટે સદગુરુ કાર મેળો? · THE UNFAIR ADVANTAGE
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-heading tracking-tight leading-tight">
              સામાન્ય બ્રોકર vs <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-300 to-yellow-200">સદગુરુ વેરિફાઇડ કાર</span>
            </h2>
            <p className="mt-3.5 text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              સુરતમાં વપરાયેલી કાર લેતી વખતે ગ્રાહકો સાથે થતી સામાન્ય છેતરપિંડીઓથી બચો. જુઓ અમારો સ્પષ્ટ તફાવત:
            </p>
          </div>

          {/* Comparison Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {/* Card 1: Traditional Broker */}
            <div className="bg-slate-950/80 p-6 sm:p-8 rounded-3xl border border-red-500/30 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-red-500/80" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-heading font-black text-red-400 uppercase tracking-wider bg-red-950/60 px-3 py-1 rounded-full border border-red-500/30">
                    સામાન્ય બજાર / લોકલ બ્રોકર
                  </span>
                  <span className="text-xs text-slate-500 font-bold">Unorganized Broker</span>
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-black text-slate-200 mb-5">
                  અનિશ્ચિતતા અને ઊંચા જોખમો
                </h3>

                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-400">
                  <li className="flex items-start gap-2.5">
                    <LucideX className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><b>કોઈ ટેકનિકલ ગેરંટી નહીં:</b> કારમાં રહેલા છૂપા યાંત્રિક ફોલ્ટની કોઈ જવાબદારી હોતી નથી.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <LucideX className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><b>મીટર ટેમ્પરિંગનું ઊંચું જોખમ:</b> કિલોમીટર ઓછા બતાવીને ગેરમાર્ગે દોરવાની શક્યતા.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <LucideX className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><b>કાગળિયાં અને RTO ટ્રાન્સફરમાં વિલંબ:</b> મહિનાઓ સુધી આરસી બુક ટ્રાન્સફર થતી નથી.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <LucideX className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><b>અનિશ્ચિત કમિશન &amp; છૂપા ચાર્જીસ:</b> ખરીદનાર અને વેચનાર બંને પાસેથી છૂપા પૈસા લેવાય છે.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <LucideX className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><b>વેચાણ પછી કોઈ સર્વિસ નહીં:</b> ડીલ પત્યા પછી કોઈ પ્રકારનો સંપર્ક કે સહાય મળતી નથી.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-900 text-center">
                <span className="text-xs font-semibold text-red-400">❌ ગ્રાહક માટે માનસિક તણાવ અને નાણાકીય જોખમ</span>
              </div>
            </div>

            {/* Card 2: Sadguru Verified Experience */}
            <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl border-2 border-brand-orange/60 shadow-[0_20px_50px_rgba(245,148,35,0.25)] relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-brand-orange via-amber-400 to-yellow-400" />
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-brand-orange/15 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-heading font-black text-slate-950 uppercase tracking-wider bg-gradient-to-r from-brand-orange to-amber-400 px-3 py-1 rounded-full shadow-md">
                    સદગુરુ કાર મેળો (Sadguru Verified)
                  </span>
                  <span className="text-xs text-amber-300 font-bold">100% Certified</span>
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-black text-white mb-5">
                  સંપૂર્ણ સુરક્ષા, ગેરંટી અને શાંતિ (Peace of Mind)
                </h3>

                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><b>૧૨૦+ પોઈન્ટ ટેકનિકલ ઈન્સ્પેક્શન:</b> દરેક કાર નિષ્ણાતો દ્વારા સંપૂર્ણ ટેસ્ટ પાસ કરેલી હોય છે.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><b>૧૦૦% જેન્યુઇન ઓરિજિનલ કિલોમીટર:</b> OBD સ્કેન અને ડીલર સર્વિસ હિસ્ટ્રી સાથે સચોટ ખાતરી.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><b>૧૦૦% ફ્રી &amp; ઝડપી RTO ટ્રાન્સફર:</b> કાનૂની માલિકી ફેરબદલની સંપૂર્ણ જવાબદારી અમારી.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><b>ઝીરો હિડન ચાર્જ &amp; ફિક્સ્ડ વાજબી ભાવ:</b> કોઈ બ્રોકરેજ કે કમિશન નહીં, ૧૦૦% પારદર્શક વ્યવહાર.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><b>તમામ બેંકો દ્વારા ૦ ડાઉન પેમેન્ટ લોન:</b> એક્સચેન્જ બોનસ અને સેમ-ડે ડિલિવરી સુવિધા.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800 text-center">
                <span className="text-xs font-bold text-amber-300">✅ ૧૦૦% સેફ ડીલિંગ અને સુરતના ૫,૦૦૦+ પરિવારોનો વિશ્વાસ</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          6. CORE DEALERSHIP SERVICES (BUY · SELL · EXCHANGE)
          ═════════════════════════════════════════════════════════════════════ */}
      <section id="core-services" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#070A11] relative scroll-mt-20 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/25 text-brand-orange font-heading font-bold text-xs uppercase tracking-widest mb-3.5">
              <Zap className="w-3.5 h-3.5 text-brand-orange" /> અમારી મુખ્ય સેવાઓ · CORE SERVICES
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-heading tracking-tight leading-tight">
              કારને લગતી દરેક સેવા <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-300 to-yellow-200">એક જ છત નીચે</span>
            </h2>
            <p className="mt-3.5 text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              ખરીદીથી લઈને વેચાણ અને એક્સચેન્જ સુધીની સંપૂર્ણ આધુનિક ઓટોમોટિવ સર્વિસિસ.
            </p>
          </div>

          {/* Service Switcher Tabs */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 max-w-2xl mx-auto p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative flex-1 py-3 px-3 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isSelected ? 'text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeAboutServiceTab"
                      className="absolute inset-0 bg-gradient-to-r from-brand-orange to-amber-500 rounded-xl"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 flex items-center gap-1.5 sm:gap-2 ${isSelected ? 'text-slate-950 font-black' : ''}`}>
                    <TabIcon className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-brand-orange'}`} />
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Service Display */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10 md:p-12 shadow-2xl backdrop-blur-xl">
            <AnimatePresence mode="wait">
              {activeTab === 'buy' && (
                <motion.div
                  key="buy"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-7">
                    <span className="text-xs font-heading font-black text-brand-orange uppercase tracking-wider bg-brand-orange/15 border border-brand-orange/30 px-3 py-1 rounded-full">
                      પ્રીમિયમ વેરિફાઇડ કાર ખરીદો
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white font-heading mt-3 mb-4">
                      ૧૦૦% ભરોસા સાથે તમારા પરિવાર માટે <br className="hidden sm:inline" />
                      <span className="text-brand-orange">Dream Car</span> પસંદ કરો
                    </h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-body">
                      સુરતનું સૌથી મોટું ૧૫૦+ વેરિફાઇડ કાર કલેક્શન. દરેક કાર ૧૨૦+ પોઈન્ટ ટેકનિકલ ઈન્સ્પેક્શન પાસ કરેલી છે અને તમામ ટોપ બેંકો દ્વારા સરળ લોન સુવિધા ઉપલબ્ધ છે.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-200">૧૨૦+ પોઈન્ટ સર્ટિફિકેશન</span>
                      </div>
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-200">૦ ડાઉન પેમેન્ટ બેંક લોન</span>
                      </div>
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-200">૧૦૦% મફત RTO ટ્રાન્સફર</span>
                      </div>
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-200">૧૫૦+ લાઈવ સ્ટોક વરાછા</span>
                      </div>
                    </div>

                    <Link
                      to="/inventory"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-orange to-amber-500 text-slate-950 font-heading font-black text-sm shadow-md transition-all hover:scale-105 active:scale-95"
                    >
                      <Car className="w-4 h-4 text-slate-950" />
                      <span>સંપૂર્ણ ઇન્વેન્ટરી જુઓ · View All 150+ Cars</span>
                      <ChevronRight className="w-4 h-4 text-slate-950" />
                    </Link>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video sm:aspect-[4/3] bg-slate-950 group border border-slate-800">
                      <img
                        src="https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1000&auto=format&fit=crop"
                        alt="Buy Verified Car in Surat"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="text-[10px] uppercase font-heading font-black text-amber-300">Live Inventory</span>
                        <h4 className="text-sm font-bold">સુરતનું સૌથી વિશ્વસનીય વેરિફાઇડ શોરૂમ</h4>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'sell' && (
                <motion.div
                  key="sell"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-7">
                    <span className="text-xs font-heading font-black text-emerald-400 uppercase tracking-wider bg-emerald-950/70 border border-emerald-500/30 px-3 py-1 rounded-full">
                      તમારી કાર તરત જ વેચો
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white font-heading mt-3 mb-4">
                      શ્રેષ્ઠ બજાર કિંમત અને <span className="text-emerald-400">ઇન્સ્ટન્ટ બેંક ટ્રાન્સફર</span>
                    </h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-body">
                      કોઈ બ્રોકરેજ નહીં, કોઈ છૂપા ચાર્જીસ નહીં. માત્ર ૩૦ મિનિટમાં ઓનલાઇન કે રૂબરૂ વેલ્યુએશન કરાવો અને તે જ દિવસે સીધા તમારા ખાતામાં પૈસા મેળવો.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-200">૩૦ મિનિટમાં ફેર વેલ્યુએશન</span>
                      </div>
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-200">સીધું ઇન્સ્ટન્ટ બેંક પેમેન્ટ</span>
                      </div>
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-200">૧૦૦% ફ્રી RTO ટ્રાન્સફર</span>
                      </div>
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-200">ચાલુ લોન સીધું બેંક સેટલમેન્ટ</span>
                      </div>
                    </div>

                    <Link
                      to="/sell-your-car"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-black text-sm shadow-md transition-all hover:scale-105 active:scale-95"
                    >
                      <Banknote className="w-4 h-4" />
                      <span>ઓનલાઇન કાર વેલ્યુએશન મેળવો · Sell Car Online</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video sm:aspect-[4/3] bg-slate-950 group border border-slate-800">
                      <img
                        src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop"
                        alt="Sell Car with Instant Payment"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="text-[10px] uppercase font-heading font-black text-emerald-400">Instant Payment</span>
                        <h4 className="text-sm font-bold">તમારી જૂની કારની મેળવો શ્રેષ્ઠ બજાર કિંમત</h4>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'exchange' && (
                <motion.div
                  key="exchange"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-7">
                    <span className="text-xs font-heading font-black text-brand-orange uppercase tracking-wider bg-brand-orange/15 border border-brand-orange/30 px-3 py-1 rounded-full">
                      જૂની કાર આપો, નવી કાર ઘરે લાવો
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white font-heading mt-3 mb-4">
                      સ્પેશિયલ એક્સચેન્જ બોનસ સાથે <span className="text-brand-orange">Same-Day Upgrade</span>
                    </h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-body">
                      તમારી કોઈપણ કંપની કે મોડલની જૂની કાર લાવો અને તે જ દિવસે અમારા ૧૫૦+ વેરિફાઇડ કલેક્શનમાંથી તમારી મનપસંદ અપગ્રેડેડ કાર લઈ જાવ.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-200">કોઈપણ કંપનીની કાર સ્વીકાર્ય</span>
                      </div>
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-200">સ્પેશિયલ એક્સચેન્જ બોનસ</span>
                      </div>
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-200">સેમ-ડે હેન્ડઓવર ડિલિવરી</span>
                      </div>
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-200">સરળ ડિફરન્સ ફાઇનાન્સ</span>
                      </div>
                    </div>

                    <a
                      href="https://wa.me/919913634447?text=નમસ્તે,%20હું%20મારી%20જૂની%20કાર%20એક્સચેન્જ%20કરીને%20નવી%20કાર%20લેવા%20માટે%20ઓફર%20જાણવા%20માગું%20છું."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-black text-sm shadow-md transition-all hover:scale-105 active:scale-95"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>એક્સચેન્જ ઓફર્સ પૂછો · WhatsApp Exchange</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video sm:aspect-[4/3] bg-slate-950 group border border-slate-800">
                      <img
                        src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000&auto=format&fit=crop"
                        alt="Exchange Old Car for Verified Pre-Owned"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="text-[10px] uppercase font-heading font-black text-amber-300">Hassle-Free Exchange</span>
                        <h4 className="text-sm font-bold">સરળ પ્રક્રિયા સાથે સેમ-ડે કાર અપગ્રેડ</h4>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          7. SHOWROOM FACILITY & INFRASTRUCTURE (Trilok Car Bazar, Varachha)
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#070A11] via-[#090D17] to-[#070A11] border-t border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/25 text-brand-orange font-heading font-bold text-xs uppercase tracking-widest mb-3.5">
              <Building2 className="w-3.5 h-3.5 text-brand-orange" /> શોરૂમ કેમ્પસ · WORLD-CLASS FACILITY
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-heading tracking-tight leading-tight">
              ત્રિલોક કાર બજાર, વરાછા ખાતેનું અમારું <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-300 to-yellow-200">
                પ્રીમિયમ શોરૂમ ઈન્ફ્રાસ્ટ્રક્ચર
              </span>
            </h2>
            <p className="mt-3.5 text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              ગ્રાહકોને કાર પસંદગી, ઈન્સ્પેક્શન અને પારદર્શક પેપરવર્કનો બેસ્ટ અનુભવ આપવા માટે સુસજ્જ આધુનિક સુવિધાઓ:
            </p>
          </div>

          {/* Facility Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-brand-orange/40 shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-orange/15 border border-brand-orange/30 flex items-center justify-center text-brand-orange mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <CarFront className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-black text-lg text-white mb-2">
                  વિશાળ ડિસ્પ્લે એરેના
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-body">
                  ૧૫૦+ કાર એક જ સ્થળે લાઇવ ઉપલબ્ધ. SUV, Sedan, Hatchback કે લક્ઝરી – દરેક સેગમેન્ટની પસંદગી.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-bold text-amber-300">
                ૧૫૦+ કાર કેમ્પસ
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-black text-lg text-white mb-2">
                  ઓન-સાઇટ ઈન્સ્પેક્શન બે
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-body">
                  દરેક કારની અંડરબોડી, એન્જિન અને ઓબીડી કોમ્પ્યુટર ચકાસણી માટે સમર્પિત ટેકનિકલ સ્ટેશન.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-bold text-emerald-400">
                ૧૨૦+ પોઈન્ટ ટેસ્ટિંગ
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-black text-lg text-white mb-2">
                  વીઆઈપી કસ્ટમર લાઉન્જ
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-body">
                  તમારા પરિવાર સાથે આરામદાયક વાતાવરણમાં બેસી પારદર્શક પેપરવર્ક અને બેંક લોનની ચર્ચા માટે સ્પેશિયલ સુવિધા.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-bold text-blue-400">
                ફેમિલી ફ્રેન્ડલી એમ્બિયન્સ
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-black text-lg text-white mb-2">
                  પ્રાઇમ વરાછા લોકેશન
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-body">
                  સુરતમાં સૌથી પ્રખ્યાત ત્રિલોક કાર બજાર ખાતે મુખ્ય રોડ પર સરળ પહોંચ અને વિશાળ પાર્કિંગ વ્યવસ્થા.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-bold text-purple-400">
                સરળ એક્સેસ &amp; પાર્કિંગ
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          8. SOCIAL PROOF (Google Reviews & Happy Customers)
          ═════════════════════════════════════════════ */}
      <div className="bg-[#070A11] border-t border-slate-800/80">
        <GoogleReviews />
      </div>

      <div className="bg-[#070A11] border-t border-slate-800/80 pb-16">
        <HappyCustomers />
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          9. VIP SHOWROOM INVITATION CTA BANNER
          ═════════════════════════════════════════════ */}
      <section className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-950 via-[#0B0F19] to-slate-950 text-white relative overflow-hidden border-t border-amber-500/30">
        <div className="absolute top-0 right-1/3 w-[500px] h-[300px] bg-brand-orange/[0.12] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-amber-300 font-heading font-bold text-xs uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" /> સુરતમાં આજે જ મુલાકાત લો · VISIT OUR SHOWROOM
          </span>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-heading tracking-tight leading-tight">
            તમારા પરિવાર માટે શ્રેષ્ઠ કાર શોધવા માટે <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-300 to-yellow-200">
              સદગુરુ કાર મેળોની મુલાકાત લો
            </span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-300 font-medium max-w-xl mx-auto leading-relaxed">
            વરાછા, સુરત ખાતે અમારા અનુભવી સ્ટાફ તમારી સેવામાં સવારે 9:30 થી રાત્રે 8:30 સુધી હાજર છે.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
            <a
              href="tel:+919913634447"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl sm:rounded-2xl bg-brand-orange hover:bg-orange-600 text-slate-950 font-heading font-black text-sm shadow-[0_10px_25px_rgba(245,148,35,0.4)] transition-all hover:scale-105 active:scale-95"
            >
              <Phone className="w-4 h-4 text-slate-950" />
              <span>કોલ કરો: +91 99136 34447</span>
            </a>

            <a
              href="https://wa.me/919913634447?text=નમસ્તે,%20હું%20સદગુરુ%20કાર%20મેળામાંથી%20વેરિફાઇડ%20કાર%20વિશે%20માહિતી%20મેળવવા%20માગું%20છું."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl sm:rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-black text-sm shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>WhatsApp પર વાત કરો</span>
            </a>

            <a
              href="https://maps.google.com/?q=Sadguru+Car+Melo+Surat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 text-white font-heading font-bold text-sm border border-white/20 transition-all hover:scale-105 active:scale-95"
            >
              <MapPin className="w-4 h-4 text-brand-orange" />
              <span>ગૂગલ મેપ્સ ડિરેક્શન્સ</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}