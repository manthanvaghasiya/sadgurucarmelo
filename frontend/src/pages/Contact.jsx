import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Sparkles, ShieldCheck, Award, Users, CheckCircle2, ChevronRight, Home as HomeIcon, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDealershipContact } from '../context/DealershipContactContext';
import ContactChannelCards from '../components/contact/ContactChannelCards';
import ContactInquiryForm from '../components/contact/ContactInquiryForm';
import ContactShowroomHub from '../components/contact/ContactShowroomHub';
import ContactFaqSection from '../components/contact/ContactFaqSection';

export default function Contact() {
  const { phone, address } = useDealershipContact();
  // Mobile-only segmented tab state: 'hub' | 'form'
  const [activeMobileView, setActiveMobileView] = useState('hub');

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 overflow-x-hidden relative">
      <Helmet>
        <title>સંપર્ક કરો · Contact Us | Sadguru Car Melo Surat</title>
        <meta
          name="description"
          content={`Contact Sadguru Car Melo for buying certified cars, selling vehicle at best price, or loan inquiries. Located at Trilok Car Bazar, Varachha, Surat. Call ${phone}.`}
        />
        <meta property="og:title" content="Contact Sadguru Car Melo — Visit Our Surat Showroom" />
        <meta
          property="og:description"
          content={`Visit Surat's trusted pre-owned car dealership at Trilok Car Bazar, Simada Canal Rd, Varachha. Call ${phone} or WhatsApp us.`}
        />
      </Helmet>

      {/* Decorative ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-brand-orange/5 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-10 sm:space-y-12 lg:space-y-16">
        {/* ── 1. Page Header & Breadcrumb ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Breadcrumb Navigation */}
          <nav className="inline-flex items-center justify-center gap-2 mb-4 text-xs font-heading font-semibold text-slate-500 uppercase tracking-wider">
            <Link to="/" className="inline-flex items-center gap-1.5 hover:text-brand-orange transition-colors">
              <HomeIcon className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-900 font-bold">Contact Showroom</span>
          </nav>

          {/* Top Pill Badge */}
          <div className="flex justify-center mb-3">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-heading font-semibold tracking-wider uppercase shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" /> સુરતનો #1 વિશ્વાસપાત્ર કાર મેળો · GET IN TOUCH
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight tracking-tight mb-3">
            અમારો સંપર્ક કરો |{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-amber-600 font-bold">
              Sadguru Car Melo
            </span>
          </h1>

          <p className="font-body text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            વેરિફાઇડ કાર ખરીદવી હોય, તમારી જૂની કાર વેચવી હોય કે લોન વિશે જાણવું હોય — વરાછા શોરૂમ પર અમારી
            ઓટોમોટિવ ટીમ તમારું સ્વાગત કરવા તૈયાર છે.
          </p>
        </motion.div>

        {/* ── 2. Top 4 Direct Contact Channels ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ContactChannelCards />
        </motion.div>

        {/* ── 3. Main Section: Mobile Tab Switcher vs Desktop Side-by-Side ── */}
        <div>
          {/* Mobile-Only Segmented Controller (Reduces ~1,800px vertical clutter on phones) */}
          <div className="lg:hidden flex items-center p-1 bg-slate-200/80 backdrop-blur-sm rounded-2xl mb-5 border border-slate-300/80 shadow-2xs max-w-md mx-auto w-full">
            <button
              type="button"
              onClick={() => setActiveMobileView('hub')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-heading font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMobileView === 'hub'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${activeMobileView === 'hub' ? 'text-brand-orange' : 'text-slate-400'}`} />
              <span>📍 શોરૂમ લોકેશન & નકશો</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMobileView('form')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-heading font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMobileView === 'form'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Send className={`w-3.5 h-3.5 ${activeMobileView === 'form' ? 'text-brand-orange' : 'text-slate-400'}`} />
              <span>✍️ ઇન્ક્વાયરી મોકલો</span>
            </button>
          </div>

          {/* Mobile-Only Active Card View */}
          <div className="lg:hidden">
            {activeMobileView === 'hub' ? (
              <ContactShowroomHub />
            ) : (
              <ContactInquiryForm />
            )}
          </div>

          {/* Desktop-Only Side-by-Side 12-Column Grid (100% Untouched on Laptop) */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Column (5 Cols on LG): Send Inquiry Form */}
            <div className="lg:col-span-5 w-full flex flex-col">
              <ContactInquiryForm />
            </div>

            {/* Right Column (7 Cols on LG): Live Map, Facilities & Navigation */}
            <div className="lg:col-span-7 w-full flex flex-col">
              <ContactShowroomHub />
            </div>
          </div>
        </div>

        {/* ── 4. Frequently Asked Questions (FAQ) Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <ContactFaqSection />
        </motion.div>

        {/* ── 5. Bottom Dealership Trust Ribbon ── */}
        <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="font-heading font-bold text-2xl sm:text-3xl text-amber-400">12+ Years</p>
              <p className="font-body text-xs text-slate-300">Surat Pre-Owned Leadership</p>
            </div>
            <div className="space-y-1">
              <p className="font-heading font-bold text-2xl sm:text-3xl text-emerald-400">15,000+</p>
              <p className="font-body text-xs text-slate-300">Happy Families Delivered</p>
            </div>
            <div className="space-y-1">
              <p className="font-heading font-bold text-2xl sm:text-3xl text-sky-400">120+ Points</p>
              <p className="font-body text-xs text-slate-300">OBD Inspection Standards</p>
            </div>
            <div className="space-y-1">
              <p className="font-heading font-bold text-2xl sm:text-3xl text-purple-400">100%</p>
              <p className="font-body text-xs text-slate-300">RTO Paperwork Guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
