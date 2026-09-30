/**
 * @file frontend/src/data/sellCarData.js
 * @description Centralized immutable data contracts, popular brands, FAQ definitions,
 * 3-step selling process, and broker vs Sadguru comparison points for the Sell Your Car page.
 */

import {
  Banknote,
  Clock,
  ShieldCheck,
  FileText,
  Zap,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
} from 'lucide-react';

export const POPULAR_BRANDS = [
  'Maruti Suzuki',
  'Hyundai',
  'Tata',
  'Toyota',
  'Honda',
  'Kia',
  'Mahindra',
  'Volkswagen',
  'Skoda',
  'MG',
  'Renault',
  'Ford',
];

export const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
export const TRANSMISSIONS = ['Manual', 'Automatic'];

export const SELL_VALUE_PILLARS = [
  {
    icon: Banknote,
    title: 'શ્રેષ્ઠ માર્કેટ ભાવ',
    sub: 'Best Market Valuation',
    desc: 'કોઈ વચેટિયા કે દલાલી નહીં. કારની સાચી કિંમત સીધી તમારા હાથમાં.',
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-200/80',
  },
  {
    icon: Clock,
    title: '15 મિનિટમાં રોકડ પેમેન્ટ',
    sub: 'Instant Bank Transfer',
    desc: 'ડીલ ફાઇનલ થતાં જ IMPS/RTGS દ્વારા સીધા તમારા બેંક ખાતામાં જમા.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200/80',
  },
  {
    icon: ShieldCheck,
    title: '100% ફ્રી RTO ટ્રાન્સફર',
    sub: 'Zero Legal Liability',
    desc: 'કાનૂની માલિકી ટ્રાન્સફરની સંપૂર્ણ જવાબદારી અમારી, પાકા દસ્તાવેજ સાથે.',
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200/80',
  },
  {
    icon: Zap,
    title: 'ઝડપી & પેપરલેસ પ્રોસેસ',
    sub: 'Doorstep or Showroom',
    desc: 'માત્ર 30 મિનિટમાં ઇન્સ્પેક્શન અને તે જ દિવસે કારનું હેન્ડઓવર.',
    color: 'text-purple-600',
    bg: 'bg-purple-50 border-purple-200/80',
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    badge: 'ઝડપી ઓનલાઇન વિગતો',
    title: 'કારની વિગતો અને ફોટા શેર કરો',
    engTitle: 'Share Details Online',
    description:
      'તમારી કારનું મોડેલ, વર્ષ, કિલોમીટર અને ફોટા માત્ર 2 મિનિટમાં ફોર્મ ભરીને અથવા WhatsApp પર મોકલો.',
    highlight: '2 મિનિટમાં સબમિટ',
  },
  {
    step: '02',
    badge: 'પારદર્શક ઇન્સ્પેક્શન',
    title: 'ફ્રી ઇન્સ્પેક્શન અને વાજબી ઓફર',
    engTitle: 'Free Evaluation & Best Offer',
    description:
      'અમારા ઓટોમોટિવ એક્સપર્ટ દ્વારા ગાડીની કંડિશન તપાસીને સુરત માર્કેટના આધારે સૌથી ઊંચી કિંમત ઓફર કરાશે.',
    highlight: 'વાજબી માર્કેટ મૂલ્ય',
  },
  {
    step: '03',
    badge: 'ત્વરિત બેંક પેમેન્ટ',
    title: 'રોકડ ચૂકવણી અને તે જ દિવસે હેન્ડઓવર',
    engTitle: 'Instant Payment & Free RTO',
    description:
      'તમે કિંમત મંજૂર કરો એટલે તરત જ બેંક ટ્રાન્સફર! કાર આપતા પહેલાં સંપૂર્ણ પેમેન્ટ + લીગલ ડિલિવરી સ્લિપ.',
    highlight: '15 મિનિટમાં RTGS',
  },
];

export const SELLER_COMPARISON_ROWS = [
  {
    feature: 'પેમેન્ટની સુરક્ષા',
    broker: 'ચેક બાઉન્સ થવાનું અથવા પેમેન્ટ અટકવાનું ઊંચું જોખમ',
    sadguru: 'ગાડી આપતાં પહેલાં 100% ઇન્સ્ટન્ટ બેંક ટ્રાન્સફર (RTGS/IMPS)',
  },
  {
    feature: 'દલાલી & બ્રોકરેજ ફી',
    broker: '2% થી 5% સુધી છૂપી કમિશન કપાત (₹15,000 થી ₹40,000 નુકસાન)',
    sadguru: '₹0 કમિશન, ₹0 બ્રોકરેજ — જે નક્કી થાય તે પૂરા રૂપિયા તમારા',
  },
  {
    feature: 'RTO માલિકી ટ્રાન્સફર',
    broker: 'મહિનાઓ સુધી RC ટ્રાન્સફર થતી નથી, પોલીસ લાયાબિલિટી તમારા માથે',
    sadguru: '100% ફ્રી લીગલ ટ્રાન્સફર + તાત્કાલિક ઓફિશિયલ સેલ રિસિપ્ટ',
  },
  {
    feature: 'ગ્રાહકોની પૂછપરછ & સમય',
    broker: 'સેંકડો ફોન કોલ્સ, અજાણ્યા લોકોના ઘરફેરા અને અણછાજતી બાર્ગેનિંગ',
    sadguru: 'માત્ર 1 સિંગલ મીટિંગમાં વન-શોટ સંતોષકારક ડીલ',
  },
  {
    feature: 'ચાલુ લોન ક્લિયરન્સ',
    broker: 'બેંક લોન કે NOC માટે તમારે ધક્કા ખાવા પડે',
    sadguru: 'અમે તમારી જૂની બેંક લોન સીધી ક્લિયર કરી વધારાના પૈસા આપીએ છીએ',
  },
];

export const SELLER_TESTIMONIALS = [
  {
    name: 'પરેશભાઈ પટેલ',
    area: 'મોટા વરાછા, સુરત',
    car: 'Hyundai Creta 2021 SX',
    soldPrice: '₹11.20 Lakh',
    quote:
      'મેં મારી ક્રેટા વેચવા માટે ઘણી જગ્યાએ પૂછ્યું પણ સદગુરુ કાર મેળોએ સૌથી વાજબી ભાવ આપ્યો. માત્ર 20 મિનિટમાં મારા ખાતામાં પૂરા પૈસા આવી ગયા.',
  },
  {
    name: 'ધર્મેશભાઈ સાવલિયા',
    area: 'કાપોદ્રા, સુરત',
    car: 'Maruti Suzuki Baleno 2020 Zeta',
    soldPrice: '₹6.35 Lakh',
    quote:
      'બજારમાં બ્રોકરો કમિશન માગતા હતા. અહીં કોઈ જ બ્રોકરેજ વગર એકદમ પારદર્શક વ્યવહાર થયો. RTO ટ્રાન્સફરની પહોંચ પણ તાત્કાલિક મળી ગઈ.',
  },
  {
    name: 'વિપુલભાઈ ઘેલાણી',
    area: 'અડાજણ, સુરત',
    car: 'Honda City 2019 VX',
    soldPrice: '₹7.80 Lakh',
    quote:
      'મારી કાર પર 2 લાખની બેંક લોન બાકી હતી. સદગુરુ ટીમે બેંકમાં પેમેન્ટ ક્લિયર કરાવીને બાકીની રકમ મને તરત આપી. ખરેખર ઉત્તમ અનુભવ!',
  },
];

export const SELL_CAR_FAQS = [
  {
    q: 'મારી કારનું મૂલ્યાંકન (Valuation) કેવી રીતે નક્કી થાય છે?',
    a: 'અમે કારનું મોડેલ, વર્ષ, ઓરિજિનલ કિલોમીટર, સર્વિસ હિસ્ટ્રી, બોડી કંડિશન અને સુરત માર્કેટના વર્તમાન ડિમાન્ડ ડેટા આધારે વાજબી અને શ્રેષ્ઠ કિંમત નક્કી કરીએ છીએ.',
  },
  {
    q: 'પેમેન્ટ મને ક્યારે અને કઈ રીતે મળશે?',
    a: 'તમે કિંમત મંજૂર કરો એટલે ગાડીની ચાવી આપતા પહેલાં તમારા બેંક ખાતામાં RTGS / IMPS અથવા નેટ બેંકિંગ દ્વારા 100% રકમ તાત્કાલિક ટ્રાન્સફર કરવામાં આવે છે.',
  },
  {
    q: 'RTO ટ્રાન્સફરની જવાબદારી કોની રહેશે?',
    a: 'RTO ટ્રાન્સફરની સંપૂર્ણ કાનૂની જવાબદારી સદગુરુ કાર મેળોની છે. અમે તમને ઓફિશિયલ સેલ લેટર અને ડિલિવરી સ્લિપ આપીએ છીએ જેથી ગાડી વેચ્યા પછી તમારી કોઈ જ કાનૂની જવાબદારી રહેતી નથી.',
  },
  {
    q: 'જો મારી કાર પર બેંક લોન ચાલુ હોય તો શું હું કાર વેચી શકું?',
    a: 'હા, બિલકુલ! અમે તમારી લોન આપનાર બેંક સાથે સીધો સંપર્ક કરી બાકીનું લોન પેમેન્ટ પૂરું કરાવીને NOC મેળવીએ છીએ અને બાકીની વધારાની રકમ તમને રોકડ/બેંકમાં ચૂકવી દઈએ છીએ.',
  },
  {
    q: 'કાર વેચવા માટે કયા કાગળોની જરૂર પડશે?',
    a: 'ઓરિજિનલ RC બુક, માન્ય ઇન્સ્યોરન્સ પોલિસી, PUC, ગાડીની બંને ચાવીઓ અને માલિકનું આધાર કાર્ડ / પાન કાર્ડ.',
  },
];
