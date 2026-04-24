import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, FileText, Landmark, Tag, Star, Banknote, RefreshCw, CarFront, CheckCircle, Clock, SearchCheck, Award, MapPin, Zap, Handshake, ShieldAlert } from 'lucide-react';
import GoogleReviews from '../components/GoogleReviews';
import HappyCustomers from '../components/HappyCustomers';

// Animation variants for Framer Motion
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

export default function AboutPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read service from URL or default to 'buy'
  const initialService = searchParams.get('service') || 'buy';
  const [activeTab, setActiveTab] = useState(initialService);

  // Sync state and scroll if URL changes
  useEffect(() => {
    const serviceFromUrl = searchParams.get('service');
    if (serviceFromUrl && ['buy', 'sell', 'exchange'].includes(serviceFromUrl)) {
      setActiveTab(serviceFromUrl);

      // Auto-scroll logic so users are instantly mapped to the matching content
      setTimeout(() => {
        const el = document.getElementById('core-services');
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 300);
    }
  }, [searchParams]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ service: tabId }, { replace: true });
  };

  const tabs = [
    { id: 'buy', label: 'ખરીદો (Buy)' },
    { id: 'sell', label: 'વેચો (Sell)' },
    { id: 'exchange', label: 'બદલો (Exchange)' },
  ];

  return (
    <div className="flex flex-col flex-grow min-h-screen bg-background overflow-x-hidden">
      <Helmet>
        <title>About Sadguru Car Surat — Surat's Trusted Car Dealership Since 2011</title>
        <meta name="description" content="Learn about Sadguru Car Surat — Surat's most trusted pre-owned car dealership since 2011. Buy, sell, or exchange certified vehicles with 100% transparency." />
        <meta property="og:title" content="About Sadguru Car Surat — Surat's Trusted Car Dealership" />
        <meta property="og:description" content="Buy, sell, or exchange certified pre-owned cars. 500+ happy customers, 4.8 Google rating." />
      </Helmet>

      {/* 1. Hero Section (Senior UI/UX Upgrade) */}
      <section className="relative bg-slate-950 pt-28 pb-40 md:pt-32 md:pb-48 px-4 text-center overflow-hidden border-b border-slate-900">
        {/* Dynamic Abstract Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[400px] md:w-[700px] h-[400px] md:h-[700px] bg-brand-orange/15 rounded-full blur-[100px] md:blur-[130px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-brand-orange/10 rounded-full blur-[90px] md:blur-[120px] pointer-events-none mix-blend-screen"></div>

        {/* High-End Technical CSS Grid Background with Fading Mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_100%)] pointer-events-none"></div>

        <motion.div
          className="max-w-4xl mx-auto relative z-10 flex flex-col items-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Glassmorphic Minimal Trust Badge */}
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-slate-900/50 border border-slate-800 backdrop-blur-md mb-6 md:mb-8 shadow-2xl">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="font-heading font-bold text-xs sm:text-sm uppercase tracking-wider text-slate-200">
              સુરતમાં 2011 થી કાર્યરત
            </span>
          </motion.div>

          {/* Main Heading - Simple English */}
          <motion.h1 variants={fadeInUp} className="font-heading font-bold text-4xl sm:text-5xl md:text-[72px] text-white leading-[1.15] md:leading-[1.1] mb-5 md:mb-6 tracking-tight">
            100% ભરોસા સાથે <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-400 to-yellow-500 block sm:inline">Verified Cars</span> ખરીદો અને વેચો
          </motion.h1>

          {/* Basic Gujarati + English Mix Subtext */}
          <motion.p variants={fadeInUp} className="font-body text-base md:text-[22px] text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed px-2">
            સુરતનું સૌથી ભરોસાપાત્ર Car Showroom. શ્રેષ્ઠ કિંમતે ખરીદો 100% <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded-md mx-0.5 border border-white/5 inline-block mt-1 sm:mt-0">Non-Accidental</span> અને <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded-md mx-0.5 border border-white/5 inline-block mt-1 sm:mt-0">Certified Used Cars</span>
          </motion.p>
        </motion.div>
      </section>

      {/* --- Seamless Wrapper for Stats, Legacy, Standard & Services Sections --- */}
      <div className="bg-white relative">

        {/* 2. Overlapping Stats Card (Premium Integration) */}
        <section className="px-4 relative z-20 border-t border-transparent">
          <motion.div
            className="-mt-20 md:-mt-24 max-w-4xl mx-auto bg-white rounded-[2rem] md:rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] ring-1 ring-slate-100 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between divide-y md:divide-y-0 md:divide-x divide-slate-100 gap-8 md:gap-0 text-center relative z-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={scaleUp}
          >
            <div className="flex flex-col items-center justify-center w-full pb-8 md:pb-0 group">
              <span className="font-heading font-bold text-4xl md:text-5xl text-slate-900 mb-2 group-hover:scale-105 transition-transform">5000<span className="text-brand-orange font-medium">+</span></span>
              <span className="font-body text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Happy Customers</span>
            </div>

            <div className="flex flex-col items-center justify-center w-full py-8 md:py-0 group">
              <div className="flex items-center gap-2 mb-2 group-hover:scale-105 transition-transform">
                <Star className="w-6 h-6 md:w-7 md:h-7 fill-amber-400 text-amber-400" />
                <span className="font-heading font-bold text-4xl md:text-5xl text-slate-900">4.8</span>
              </div>
              <span className="font-body text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Google Rating</span>
            </div>

            <div className="flex flex-col items-center justify-center w-full pt-8 md:pt-0 group">
              <span className="font-heading font-bold text-4xl md:text-5xl text-slate-900 mb-2 group-hover:scale-105 transition-transform">50<span className="text-brand-orange font-medium">+</span></span>
              <span className="font-body text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Verified Cars</span>
            </div>
          </motion.div>
        </section>

        {/* 3. More Than Just a Car Bazar Section (50x Premium Upgrade) */}
        <section className="py-16 md:py-24 px-4 relative overflow-hidden">
          {/* Dynamic Abstract Background Elements (Light Mode) */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/3 w-[800px] h-[800px] bg-brand-orange/5 rounded-full blur-[150px] pointer-events-none mix-blend-multiply"></div>
          <div className="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>

          {/* Architectural Grid Background with radial mask */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_30%,transparent_100%)] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center relative z-10">

            {/* Image & Showcase - Takes up 5 columns */}
            <motion.div
              className="lg:col-span-5 relative group order-2 lg:order-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
            >
              {/* Glowing inner shadow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-brand-orange/20 via-amber-400/20 to-yellow-500/20 rounded-[2rem] md:rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>

              <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-1 ring-slate-100 h-[350px] sm:h-[450px] lg:h-[600px] bg-slate-100">
                <img
                  src="/about.png"
                  alt="Premium Car Showcase"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent"></div>

                {/* Floating Legacy Badge */}
                <div className="absolute top-4 left-4 right-4 md:top-8 md:left-8 md:right-8 bg-white/95 backdrop-blur-md p-5 md:p-6 rounded-2xl md:rounded-3xl flex items-center gap-4 md:gap-5 shadow-2xl transform md:-translate-y-2 md:group-hover:translate-y-0 transition-all duration-500 ring-1 ring-slate-200/50">
                  <div className="font-heading font-black text-4xl md:text-5xl text-brand-orange">13+</div>
                  <div>
                    <div className="font-heading font-bold text-base md:text-lg text-slate-900 mb-0.5">વર્ષોનો અતૂટ વિશ્વાસ</div>
                    <div className="font-body text-xs md:text-sm text-slate-500 font-medium leading-tight line-clamp-2 md:line-clamp-none">2011 થી પ્રીમિયમ કાર્સ માટેનું સૌથી પ્રતિષ્ઠિત અને ભરોસાપાત્ર સરનામું</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Typography & Text Content - Takes up 7 columns */}
            <motion.div
              className="flex flex-col lg:col-span-7 order-1 lg:order-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 w-max mb-6 md:mb-8 shadow-sm hover:bg-brand-orange/15 transition-colors cursor-default">
                <Star className="w-3 h-3 md:w-4 md:h-4 text-brand-orange" />
                <span className="font-heading font-bold text-xs md:text-sm tracking-widest text-brand-orange uppercase">Our Heritage</span>
              </motion.div>

              <motion.h2 variants={fadeInUp} className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-slate-900 mb-6 md:mb-8 leading-[1.2] md:leading-[1.15] tracking-tight">
                માત્ર એક કાર કલેક્શનથી <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-500">ઘણું વિશેષ</span>
              </motion.h2>

              <motion.div variants={fadeInUp} className="font-body text-base md:text-lg text-slate-600 space-y-5 md:space-y-6 leading-relaxed mb-8 md:mb-12 relative">
                <div className="absolute left-0 top-2 bottom-2 w-1 md:w-1.5 bg-gradient-to-b from-brand-orange to-yellow-400 rounded-full"></div>
                <p className="pl-6 md:pl-8 text-lg md:text-xl font-medium text-slate-800">
                  સદગુરુ કાર મેળો ખાતે, અમારું માનવું છે કે પ્રી-ઓન્ડ વાહન ખરીદવું એ નવી કાર ખરીદવા જેટલું જ ગૌરવપૂર્ણ હોવું જોઈએ. 2011 માં સ્થપાયેલ, અમે પારદર્શિતા અને શ્રેષ્ઠ ગુણવત્તાના સ્તંભો પર અમારી પ્રતિષ્ઠાનું નિર્માણ કર્યું છે.
                </p>
                <p className="pl-6 md:pl-8">
                  અમારા શોરૂમમાં રહેલું દરેક વાહન કડક ચકાસણી પ્રક્રિયામાંથી પસાર થાય છે. અમારું ધ્યાન સંપૂર્ણપણે <span className="font-bold">નોન-એક્સિડેન્ટલ અને RTO-પ્રમાણિત</span> વાહનો પર જ કેન્દ્રિત રહે છે. અમે 'ત્રિલોક Car Showroom'ના ગૌરવપૂર્ણ ભાગીદાર છીએ, જે વિશ્વાસનો એવો વારસો સુનિશ્ચિત કરે છે જેના પર વરાછાના લોકોએ એક દાયકાથી વધુ સમયથી ભરોસો મૂક્યો છે.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 md:gap-10">
                <button className="group relative inline-flex items-center justify-center gap-3 bg-slate-900 text-white font-heading font-bold text-sm md:text-base px-6 py-4 md:px-8 md:py-4 rounded-xl md:rounded-2xl shadow-[0_10px_20px_rgba(15,23,42,0.15)] hover:shadow-[0_15px_30px_rgba(15,23,42,0.25)] transition-all hover:-translate-y-1 overflow-hidden min-h-[50px] w-full sm:w-auto">
                  <span className="relative z-10 flex items-center gap-2">
                    Discover Our Legacy
                    <Award className="w-4 h-4 md:w-5 md:h-5 text-brand-orange group-hover:rotate-12 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform"></div>
                </button>

                <div className="flex items-center justify-center sm:justify-start gap-3 md:gap-4 bg-slate-50 px-4 py-3 md:px-5 md:py-3 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm w-full sm:w-auto">
                  <div className="flex -space-x-2 md:-space-x-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-emerald-50 flex items-center justify-center shadow-sm relative z-30">
                      <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center shadow-sm relative z-20">
                      <Landmark className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-orange-50 flex items-center justify-center shadow-sm relative z-10">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-brand-orange" />
                    </div>
                  </div>
                  <div className="text-xs md:text-sm font-heading font-bold text-slate-500">
                    <span className="block text-slate-900 text-sm md:text-base">100% Certified</span>
                    Trust & Security
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </section>

        {/* 4. The Sadguru Standard (Premium 10x UI) */}
        <section className="py-16 md:py-24 px-4 relative overflow-hidden bg-slate-50/50">
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              className="text-center mb-12 md:mb-20 flex flex-col items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
            >
              <span className="font-heading font-bold text-xs md:text-sm uppercase tracking-[0.3em] text-brand-orange mb-3">અમારું Promise</span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-slate-900 mb-5 md:mb-6 tracking-tight">
                અમારું <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-500">સદગુરુ Standard</span>
              </h2>
              <div className="w-16 md:w-24 h-1.5 bg-gradient-to-r from-brand-orange to-yellow-400 rounded-full"></div>
              <p className="mt-5 md:mt-6 font-body text-slate-500 max-w-2xl mx-auto text-base md:text-lg leading-relaxed px-2">
                અમે ફક્ત કાર નથી વેચતા. કડક <span className="font-bold text-slate-800">Quality Control</span>, પારદર્શક પ્રક્રિયા અને અજોડ <span className="font-bold text-slate-800">Customer Support</span> દ્વારા અમે તમને માનસિક શાંતિ (Peace of Mind) આપીએ છીએ.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 xl:gap-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              {/* Card 1 */}
              <motion.div variants={fadeInUp} className="group relative bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-primary/20 transition-all duration-300 md:hover:-translate-y-2 overflow-hidden flex flex-col h-full">
                <div className="absolute -right-6 -top-10 font-heading font-black text-[100px] md:text-[120px] text-slate-50 group-hover:text-primary/5 transition-colors duration-300 pointer-events-none select-none">01</div>
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-white relative z-10">
                  <ShieldCheck className="w-7 h-7 md:w-8 md:h-8 text-primary stroke-[1.5]" />
                </div>
                <h3 className="inline-flex items-center w-fit font-heading font-bold text-[15px] md:text-[17px] text-slate-800 mb-4 md:mb-5 relative z-10 px-3 py-2 md:px-4 border border-slate-200 bg-slate-50 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                  100% Inspection Guarantee
                </h3>
                <p className="font-body text-slate-600 leading-relaxed text-sm relative z-10">
                  દરેક કારને નિષ્ણાતો દ્વારા ચેક કરવામાં આવે છે જેથી તમને 100% Mechanical પરફેક્શન મળે.
                </p>
              </motion.div>

              {/* Card 2 */}
              <motion.div variants={fadeInUp} className="group relative bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-emerald-500/20 transition-all duration-300 md:hover:-translate-y-2 overflow-hidden flex flex-col h-full">
                <div className="absolute -right-6 -top-10 font-heading font-black text-[100px] md:text-[120px] text-slate-50 group-hover:text-emerald-500/5 transition-colors duration-300 pointer-events-none select-none">02</div>
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-white relative z-10">
                  <FileText className="w-7 h-7 md:w-8 md:h-8 text-emerald-600 stroke-[1.5]" />
                </div>
                <h3 className="inline-flex items-center w-fit font-heading font-bold text-[15px] md:text-[17px] text-slate-800 mb-4 md:mb-5 relative z-10 px-3 py-2 md:px-4 border border-slate-200 bg-slate-50 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] group-hover:border-emerald-500/40 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-all duration-300">
                  ઝડપી RC Transfer
                </h3>
                <p className="font-body text-slate-600 leading-relaxed text-sm relative z-10">
                  કાગળની કાર્યવાહીની ઝંઝટમાંથી મુક્તિ. અમે તમામ Documentation ઝડપથી અને સંપૂર્ણ પારદર્શક રીતે પૂર્ણ કરીએ છીએ.
                </p>
              </motion.div>

              {/* Card 3 */}
              <motion.div variants={fadeInUp} className="group relative bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-purple-500/20 transition-all duration-300 md:hover:-translate-y-2 overflow-hidden flex flex-col h-full">
                <div className="absolute -right-6 -top-10 font-heading font-black text-[100px] md:text-[120px] text-slate-50 group-hover:text-purple-500/5 transition-colors duration-300 pointer-events-none select-none">03</div>
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-50 to-fuchsia-50 flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-white relative z-10">
                  <Landmark className="w-7 h-7 md:w-8 md:h-8 text-purple-600 stroke-[1.5]" />
                </div>
                <h3 className="inline-flex items-center w-fit font-heading font-bold text-[15px] md:text-[17px] text-slate-800 mb-4 md:mb-5 relative z-10 px-3 py-2 md:px-4 border border-slate-200 bg-slate-50 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] group-hover:border-purple-500/40 group-hover:bg-purple-50 group-hover:text-purple-700 transition-all duration-300">
                  સરળ Loan Approvals
                </h3>
                <p className="font-body text-slate-600 leading-relaxed text-sm relative z-10">
                  Top Banks સાથેના જોડાણને કારણે અમે તમને સૌથી ઓછા Interest Rates અને ઝડપી Loan ની સુવિધા આપીએ છીએ.
                </p>
              </motion.div>

              {/* Card 4 */}
              <motion.div variants={fadeInUp} className="group relative bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-brand-orange/20 transition-all duration-300 md:hover:-translate-y-2 overflow-hidden flex flex-col h-full">
                <div className="absolute -right-6 -top-10 font-heading font-black text-[100px] md:text-[120px] text-slate-50 group-hover:text-brand-orange/5 transition-colors duration-300 pointer-events-none select-none">04</div>
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-white relative z-10">
                  <Tag className="w-7 h-7 md:w-8 md:h-8 text-brand-orange stroke-[1.5]" />
                </div>
                <h3 className="inline-flex items-center w-fit font-heading font-bold text-[15px] md:text-[17px] text-slate-800 mb-4 md:mb-5 relative z-10 px-3 py-2 md:px-4 border border-slate-200 bg-slate-50 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] group-hover:border-brand-orange/40 group-hover:bg-orange-50 group-hover:text-orange-700 transition-all duration-300">
                  100% Transparent Pricing
                </h3>
                <p className="font-body text-slate-600 leading-relaxed text-sm relative z-10">
                  કોઈ Hidden Fees નહીં. તમે જે જુઓ છો તે જ તમારે ચૂકવવાનું રહે છે, સંપૂર્ણ પારદર્શિતા (Transparency) સાથે.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 50x Premium Core Services Section - LIGHT MODE UPGRADE */}
        <section id="core-services" className="py-16 md:py-24 px-4 relative z-10 scroll-mt-24 overflow-hidden">
          {/* Dynamic Abstract Background Elements (Light Mode) */}
          <div className="absolute top-1/4 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-brand-orange/5 rounded-full blur-[100px] md:blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-primary/5 rounded-full blur-[100px] md:blur-[120px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto relative z-20">
            <motion.div
              className="text-center mb-12 md:mb-20 flex flex-col items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
            >
              <span className="font-heading font-bold text-xs md:text-sm uppercase tracking-[0.3em] text-brand-orange mb-3 md:mb-4">અમારી વિશેષતા</span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-6xl text-slate-900 mb-5 md:mb-6 tracking-tight">
                કારને લગતી <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-500">દરેક સુવિધા</span> એક જ જગ્યાએ
              </h2>
              <div className="w-16 md:w-24 h-1.5 bg-gradient-to-r from-brand-orange to-yellow-400 rounded-full mb-6 md:mb-8 shadow-sm"></div>
              <p className="font-body text-base md:text-xl text-slate-600 max-w-3xl px-2">
                Pre-owned કલેક્શનનો સૌથી શ્રેષ્ઠ અનુભવ. 100% <span className="font-bold text-slate-800">Quality Inspection</span> થી લઈને <span className="font-bold text-slate-800"> Instant Payment</span> સુધીની તમામ સુવિધાઓ.
              </p>
            </motion.div>

            {/* Premium Tab Navigation (Light Mode) */}
            <motion.div
              className="grid grid-cols-3 sm:flex sm:flex-row sm:justify-center gap-2 sm:gap-3 md:gap-4 mb-10 md:mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleUp}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`group relative px-1 py-3 sm:px-6 sm:py-3 md:px-12 md:py-4 rounded-xl md:rounded-2xl font-heading font-bold transition-all duration-500 overflow-hidden shadow-sm flex items-center justify-center w-full sm:w-auto sm:min-w-[200px] md:min-w-[250px] min-h-[60px] sm:min-h-[48px] md:min-h-[56px] ${activeTab === tab.id
                    ? 'text-white scale-[1.02] sm:scale-105 ring-1 ring-primary/20 shadow-[0_10px_20px_rgba(37,99,235,0.2)] z-10'
                    : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}
                >
                  {activeTab === tab.id && (
                    <motion.div layoutId="activeTabBackground" className="absolute inset-0 bg-primary opacity-100"></motion.div>
                  )}
                  {/* Hover gradient effect for inactive */}
                  {activeTab !== tab.id && (
                    <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  )}
                  <span className="relative z-10 flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 md:gap-3 text-center whitespace-nowrap">
                    {tab.id === 'buy' && <CarFront className={`w-4 h-4 md:w-6 md:h-6 ${activeTab === tab.id ? 'text-white' : 'text-primary transition-colors group-hover:text-blue-700'}`} />}
                    {tab.id === 'sell' && <Banknote className={`w-4 h-4 md:w-6 md:h-6 ${activeTab === tab.id ? 'text-white' : 'text-emerald-600 transition-colors group-hover:text-emerald-700'}`} />}
                    {tab.id === 'exchange' && <RefreshCw className={`w-4 h-4 md:w-6 md:h-6 ${activeTab === tab.id ? 'text-white' : 'text-brand-orange transition-colors group-hover:text-orange-700'}`} />}
                    <span className="text-[10px] sm:text-sm md:text-lg tracking-tight sm:tracking-normal">{tab.label}</span>
                  </span>
                </button>
              ))}
            </motion.div>

            {/* Dynamic Light Mode Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 ring-1 ring-slate-100 rounded-[2rem] md:rounded-[3rem] p-6 sm:p-8 md:p-14 bg-white relative overflow-hidden min-h-[500px] shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              {/* Inner aesthetic glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full sm:w-3/4 h-1/2 bg-slate-50/50 rounded-full blur-[60px] sm:blur-[100px] pointer-events-none"></div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="col-span-1 lg:col-span-12 flex flex-col lg:flex-row gap-10 lg:gap-16 relative z-10 w-full items-center"
                >
                  {/* TAB CONTENT: BUY */}
                  {activeTab === 'buy' && (
                    <>
                      <div className="flex-1 w-full order-2 lg:order-1">
                        <h3 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-slate-900 mb-4 md:mb-5 tracking-tight">100% ભરોસા સાથે <span className="text-brand-orange">Dream Car</span> ખરીદો</h3>
                        <p className="font-body text-slate-600 text-base md:text-lg leading-relaxed mb-8 md:mb-10">
                          Pre-owned ખરીદવી હવે ચિંતાનો વિષય નથી. અમે તમને સંપૂર્ણ પારદર્શક અને <span className="font-semibold text-slate-800">Premium Buying Experience</span> આપીએ છીએ.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 md:gap-y-8">
                          {/* Items ... */}
                          <div className="flex items-start gap-3 md:gap-4 group">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-1 md:group-hover:bg-blue-100 md:group-hover:scale-110 transition-all duration-300 shadow-sm">
                              <SearchCheck className="w-5 h-5 md:w-6 md:h-6 text-brand-orange" />
                            </div>
                            <div>
                              <span className="block font-heading font-bold text-slate-900 text-base md:text-lg group-hover:text-blue-700 transition-colors">110-Point Inspection</span>
                              <span className="font-body text-slate-600 text-xs md:text-sm mt-1 block leading-relaxed">બમ્પરથી બમ્પર સુધી Mechanical પરફેક્શન માટે કડક ટેસ્ટિંગ.</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 md:gap-4 group">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-1 md:group-hover:bg-emerald-100 md:group-hover:scale-110 transition-all duration-300 shadow-sm">
                              <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                            </div>
                            <div>
                              <span className="block font-heading font-bold text-slate-900 text-base md:text-lg group-hover:text-emerald-700 transition-colors">Non-Accidental</span>
                              <span className="font-body text-slate-600 text-xs md:text-sm mt-1 block leading-relaxed">સ્ટ્રક્ચરલ મજબૂતાઈ અને 100% Genuine હિસ્ટ્રીની ખાતરી.</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 md:gap-4 group">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 mt-1 md:group-hover:bg-purple-100 md:group-hover:scale-110 transition-all duration-300 shadow-sm">
                              <Landmark className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                            </div>
                            <div>
                              <span className="block font-heading font-bold text-slate-900 text-base md:text-lg group-hover:text-purple-700 transition-colors">Zero Downpayment</span>
                              <span className="font-body text-slate-600 text-xs md:text-sm mt-1 block leading-relaxed">100% સુધી સરળ અને Fast-track ફાઇનાન્સિંગ ઓપ્શન્સ.</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 md:gap-4 group">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 mt-1 md:group-hover:bg-orange-100 md:group-hover:scale-110 transition-all duration-300 shadow-sm">
                              <CarFront className="w-5 h-5 md:w-6 md:h-6 text-brand-orange" />
                            </div>
                            <div>
                              <span className="block font-heading font-bold text-slate-900 text-base md:text-lg group-hover:text-orange-700 transition-colors">150+ Premium Cars</span>
                              <span className="font-body text-slate-600 text-xs md:text-sm mt-1 block leading-relaxed">સુરતમાં સૌથી મોટું અને શ્રેષ્ઠ Premium કાર્સનું કલેક્શન.</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 md:gap-4 group">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 mt-1 md:group-hover:bg-teal-100 md:group-hover:scale-110 transition-all duration-300 shadow-sm">
                              <FileText className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />
                            </div>
                            <div>
                              <span className="block font-heading font-bold text-slate-900 text-base md:text-lg group-hover:text-teal-700 transition-colors">Hassle-Free RC Transfer</span>
                              <span className="font-body text-slate-600 text-xs md:text-sm mt-1 block leading-relaxed">કાગળની કાર્યવાહીની સંપૂર્ણ જવાબદારી અમારી, જેથી તમને મળે Peace of Mind.</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 md:gap-4 group">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 mt-1 md:group-hover:bg-rose-100 md:group-hover:scale-110 transition-all duration-300 shadow-sm">
                              <Handshake className="w-5 h-5 md:w-6 md:h-6 text-rose-600" />
                            </div>
                            <div>
                              <span className="block font-heading font-bold text-slate-900 text-base md:text-lg group-hover:text-rose-700 transition-colors">After-Sales Support</span>
                              <span className="font-body text-slate-600 text-xs md:text-sm mt-1 block leading-relaxed">કાર ખરીદ્યા પછી પણ સર્વિસ અને કોઈપણ સહાયતા માટે અમારી ટીમ હંમેશા તૈયાર.</span>
                            </div>
                          </div>

                        </div>
                      </div>

                      <div className="w-full lg:w-5/12 flex items-center justify-center relative order-1 lg:order-2">
                        <div className="relative w-full aspect-[4/3] sm:aspect-square lg:aspect-[4/5] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)] group">
                          <img src="https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1000&auto=format&fit=crop" alt="Buy a Premium Car" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* TAB CONTENT: SELL */}
                  {activeTab === 'sell' && (
                    <>
                      <div className="flex-1 w-full order-2 lg:order-1">
                        <h3 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-slate-900 mb-4 md:mb-5 tracking-tight">શ્રેષ્ઠ કિંમતે કાર વેચો અને <span className="text-emerald-600 block sm:inline">Instant Payment</span> મેળવો</h3>
                        <p className="font-body text-slate-600 text-base md:text-lg leading-relaxed mb-8 md:mb-10">
                          ભાવતાલની કોઈ ઝંઝટ નહીં. સૌથી સાચો ભાવ મેળવો અને કોઈ પણ રિસ્ક વગર સીધા તમારા બેંક ખાતામાં <span className="font-semibold text-slate-800">Instant Payment</span> મેળવો.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 md:gap-y-8">
                          <div className="flex items-start gap-3 md:gap-4 group">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-1 md:group-hover:bg-emerald-100 md:group-hover:scale-110 transition-all duration-300 shadow-sm">
                              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                            </div>
                            <div>
                              <span className="block font-heading font-bold text-slate-900 text-base md:text-lg group-hover:text-emerald-700 transition-colors">Instant Fair Valuation</span>
                              <span className="font-body text-slate-600 text-xs md:text-sm mt-1 block leading-relaxed">માર્કેટ મુજબ સાચી કિંમતનું ડેટાબેઝ્ડ અને નિષ્ણાતો દ્વારા વેરિફિકેશન.</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 md:gap-4 group">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0 mt-1 md:group-hover:bg-green-100 md:group-hover:scale-110 transition-all duration-300 shadow-sm">
                              <Clock className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                            </div>
                            <div>
                              <span className="block font-heading font-bold text-slate-900 text-base md:text-lg group-hover:text-green-700 transition-colors">15 મિનિટમાં Payment</span>
                              <span className="font-body text-slate-600 text-xs md:text-sm mt-1 block leading-relaxed">ડીલ ફાઇનલ થતાં જ સીધા બેંક એકાઉન્ટમાં Immediate Transfer.</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 md:gap-4 group">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-1 md:group-hover:bg-blue-100 md:group-hover:scale-110 transition-all duration-300 shadow-sm">
                              <FileText className="w-5 h-5 md:w-6 md:h-6 text-brand-orange" />
                            </div>
                            <div>
                              <span className="block font-heading font-bold text-slate-900 text-base md:text-lg group-hover:text-blue-700 transition-colors">Free RC Transfer</span>
                              <span className="font-body text-slate-600 text-xs md:text-sm mt-1 block leading-relaxed">કોઈપણ ખર્ચ વગર RTO ની તમામ કાયદાકીય કામગીરીની ખાતરી.</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 md:gap-4 group">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 mt-1 md:group-hover:bg-orange-100 md:group-hover:scale-110 transition-all duration-300 shadow-sm">
                              <MapPin className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                            </div>
                            <div>
                              <span className="block font-heading font-bold text-slate-900 text-base md:text-lg group-hover:text-orange-700 transition-colors">Doorstep Evaluation</span>
                              <span className="font-body text-slate-600 text-xs md:text-sm mt-1 block leading-relaxed">ઝડપી અને ફ્રી કાર ચેકિંગ માટે અમે તમારા લોકેશન પર આવીશું.</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 md:gap-4 group">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0 mt-1 md:group-hover:bg-red-100 md:group-hover:scale-110 transition-all duration-300 shadow-sm">
                              <Tag className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                            </div>
                            <div>
                              <span className="block font-heading font-bold text-slate-900 text-base md:text-lg group-hover:text-red-700 transition-colors">No Hidden Charges</span>
                              <span className="font-body text-slate-600 text-xs md:text-sm mt-1 block leading-relaxed">કાર વેચવાની પ્રક્રિયા સંપૂર્ણપણે ફ્રી છે, કોઈ કમિશન કે હિડન ચાર્જ વસૂલવામાં આવતો નથી.</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 md:gap-4 group">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-1 md:group-hover:bg-indigo-100 md:group-hover:scale-110 transition-all duration-300 shadow-sm">
                              <Landmark className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                            </div>
                            <div>
                              <span className="block font-heading font-bold text-slate-900 text-base md:text-lg group-hover:text-indigo-700 transition-colors">Loan Settlement</span>
                              <span className="font-body text-slate-600 text-xs md:text-sm mt-1 block leading-relaxed">જો તમારી કાર પર લોન ચાલુ હોય, તો અમે તેનું સીધું બેંક સેટલમેન્ટ કરી આપીએ છીએ.</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-full lg:w-5/12 flex items-center justify-center relative order-1 lg:order-2">
                        <div className="relative w-full aspect-[4/3] sm:aspect-square lg:aspect-[4/5] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)] group">
                          <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop" alt="Sell Your Car" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* TAB CONTENT: EXCHANGE */}
                  {activeTab === 'exchange' && (
                    <>
                      <div className="flex-1 w-full order-2 lg:order-1">
                        <h3 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-slate-900 mb-4 md:mb-5 tracking-tight">જૂની કાર આપી નવી <span className="text-brand-orange block sm:inline">Dream Car</span> ઘરે લાવો</h3>
                        <p className="font-body text-slate-600 text-base md:text-lg leading-relaxed mb-8 md:mb-10">
                          શું તમે નવી કાર લેવાનું વિચારી રહ્યા છો? તમારી જૂની કારની સાચી કિંમત મેળવો અને તે જ દિવસે તમારી પસંદગીની નવી <span className="font-semibold text-slate-800">Premium Car</span> ઘરે લઈ જાવ.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 md:gap-y-8">
                          <div className="flex items-start gap-3 md:gap-4 group">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 mt-1 md:group-hover:bg-orange-100 md:group-hover:scale-110 transition-all duration-300 shadow-sm">
                              <RefreshCw className="w-5 h-5 md:w-6 md:h-6 text-brand-orange" />
                            </div>
                            <div>
                              <span className="block font-heading font-bold text-slate-900 text-base md:text-lg group-hover:text-orange-700 transition-colors">The Seamless Process</span>
                              <span className="font-body text-slate-600 text-xs md:text-sm mt-1 block leading-relaxed">તમારી જૂની કાર લાવો અને નવી પસંદ કરો, કિંમત તરત Adjust કરવામાં આવશે.</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 md:gap-4 group">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-yellow-50 border border-yellow-100 flex items-center justify-center shrink-0 mt-1 md:group-hover:bg-yellow-100 md:group-hover:scale-110 transition-all duration-300 shadow-sm">
                              <Banknote className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
                            </div>
                            <div>
                              <span className="block font-heading font-bold text-slate-900 text-base md:text-lg group-hover:text-yellow-700 transition-colors">Exchange Bonus</span>
                              <span className="font-body text-slate-600 text-xs md:text-sm mt-1 block leading-relaxed">માત્ર એક્સચેન્જ પર મળતા Special Price બેનિફિટ્સનો લાભ લો.</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 md:gap-4 group">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-1 md:group-hover:bg-blue-100 md:group-hover:scale-110 transition-all duration-300 shadow-sm">
                              <CarFront className="w-5 h-5 md:w-6 md:h-6 text-brand-orange" />
                            </div>
                            <div>
                              <span className="block font-heading font-bold text-slate-900 text-base md:text-lg group-hover:text-blue-700 transition-colors">Drive Out Same Day</span>
                              <span className="font-body text-slate-600 text-xs md:text-sm mt-1 block leading-relaxed">ઝડપી પેપરવર્કને કારણે તે જ દિવસે તમારી નવી કાર સાથે ઘરે જાવ.</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 md:gap-4 group">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-1 md:group-hover:bg-emerald-100 md:group-hover:scale-110 transition-all duration-300 shadow-sm">
                              <Zap className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                            </div>
                            <div>
                              <span className="block font-heading font-bold text-slate-900 text-base md:text-lg group-hover:text-emerald-700 transition-colors">Top Market Value</span>
                              <span className="font-body text-slate-600 text-xs md:text-sm mt-1 block leading-relaxed">અમારા ફેલાયેલા નેટવર્ક દ્વારા તમને સૌથી ઊંચી કિંમત મળે તેની ખાતરી.</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 md:gap-4 group">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0 mt-1 md:group-hover:bg-cyan-100 md:group-hover:scale-110 transition-all duration-300 shadow-sm">
                              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-cyan-600" />
                            </div>
                            <div>
                              <span className="block font-heading font-bold text-slate-900 text-base md:text-lg group-hover:text-cyan-700 transition-colors">Any Car, Any Condition</span>
                              <span className="font-body text-slate-600 text-xs md:text-sm mt-1 block leading-relaxed">તમારી જૂની કાર કોઈપણ કંપની કે મોડલની હોય, અમે તેને બેસ્ટ વેલ્યુ સાથે એક્સચેન્જ કરીશું.</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 md:gap-4 group">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-fuchsia-50 border border-fuchsia-100 flex items-center justify-center shrink-0 mt-1 md:group-hover:bg-fuchsia-100 md:group-hover:scale-110 transition-all duration-300 shadow-sm">
                              <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-fuchsia-600" />
                            </div>
                            <div>
                              <span className="block font-heading font-bold text-slate-900 text-base md:text-lg group-hover:text-fuchsia-700 transition-colors">Transparent Upgrade</span>
                              <span className="font-body text-slate-600 text-xs md:text-sm mt-1 block leading-relaxed">જૂની કારની સાચી કિંમત અને નવી કારનો બેસ્ટ ભાવ – 100% પારદર્શિતા સાથે.</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-full lg:w-5/12 flex items-center justify-center relative order-1 lg:order-2">
                        <div className="relative w-full aspect-[4/3] sm:aspect-square lg:aspect-[4/5] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)] group">
                          <img src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000&auto=format&fit=crop" alt="Exchange Your Car" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 5. Google Reviews Section */}
        <div className="bg-slate-50/50 border-t border-slate-100">
          <GoogleReviews />
        </div>

        {/* 6. Happy Customers Section */}
        <div className="bg-white border-t border-slate-100 pb-16">
          <HappyCustomers />
        </div>
      </div>
    </div>
  );
}