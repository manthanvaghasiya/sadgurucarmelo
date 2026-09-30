/**
 * @file frontend/src/data/aboutData.js
 * @description Centralized data source and configurations for the About Us page,
 * containing hero customer fallbacks, visual transforms, service tabs,
 * animation presets, and Sadguru Standard pillars.
 */

// External dependencies
import {
  ShieldCheck,
  FileText,
  Landmark,
  Tag,
  CarFront,
  Banknote,
  RefreshCw,
} from 'lucide-react';

// Animation variants
export const FADE_IN_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// Fallback customer delivery photos from verified showroom handovers
export const FALLBACK_HERO_CUSTOMERS = [
  {
    _id: 'hc-1',
    customerName: 'નિકુલભાઈ (ભાવનગર)',
    carModel: 'Hyundai Creta SX',
    deliveryTag: 'Happy Delivery 🔑',
    rating: '5.0',
    location: 'ભાવનગર / સુરત',
    photo: 'https://res.cloudinary.com/dijf9umhc/image/upload/v1776927906/sadguru_cars/maqpmlzrkhwdjgfbx4qm.jpg',
    reviewText: '120-પોઇન્ટ ચેકલિસ્ટ અને RTO ફ્રી ટ્રાન્સફર સાથે ગાડી મળી. સર્વિસ ખૂબ જ ઉત્તમ.',
  },
  {
    _id: 'hc-2',
    customerName: 'સુરત અડાજણ ફેમિલી',
    carModel: 'Maruti Suzuki Dzire',
    deliveryTag: 'Family Choice 🚗',
    rating: '5.0',
    location: 'અડાજણ, સુરત',
    photo: 'https://res.cloudinary.com/dijf9umhc/image/upload/v1776927825/sadguru_cars/hrjlqzfexc1bciifiumo.jpg',
    reviewText: 'આજે જ અમારી નવી ફેમિલી કાર સદગુરુ કાર મેળામાંથી લીધી. પરિવાર ખૂબ ખુશ છે!',
  },
  {
    _id: 'hc-3',
    customerName: 'સ્વપ્નિલભાઈ (મહારાષ્ટ્ર)',
    carModel: 'Kia Seltos HTX',
    deliveryTag: 'Outstation Buyer 🌟',
    rating: '5.0',
    location: 'મહારાષ્ટ્ર / સુરત',
    photo: 'https://res.cloudinary.com/dijf9umhc/image/upload/v1776927802/sadguru_cars/ned6pwkfsldkjrr76icz.jpg',
    reviewText: 'મહારાષ્ટ્રથી ખાસ સુરત ગાડી લેવા આવ્યો. 100% જેન્યુઈન કાર અને સ્મૂથ ડીલ.',
  },
  {
    _id: 'hc-4',
    customerName: 'સાહિલભાઈ (સુરત)',
    carModel: 'Maruti Brezza ZDi',
    deliveryTag: 'Verified Quality 🏆',
    rating: '5.0',
    location: 'વરાછા, સુરત',
    photo: 'https://res.cloudinary.com/dijf9umhc/image/upload/v1776927753/sadguru_cars/pxkkqas58ukevo61kbqf.jpg',
    reviewText: 'સુરતમાં સૌથી બેસ્ટ કાર ડીલર. ગાડી એકદમ શોરૂમ કંડિશનમાં મળી.',
  },
  {
    _id: 'hc-5',
    customerName: 'પરેશભાઈ & ફેમિલી',
    carModel: 'Honda City i-VTEC',
    deliveryTag: 'Showroom Handover ✨',
    rating: '5.0',
    location: 'કાપોદ્રા, સુરત',
    photo: '/about.png',
    reviewText: '15+ વર્ષોથી સદગુરુ કાર ઉપર જ વિશ્વાસ છે. કાગળો અને RTO એકદમ ક્લિયર.',
  },
  {
    _id: 'hc-6',
    customerName: 'દિનેશભાઈ (સુરત)',
    carModel: 'Tata Nexon Fearless',
    deliveryTag: 'Certified Car 🔑',
    rating: '5.0',
    location: 'કતારગામ, સુરત',
    photo: 'https://res.cloudinary.com/dijf9umhc/image/upload/v1776927825/sadguru_cars/hrjlqzfexc1bciifiumo.jpg',
    reviewText: 'ઝીરો ડાઉન પેમેન્ટ અને તે જ દિવસે બેંક લોન સેટલ થઈ ગઈ.',
  },
];

// Pinterest-style perspective smile cradle arc transforms
export const ARC_CARD_CONFIGS = [
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

// Core Dealership Service Tabs Configuration
export const SERVICE_TABS = [
  { id: 'buy', label: 'કાર ખરીદો', engLabel: 'Buy Verified Car', icon: CarFront, badge: '150+ કાર' },
  { id: 'sell', label: 'કાર વેચો', engLabel: 'Sell with Instant Pay', icon: Banknote, badge: 'ઇન્સ્ટન્ટ પેમેન્ટ' },
  { id: 'exchange', label: 'એક્સચેન્જ', engLabel: 'Trade-in Upgrade', icon: RefreshCw, badge: 'બેસ્ટ બોનસ' },
];

// The Sadguru Promise & Standard - 4 Architectural Pillars
export const SADGURU_STANDARD_PILLARS = [
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
      { label: 'લેબ સર્ટિફિકેટ', value: '100% પાસ ગેરંટી' },
    ],
    checkpoints: [
      '120+ પોઈન્ટ સઘન ટેકનિકલ લેબ & રોડ ટેસ્ટિંગ',
      '100% નોન-એક્સિડેન્ટલ ચેસીસ અને ફ્રેમ સર્ટિફિકેશન',
      'ડિજિટલ OBD-II સ્કેન & જેન્યુઇન ઓરિજિનલ કિલોમીટર',
    ],
    detailedFeatures: [
      'હાઇડ્રોલિક લિફ્ટ પર અંડરબોડી ચેસીસ & સસ્પેન્શન ચેક',
      'ડિજિટલ પેઇન્ટ ગેજ વડે 100% નોન-એક્સિડેન્ટલ વેરિફિકેશન',
      'ઓન-બોર્ડ ઈલેક્ટ્રોનિક્સ & એન્જિન સેન્સર્સ સ્કેનિંગ',
      'ગ્રાહકને સંતોષ માટે સંપૂર્ણ પારદર્શક હેલ્થ રિપોર્ટ',
    ],
    modalSpecs: [
      { label: 'ડાયગ્નોસ્ટિક્સ', value: 'OBD-II કમ્પ્યુટર સ્કેનર' },
      { label: 'લિફ્ટ સિસ્ટમ', value: 'હાઇડ્રોલિક ટ્વિન રેમ' },
      { label: 'ટેકનિકલ ટીમ', value: 'સર્ટિફાઇડ ઓટો એન્જિનિયર્સ' },
      { label: 'રિપોર્ટિંગ', value: '100% ડિજિટલ ચેકશીટ' },
    ],
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
      { label: 'સમયમર્યાદા', value: '3-5 દિવસમાં હેન્ડઓવર' },
    ],
    checkpoints: [
      '100% ફ્રી & ઝડપી આરસી માલિકી ટ્રાન્સફર',
      'ક્લીન ટાઇટલ, નો-હાઈપોથેકેશન & લીગલ RTO NOC',
      'તમામ Documentation અમારી ટીમ દ્વારા પૂર્ણ કરવામાં આવે છે',
    ],
    detailedFeatures: [
      'સુરત RTO કચેરીની કાનૂની માલિકી ફેરબદલની સંપૂર્ણ જવાબદારી',
      'પોલીસ વેરિફિકેશન અને ચલણ ક્લિયરન્સ સર્ટિફિકેટ',
      'ઓરિજિનલ સ્માર્ટ કાર્ડ આરસી સીધા તમારા સરનામે',
      'ગ્રાહકને સરકારી કચેરીઓના ધક્કા ખાવામાંથી 100% મુક્તિ',
    ],
    modalSpecs: [
      { label: 'આરટીઓ ફી', value: '₹0 (ગ્રાહક માટે મફત)' },
      { label: 'કાનૂની ટાઇટલ', value: '100% ક્લીન & વેરિફાઇડ' },
      { label: 'NOC સ્ટેટસ', value: 'તમામ બેંક ક્લિયર' },
      { label: 'સપોર્ટ', value: 'ડેડિકેટેડ RTO એક્ઝિક્યુટિવ' },
    ],
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
      { label: 'ડાઉન પેમેન્ટ', value: '0% સુધી સરળ સુવિધા' },
    ],
    checkpoints: [
      'SBI, HDFC, ICICI, Axis અને Bank of Baroda સાથે જોડાણ',
      '0 ડાઉન પેમેન્ટ અને 100% સુધી સરળ લોન સુવિધા',
      'ન્યૂનતમ દસ્તાવેજો સાથે ઝડપી ઇન-પ્રિન્સિપલ લોન મંજૂરી',
    ],
    detailedFeatures: [
      'સ્થળ પર જ માત્ર 30 મિનિટમાં લોનની પ્રાથમિક મંજૂરી',
      'ગ્રાહકના સિવિલ સ્કોર મુજબ સૌથી ઓછો સંભવિત વ્યાજદર',
      'ન્યૂનતમ દસ્તાવેજીકરણ અને સરળ પેપરલેસ પ્રક્રિયા',
      'ફ્લેક્સિબલ EMI ટેન્યોર (12 થી 84 મહિના સુધી)',
    ],
    modalSpecs: [
      { label: 'લોન મંજૂરી', value: 'ઇન્સ્ટન્ટ 30 મિનિટ' },
      { label: 'વ્યાજદર', value: 'સૌથી સ્પર્ધાત્મક (Lowest Rate)' },
      { label: 'ફાઇનાન્સિંગ', value: '100% ઓન-રોડ સુધી' },
      { label: 'ડોક્યુમેન્ટ્સ', value: 'બેઝિક KYC & આવક પુરાવો' },
    ],
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
    accentBorder: 'hover:border-emerald-500/60 hover:shadow-[0_20px_40px_rgba(160,185,129,0.18)]',
    iconContainer: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    specs: [
      { label: 'બ્રોકરેજ ફી', value: '₹0 (Zero Brokerage)' },
      { label: 'ઇન્વૉઇસ', value: '100% આઇટમાઇઝ્ડ બિલ' },
    ],
    checkpoints: [
      'ખરીદનાર અને વેચનાર બંને માટે ઝીરો બ્રોકરેજ અથવા કમિશન',
      'દરેક વાહનનું 100% પારદર્શક અને આઇટમાઇઝ્ડ પ્રાઇસિંગ',
      'તમે જે જુઓ છો તે જ ફાઇનલ કિંમત ચૂકવવાની રહે છે',
    ],
    detailedFeatures: [
      'કોઈ પણ પ્રકારની છૂપી દલાલી કે અઘોષિત કમિશન લેવામાં આવતું નથી',
      'દરેક કારનું સ્પષ્ટ બિલિંગ અને કાનૂની GST રસીદ',
      'ઓન-પેપર ફેસ વેલ્યુ ડીલિંગ, જે જુઓ છો તે જ ફાઇનલ કિંમત',
      'સંપૂર્ણ પારદર્શિતા સાથે સુરતના પરિવારોનો 15+ વર્ષોનો અતૂટ સંતોષ',
    ],
    modalSpecs: [
      { label: 'બ્રોકરેજ', value: '₹0 (ઝીરો કમિશન)' },
      { label: 'છૂપા ચાર્જ', value: 'બિલકુલ નહીં (0%)' },
      { label: 'બિલિંગ', value: 'ઓરિજિનલ ટેક્સ ઇન્વૉઇસ' },
      { label: 'પ્રાઇસિંગ ગેરંટી', value: '100% ઓન-પેપર ફેર વેલ્યુ' },
    ],
  },
];
