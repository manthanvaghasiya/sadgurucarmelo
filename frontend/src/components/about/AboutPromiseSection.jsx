/**
 * @file frontend/src/components/about/AboutPromiseSection.jsx
 * @description The Sadguru Promise & Standard section featuring the modern SaaS Bento grid,
 * a 5-badge reassurance ribbon, quality commitment banner, and the deep-dive pillar modal.
 */

// External dependencies
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  FileText,
  Landmark,
  Tag,
  HeartHandshake,
  Award,
  ChevronRight,
} from 'lucide-react';

// Internal local imports
import SadguruStandardBento from '../SadguruStandardBento';
import WhatsAppIcon from '../WhatsAppIcon';
import { SADGURU_STANDARD_PILLARS } from '../../data/aboutData';
import AboutPromiseModal from './AboutPromiseModal';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

// Constants
const REASSURANCE_BADGES = [
  {
    icon: ShieldCheck,
    text: '120+ પોઈન્ટ ટેસ્ટિંગ',
    color: 'text-brand-orange',
    wrapperClass: '',
  },
  {
    icon: FileText,
    text: '100% ફ્રી RTO ટ્રાન્સફર',
    color: 'text-sky-600',
    wrapperClass: '',
  },
  {
    icon: Landmark,
    text: '0% ડાઉન પેમેન્ટ લોન',
    color: 'text-purple-600',
    wrapperClass: '',
  },
  {
    icon: Tag,
    text: '₹0 હિડન ચાર્જિસ',
    color: 'text-emerald-600',
    wrapperClass: '',
  },
  {
    icon: HeartHandshake,
    text: '100% હેન્ડઓવર સપોર્ટ',
    color: 'text-amber-500',
    wrapperClass: 'col-span-2 sm:col-span-1',
  },
];

const getWhatsappPromiseUrl = () =>
  buildWhatsAppUrl('નમસ્તે, હું સદગુરુ સ્ટાન્ડર્ડ અને વેરિફાઇડ કાર વિશે માહિતી મેળવવા માગું છું.');

/**
 * About Promise Section Component
 * @param {Object} props
 * @param {Object|null} props.activePromiseModal - Currently opened pillar data or null
 * @param {Function} props.onOpenModal - Handler to open pillar modal
 * @param {Function} props.onCloseModal - Handler to close pillar modal
 */
export default function AboutPromiseSection({
  activePromiseModal,
  onOpenModal,
  onCloseModal,
}) {
  return (
    <section
      id="sadguru-promise"
      className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-b border-slate-100 relative overflow-hidden"
    >
      {/* Soft Warm Luxury Ambient Radiance */}
      <div className="absolute top-0 right-1/4 w-[650px] h-[350px] bg-gradient-to-br from-amber-200/20 via-brand-orange/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[320px] bg-gradient-to-tl from-emerald-100/20 to-transparent rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle Architectural Grid Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
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

        {/* Modern SaaS Bento Architectural Grid */}
        <SadguruStandardBento
          pillars={SADGURU_STANDARD_PILLARS}
          onOpenModal={(pillar) => onOpenModal(pillar)}
        />

        {/* 5-Badge Reassurance Ribbon */}
        <div className="mt-10 pt-6 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-center">
          {REASSURANCE_BADGES.map((badge, idx) => {
            const BadgeIcon = badge.icon;
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center gap-2 ${badge.wrapperClass}`}
              >
                <BadgeIcon className={`w-4 h-4 ${badge.color} shrink-0`} />
                <span className="text-xs font-heading font-black text-slate-800">
                  {badge.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust & Commitment Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-8 max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-brand-orange/10 to-yellow-500/10 border border-brand-orange/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-sm"
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
              href={getWhatsappPromiseUrl()}
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

      {/* Deep-Dive Pillar Modal */}
      <AboutPromiseModal pillar={activePromiseModal} onClose={onCloseModal} />
    </section>
  );
}
