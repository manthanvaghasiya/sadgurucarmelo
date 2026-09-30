/**
 * @file frontend/src/components/about/AboutShowroomCta.jsx
 * @description VIP Showroom Invitation CTA banner providing direct access to showroom
 * phone consultation, WhatsApp conversations, and Google Maps routing.
 */

// External dependencies
import React from 'react';
import { Sparkles, Phone, ArrowUpRight, MapPin } from 'lucide-react';

// Internal local imports
import WhatsAppIcon from '../WhatsAppIcon';
import { useDealershipContact } from '../../context/DealershipContactContext';

// Constants
const MAPS_URL = 'https://maps.google.com/?q=Sadguru+Car+Melo+Surat';

/**
 * About Showroom CTA Banner Component
 */
export default function AboutShowroomCta() {
  const { phone, telLink, getWhatsAppLink } = useDealershipContact();

  const whatsappCtaUrl = getWhatsAppLink(
    'નમસ્તે, હું સદગુરુ કાર મેળામાંથી વેરિફાઇડ કાર વિશે માહિતી મેળવવા માગું છું.'
  );

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F8FAFC] via-[#FAF8F5] to-white relative overflow-hidden border-t border-slate-100">
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

          <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed font-body">
            150+ પ્રમાણિત કાર્સ, 120-પોઇન્ટ ઇન્સ્પેક્શન રિપોર્ટ, અને 15 મિનિટમાં લોન સહાય. અમારા ઓટોમોટિવ એક્સપર્ટ સાથે રૂબરૂ મુલાકાત લો.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
            <a
              href={telLink}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-brand-orange hover:bg-orange-600 text-white font-heading font-black text-sm sm:text-base shadow-[0_10px_25px_rgba(245,148,35,0.35)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-white" />
              <span>કોલ કરો: {phone}</span>
            </a>

            <a
              href={whatsappCtaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-black text-sm sm:text-base shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>WhatsApp પર વાત કરો</span>
            </a>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-sm sm:text-base shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer border border-slate-800"
            >
              <MapPin className="w-4 h-4 text-brand-orange" />
              <span>શોરૂમ લોકેશન (વરાછા, સુરત)</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
