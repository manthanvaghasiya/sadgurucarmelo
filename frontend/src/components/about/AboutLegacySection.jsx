/**
 * @file frontend/src/components/about/AboutLegacySection.jsx
 * @description Heritage & Legacy presentation component highlighting Sadguru's founding
 * in 2011, showroom lounge visuals, founder quote narrative, and core trust assurances.
 */

// External dependencies
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Gauge, FileText } from 'lucide-react';

// Internal local imports
import { FADE_IN_UP, STAGGER_CONTAINER } from '../../data/aboutData';

// Constants
const CORE_TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: '100% નોન-એક્સિડેન્ટલ',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Gauge,
    title: 'ઓરિજિનલ કિલોમીટર',
    iconColor: 'text-brand-orange',
  },
  {
    icon: FileText,
    title: '100% ફ્રી RTO ટ્રાન્સફર',
    iconColor: 'text-blue-600',
  },
];

/**
 * About Legacy Section Component
 */
export default function AboutLegacySection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white border-b border-slate-100">
      {/* Soft Ambient Luxury Lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center relative z-10">
        {/* Left Column: Visual Gallery Showcase Frame */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={FADE_IN_UP}
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
          viewport={{ once: true, margin: '-40px' }}
          variants={STAGGER_CONTAINER}
          className="lg:col-span-7 flex flex-col justify-center"
        >
          <motion.div
            variants={FADE_IN_UP}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-heading font-bold text-xs uppercase tracking-widest w-fit mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" /> અમારો વારસો · THE SADGURU LEGACY
          </motion.div>

          <motion.h2
            variants={FADE_IN_UP}
            className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.18] font-heading tracking-tight mb-5"
          >
            માત્ર એક કાર મેળો નહીં, સુરતના પરિવારોનો <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">
              દાયકાઓ જૂનો ભરોસો
            </span>
          </motion.h2>

          <motion.div
            variants={FADE_IN_UP}
            className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed font-body"
          >
            <p>
              વર્ષ <b className="text-slate-900 font-heading">2011</b> માં વરાછા, સુરત ખાતે જ્યારે સદગુરુ કાર મેળોની સ્થાપના થઈ, ત્યારે અમારો એક જ દ્રઢ સંકલ્પ હતો:{' '}
              <span className="text-slate-900 font-semibold">
                "પ્રી-ઓન્ડ કાર ખરીદવી એ નવી કાર ખરીદવા જેટલું જ ગૌરવપૂર્ણ, સુરક્ષિત અને પારદર્શક હોવું જોઈએ."
              </span>
            </p>
            <p>
              સામાન્ય બ્રોકરો કે અનઓર્ગેનાઈઝ્ડ બજારથી વિપરીત, અમે સુરતમાં એક એવું મોડેલ ઊભું કર્યું જ્યાં દરેક કાર{' '}
              <b className="text-slate-900 font-heading">120+ પોઈન્ટ ટેકનિકલ ઈન્સ્પેક્શન</b> પાસ કર્યા પછી જ ડિસ્પ્લે થાય છે. કોઈ મીટર ટેમ્પરિંગ નહીં, કોઈ છૂપા ખર્ચા નહીં અને કોઈ અનિશ્ચિતતા નહીં.
            </p>
          </motion.div>

          {/* Founder Quote Card */}
          <motion.div
            variants={FADE_IN_UP}
            className="mt-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-amber-50/80 border border-amber-200 shadow-sm relative overflow-hidden"
          >
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
          <motion.div variants={FADE_IN_UP} className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CORE_TRUST_ITEMS.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <IconComponent className={`w-5 h-5 ${item.iconColor} shrink-0`} />
                  <span className="text-xs font-heading font-black text-slate-800">
                    {item.title}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
