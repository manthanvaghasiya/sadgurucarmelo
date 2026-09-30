import React from 'react';
import { MapPin, Navigation, Car, Building2, Users } from 'lucide-react';
import WhatsAppIcon from '../WhatsAppIcon';
import { useDealershipContact } from '../../context/DealershipContactContext';

export default function ContactShowroomHub() {
  const { phone, address, getWhatsAppLink } = useDealershipContact();

  return (
    <div className="w-full">
      {/* ── Interactive Google Map & Direction Card ── */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl shadow-slate-200/40 relative">
        {/* Map Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-orange text-white flex items-center justify-center shrink-0 shadow-md shadow-brand-orange/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/25">
                  Live Showroom Location
                </span>
              </div>
              <h3 className="font-heading font-bold text-lg text-white">
                સદગુરુ કાર મેળો · Varachha, Surat
              </h3>
              <p className="font-body text-xs text-slate-400 mt-0.5 leading-relaxed max-w-md">
                Trilok Car Bazar, Simada Canal BRTS Rd, Canal Chokdi, Varachha, Surat, Gujarat 395013
              </p>
            </div>
          </div>

          <a
            href="https://maps.app.goo.gl/zJjxnJM1BnLj3RpR7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-orange to-amber-500 hover:from-accent-hover hover:to-amber-600 text-white font-heading font-bold text-xs shadow-md shadow-brand-orange/25 transition-all hover:scale-[1.02] active:scale-95 shrink-0"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open in Google Maps</span>
          </a>
        </div>

        {/* Map Iframe with Overlays */}
        <div className="relative h-[380px] sm:h-[460px] lg:h-[500px] w-full bg-slate-100">
          <iframe
            title="Sadguru Car Surat Showroom Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.5210617841512!2d72.89515417470535!3d21.211176681489203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04fdde8bfb4e5%3A0x834add64072864dc!2sSadguru%20Car%20Melo!5e0!3m2!1sen!2sin!4v1775327556300!5m2!1sen!2sin"
            width="100%"
            height="100%"
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Floating WhatsApp Quick-Help Banner */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto max-w-sm bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-xl z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-md">
                  <WhatsAppIcon className="w-5 h-5" />
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <p className="font-heading font-bold text-xs text-slate-900 leading-tight">
                  શોરૂમ રસ્તો શોધવામાં મદદ?
                </p>
                <p className="font-body text-[11px] text-slate-500">Live Location WhatsApp પર મેળવો</p>
              </div>
            </div>

            <a
              href={getWhatsAppLink('Hello Sadguru Team, please share your showroom live Google map location.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1fa955] text-white font-heading font-bold text-xs shadow-sm transition-all shrink-0 active:scale-95"
            >
              Get Location
            </a>
          </div>
        </div>

        {/* Showroom Landmark & Parking Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-slate-50 p-4 border-t border-slate-200/80 text-xs font-body">
          <div className="flex items-center gap-2.5 p-2">
            <div className="w-7 h-7 rounded-lg bg-orange-100 text-brand-orange flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">મુખ્ય લેન્ડમાર્ક</p>
              <p className="text-slate-500 text-[11px]">સીમાડા કેનાલ ચોકડી પાસે, વરાછા</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">ફ્રી કસ્ટમર પાર્કિંગ</p>
              <p className="text-slate-500 text-[11px]">તમામ મુલાકાતીઓ માટે સમર્પિત પાર્કિંગ</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">BRTS કનેક્ટિવિટી</p>
              <p className="text-slate-500 text-[11px]">સીમાડા કેનાલ BRTS સ્ટેન્ડથી 2 મિનિટ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
