import React from 'react';
import { Phone, Mail, Clock, MapPin, ArrowUpRight, Sparkles } from 'lucide-react';
import WhatsAppIcon from '../WhatsAppIcon';
import { useDealershipContact } from '../../context/DealershipContactContext';

export default function ContactChannelCards() {
  const { phone, email, address, telLink, mailLink, getWhatsAppLink } = useDealershipContact();

  const channels = [
    {
      id: 'phone',
      title: 'Direct Sales Hotline',
      gujTitle: 'સીધો ફોન સંપર્ક',
      value: phone,
      subtext: 'સીધા સિનિયર એક્ઝિક્યુટિવ સાથે વાત કરો',
      actionText: 'Call Now · ફોન કરો',
      link: telLink,
      icon: Phone,
      theme: 'blue',
      badge: 'Immediate Response',
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Official Desk',
      gujTitle: '1-ક્લિક WhatsApp ચેટ',
      value: 'Instant Chat (< 5 min)',
      subtext: 'ફોટા, વીડિયો વોકઅરાઉન્ડ અને ક્વોટેશન મેળવો',
      actionText: 'Chat on WhatsApp',
      link: getWhatsAppLink('Hello Sadguru Car Melo, I would like to inquire about cars.'),
      icon: WhatsAppIcon,
      isCustomIcon: true,
      theme: 'emerald',
      badge: 'Fastest Channel',
    },
    {
      id: 'email',
      title: 'Dealership Email',
      gujTitle: 'સત્તાવાર ઇમેઇલ ડેસ્ક',
      value: email,
      subtext: 'દસ્તાવેજો અને કોર્પોરેટ પાર્ટનરશિપ માટે',
      actionText: 'Send Email · મેઇલ કરો',
      link: mailLink,
      icon: Mail,
      theme: 'violet',
      badge: '24h Turnaround',
    },
    {
      id: 'hours',
      title: 'Showroom & Lot Hours',
      gujTitle: 'શોરૂમ સમય અને દિવસો',
      value: '9:00 AM – 8:00 PM',
      subtext: 'અઠવાડિયાના તમામ 7 દિવસ ખુલ્લું · No Lunch Break',
      actionText: 'Get Directions · નકશો જુઓ',
      link: 'https://maps.app.goo.gl/zJjxnJM1BnLj3RpR7',
      icon: Clock,
      theme: 'amber',
      badge: 'Open 7 Days',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
      {channels.map((ch) => {
        const IconComponent = ch.icon;

        // Visual theme tokens
        const themeStyles = {
          blue: {
            bg: 'bg-blue-50/70 border-blue-100 hover:border-blue-300',
            iconBg: 'bg-blue-600 text-white shadow-blue-500/25',
            badge: 'bg-blue-100/80 text-blue-700 border-blue-200',
            accent: 'text-blue-600 group-hover:text-blue-700',
          },
          emerald: {
            bg: 'bg-emerald-50/70 border-emerald-100 hover:border-emerald-300',
            iconBg: 'bg-[#25D366] text-white shadow-emerald-500/25',
            badge: 'bg-emerald-100/80 text-emerald-800 border-emerald-200',
            accent: 'text-emerald-600 group-hover:text-emerald-700',
          },
          violet: {
            bg: 'bg-purple-50/70 border-purple-100 hover:border-purple-300',
            iconBg: 'bg-purple-600 text-white shadow-purple-500/25',
            badge: 'bg-purple-100/80 text-purple-700 border-purple-200',
            accent: 'text-purple-600 group-hover:text-purple-700',
          },
          amber: {
            bg: 'bg-amber-50/70 border-amber-100 hover:border-amber-300',
            iconBg: 'bg-brand-orange text-white shadow-brand-orange/25',
            badge: 'bg-amber-100/80 text-amber-800 border-amber-200',
            accent: 'text-brand-orange group-hover:text-orange-600',
          },
        }[ch.theme];

        return (
          <a
            key={ch.id}
            href={ch.link}
            target={ch.id === 'hours' || ch.id === 'whatsapp' ? '_blank' : undefined}
            rel={ch.id === 'hours' || ch.id === 'whatsapp' ? 'noopener noreferrer' : undefined}
            className={`group relative rounded-2xl p-3.5 sm:p-6 border transition-all duration-300 bg-white hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] flex flex-col justify-between ${themeStyles.bg}`}
          >
            <div>
              {/* Card Header: Icon & Badge */}
              <div className="flex items-center justify-between mb-2.5 sm:mb-4">
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 ${themeStyles.iconBg}`}
                >
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                </div>
                <span
                  className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-heading font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border ${themeStyles.badge}`}
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  {ch.badge}
                </span>
              </div>

              {/* Title & Channel Value */}
              <p className="font-heading text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 truncate">
                {ch.title}
              </p>
              <h3
                className={`font-heading text-slate-900 mb-1 leading-snug ${
                  ch.id === 'email'
                    ? 'font-medium sm:font-semibold text-[11px] sm:text-sm lg:text-[15px] tracking-tight break-all select-all text-slate-800'
                    : 'font-bold text-xs sm:text-base lg:text-lg tracking-tight truncate'
                }`}
                title={ch.value}
              >
                {ch.value}
              </h3>
              <p className="hidden sm:block font-body text-xs text-slate-600 leading-relaxed mb-4">
                {ch.subtext}
              </p>
            </div>

            {/* Action Bar */}
            <div className="pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className={`font-heading text-[11px] sm:text-xs font-semibold transition-colors truncate pr-1 ${themeStyles.accent}`}>
                {ch.actionText}
              </span>
              <div
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-slate-900 transition-all shadow-2xs shrink-0`}
              >
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
