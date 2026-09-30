/**
 * @file frontend/src/data/compareCarsData.js
 * @description Centralized data contracts for Compare Cars page: popular pre-curated matchups,
 * comparison guide criteria, and value highlights.
 */

import {
  Sparkles,
  ShieldCheck,
  Calculator,
  Gauge,
} from 'lucide-react';

export const COMPARE_VALUE_BADGES = [
  {
    icon: Sparkles,
    label: '1-ક્લિક તફાવત હાઇલાઇટ',
    sub: 'Instant Diff Highlighting',
    color: 'text-brand-orange',
    bg: 'bg-orange-50 border-orange-200/80',
  },
  {
    icon: Calculator,
    label: 'અંદાજિત EMI ગણતરી',
    sub: 'Real EMI & Downpayment',
    color: 'text-purple-600',
    bg: 'bg-purple-50 border-purple-200/80',
  },
  {
    icon: Gauge,
    label: '100% ઓરિજિનલ કિલોમીટર',
    sub: 'OBD-II Genuine Scan',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200/80',
  },
  {
    icon: ShieldCheck,
    label: '120+ પોઇન્ટ ટેકનિકલ રિપોર્ટ',
    sub: 'Non-Accidental Certified',
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200/80',
  },
];

export const POPULAR_MATCHUPS = [
  {
    id: 'matchup-compact-suv',
    tag: 'ટોપ ટ્રેન્ડિંગ SUV',
    title: 'Hyundai Creta vs Kia Seltos',
    gujSub: 'સુરતનું સૌથી લોકપ્રિય પ્રીમિયમ SUV યુદ્ધ',
    category: 'Mid-size SUV',
    priceRange: '₹9.5 L – ₹14.5 L',
    car1Query: 'Creta',
    car2Query: 'Seltos',
    summary:
      'ક્રેટા તેની અત્યંત સ્મૂધ સસ્પેન્શન અને રીસેલ વેલ્યુ માટે જાણીતી છે, જ્યારે સેલ્ટોસ સ્પોર્ટી સ્ટીયરીંગ અને બોલ્ડ ડિઝાઇન આપે છે.',
    image1: 'https://res.cloudinary.com/dcdh9msgd/image/upload/v1746261543/creta_preview.jpg',
    image2: 'https://res.cloudinary.com/dcdh9msgd/image/upload/v1746261543/seltos_preview.jpg',
  },
  {
    id: 'matchup-family-hatchback',
    tag: 'ફેમિલી માઇલેજ કિંગ',
    title: 'Maruti Swift vs Maruti Baleno',
    gujSub: 'શહેરમાં સરળ ડ્રાઇવિંગ અને સૌથી ઓછો નિભાવ ખર્ચ',
    category: 'Premium Hatchback',
    priceRange: '₹5.2 L – ₹7.8 L',
    car1Query: 'Swift',
    car2Query: 'Baleno',
    summary:
      'સ્વિફ્ટ યુવા ડ્રાઇવરો માટે કોમ્પેક્ટ અને પપી પર્ફોર્મન્સ આપે છે, જ્યારે બલેનો વધુ રિયર લેગરૂમ અને પ્રીમિયમ કેબિન ધરાવે છે.',
    image1: 'https://res.cloudinary.com/dcdh9msgd/image/upload/v1746261543/swift_preview.jpg',
    image2: 'https://res.cloudinary.com/dcdh9msgd/image/upload/v1746261543/baleno_preview.jpg',
  },
  {
    id: 'matchup-luxury-7seater',
    tag: '7-સીટર રોયલ ટૂરિંગ',
    title: 'Toyota Innova vs Mahindra XUV700',
    gujSub: 'મોટા પરિવારો માટે અલ્ટીમેટ કમ્ફર્ટ અને પાવર',
    category: '7-Seater Family Cruiser',
    priceRange: '₹14.0 L – ₹21.0 L',
    car1Query: 'Innova',
    car2Query: 'XUV700',
    summary:
      'ઇનોવા ક્રિસ્ટાનું એન્જિન લાખો કિલોમીટર સુધી બુલેટપ્રૂફ ભરોસો આપે છે, જ્યારે XUV700 અત્યાધુનિક ADAS અને હાઇટેક સ્ક્રિન્સ આપે છે.',
    image1: 'https://res.cloudinary.com/dcdh9msgd/image/upload/v1746261543/innova_preview.jpg',
    image2: 'https://res.cloudinary.com/dcdh9msgd/image/upload/v1746261543/xuv_preview.jpg',
  },
  {
    id: 'matchup-executive-sedan',
    tag: 'ક્લાસી એક્ઝિક્યુટિવ સેડાન',
    title: 'Honda City vs Hyundai Verna',
    gujSub: 'હાઇવે કમ્ફર્ટ, બૂટ સ્પેસ અને લક્ઝુરિયસ રાઇડ',
    category: 'Executive Sedan',
    priceRange: '₹7.5 L – ₹11.5 L',
    car1Query: 'City',
    car2Query: 'Verna',
    summary:
      'હોન્ડા સિટીનું i-VTEC એન્જિન અત્યંત રિફાઇન્ડ છે, જ્યારે વર્ના તેની ફીચર્સ-લોડેડ ઇલેક્ટ્રોનિક્સ અને ટર્બો પાવરથી પ્રભાવિત કરે છે.',
    image1: 'https://res.cloudinary.com/dcdh9msgd/image/upload/v1746261543/city_preview.jpg',
    image2: 'https://res.cloudinary.com/dcdh9msgd/image/upload/v1746261543/verna_preview.jpg',
  },
];
