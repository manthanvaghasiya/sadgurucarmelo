/**
 * @file frontend/src/components/sell/SellCarDirectCta.jsx
 * @description VIP consultation and direct contact banner for car sellers who prefer
 * phone calls, WhatsApp photo submissions, or direct showroom walk-in consultations.
 */

import React from 'react';
import { Phone, Sparkles, MapPin, ArrowUpRight } from 'lucide-react';
import WhatsAppIcon from '../WhatsAppIcon';
import { useDealershipContact } from '../../context/DealershipContactContext';

const MAPS_URL = 'https://maps.google.com/?q=Sadguru+Car+Melo+Surat';

export default function SellCarDirectCta() {
  const { phone, telLink, getWhatsAppLink } = useDealershipContact();

  const whatsappSellUrl = getWhatsAppLink(
    'નમસ્તે સદગુરુ કાર મેળો, હું મારી કાર વેચવા માગું છું. કૃપા કરીને મને યોગ્ય વેલ્યુએશન આપો.'
  );

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F8FAFC] via-[#FAF8F5] to-white relative overflow-hidden border-t border-slate-100">
      {/* Soft Ambient Gold/Orange Radiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-orange/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="bg-white rounded-3xl sm:rounded-[36px] p-8 sm:p-12 md:p-16 border-2 border-brand-orange/30 shadow-[0_20px_60px_rgba(245,148,35,0.22)] relative overflow-hidden text-center">
          {/* Top Amber Highlight Hairline */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-brand-orange via-amber-400 to-yellow-400" />

          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/25 text-brand-orange font-heading font-black text-xs uppercase tracking-widest mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" /> સીધો સંપર્ક કરો · INSTANT PHONE &amp; WHATSAPP
          </span>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-950 font-heading tracking-tight leading-tight">
            શું તમે સીધા કાર એક્સપર્ટ સાથે <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">
              વાત કરવા માગો છો?
            </span>
          </h2>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed font-body">
            તમારી કારના ફોટા અને RC બુક WhatsApp પર મોકલો અથવા સીધો કોલ કરો. અમારા સિનિયર ઇવેલ્યુએટર માત્ર 10 મિનિટમાં શ્રેષ્ઠ ઓફર આપશે.
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
              href={whatsappSellUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-black text-sm sm:text-base shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>WhatsApp પર ફોટા મોકલો</span>
            </a>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-sm sm:text-base shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer border border-slate-800"
            >
              <MapPin className="w-4 h-4 text-brand-orange" />
              <span>શોરૂમ મુલાકાત (વરાછા, સુરત)</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
