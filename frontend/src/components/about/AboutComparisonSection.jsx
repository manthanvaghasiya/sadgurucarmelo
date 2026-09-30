/**
 * @file frontend/src/components/about/AboutComparisonSection.jsx
 * @description Comparison matrix component contrasting the risks of unorganized
 * local car brokers with the guaranteed protections of Sadguru Verified vehicles.
 */

// External dependencies
import React from 'react';
import { Compass, X as LucideX, CheckCircle } from 'lucide-react';

// Constants
const BROKER_RISKS = [
  {
    title: 'કોઈ ટેકનિકલ ગેરંટી નહીં:',
    detail: 'કારમાં રહેલા છૂપા યાંત્રિક ફોલ્ટની કોઈ જવાબદારી હોતી નથી.',
  },
  {
    title: 'મીટર ટેમ્પરિંગનું ઊંચું જોખમ:',
    detail: 'કિલોમીટર ઓછા બતાવીને ગેરમાર્ગે દોરવાની શક્યતા.',
  },
  {
    title: 'કાગળિયાં અને RTO ટ્રાન્સફરમાં વિલંબ:',
    detail: 'મહિનાઓ સુધી આરસી બુક ટ્રાન્સફર થતી નથી.',
  },
  {
    title: 'અનિશ્ચિત કમિશન & છૂપા ચાર્જીસ:',
    detail: 'ખરીદનાર અને વેચનાર બંને પાસેથી છૂપા પૈસા લેવાય છે.',
  },
  {
    title: 'વેચાણ પછી કોઈ સર્વિસ નહીં:',
    detail: 'ડીલ પત્યા પછી કોઈ પ્રકારનો સંપર્ક કે સહાય મળતી નથી.',
  },
];

const SADGURU_ADVANTAGES = [
  {
    title: '120+ પોઈન્ટ ટેકનિકલ ઈન્સ્પેક્શન:',
    detail: 'દરેક કાર નિષ્ણાતો દ્વારા સંપૂર્ણ ટેસ્ટ પાસ કરેલી હોય છે.',
  },
  {
    title: '100% જેન્યુઇન ઓરિજિનલ કિલોમીટર:',
    detail: 'OBD સ્કેન અને ડીલર સર્વિસ હિસ્ટ્રી સાથે સચોટ ખાતરી.',
  },
  {
    title: '100% ફ્રી & ઝડપી RTO ટ્રાન્સફર:',
    detail: 'કાનૂની માલિકી ફેરબદલની સંપૂર્ણ જવાબદારી અમારી.',
  },
  {
    title: 'ઝીરો હિડન ચાર્જ & ફિક્સ્ડ વાજબી ભાવ:',
    detail: 'કોઈ બ્રોકરેજ કે કમિશન નહીં, 100% પારદર્શક વ્યવહાર.',
  },
  {
    title: 'તમામ બેંકો દ્વારા 0 ડાઉન પેમેન્ટ લોન:',
    detail: 'એક્સચેન્જ બોનસ અને સેમ-ડે ડિલિવરી સુવિધા.',
  },
];

/**
 * About Comparison Section Component
 */
export default function AboutComparisonSection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] relative overflow-hidden border-b border-slate-100">
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-gradient-to-br from-amber-100/20 to-transparent rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-heading font-bold text-xs uppercase tracking-widest mb-3.5 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-brand-orange" /> શા માટે સદગુરુ કાર મેળો? · THE UNFAIR ADVANTAGE
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 font-heading tracking-tight leading-tight">
            સામાન્ય બ્રોકર vs{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">
              સદગુરુ વેરિફાઇડ કાર
            </span>
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-slate-600 font-medium leading-relaxed font-body">
            સુરતમાં વપરાયેલી કાર લેતી વખતે ગ્રાહકો સાથે થતી સામાન્ય છેતરપિંડીઓથી બચો. જુઓ અમારો સ્પષ્ટ તફાવત:
          </p>
        </div>

        {/* Comparison Matrix Cards */}
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
                {BROKER_RISKS.map((risk, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <LucideX className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>
                      <b>{risk.title}</b> {risk.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-red-200/60 text-center">
              <span className="text-xs font-semibold text-red-600">
                ❌ ગ્રાહક માટે માનસિક તણાવ અને નાણાકીય જોખમ
              </span>
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
                {SADGURU_ADVANTAGES.map((advantage, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <b>{advantage.title}</b> {advantage.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 text-center">
              <span className="text-xs font-bold text-brand-orange">
                ✅ 100% સેફ ડીલિંગ અને સુરતના 5,000+ પરિવારોનો વિશ્વાસ
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
