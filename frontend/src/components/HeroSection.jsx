import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, MapPin, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCars } from '../context/CarContext';

export default function HeroSection() {
  const navigate = useNavigate();
  const { cars } = useCars();

  // Coming Soon Carousel State
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const comingSoonCars = cars.filter(c => c.status === 'Coming Soon');

  useEffect(() => {
    if (comingSoonCars.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentCarIndex((prev) => (prev + 1) % comingSoonCars.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [comingSoonCars.length]);

  const formatPrice = (price) => {
    return price >= 100000
      ? `₹${(price / 100000).toFixed(2)} Lakhs`
      : `₹${(price || 0).toLocaleString('en-IN')}`;
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const carSlideVariants = {
    enter: { opacity: 0, x: 120, scale: 0.75, filter: 'blur(16px)' },
    center: {
      opacity: 1, x: 0, scale: 1, filter: 'blur(0px)',
      transition: { duration: 1, type: 'spring', bounce: 0.3 }
    },
    exit: {
      opacity: 0, x: -120, scale: 0.85, filter: 'blur(16px)',
      transition: { duration: 0.7, ease: 'easeIn' }
    }
  };

  const currentCar = comingSoonCars[currentCarIndex];

  return (
    <section className="relative w-full min-h-[100dvh] bg-[#030303] overflow-hidden font-['Inter',sans-serif]">

      {/* ════════════════════════════════════════════════════════════════
          PREMIUM ABSTRACT BACKGROUND
      ════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Primary warm gradient orb — top-left */}
        <div className="absolute top-[-20%] left-[-10%] w-[55vw] h-[55vw] bg-brand-orange/[0.08] rounded-full blur-[180px] animate-pulse"></div>
        {/* Secondary cool gradient orb — bottom-right */}
        <div className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] bg-amber-500/[0.04] rounded-full blur-[180px] animate-pulse" style={{ animationDelay: '2.5s' }}></div>
        {/* Centered radial accent behind the car column */}
        <div className="absolute top-[30%] right-[10%] w-[40vw] h-[40vw] bg-gradient-to-tr from-amber-600/[0.06] to-orange-400/[0.03] rounded-full blur-[160px] hidden lg:block"></div>

        {/* Subtle grid pattern for depth texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik00MCAwaC0xdjQwaDFWMHptMCAzOWgtNDB2MWg0MHYtMXoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyIgZmlsbC1ydWxlPSJldmVub2RkIi8+Cjwvc3ZnPg==')] opacity-30"></div>

        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#030303_100%)] opacity-70"></div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          MAIN GRID LAYOUT
      ════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 pt-20 pb-20 lg:pt-0 lg:pb-0 items-center min-h-[100dvh]">

        {/* ──────────────────────────────────────────────────
            LEFT COLUMN: TYPOGRAPHY & CTA
        ────────────────────────────────────────────────── */}
        <motion.div
          className="col-span-1 lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 pt-2 lg:pt-0"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Brand pill */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <div className="h-[2px] w-12 bg-gradient-to-r from-brand-orange to-transparent"></div>
            <span className="text-brand-orange text-sm font-bold tracking-[0.2em] uppercase">સદગુરુ કાર મેળો– વિશ્વાસ અને ગુણવત્તા સાથે.</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={itemVariants}
            className="text-[2.6rem] sm:text-5xl lg:text-[3.5rem] xl:text-[4.2rem] text-white font-black tracking-tight leading-[1.08]"
          >
            તમારી <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-400 to-yellow-500">સપનાની કાર,</span><br className="lg:hidden" />
            {" "}હવે તમારી નજીકમાં મળશે.
          </motion.h1>

          {/* Description */}
          <motion.p variants={itemVariants} className="text-base lg:text-lg text-slate-400 mt-6 font-medium leading-relaxed max-w-lg drop-shadow-sm">
            સુરતનું સૌથી વિશ્વાસપાત્ર લક્ઝરી કાર ડેસ્ટિનેશન. જ્યાં અતૂટ ભરોસો અને શ્રેષ્ઠતા મળે છે.
            સર્વોત્તમ ગુણવત્તા અને વિશ્વાસનું અજોડ સંગમ.
          </motion.p>

          {/* Trust badges & Location */}
          <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Google rating pill */}
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 shadow-lg">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-white font-bold text-sm ml-1">4.8/5.0</span>
              <div className="h-4 w-[1px] bg-white/20 mx-1"></div>
              <span className="text-slate-300 text-[10px] uppercase tracking-widest font-bold">ગૂગલ રિવ્યુઝ</span>
            </div>

            {/* Location link */}
            <button
              onClick={() => navigate('/contact')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full border border-white/10 transition-all duration-300 group cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-brand-orange" />
              <span className="text-white font-medium text-sm tracking-wide">વરાછા, સુરત</span>
              <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-brand-orange group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>


        {/* ──────────────────────────────────────────────────
            RIGHT COLUMN: CAR SHOWCASE — FIXED LAYOUT (NO OVERLAP)
        ────────────────────────────────────────────────── */}
        <div className="col-span-1 lg:col-span-7 relative order-1 lg:order-2 w-full mt-6 lg:mt-0">
          {comingSoonCars.length > 0 ? (
            <>
              {/* Infinite Marquee Text Background */}
              <div className="absolute inset-0 flex items-end justify-center overflow-hidden pointer-events-none z-0 pb-2 lg:pb-4">
                <motion.div
                  animate={{ x: [0, -1500] }}
                  transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
                  className="whitespace-nowrap"
                >
                  <h2 className="text-[3rem] lg:text-[6rem] font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-transparent via-amber-500/[0.12] to-transparent select-none tracking-tighter">
                    COMING SOON • COMING SOON • COMING SOON •
                  </h2>
                </motion.div>
              </div>

              {/* Central Glowing Orb behind car */}
              <motion.div
                key={`glow-${currentCarIndex}`}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[75%] h-[55%] bg-gradient-to-tr from-amber-500/15 to-brand-orange/5 blur-[120px] rounded-full pointer-events-none z-0"
              />

              {/* ═══════════════════════════════════════════════
                  FLEX COLUMN: Image on top → Info Card below
                  This uses normal document flow to PREVENT overlap
              ═══════════════════════════════════════════════ */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCarIndex}
                  variants={carSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative z-10 flex flex-col items-center w-full"
                >
                  {/* ── CAR IMAGE ── */}
                  <div className="relative w-full flex items-center justify-center pointer-events-none pt-0 lg:pt-6 pb-0">
                    <motion.div
                      animate={{ y: [0, -16, 0], rotateZ: [0, -0.5, 0, 0.5, 0] }}
                      transition={{
                        y: { repeat: Infinity, duration: 4.5, ease: "easeInOut" },
                        rotateZ: { repeat: Infinity, duration: 9, ease: "easeInOut" }
                      }}
                      className="w-full flex justify-center"
                    >
                      <img
                        src={currentCar.image || 'https://placehold.co/800x400/111/333?text=Incoming+Vehicle'}
                        alt={`${currentCar.make} ${currentCar.model}`}
                        className="w-[90%] sm:w-[85%] lg:w-[95%] xl:w-full h-auto object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.75)] max-h-[35vh] sm:max-h-[38vh] lg:max-h-[42vh] xl:max-h-[50vh] transform-gpu"
                      />
                    </motion.div>
                  </div>

                  {/* ── GLASSMORPHISM INFO CARD (Below the car — no overlap) ── */}
                  <div className="w-full sm:w-[92%] lg:w-[95%] xl:w-[90%] z-30 group mt-0 mb-7 lg:-mt-8">
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.9, delay: 0.35, type: "spring", bounce: 0.35 }}
                      onClick={() => navigate(`/car/${currentCar.id}`)}
                      className="relative bg-white/[0.04] backdrop-blur-[50px] border border-white/[0.08] p-5 sm:p-6 lg:px-8 lg:py-6 rounded-[1.75rem] cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.5),_inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden transform-gpu hover:-translate-y-1.5 hover:bg-white/[0.06] hover:border-amber-500/25 hover:shadow-[0_12px_48px_rgba(245,158,11,0.12)] transition-all duration-500 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0"
                    >
                      {/* Shimmer sweep on hover */}
                      <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-[1.5s] ease-out pointer-events-none" />

                      {/* Left: Title & Specs */}
                      <div className="w-full lg:w-auto flex-1 z-10 relative">
                        {/* Header Badge */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                            <div className="absolute w-full h-full rounded-full border border-amber-500/40 animate-[spin_4s_linear_infinite]" />
                            <Sparkles className="w-4 h-4 text-amber-500" />
                          </div>
                          <span className="text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase text-amber-400">
                            COMING SOON
                          </span>
                        </div>

                        {/* Car Name */}
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-2.5 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-amber-200 transition-all duration-500">
                          {currentCar.make} <span className="font-light">{currentCar.model}</span>
                        </h3>

                        {/* Spec Chips */}
                        {(currentCar.year || currentCar.fuelType || currentCar.transmission) && (
                          <div className="flex items-center gap-2.5 flex-wrap lg:hidden">
                            {currentCar.year && <span className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/[0.08] text-slate-300 text-xs font-bold uppercase tracking-wider">{currentCar.year}</span>}
                            {currentCar.fuelType && <span className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/[0.08] text-slate-300 text-xs font-bold uppercase tracking-wider">{currentCar.fuelType}</span>}
                            {currentCar.transmission && <span className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/[0.08] text-slate-300 text-xs font-bold uppercase tracking-wider">{currentCar.transmission}</span>}
                          </div>
                        )}
                      </div>

                      {/* Vertical / Horizontal Divider */}
                      <div className="w-full lg:w-[1px] h-[1px] lg:h-20 bg-gradient-to-r lg:bg-gradient-to-b from-transparent via-amber-500/40 to-transparent lg:mx-8 relative z-10" />

                      {/* Right: Price & CTA */}
                      <div className="flex items-center justify-between lg:justify-end lg:flex-col lg:items-end gap-3 w-full lg:w-auto relative z-10">
                        {/* Spec chips — only visible on lg+ (above price) */}
                        {(currentCar.year || currentCar.fuelType || currentCar.transmission) && (
                          <div className="hidden lg:flex items-center gap-2 flex-wrap justify-end">
                            {currentCar.year && <span className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/[0.08] text-slate-300 text-xs font-bold uppercase tracking-wider">{currentCar.year}</span>}
                            {currentCar.fuelType && <span className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/[0.08] text-slate-300 text-xs font-bold uppercase tracking-wider">{currentCar.fuelType}</span>}
                            {currentCar.transmission && <span className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/[0.08] text-slate-300 text-xs font-bold uppercase tracking-wider">{currentCar.transmission}</span>}
                          </div>
                        )}
                        {/* Price + Arrow */}
                        <div className="flex items-center gap-5 w-full lg:w-auto justify-between lg:justify-end">
                          {currentCar.price > 0 && (
                            <div className="flex flex-col lg:items-end lg:text-right">
                              <p className="text-[10px] text-amber-500/70 uppercase tracking-[0.15em] font-bold mb-1.5 flex items-center gap-1.5">
                                Expected Pricing
                              </p>
                              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
                                {formatPrice(currentCar.price)}
                              </p>
                            </div>
                          )}
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: -15 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-500 to-brand-orange shadow-[0_0_30px_rgba(245,158,11,0.35)] flex items-center justify-center transition-all duration-300 relative overflow-hidden shrink-0"
                          >
                            <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
                            <ArrowRight className="w-6 h-6 text-black relative z-10" strokeWidth={2.5} />
                          </motion.div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5 rounded-b-[1.75rem] overflow-hidden">
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 5, ease: "linear" }}
                          className="h-full bg-gradient-to-r from-amber-500 to-brand-orange origin-left shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                        />
                      </div>
                    </motion.div>
                  </div>

                </motion.div>
              </AnimatePresence>


            </>
          ) : (
            // Fallback empty state
            <div className="w-full h-[50vh] flex flex-col items-center justify-center opacity-30 select-none pointer-events-none z-10">
              <Car className="w-28 h-28 text-white/10 mb-4" />
              <h2 className="text-[3rem] lg:text-[4rem] font-black uppercase text-white/5 tracking-tighter">Premium Collection</h2>
            </div>
          )}
        </div>

      </div>

    </section>
  );
}