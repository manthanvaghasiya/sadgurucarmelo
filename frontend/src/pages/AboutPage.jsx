import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ShieldCheck, FileText, Landmark, Tag, Star, Banknote, RefreshCw,
  CarFront, CheckCircle, Clock, SearchCheck, Award, MapPin, Zap,
  Handshake, ShieldAlert, ChevronRight, Phone, ArrowUpRight,
  Sparkles, Check, X as LucideX, Gauge, Shield, Wrench, HeartHandshake,
  Eye, Compass, Car, Building2, UserCheck, Flame, Cpu, CheckCircle2,
  Activity, ArrowRight, Quote, Heart, Coffee
} from 'lucide-react';
import GoogleReviews from '../components/GoogleReviews';
import WhatsAppIcon from '../components/WhatsAppIcon';
import SadguruStandardBento from '../components/SadguruStandardBento';
import axiosInstance from '../api/axiosConfig';
import { getOptimizedUrl } from '../utils/imageUtils';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Fallback customer delivery photos from verified deliveries & showroom
const fallbackHeroCustomers = [
  {
    _id: 'hc-1',
    customerName: 'નિકુલભાઈ (ભાવનગર)',
    carModel: 'Hyundai Creta SX',
    deliveryTag: 'Happy Delivery 🔑',
    rating: '5.0',
    location: 'ભાવનગર / સુરત',
    photo: 'https://res.cloudinary.com/dijf9umhc/image/upload/v1776927906/sadguru_cars/maqpmlzrkhwdjgfbx4qm.jpg',
    reviewText: '120-પોઇન્ટ ચેકલિસ્ટ અને RTO ફ્રી ટ્રાન્સફર સાથે ગાડી મળી. સર્વિસ ખૂબ જ ઉત્તમ.'
  },
  {
    _id: 'hc-2',
    customerName: 'સુરત અડાજણ ફેમિલી',
    carModel: 'Maruti Suzuki Dzire',
    deliveryTag: 'Family Choice 🚗',
    rating: '5.0',
    location: 'અડાજણ, સુરત',
    photo: 'https://res.cloudinary.com/dijf9umhc/image/upload/v1776927825/sadguru_cars/hrjlqzfexc1bciifiumo.jpg',
    reviewText: 'આજે જ અમારી નવી ફેમિલી કાર સદગુરુ કાર મેળામાંથી લીધી. પરિવાર ખૂબ ખુશ છે!'
  },
  {
    _id: 'hc-3',
    customerName: 'સ્વપ્નિલભાઈ (મહારાષ્ટ્ર)',
    carModel: 'Kia Seltos HTX',
    deliveryTag: 'Outstation Buyer 🌟',
    rating: '5.0',
    location: 'મહારાષ્ટ્ર / સુરત',
    photo: 'https://res.cloudinary.com/dijf9umhc/image/upload/v1776927802/sadguru_cars/ned6pwkfsldkjrr76icz.jpg',
    reviewText: 'મહારાષ્ટ્રથી ખાસ સુરત ગાડી લેવા આવ્યો. 100% જેન્યુઈન કાર અને સ્મૂથ ડીલ.'
  },
  {
    _id: 'hc-4',
    customerName: 'સાહિલભાઈ (સુરત)',
    carModel: 'Maruti Brezza ZDi',
    deliveryTag: 'Verified Quality 🏆',
    rating: '5.0',
    location: 'વરાછા, સુરત',
    photo: 'https://res.cloudinary.com/dijf9umhc/image/upload/v1776927753/sadguru_cars/pxkkqas58ukevo61kbqf.jpg',
    reviewText: 'સુરતમાં સૌથી બેસ્ટ કાર ડીલર. ગાડી એકદમ શોરૂમ કંડિશનમાં મળી.'
  },
  {
    _id: 'hc-5',
    customerName: 'પરેશભાઈ & ફેમિલી',
    carModel: 'Honda City i-VTEC',
    deliveryTag: 'Showroom Handover ✨',
    rating: '5.0',
    location: 'કાપોદ્રા, સુરત',
    photo: '/about.png',
    reviewText: '15+ વર્ષોથી સદગુરુ કાર ઉપર જ વિશ્વાસ છે. કાગળો અને RTO એકદમ ક્લિયર.'
  },
  {
    _id: 'hc-6',
    customerName: 'દિનેશભાઈ (સુરત)',
    carModel: 'Tata Nexon Fearless',
    deliveryTag: 'Certified Car 🔑',
    rating: '5.0',
    location: 'કતારગામ, સુરત',
    photo: 'https://res.cloudinary.com/dijf9umhc/image/upload/v1776927825/sadguru_cars/hrjlqzfexc1bciifiumo.jpg',
    reviewText: 'ઝીરો ડાઉન પેમેન્ટ અને તે જ દિવસે બેંક લોન સેટલ થઈ ગઈ.'
  }
];

// Pinterest-style perspective smile cradle arc transforms
const arcCardConfigs = [
  {
    rotation: '-rotate-[5deg]',
    translate: '-translate-y-2 lg:-translate-y-3',
    hover: 'hover:rotate-0 hover:-translate-y-6 hover:scale-105 hover:z-30 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.28)]',
  },
  {
    rotation: '-rotate-[2.5deg]',
    translate: 'translate-y-2 lg:translate-y-3',
    hover: 'hover:rotate-0 hover:-translate-y-4 hover:scale-105 hover:z-30 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.28)]',
  },
  {
    rotation: '-rotate-[0.8deg]',
    translate: 'translate-y-7 lg:translate-y-9',
    hover: 'hover:rotate-0 hover:translate-y-1 hover:scale-105 hover:z-30 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.28)]',
  },
  {
    rotation: 'rotate-[0.8deg]',
    translate: 'translate-y-7 lg:translate-y-9',
    hover: 'hover:rotate-0 hover:translate-y-1 hover:scale-105 hover:z-30 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.28)]',
  },
  {
    rotation: 'rotate-[2.5deg]',
    translate: 'translate-y-2 lg:translate-y-3',
    hover: 'hover:rotate-0 hover:-translate-y-4 hover:scale-105 hover:z-30 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.28)]',
  },
  {
    rotation: 'rotate-[5deg]',
    translate: '-translate-y-2 lg:-translate-y-3',
    hover: 'hover:rotate-0 hover:-translate-y-6 hover:scale-105 hover:z-30 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.28)]',
  },
];

export default function AboutPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read service from URL or default to 'buy'
  const initialService = searchParams.get('service') || 'buy';
  const [activeTab, setActiveTab] = useState(initialService);

  // Stacking deck ref & scroll transforms for Core Dealership Services
  const serviceDeckRef = useRef(null);
  const { scrollYProgress: deckScrollYProgress } = useScroll({
    target: serviceDeckRef,
    offset: ['start start', 'end end'],
  });

  const card0Scale = useTransform(deckScrollYProgress, [0.1, 0.45, 0.8], [1, 0.96, 0.92]);
  const card0Dim = useTransform(deckScrollYProgress, [0.15, 0.5], [0, 0.08]);

  const card1Scale = useTransform(deckScrollYProgress, [0.45, 0.85], [1, 0.96]);
  const card1Dim = useTransform(deckScrollYProgress, [0.55, 0.88], [0, 0.06]);

  // Hero section Happy Customers state
  const [heroCustomers, setHeroCustomers] = useState(fallbackHeroCustomers);
  const [selectedCustomerModal, setSelectedCustomerModal] = useState(null);

  // Fetch real happy customer photos from API
  useEffect(() => {
    const fetchHeroCustomers = async () => {
      try {
        const res = await axiosInstance.get('/happy-customers');
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const apiList = res.data.data;
          const merged = fallbackHeroCustomers.map((fallback, idx) => {
            if (apiList[idx]) {
              return {
                ...fallback,
                _id: apiList[idx]._id,
                customerName: apiList[idx].customerName || fallback.customerName,
                photo: apiList[idx].photo || fallback.photo,
                reviewText: apiList[idx].reviewText || fallback.reviewText
              };
            }
            return fallback;
          });
          setHeroCustomers(merged);
        }
      } catch (err) {
        console.warn('Could not fetch hero customers:', err);
      }
    };
    fetchHeroCustomers();
  }, []);

  // Sync state and scroll if URL changes
  useEffect(() => {
    const serviceFromUrl = searchParams.get('service');
    if (serviceFromUrl && ['buy', 'sell', 'exchange'].includes(serviceFromUrl)) {
      const timer = setTimeout(() => {
        setActiveTab(serviceFromUrl);
        const el = document.getElementById(`service-card-${serviceFromUrl}`);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Auto-sync activeTab with the card currently in viewport
  useEffect(() => {
    const handleScrollSpy = () => {
      const cardIds = ['exchange', 'sell', 'buy'];
      for (const id of cardIds) {
        const anchor = document.getElementById(`service-anchor-${id}`) || document.getElementById(`service-card-${id}`);
        if (anchor) {
          const rect = anchor.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveTab(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ service: tabId }, { replace: true });
    const anchor = document.getElementById(`service-anchor-${tabId}`) || document.getElementById(`service-card-${tabId}`);
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const tabs = [
    { id: 'buy', label: 'કાર ખરીદો', engLabel: 'Buy Verified Car', icon: CarFront, badge: '150+ કાર' },
    { id: 'sell', label: 'કાર વેચો', engLabel: 'Sell with Instant Pay', icon: Banknote, badge: 'ઇન્સ્ટન્ટ પેમેન્ટ' },
    { id: 'exchange', label: 'એક્સચેન્જ', engLabel: 'Trade-in Upgrade', icon: RefreshCw, badge: 'બેસ્ટ બોનસ' },
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  // The Sadguru Promise & Standard - 4 Top-Tier Pillars (Agency Grade Architectural Grid)
  // ─────────────────────────────────────────────────────────────────────────────
  const [activePromiseModal, setActivePromiseModal] = useState(null);

  const sadguruStandardPillars = [
    {
      id: 'inspection',
      code: '01 / GUARANTEE',
      badge: '100% Mechanical Pass',
      liveBadge: '120+ Points Pass',
      categoryTag: 'Quality Lab',
      title: '100% Inspection Guarantee',
      gujSub: 'કડક ક્વોલિટી કંટ્રોલ અને પ્રમાણિકતા',
      description: 'દરેક કારને નિષ્ણાતો દ્વારા ચેક કરવામાં આવે છે જેથી તમને 100% Mechanical પરફેક્શન મળે.',
      icon: ShieldCheck,
      image: '/inspection_lab.jpg',
      accentBorder: 'hover:border-amber-500/60 hover:shadow-[0_20px_40px_rgba(245,148,35,0.18)]',
      iconContainer: 'bg-amber-500/10 text-brand-orange border border-amber-500/20',
      badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200/80',
      specs: [
        { label: 'ટેસ્ટિંગ સ્ટાન્ડર્ડ', value: '120+ પોઈન્ટ સઘન તપાસ' },
        { label: 'લેબ સર્ટિફિકેટ', value: '100% પાસ ગેરંટી' }
      ],
      checkpoints: [
        '120+ પોઈન્ટ સઘન ટેકનિકલ લેબ & રોડ ટેસ્ટિંગ',
        '100% નોન-એક્સિડેન્ટલ ચેસીસ અને ફ્રેમ સર્ટિફિકેશન',
        'ડિજિટલ OBD-II સ્કેન & જેન્યુઇન ઓરિજિનલ કિલોમીટર'
      ],
      detailedFeatures: [
        'હાઇડ્રોલિક લિફ્ટ પર અંડરબોડી ચેસીસ & સસ્પેન્શન ચેક',
        'ડિજિટલ પેઇન્ટ ગેજ વડે 100% નોન-એક્સિડેન્ટલ વેરિફિકેશન',
        'ઓન-બોર્ડ ઈલેક્ટ્રોનિક્સ & એન્જિન સેન્સર્સ સ્કેનિંગ',
        'ગ્રાહકને સંતોષ માટે સંપૂર્ણ પારદર્શક હેલ્થ રિપોર્ટ'
      ],
      modalSpecs: [
        { label: 'ડાયગ્નોસ્ટિક્સ', value: 'OBD-II કમ્પ્યુટર સ્કેનર' },
        { label: 'લિફ્ટ સિસ્ટમ', value: 'હાઇડ્રોલિક ટ્વિન રેમ' },
        { label: 'ટેકનિકલ ટીમ', value: 'સર્ટિફાઇડ ઓટો એન્જિનિયર્સ' },
        { label: 'રિપોર્ટિંગ', value: '100% ડિજિટલ ચેકશીટ' }
      ]
    },
    {
      id: 'rc-transfer',
      code: '02 / LEGAL',
      badge: '100% Free RTO Transfer',
      liveBadge: '100% Free RTO',
      categoryTag: 'Legal Ownership',
      title: 'ઝડપી RC Transfer',
      gujSub: 'કાગળની કાર્યવાહીની ઝંઝટમાંથી મુક્તિ',
      description: 'કાગળની કાર્યવાહીની ઝંઝટમાંથી મુક્તિ. અમે તમામ Documentation ઝડપથી અને સંપૂર્ણ પારદર્શક રીતે પૂર્ણ કરીએ છીએ.',
      icon: FileText,
      image: '/delivery_lounge.jpg',
      accentBorder: 'hover:border-sky-500/60 hover:shadow-[0_20px_40px_rgba(14,165,233,0.18)]',
      iconContainer: 'bg-sky-500/10 text-sky-600 border border-sky-500/20',
      badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200/80',
      specs: [
        { label: 'આરટીઓ પ્રોસેસિંગ', value: '100% મફત સેવા' },
        { label: 'સમયમર્યાદા', value: '3-5 દિવસમાં હેન્ડઓવર' }
      ],
      checkpoints: [
        '100% ફ્રી & ઝડપી આરસી માલિકી ટ્રાન્સફર',
        'ક્લીન ટાઇટલ, નો-હાઈપોથેકેશન & લીગલ RTO NOC',
        'તમામ Documentation અમારી ટીમ દ્વારા પૂર્ણ કરવામાં આવે છે'
      ],
      detailedFeatures: [
        'સુરત RTO કચેરીની કાનૂની માલિકી ફેરબદલની સંપૂર્ણ જવાબદારી',
        'પોલીસ વેરિફિકેશન અને ચલણ ક્લિયરન્સ સર્ટિફિકેટ',
        'ઓરિજિનલ સ્માર્ટ કાર્ડ આરસી સીધા તમારા સરનામે',
        'ગ્રાહકને સરકારી કચેરીઓના ધક્કા ખાવામાંથી 100% મુક્તિ'
      ],
      modalSpecs: [
        { label: 'આરટીઓ ફી', value: '₹0 (ગ્રાહક માટે મફત)' },
        { label: 'કાનૂની ટાઇટલ', value: '100% ક્લીન & વેરિફાઇડ' },
        { label: 'NOC સ્ટેટસ', value: 'તમામ બેંક ક્લિયર' },
        { label: 'સપોર્ટ', value: 'ડેડિકેટેડ RTO એક્ઝિક્યુટિવ' }
      ]
    },
    {
      id: 'loan-approvals',
      code: '03 / FINANCE',
      badge: 'Lowest Interest Rates',
      liveBadge: 'Instant Sanction',
      categoryTag: 'Banking Tie-up',
      title: 'સરળ Loan Approvals',
      gujSub: 'ટોચની રાષ્ટ્રીય બેંકો સાથે સીધું જોડાણ',
      description: 'Top Banks સાથેના જોડાણને કારણે અમે તમને સૌથી ઓછા Interest Rates અને ઝડપી Loan ની સુવિધા આપીએ છીએ.',
      icon: Landmark,
      image: '/showroom_lounge.jpg',
      accentBorder: 'hover:border-purple-500/60 hover:shadow-[0_20px_40px_rgba(168,85,247,0.18)]',
      iconContainer: 'bg-purple-500/10 text-purple-600 border border-purple-500/20',
      badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200/80',
      specs: [
        { label: 'બેંક પાર્ટનર્સ', value: 'SBI, HDFC, ICICI, Axis' },
        { label: 'ડાઉન પેમેન્ટ', value: '0% સુધી સરળ સુવિધા' }
      ],
      checkpoints: [
        'SBI, HDFC, ICICI, Axis અને Bank of Baroda સાથે જોડાણ',
        '0 ડાઉન પેમેન્ટ અને 100% સુધી સરળ લોન સુવિધા',
        'ન્યૂનતમ દસ્તાવેજો સાથે ઝડપી ઇન-પ્રિન્સિપલ લોન મંજૂરી'
      ],
      detailedFeatures: [
        'સ્થળ પર જ માત્ર 30 મિનિટમાં લોનની પ્રાથમિક મંજૂરી',
        'ગ્રાહકના સિવિલ સ્કોર મુજબ સૌથી ઓછો સંભવિત વ્યાજદર',
        'ન્યૂનતમ દસ્તાવેજીકરણ અને સરળ પેપરલેસ પ્રક્રિયા',
        'ફ્લેક્સિબલ EMI ટેન્યોર (12 થી 84 મહિના સુધી)'
      ],
      modalSpecs: [
        { label: 'લોન મંજૂરી', value: 'ઇન્સ્ટન્ટ 30 મિનિટ' },
        { label: 'વ્યાજદર', value: 'સૌથી સ્પર્ધાત્મક (Lowest Rate)' },
        { label: 'ફાઇનાન્સિંગ', value: '100% ઓન-રોડ સુધી' },
        { label: 'ડોક્યુમેન્ટ્સ', value: 'બેઝિક KYC & આવક પુરાવો' }
      ]
    },
    {
      id: 'transparent-pricing',
      code: '04 / TRUST',
      badge: '₹0 Hidden Fees',
      liveBadge: 'Zero Hidden Cost',
      categoryTag: 'Zero Brokerage',
      title: '100% Transparent Pricing',
      gujSub: 'સંપૂર્ણ પારદર્શિતા (Transparency)',
      description: 'કોઈ Hidden Fees નહીં. તમે જે જુઓ છો તે જ તમારે ચૂકવવાનું રહે છે, સંપૂર્ણ પારદર્શિતા (Transparency) સાથે.',
      icon: Tag,
      image: '/showroom_arena.jpg',
      accentBorder: 'hover:border-emerald-500/60 hover:shadow-[0_20px_40px_rgba(16,185,129,0.18)]',
      iconContainer: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
      badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      specs: [
        { label: 'બ્રોકરેજ ફી', value: '₹0 (Zero Brokerage)' },
        { label: 'ઇન્વૉઇસ', value: '100% આઇટમાઇઝ્ડ બિલ' }
      ],
      checkpoints: [
        'ખરીદનાર અને વેચનાર બંને માટે ઝીરો બ્રોકરેજ અથવા કમિશન',
        'દરેક વાહનનું 100% પારદર્શક અને આઇટમાઇઝ્ડ પ્રાઇસિંગ',
        'તમે જે જુઓ છો તે જ ફાઇનલ કિંમત ચૂકવવાની રહે છે'
      ],
      detailedFeatures: [
        'કોઈ પણ પ્રકારની છૂપી દલાલી કે અઘોષિત કમિશન લેવામાં આવતું નથી',
        'દરેક કારનું સ્પષ્ટ બિલિંગ અને કાનૂની GST રસીદ',
        'ઓન-પેપર ફેસ વેલ્યુ ડીલિંગ, જે જુઓ છો તે જ ફાઇનલ કિંમત',
        'સંપૂર્ણ પારદર્શિતા સાથે સુરતના પરિવારોનો 15+ વર્ષોનો અતૂટ સંતોષ'
      ],
      modalSpecs: [
        { label: 'બ્રોકરેજ', value: '₹0 (ઝીરો કમિશન)' },
        { label: 'છૂપા ચાર્જ', value: 'બિલકુલ નહીં (0%)' },
        { label: 'બિલિંગ', value: 'ઓરિજિનલ ટેક્સ ઇન્વૉઇસ' },
        { label: 'પ્રાઇસિંગ ગેરંટી', value: '100% ઓન-પેપર ફેર વેલ્યુ' }
      ]
    }
  ];

  return (
    <div className="flex flex-col flex-grow min-h-screen bg-[#f8fafc] text-slate-800 font-body selection:bg-brand-orange selection:text-white">
      <Helmet>
        <title>About Sadguru Car Surat — Surat's Premier Certified Pre-Owned Showroom Since 2011</title>
        <meta name="description" content="Discover Sadguru Car Surat — Surat's most reputable certified pre-owned showroom since 2011. 15+ years of trust, 150+ inspected cars, 120-point quality check, and 5000+ happy families." />
        <meta property="og:title" content="About Sadguru Car Surat — 15+ Years of Automotive Trust in Surat" />
        <meta property="og:description" content="Surat's leading certified pre-owned car showroom. 150+ verified vehicles, 120-point inspection, zero hidden charges." />
      </Helmet>

      {/* ═════════════════════════════════════════════════════════════════════
          1. PINTEREST-INSPIRED LUXURY HERO WITH CURVED HAPPY CUSTOMER SHOWCASE
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#FAF8F5] pt-14 sm:pt-18 md:pt-22 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden border-b border-slate-200/80">
        {/* Soft Warm Luxury Ambient Radiance Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-[radial-gradient(ellipse_75%_55%_at_50%_0%,rgba(245,148,35,0.12),transparent_70%)] pointer-events-none" />
        <div className="absolute -top-28 -left-28 w-96 h-96 bg-amber-100/50 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -top-28 -right-28 w-96 h-96 bg-orange-100/40 rounded-full blur-[130px] pointer-events-none" />

        {/* Subtle Luxury Pattern Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_50%,transparent_100%)] pointer-events-none" />

        {/* ── Left Doodle Annotation (Pinterest agency sketch style) ── */}
        <div className="hidden xl:flex absolute left-6 2xl:left-14 top-24 flex-col items-center pointer-events-none select-none z-10">
          <span className="font-script text-2xl lg:text-[28px] text-slate-700 -rotate-6 tracking-wide drop-shadow-sm font-bold">
            5,000+ Happy Families ✨
          </span>
          <svg className="w-20 h-16 text-slate-600/70 mt-1 -rotate-6" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M 25 15 Q 55 25 75 62" />
            <path d="M 64 56 L 75 62 L 73 48" />
          </svg>
        </div>

        {/* ── Right Doodle Annotation (Pinterest agency sketch style) ── */}
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

          {/* Action CTAs & Doodle Annotation */}
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
                href="https://maps.google.com/?q=Sadguru+Car+Melo+Surat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/95 hover:bg-white text-slate-800 font-heading font-bold text-sm sm:text-base border border-slate-300 shadow-sm hover:shadow-md hover:border-slate-400 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
              >
                <MapPin className="w-4 h-4 text-brand-orange" />
                <span>શોરૂમ લોકેશન · Showroom Visit</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Under-Button Doodle Annotation (Pinterest pin "It's free" style) */}
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

        {/* ── THE SIGNATURE PINTEREST-STYLE CURVED SMILE ARC SHOWCASE ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 sm:mt-14 max-w-7xl mx-auto relative z-10"
        >
          {/* Desktop & Tablet Curved Smile Arc Fan */}
          <div className="hidden md:flex justify-center items-center gap-3 lg:gap-4 xl:gap-5 px-2 overflow-visible pt-4 pb-8">
            {heroCustomers.slice(0, 6).map((customer, idx) => {
              const config = arcCardConfigs[idx] || arcCardConfigs[0];
              return (
                <div
                  key={customer._id || idx}
                  onClick={() => setSelectedCustomerModal(customer)}
                  className={`group relative shrink-0 w-44 sm:w-48 lg:w-52 xl:w-56 aspect-[4/5] rounded-[24px] lg:rounded-[28px] overflow-hidden cursor-pointer bg-slate-900 border-2 border-white shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${config.rotation} ${config.translate} ${config.hover}`}
                >
                  {/* Customer Delivery Photo */}
                  <img
                    src={getOptimizedUrl(customer.photo, 600)}
                    alt={customer.customerName}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Vignette Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-black/15 pointer-events-none transition-opacity duration-300 group-hover:opacity-75" />

                  {/* Top Pill Badges */}
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

                  {/* Hover Quote Preview Accent */}
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
                  onClick={() => setSelectedCustomerModal(customer)}
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

      {/* Customer Delivery Modal */}
      <AnimatePresence>
        {selectedCustomerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCustomerModal(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100"
            >
              <button
                onClick={() => setSelectedCustomerModal(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <LucideX className="w-5 h-5" />
              </button>

              <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
                <img
                  src={getOptimizedUrl(selectedCustomerModal.photo, 800)}
                  alt={selectedCustomerModal.customerName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-brand-orange text-white text-xs font-black tracking-wider uppercase shadow-md">
                  {selectedCustomerModal.deliveryTag}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading font-black text-xl text-slate-900">
                    {selectedCustomerModal.customerName}
                  </h3>
                  <div className="flex items-center gap-1 text-amber-500 font-black text-sm">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>5.0</span>
                  </div>
                </div>
                <p className="text-xs text-brand-orange font-bold uppercase tracking-wider mb-4">
                  {selectedCustomerModal.carModel} · {selectedCustomerModal.location}
                </p>
                {selectedCustomerModal.reviewText && (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 relative">
                    <Quote className="w-5 h-5 text-brand-orange/40 mb-1" />
                    <p className="text-slate-700 font-medium italic text-sm leading-relaxed">
                      "{selectedCustomerModal.reviewText}"
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* ═════════════════════════════════════════════════════════════════════
          3. HERITAGE & FOUNDER NARRATIVE (Clean White & Warm Cream)
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">

          {/* Left Column: Visual Gallery Showcase Frame */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeInUp}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl p-3 bg-gradient-to-b from-amber-200/60 via-slate-100 to-amber-300/40 shadow-xl border border-slate-200/80">
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 h-[380px] sm:h-[480px]">
                <img
                  src="/showroom_lounge.jpg"
                  alt="Sadguru Car Surat Showroom Experience"
                  className="w-full h-full object-cover select-none hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
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
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-heading font-bold text-xs uppercase tracking-widest w-fit mb-4">
              <Sparkles className="w-3.5 h-3.5 text-brand-orange" /> અમારો વારસો · THE SADGURU LEGACY
            </motion.div>

            <motion.h2 variants={fadeInUp} className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.18] font-heading tracking-tight mb-5">
              માત્ર એક કાર મેળો નહીં, સુરતના પરિવારોનો <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">
                દાયકાઓ જૂનો ભરોસો
              </span>
            </motion.h2>

            <motion.div variants={fadeInUp} className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed font-body">
              <p>
                વર્ષ <b className="text-slate-900 font-heading">2011</b> માં વરાછા, સુરત ખાતે જ્યારે સદગુરુ કાર મેળોની સ્થાપના થઈ, ત્યારે અમારો એક જ દ્રઢ સંકલ્પ હતો: <span className="text-slate-900 font-semibold">"પ્રી-ઓન્ડ કાર ખરીદવી એ નવી કાર ખરીદવા જેટલું જ ગૌરવપૂર્ણ, સુરક્ષિત અને પારદર્શક હોવું જોઈએ."</span>
              </p>
              <p>
                સામાન્ય બ્રોકરો કે અનઓર્ગેનાઈઝ્ડ બજારથી વિપરીત, અમે સુરતમાં એક એવું મોડેલ ઊભું કર્યું જ્યાં દરેક કાર <b className="text-slate-900 font-heading">120+ પોઈન્ટ ટેકનિકલ ઈન્સ્પેક્શન</b> પાસ કર્યા પછી જ ડિસ્પ્લે થાય છે. કોઈ મીટર ટેમ્પરિંગ નહીં, કોઈ છૂપા ખર્ચા નહીં અને કોઈ અનિશ્ચિતતા નહીં.
              </p>
            </motion.div>

            {/* Founder Quote Card */}
            <motion.div variants={fadeInUp} className="mt-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-amber-50/80 border border-amber-200 shadow-sm relative overflow-hidden">
              <div className="flex items-start gap-3.5">
                <span className="text-4xl text-brand-orange font-serif leading-none select-none">“</span>
                <div>
                  <p className="text-xs sm:text-sm text-slate-800 font-heading font-medium italic leading-relaxed">
                    જ્યારે કોઈ પરિવાર પોતાની બચતમાંથી કાર ખરીદે છે, ત્યારે એ માત્ર કાર નથી હોતી, એમના સપના હોય છે. અમે એ સપનાને 100% સાચો, સુરક્ષિત અને પ્રમાણિક ઓટોમોટિવ સપોર્ટ આપવા માટે બંધાયેલા છીએ.
                  </p>
                  <div className="mt-3.5 flex items-center justify-between border-t border-amber-200/80 pt-2.5">
                    <div>
                      <p className="text-xs font-heading font-bold text-slate-900">સદગુરુ કાર મેળો ટીમ</p>
                      <p className="text-[10px] text-slate-500">ત્રિલોક કાર બજાર, વરાછા, સુરત</p>
                    </div>
                    <span className="text-[10px] font-bold text-brand-orange bg-brand-orange/15 px-2.5 py-1 rounded-full border border-brand-orange/30">
                      Trusted Showroom
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 3 Core Trust Badges */}
            <motion.div variants={fadeInUp} className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-heading font-black text-slate-800">100% નોન-એક્સિડેન્ટલ</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <Gauge className="w-5 h-5 text-brand-orange shrink-0" />
                <span className="text-xs font-heading font-black text-slate-800">ઓરિજિનલ કિલોમીટર</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-xs font-heading font-black text-slate-800">100% ફ્રી RTO ટ્રાન્સફર</span>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          4. THE SADGURU DIFFERENCE: Traditional Broker vs Sadguru Verified
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-heading font-bold text-xs uppercase tracking-widest mb-3.5">
              <Compass className="w-3.5 h-3.5 text-brand-orange" /> શા માટે સદગુરુ કાર મેળો? · THE UNFAIR ADVANTAGE
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 font-heading tracking-tight leading-tight">
              સામાન્ય બ્રોકર vs <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">સદગુરુ વેરિફાઇડ કાર</span>
            </h2>
            <p className="mt-3.5 text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              સુરતમાં વપરાયેલી કાર લેતી વખતે ગ્રાહકો સાથે થતી સામાન્ય છેતરપિંડીઓથી બચો. જુઓ અમારો સ્પષ્ટ તફાવત:
            </p>
          </div>

          {/* Comparison Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {/* Card 1: Traditional Broker */}
            <div className="bg-red-50/50 p-6 sm:p-8 rounded-3xl border border-red-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-red-400" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-heading font-black text-red-600 uppercase tracking-wider bg-red-100/80 px-3 py-1 rounded-full border border-red-200">
                    સામાન્ય બજાર / લોકલ બ્રોકર
                  </span>
                  <span className="text-xs text-slate-500 font-bold">Unorganized Broker</span>
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-black text-slate-900 mb-5">
                  અનિશ્ચિતતા અને ઊંચા જોખમો
                </h3>

                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600">
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

              <div className="mt-8 pt-4 border-t border-red-200/60 text-center">
                <span className="text-xs font-semibold text-red-600">❌ ગ્રાહક માટે માનસિક તણાવ અને નાણાકીય જોખમ</span>
              </div>
            </div>

            {/* Card 2: Sadguru Verified Experience */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-brand-orange/60 shadow-[0_15px_40px_rgba(245,148,35,0.15)] relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-brand-orange via-amber-400 to-yellow-400" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-heading font-black text-slate-950 uppercase tracking-wider bg-gradient-to-r from-brand-orange to-amber-400 px-3 py-1 rounded-full shadow-sm">
                    સદગુરુ કાર મેળો (Sadguru Verified)
                  </span>
                  <span className="text-xs text-brand-orange font-bold">100% Certified</span>
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-black text-slate-900 mb-5">
                  સંપૂર્ણ સુરક્ષા, ગેરંટી અને શાંતિ (Peace of Mind)
                </h3>

                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><b>120+ પોઈન્ટ ટેકનિકલ ઈન્સ્પેક્શન:</b> દરેક કાર નિષ્ણાતો દ્વારા સંપૂર્ણ ટેસ્ટ પાસ કરેલી હોય છે.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><b>100% જેન્યુઇન ઓરિજિનલ કિલોમીટર:</b> OBD સ્કેન અને ડીલર સર્વિસ હિસ્ટ્રી સાથે સચોટ ખાતરી.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><b>100% ફ્રી &amp; ઝડપી RTO ટ્રાન્સફર:</b> કાનૂની માલિકી ફેરબદલની સંપૂર્ણ જવાબદારી અમારી.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><b>ઝીરો હિડન ચાર્જ &amp; ફિક્સ્ડ વાજબી ભાવ:</b> કોઈ બ્રોકરેજ કે કમિશન નહીં, 100% પારદર્શક વ્યવહાર.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><b>તમામ બેંકો દ્વારા 0 ડાઉન પેમેન્ટ લોન:</b> એક્સચેન્જ બોનસ અને સેમ-ડે ડિલિવરી સુવિધા.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 text-center">
                <span className="text-xs font-bold text-brand-orange">✅ 100% સેફ ડીલિંગ અને સુરતના 5,000+ પરિવારોનો વિશ્વાસ</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          5. CORE DEALERSHIP SERVICES (Brandappart Stacking Card Deck - Light Mode)
          ═════════════════════════════════════════════════════════════════════ */}
      <section id="core-services" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] text-slate-800 relative scroll-mt-20 border-t border-slate-200/80 overflow-hidden">
        {/* Soft Warm Luxury Ambient Radiance */}
        <div className="absolute top-0 right-1/4 w-[650px] h-[350px] bg-gradient-to-br from-amber-200/25 via-brand-orange/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[320px] bg-gradient-to-tl from-emerald-100/25 to-transparent rounded-full blur-[120px] pointer-events-none" />

        {/* Subtle Architectural Grid Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/25 text-brand-orange font-heading font-black text-xs uppercase tracking-widest mb-4 shadow-xs"
            >
              <Zap className="w-3.5 h-3.5 text-brand-orange" />
              <span>અમારી મુખ્ય સેવાઓ · CORE SERVICES</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-950 font-heading tracking-tight leading-[1.15]"
            >
              કારને લગતી દરેક સેવા{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">
                એક જ છત નીચે
                <svg
                  className="absolute -bottom-2 sm:-bottom-3.5 left-0 w-full h-3 sm:h-4 text-brand-orange overflow-visible pointer-events-none"
                  viewBox="0 0 160 20"
                  fill="none"
                >
                  <path
                    d="M3 9C45 19 115 19 157 8"
                    stroke="currentColor"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed font-body"
            >
              ખરીદીથી લઈને વેચાણ અને એક્સચેન્જ સુધીની સંપૂર્ણ આધુનિક ઓટોમોટિવ સર્વિસિસ. સ્ક્રોલ કરતાં કાર્ડ્સ એકબીજા પર સ્ટેક થાય છે.
            </motion.p>
          </div>

          {/* Sticky Quick-Jump Nav Bar (Light Glassmorphic) */}
          <div className="sticky top-20 z-40 flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 max-w-xl mx-auto p-1.5 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            {tabs.map((tab, idx) => {
              const TabIcon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative flex-1 py-2.5 px-3 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${isSelected ? 'text-white shadow-md' : 'text-slate-600 hover:text-slate-950'
                    }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeAboutServiceTab"
                      className="absolute inset-0 bg-slate-950 rounded-xl"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                    <TabIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isSelected ? 'text-brand-orange' : 'text-slate-400'}`} />
                    <span className="whitespace-nowrap font-mono text-[11px] opacity-75 mr-0.5">[{idx + 1}]</span>
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* ─────────────────────────────────────────────────────────────────
              Brandappart Stacking Card Deck (Shared Relative Container)
              Each card sticks at sequential offsets and layers over the previous card
              ───────────────────────────────────────────────────────────────── */}
          <div ref={serviceDeckRef} className="relative pb-16 sm:pb-24">

            <div id="service-anchor-buy" className="scroll-mt-28" />
            {/* ── CARD 0: [1] કાર ખરીદો (BUY) ── */}
            <motion.div
              id="service-card-buy"
              style={{
                top: 'clamp(72px, 8vh, 88px)',
                scale: card0Scale,
                transformOrigin: 'top center',
                zIndex: 10,
              }}
              className="sticky rounded-[28px] sm:rounded-[36px] md:rounded-[42px] bg-white border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.08)] p-6 sm:p-8 lg:p-10 overflow-hidden transition-all duration-300 relative"
            >
              {/* Subtle Dimming when covered */}
              <motion.div
                style={{ opacity: card0Dim }}
                className="absolute inset-0 bg-slate-950 pointer-events-none rounded-[inherit] z-20"
              />

              {/* Top Accent Hairline */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-orange via-amber-400 to-yellow-400" />

              {/* Folder Top Tab Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-100 relative z-10">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-black text-brand-orange tracking-widest uppercase bg-brand-orange/10 px-3 py-1 rounded-full border border-brand-orange/25">
                    [01 / BUY]
                  </span>
                  <span className="text-xs sm:text-sm font-heading font-black text-slate-800">
                    પ્રીમિયમ વેરિફાઇડ કાર ખરીદો
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-heading font-black">
                    150+ લાઈવ સ્ટોક
                  </span>
                </div>
              </div>

              {/* Main Headline & Description */}
              <div className="mb-6 relative z-10">
                <h3 className="text-2xl sm:text-4xl lg:text-[42px] font-black font-heading text-slate-950 tracking-tight leading-tight">
                  100% ભરોસા સાથે <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">Dream Car</span> ખરીદો
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm md:text-base text-slate-600 font-medium leading-relaxed font-body max-w-3xl">
                  Pre-owned ખરીદવી હવે ચિંતાનો વિષય નથી. અમે તમને સંપૂર્ણ પારદર્શક અને Premium Buying Experience આપીએ છીએ. દરેક વાહન કડક 120-પોઇન્ટ ગુણવત્તા તપાસ પાસ કર્યા પછી જ ડિસ્પ્લે થાય છે.
                </p>
              </div>

              {/* Quick Spec Pills */}
              <div className="flex flex-wrap gap-2 mb-7 relative z-10">
                {[
                  '110-Point Inspection',
                  '100% Non-Accidental',
                  'Zero Downpayment',
                  '150+ Premium Stock',
                  'Hassle-Free RC Transfer',
                  'After-Sales Support'
                ].map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] sm:text-xs font-heading font-bold text-slate-700 hover:bg-orange-50 hover:border-orange-200 transition-colors"
                  >
                    • {tag}
                  </span>
                ))}
              </div>

              {/* 2-Column Split: Feature Grid & Cinematic Photo */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative z-10">
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-orange-50/40 hover:border-brand-orange/30 transition-all shadow-xs group">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <h4 className="text-xs font-heading font-black text-slate-900 group-hover:text-brand-orange transition-colors">110-Point Inspection</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 font-body leading-relaxed pl-6">
                        બમ્પરથી બમ્પર સુધી Mechanical પરફેક્શન માટે કડક ટેસ્ટિંગ.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-orange-50/40 hover:border-brand-orange/30 transition-all shadow-xs group">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <h4 className="text-xs font-heading font-black text-slate-900 group-hover:text-brand-orange transition-colors">Non-Accidental</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 font-body leading-relaxed pl-6">
                        સ્ટ્રક્ચરલ મજબૂતાઈ અને 100% Genuine હિસ્ટ્રીની ખાતરી.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-orange-50/40 hover:border-brand-orange/30 transition-all shadow-xs group">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <h4 className="text-xs font-heading font-black text-slate-900 group-hover:text-brand-orange transition-colors">Zero Downpayment</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 font-body leading-relaxed pl-6">
                        100% સુધી સરળ અને Fast-track ફાઇનાન્સિંગ ઓપ્શન્સ.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-orange-50/40 hover:border-brand-orange/30 transition-all shadow-xs group">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <h4 className="text-xs font-heading font-black text-slate-900 group-hover:text-brand-orange transition-colors">150+ Premium Cars</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 font-body leading-relaxed pl-6">
                        સુરતમાં સૌથી મોટું અને શ્રેષ્ઠ Premium કાર્સનું કલેક્શન.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-orange-50/40 hover:border-brand-orange/30 transition-all shadow-xs group">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <h4 className="text-xs font-heading font-black text-slate-900 group-hover:text-brand-orange transition-colors">Hassle-Free RC</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 font-body leading-relaxed pl-6">
                        કાગળની કાર્યવાહીની સંપૂર્ણ જવાબદારી અમારી, જેથી તમને મળે શાંતિ.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-orange-50/40 hover:border-brand-orange/30 transition-all shadow-xs group">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <h4 className="text-xs font-heading font-black text-slate-900 group-hover:text-brand-orange transition-colors">After-Sales Support</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 font-body leading-relaxed pl-6">
                        કાર ખરીદ્યા પછી પણ સર્વિસ અને કોઈપણ સહાયતા માટે ટીમ તૈયાર.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to="/inventory"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl sm:rounded-2xl bg-slate-950 hover:bg-brand-orange text-white font-heading font-black text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Car className="w-4 h-4 text-brand-orange group-hover:text-white" />
                      <span>સંપૂર્ણ ઇન્વેન્ટરી જુઓ · View All 150+ Cars</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <a
                      href="https://wa.me/919913634447?text=નમસ્તે,%20હું%20સદગુરુ%20કાર%20મેળામાંથી%20વેરિફાઇડ%20કાર%20ખરીદવા%20માટે%20માહિતી%20મેળવવા%20માગું%20છું."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-heading font-bold text-xs sm:text-sm border border-slate-300 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>WhatsApp કન્સલ્ટેશન</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg aspect-[16/10] lg:aspect-auto lg:h-full min-h-[220px] bg-slate-900 border border-slate-200 group">
                    <img
                      src="https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1000&auto=format&fit=crop"
                      alt="Buy Verified Car in Surat"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[10px] uppercase font-mono font-bold text-amber-300 tracking-wider">
                        CERTIFIED INVENTORY
                      </span>
                      <h4 className="text-sm sm:text-base font-heading font-bold">સુરતનું સૌથી વિશ્વસનીય વેરિફાઇડ શોરૂમ</h4>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Scroll Spacer between Card 0 and Card 1 */}
            <div className="h-[28vh] sm:h-[36vh] pointer-events-none" />

            <div id="service-anchor-sell" className="scroll-mt-28" />
            {/* ── CARD 1: [2] કાર વેચો (SELL) ── */}
            <motion.div
              id="service-card-sell"
              style={{
                top: 'calc(clamp(72px, 8vh, 88px) + clamp(42px, 5vh, 48px))',
                scale: card1Scale,
                transformOrigin: 'top center',
                zIndex: 20,
              }}
              className="sticky rounded-[28px] sm:rounded-[36px] md:rounded-[42px] bg-white border border-slate-200/90 shadow-[0_25px_60px_-12px_rgba(15,23,42,0.14),0_8px_20px_-4px_rgba(15,23,42,0.08),0_-3px_8px_rgba(15,23,42,0.02)] p-6 sm:p-8 lg:p-10 overflow-hidden transition-all duration-300 relative"
            >
              {/* Subtle Dimming when covered */}
              <motion.div
                style={{ opacity: card1Dim }}
                className="absolute inset-0 bg-slate-950 pointer-events-none rounded-[inherit] z-20"
              />

              {/* Top Accent Hairline */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-green-400" />

              {/* Folder Top Tab Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-100 relative z-10">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-black text-emerald-700 tracking-widest uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
                    [02 / SELL]
                  </span>
                  <span className="text-xs sm:text-sm font-heading font-black text-slate-800">
                    તમારી કાર તરત જ વેચો
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-heading font-black">
                    15 મિનિટમાં પેમેન્ટ
                  </span>
                </div>
              </div>

              {/* Main Headline & Description */}
              <div className="mb-6 relative z-10">
                <h3 className="text-2xl sm:text-4xl lg:text-[42px] font-black font-heading text-slate-950 tracking-tight leading-tight">
                  શ્રેષ્ઠ કિંમતે કાર વેચો અને <span className="text-emerald-600">Instant Payment</span> મેળવો
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm md:text-base text-slate-600 font-medium leading-relaxed font-body max-w-3xl">
                  ભાવતાલની કોઈ ઝંઝટ નહીં. સૌથી સાચો ભાવ મેળવો અને કોઈ પણ રિસ્ક વગર સીધા તમારા બેંક ખાતામાં Instant Payment મેળવો. કાગળ અને RTO ની તમામ જવાબદારી અમારી.
                </p>
              </div>

              {/* Quick Spec Pills */}
              <div className="flex flex-wrap gap-2 mb-7 relative z-10">
                {[
                  'Instant Fair Valuation',
                  '15-Minute Payment',
                  'Free RC Transfer',
                  'Doorstep Evaluation',
                  'Zero Brokerage (₹0)',
                  'Direct Bank Settlement'
                ].map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] sm:text-xs font-heading font-bold text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
                  >
                    • {tag}
                  </span>
                ))}
              </div>

              {/* 2-Column Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative z-10">
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-emerald-50/40 hover:border-emerald-500/30 transition-all shadow-xs group">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <h4 className="text-xs font-heading font-black text-slate-900 group-hover:text-emerald-700 transition-colors">Instant Fair Valuation</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 font-body leading-relaxed pl-6">
                        માર્કેટ મુજબ સાચી કિંમતનું ડેટાબેઝ્ડ અને નિષ્ણાતો દ્વારા વેરિફિકેશન.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-emerald-50/40 hover:border-emerald-500/30 transition-all shadow-xs group">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <h4 className="text-xs font-heading font-black text-slate-900 group-hover:text-emerald-700 transition-colors">15 મિનિટમાં Payment</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 font-body leading-relaxed pl-6">
                        ડીલ ફાઇનલ થતાં જ સીધા બેંક એકાઉન્ટમાં Immediate Transfer.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-emerald-50/40 hover:border-emerald-500/30 transition-all shadow-xs group">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <h4 className="text-xs font-heading font-black text-slate-900 group-hover:text-emerald-700 transition-colors">Free RC Transfer</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 font-body leading-relaxed pl-6">
                        કોઈપણ ખર્ચ વગર RTO ની તમામ કાયદાકીય કામગીરીની ખાતરી.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-emerald-50/40 hover:border-emerald-500/30 transition-all shadow-xs group">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <h4 className="text-xs font-heading font-black text-slate-900 group-hover:text-emerald-700 transition-colors">Doorstep Evaluation</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 font-body leading-relaxed pl-6">
                        ઝડપી અને ફ્રી કાર ચેકિંગ માટે અમે તમારા લોકેશન પર આવીશું.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-emerald-50/40 hover:border-emerald-500/30 transition-all shadow-xs group">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <h4 className="text-xs font-heading font-black text-slate-900 group-hover:text-emerald-700 transition-colors">No Hidden Charges</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 font-body leading-relaxed pl-6">
                        કાર વેચવાની પ્રક્રિયા સંપૂર્ણપણે ફ્રી છે, કોઈ કમિશન લેવાતું નથી.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-emerald-50/40 hover:border-emerald-500/30 transition-all shadow-xs group">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <h4 className="text-xs font-heading font-black text-slate-900 group-hover:text-emerald-700 transition-colors">Loan Settlement</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 font-body leading-relaxed pl-6">
                        જો તમારી કાર પર લોન ચાલુ હોય, તો અમે તેનું સીધું બેંક સેટલમેન્ટ કરી આપીએ છીએ.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to="/sell-your-car"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-black text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Banknote className="w-4 h-4" />
                      <span>ઓનલાઇન કાર વેલ્યુએશન મેળવો · Sell Car Online</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <a
                      href="https://wa.me/919913634447?text=નમસ્તે,%20હું%20મારી%20કાર%20વેચવા%20માટે%20ઇન્સ્ટન્ટ%20વેલ્યુએશન%20જાણવા%20માગું%20છું."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-heading font-bold text-xs sm:text-sm border border-slate-300 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>WhatsApp ક્વોટેશન</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg aspect-[16/10] lg:aspect-auto lg:h-full min-h-[220px] bg-slate-900 border border-slate-200 group">
                    <img
                      src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop"
                      alt="Sell Car with Instant Payment"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 tracking-wider">
                        INSTANT SETTLEMENT
                      </span>
                      <h4 className="text-sm sm:text-base font-heading font-bold">તમારી જૂની કારની મેળવો શ્રેષ્ઠ બજાર કિંમત</h4>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Scroll Spacer between Card 1 and Card 2 */}
            <div className="h-[28vh] sm:h-[36vh] pointer-events-none" />

            <div id="service-anchor-exchange" className="scroll-mt-28" />
            {/* ── CARD 2: [3] એક્સચેન્જ (EXCHANGE) ── */}
            <motion.div
              id="service-card-exchange"
              style={{
                top: 'calc(clamp(72px, 8vh, 88px) + clamp(84px, 10vh, 96px))',
                scale: 1,
                transformOrigin: 'top center',
                zIndex: 30,
              }}
              className="sticky rounded-[28px] sm:rounded-[36px] md:rounded-[42px] bg-white border border-slate-200/90 shadow-[0_30px_70px_-15px_rgba(15,23,42,0.16),0_10px_25px_-5px_rgba(15,23,42,0.09),0_-4px_12px_rgba(15,23,42,0.03)] p-6 sm:p-8 lg:p-10 overflow-hidden transition-all duration-300 relative"
            >
              {/* Top Accent Hairline */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />

              {/* Folder Top Tab Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-100 relative z-10">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-black text-sky-700 tracking-widest uppercase bg-sky-50 px-3 py-1 rounded-full border border-sky-200/80">
                    [03 / EXCHANGE]
                  </span>
                  <span className="text-xs sm:text-sm font-heading font-black text-slate-800">
                    જૂની કાર આપો, નવી કાર ઘરે લાવો
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-sky-800 text-xs font-heading font-black">
                    સેમ-ડે ડિલિવરી બોનસ
                  </span>
                </div>
              </div>

              {/* Main Headline & Description */}
              <div className="mb-6 relative z-10">
                <h3 className="text-2xl sm:text-4xl lg:text-[42px] font-black font-heading text-slate-950 tracking-tight leading-tight">
                  જૂની કાર આપી નવી <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-brand-orange">Dream Car</span> ઘરે લાવો
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm md:text-base text-slate-600 font-medium leading-relaxed font-body max-w-3xl">
                  શું તમે નવી કાર લેવાનું વિચારી રહ્યા છો? તમારી જૂની કારની સાચી કિંમત મેળવો અને તે જ દિવસે તમારી પસંદગીની નવી Premium Car ઘરે લઈ જાવ. બંને ડીલ એક જ સ્થળે પૂર્ણ.
                </p>
              </div>

              {/* Quick Spec Pills */}
              <div className="flex flex-wrap gap-2 mb-7 relative z-10">
                {[
                  'Same-Day Delivery',
                  'Special Exchange Bonus',
                  'Any Car Any Condition',
                  'Single-Window Deal',
                  'Fast Loan Switch',
                  '100% Free RTO'
                ].map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] sm:text-xs font-heading font-bold text-slate-700 hover:bg-sky-50 hover:border-sky-200 transition-colors"
                  >
                    • {tag}
                  </span>
                ))}
              </div>

              {/* 2-Column Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative z-10">
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-sky-50/40 hover:border-sky-500/30 transition-all shadow-xs group">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <h4 className="text-xs font-heading font-black text-slate-900 group-hover:text-sky-700 transition-colors">The Seamless Process</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 font-body leading-relaxed pl-6">
                        તમારી જૂની કાર લાવો અને નવી પસંદ કરો, કિંમત તરત Adjust કરવામાં આવશે.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-sky-50/40 hover:border-sky-500/30 transition-all shadow-xs group">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <h4 className="text-xs font-heading font-black text-slate-900 group-hover:text-sky-700 transition-colors">Exchange Bonus</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 font-body leading-relaxed pl-6">
                        માત્ર એક્સચેન્જ પર મળતા Special Price બેનિફિટ્સનો લાભ લો.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-sky-50/40 hover:border-sky-500/30 transition-all shadow-xs group">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <h4 className="text-xs font-heading font-black text-slate-900 group-hover:text-sky-700 transition-colors">Drive Out Same Day</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 font-body leading-relaxed pl-6">
                        જૂની કાર આપો અને માત્ર 2 કલાકમાં નવી વેરિફાઇડ કાર ચાવી સાથે ઘરે લઈ જાવ.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-sky-50/40 hover:border-sky-500/30 transition-all shadow-xs group">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <h4 className="text-xs font-heading font-black text-slate-900 group-hover:text-sky-700 transition-colors">Hassle-Free Paperwork</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 font-body leading-relaxed pl-6">
                        જૂની કારનું નામ બદલવું અને નવી કારની લોન/RTO એક જ જગ્યાએ.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-sky-50/40 hover:border-sky-500/30 transition-all shadow-xs group">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <h4 className="text-xs font-heading font-black text-slate-900 group-hover:text-sky-700 transition-colors">Any Car, Any Condition</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 font-body leading-relaxed pl-6">
                        તમારી જૂની કાર કોઈપણ કંપની કે મોડલની હોય, અમે તેને બેસ્ટ વેલ્યુ આપીશું.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-sky-50/40 hover:border-sky-500/30 transition-all shadow-xs group">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <h4 className="text-xs font-heading font-black text-slate-900 group-hover:text-sky-700 transition-colors">Transparent Upgrade</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 font-body leading-relaxed pl-6">
                        જૂની કારની સાચી કિંમત અને નવી કારનો બેસ્ટ ભાવ – 100% પારદર્શિતા સાથે.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href="https://wa.me/919913634447?text=નમસ્તે,%20હું%20મારી%20જૂની%20કાર%20એક્સચેન્જ%20કરીને%20નવી%20કાર%20લેવા%20માટે%20ઓફર%20જાણવા%20માગું%20છું."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl sm:rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-black text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
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

                <div className="lg:col-span-5">
                  <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg aspect-[16/10] lg:aspect-auto lg:h-full min-h-[220px] bg-slate-900 border border-slate-200 group">
                    <img
                      src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000&auto=format&fit=crop"
                      alt="Exchange Old Car for Verified Pre-Owned"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[10px] uppercase font-mono font-bold text-sky-300 tracking-wider">
                        SAME-DAY EXCHANGE
                      </span>
                      <h4 className="text-sm sm:text-base font-heading font-bold">સરળ પ્રક્રિયા સાથે સેમ-ડે કાર અપગ્રેડ</h4>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* ═════════════════════════════════════════════════════════════════════
          6. THE SADGURU PROMISE & STANDARD (Architectural 4-Card Grid)
          ═════════════════════════════════════════════════════════════════════ */}
      <section id="sadguru-promise" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6] border-t border-slate-200/80 relative overflow-hidden">
        {/* Soft Warm Luxury Ambient Radiance */}
        <div className="absolute top-0 right-1/4 w-[650px] h-[350px] bg-gradient-to-br from-amber-200/25 via-brand-orange/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[320px] bg-gradient-to-tl from-emerald-100/25 to-transparent rounded-full blur-[120px] pointer-events-none" />

        {/* Subtle Architectural Grid Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/25 text-brand-orange font-heading font-black text-xs uppercase tracking-widest mb-4 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
              <span>અમારું Promise · THE SADGURU PROMISE</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-950 font-heading tracking-tight leading-[1.15]"
            >
              અમારું{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">
                સદગુરુ Standard
                <svg
                  className="absolute -bottom-2 sm:-bottom-3.5 left-0 w-full h-3 sm:h-4 text-brand-orange overflow-visible pointer-events-none"
                  viewBox="0 0 160 20"
                  fill="none"
                >
                  <path
                    d="M3 9C45 19 115 19 157 8"
                    stroke="currentColor"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-base sm:text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed font-body"
            >
              અમે ફક્ત કાર નથી વેચતા. કડક Quality Control, પારદર્શક પ્રક્રિયા અને અજોડ Customer Support દ્વારા અમે તમને માનસિક શાંતિ{' '}
              <strong className="text-slate-950 font-bold">(Peace of Mind)</strong> આપીએ છીએ.
            </motion.p>
          </div>

          {/* Modern SaaS Bento Architectural Grid (Flagship Tall Card + Asymmetric Cluster) */}
          <SadguruStandardBento
            pillars={sadguruStandardPillars}
            onOpenModal={(pillar) => setActivePromiseModal(pillar)}
          />

          {/* 5-Badge Reassurance Ribbon */}
          <div className="mt-14 pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-orange shrink-0" />
              <span className="text-xs font-heading font-black text-slate-800">120+ પોઈન્ટ ટેસ્ટિંગ</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center gap-2">
              <FileText className="w-4 h-4 text-sky-600 shrink-0" />
              <span className="text-xs font-heading font-black text-slate-800">100% ફ્રી RTO ટ્રાન્સફર</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center gap-2">
              <Landmark className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="text-xs font-heading font-black text-slate-800">0% ડાઉન પેમેન્ટ લોન</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center gap-2">
              <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-heading font-black text-slate-800">₹0 હિડન ચાર્જિસ</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs col-span-2 sm:col-span-1 flex items-center justify-center gap-2">
              <HeartHandshake className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-xs font-heading font-black text-slate-800">100% હેન્ડઓવર સપોર્ટ</span>
            </div>
          </div>

          {/* Bottom Trust & Commitment Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-10 max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-brand-orange/10 to-yellow-500/10 border border-brand-orange/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-orange text-white flex items-center justify-center shrink-0 shadow-lg shadow-brand-orange/30">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-black font-heading text-slate-900">
                  સદગુરુ ક્વોલિટી કમિટમેન્ટ · સુરતના 5,000+ પરિવારોનો અતૂટ વિશ્વાસ
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-medium font-body mt-0.5">
                  કોઈપણ શંકા વગર કાર ખરીદો અથવા વેચો. અમારા તમામ વચનો ઓન-પેપર માન્ય છે.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/inventory"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-950 hover:bg-slate-900 text-white font-heading font-black text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>વેરિફાઇડ સ્ટોક જુઓ</span>
                <ChevronRight className="w-4 h-4 text-brand-orange" />
              </Link>
              <a
                href="https://wa.me/919913634447?text=નમસ્તે,%20હું%20સદગુરુ%20સ્ટાન્ડર્ડ%20અને%20વેરિફાઇડ%20કાર%20વિશે%20માહિતી%20મેળવવા%20માગું%20છું."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-heading font-bold text-xs sm:text-sm border border-slate-300 shadow-xs transition-all hover:scale-105 active:scale-95"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>સલાહ મેળવો</span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* ── Active Pillar Detailed Modal ── */}
        <AnimatePresence>
          {activePromiseModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActivePromiseModal(null)}
                className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25 }}
                className="relative bg-white rounded-3xl sm:rounded-[32px] border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden z-10 my-8"
              >
                {/* Modal Modern Tech Header */}
                <div className="relative py-8 px-6 sm:px-8 w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden border-b border-slate-800">
                  {/* Subtle Grid Ambient Glow */}
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-orange/20 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

                  {/* Close button */}
                  <button
                    onClick={() => setActivePromiseModal(null)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20 z-20"
                    aria-label="Close"
                  >
                    <LucideX className="w-5 h-5" />
                  </button>

                  <div className="relative z-10 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-brand-orange flex items-center justify-center shrink-0">
                      {React.createElement(activePromiseModal.icon, { className: 'w-6 h-6' })}
                    </div>

                    <div className="text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                          {activePromiseModal.code} · {activePromiseModal.categoryTag}
                        </span>
                        <span className="text-[10px] font-heading font-black text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          {activePromiseModal.liveBadge}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black font-heading">
                        {activePromiseModal.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1 font-heading font-semibold">
                        {activePromiseModal.gujSub}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                    {activePromiseModal.description}
                  </p>

                  {/* Modal Specs */}
                  <div>
                    <h4 className="text-xs font-heading font-black text-slate-900 uppercase tracking-wider mb-3">
                      મુખ્ય ટેકનિકલ માપદંડો · SPECIFICATIONS
                    </h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      {activePromiseModal.modalSpecs.map((spec, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/90">
                          <span className="text-[10px] font-heading font-semibold text-slate-400 block">
                            {spec.label}
                          </span>
                          <span className="text-xs sm:text-sm font-heading font-black text-slate-900">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Features */}
                  <div>
                    <h4 className="text-xs font-heading font-black text-slate-900 uppercase tracking-wider mb-3">
                      સદગુરુ ક્વોલિટી ચેકપોઇન્ટ્સ · VERIFICATION POINTS
                    </h4>
                    <div className="space-y-2.5">
                      {activePromiseModal.detailedFeatures.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Modal Actions */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                    <a
                      href={`https://wa.me/919913634447?text=${encodeURIComponent(`નમસ્તે, હું સદગુરુ ${activePromiseModal.title} (${activePromiseModal.gujSub}) વિશે વધુ માહિતી મેળવવા માગું છું.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-black text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>WhatsApp પર માહિતી મેળવો</span>
                    </a>
                    <Link
                      to="/inventory"
                      onClick={() => setActivePromiseModal(null)}
                      className="py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-black text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>કાર સ્ટોક જુઓ</span>
                      <ChevronRight className="w-4 h-4 text-brand-orange" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>


      {/* ═════════════════════════════════════════════════════════════════════
          7. SOCIAL PROOF (Google Reviews)
          ═════════════════════════════════════════════ */}
      <div className="bg-slate-50 border-t border-slate-200/80">
        <GoogleReviews />
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          8. VIP SHOWROOM INVITATION CTA BANNER (White with Orange Shadow)
          ═════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/80 relative overflow-hidden border-t border-slate-200/80">
        {/* Soft Ambient Orange Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-orange/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="bg-white rounded-3xl sm:rounded-[36px] p-8 sm:p-12 md:p-16 border-2 border-brand-orange/30 shadow-[0_20px_60px_rgba(245,148,35,0.22)] relative overflow-hidden text-center">
            {/* Top Amber Highlight Hairline */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-brand-orange via-amber-400 to-yellow-400" />

            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/25 text-brand-orange font-heading font-black text-xs uppercase tracking-widest mb-4 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-orange" /> સુરતમાં આજે જ મુલાકાત લો · VISIT OUR SHOWROOM
            </span>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-950 font-heading tracking-tight leading-tight">
              તમારા પરિવાર માટે શ્રેષ્ઠ કાર શોધવા માટે <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">
                સદગુરુ કાર મેળોની મુલાકાત લો
              </span>
            </h2>

            <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
              વરાછા, સુરત ખાતે અમારા અનુભવી સ્ટાફ તમારી સેવામાં સવારે 9:30 થી રાત્રે 8:30 સુધી હાજર છે.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
              <a
                href="tel:+919913634447"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl sm:rounded-2xl bg-brand-orange hover:bg-orange-600 text-white font-heading font-black text-sm sm:text-base shadow-[0_10px_25px_rgba(245,148,35,0.35)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-white" />
                <span>કોલ કરો: +91 99136 34447</span>
              </a>

              <a
                href="https://wa.me/919913634447?text=નમસ્તે,%20હું%20સદગુરુ%20કાર%20મેળામાંથી%20વેરિફાઇડ%20કાર%20વિશે%20માહિતી%20મેળવવા%20માગું%20છું."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl sm:rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-black text-sm sm:text-base shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp પર વાત કરો</span>
              </a>

              <a
                href="https://maps.google.com/?q=Sadguru+Car+Melo+Surat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl sm:rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-sm sm:text-base shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer border border-slate-800"
              >
                <MapPin className="w-4 h-4 text-brand-orange" />
                <span>ગૂગલ મેપ્સ ડિરેક્શન્સ</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
