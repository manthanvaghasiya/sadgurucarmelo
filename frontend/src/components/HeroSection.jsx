import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Settings2, Wallet, Search, MapPin, ChevronDown, ChevronRight, X, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../api/axiosConfig';
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
    enter: { opacity: 0, x: 150, scale: 0.7, rotateY: 45, filter: 'blur(20px)', zIndex: 0 },
    center: { 
      opacity: 1, x: 0, scale: 1, rotateY: 0, filter: 'blur(0px)', zIndex: 10,
      transition: { duration: 1.2, type: 'spring', bounce: 0.35, ease: 'easeOut' } 
    },
    exit: { 
      opacity: 0, x: -150, scale: 0.8, rotateY: -30, filter: 'blur(20px)', zIndex: 0,
      transition: { duration: 0.8, ease: 'easeIn' } 
    }
  };

  const searchBarVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: 0.6
      }
    }
  };

  const currentCar = comingSoonCars[currentCarIndex];

  return (
    <section className="relative w-full min-h-[100dvh] bg-[#030303] overflow-hidden font-['Inter',sans-serif] flex items-center">
      
      {/* ════════════════════════════════════════════════════════════════
          PREMIUM ABSTRACT BACKGROUND
      ════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Dynamic Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-brand-orange/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-yellow-500/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Subtle grid pattern for texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik00MCAwaC0xdjQwaDFWMHptMCAzOWgtNDB2MWg0MHYtMXoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyIgZmlsbC1ydWxlPSJldmVub2RkIi8+Cjwvc3ZnPg==')] opacity-30"></div>
        
        {/* Dark vignette to focus center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#030303_100%)] opacity-80"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-24 pb-32 lg:pb-24 lg:py-0 items-center min-h-[85vh]">

        {/* ════════════════════════════════════════════════════════════════
            LEFT COLUMN: TYPOGRAPHY
        ════════════════════════════════════════════════════════════════ */}
        <motion.div
          className="col-span-1 lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 pt-4 lg:pt-0"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <div className="h-[2px] w-12 bg-gradient-to-r from-brand-orange to-transparent"></div>
            <span className="text-brand-orange text-sm font-bold tracking-[0.2em] uppercase">Sadguru Carmelo</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-[3rem] sm:text-6xl lg:text-[4rem] xl:text-[4.5rem] text-white font-black tracking-tight leading-[1.05]"
          >
            તમારી <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-yellow-500">ડ્રીમ કાર,</span><br />
            હવે તમારી પહોંચમાં.
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg lg:text-xl text-slate-400 mt-6 font-medium leading-relaxed max-w-md drop-shadow-sm">
            સુરતનું શ્રેષ્ઠ પ્રી-ઓવન્ડ અને લક્ઝરી કાર ડેસ્ટિનેશન. વિશ્વાસથી બનેલું, ગુણવત્તાથી ચાલતું.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
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


        {/* ════════════════════════════════════════════════════════════════
            RIGHT COLUMN: COMING SOON CAR ANIMATED STAGE
        ════════════════════════════════════════════════════════════════ */}
        <div className="col-span-1 lg:col-span-7 relative flex items-center justify-center order-1 lg:order-2 h-[50vh] lg:h-[75vh] w-full perspective-[2000px]">
          {comingSoonCars.length > 0 ? (
            <>
              {/* Infinite Animated Marquee Background */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
                <motion.div
                  animate={{ x: [0, -1500] }}
                  transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
                  className="whitespace-nowrap"
                >
                  <h2 className="text-[8rem] lg:text-[16rem] font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-transparent via-amber-500/10 to-transparent select-none tracking-tighter">
                    COMING SOON • INCOMING • ARRIVING • COMING SOON • INCOMING • ARRIVING •
                  </h2>
                </motion.div>
              </div>

              {/* Central Glowing Orb tied to Car */}
              <motion.div 
                key={`glow-${currentCarIndex}`}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-gradient-to-tr from-amber-500/20 to-brand-orange/5 blur-[120px] rounded-full pointer-events-none z-0" 
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCarIndex}
                  variants={carSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative w-full h-full flex flex-col lg:flex-row items-center justify-center lg:justify-end z-10"
                >
                  {/* Info Card (Floating Above) */}
                  <div className="w-full sm:w-[85%] lg:w-[65%] xl:w-[55%] lg:absolute lg:bottom-12 lg:left-0 z-30 group mt-auto lg:mt-0 perspective-1000">
                    <motion.div 
                      initial={{ opacity: 0, y: 50, rotateX: 20 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ duration: 1, delay: 0.4, type: "spring", bounce: 0.4 }}
                      onClick={() => navigate(`/car/${currentCar.id}`)}
                      className="relative bg-white/[0.03] backdrop-blur-[40px] border border-white/10 p-6 lg:px-8 lg:py-6 rounded-[2rem] cursor-pointer shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden transform-gpu hover:-translate-y-2 hover:bg-white/[0.05] hover:border-amber-500/30 transition-all duration-500 flex flex-col lg:flex-row items-start lg:items-center justify-between"
                    >
                      {/* Sweeping Shimmer Effect inside Card */}
                      <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

                      {/* Left Area: Title & Specs */}
                      <div className="w-full lg:w-auto flex-1 z-10 relative">
                        {/* Header Badge */}
                        <div className="flex items-center gap-3 mb-4 lg:mb-3">
                          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                            <div className="absolute w-full h-full rounded-full border border-amber-500/50 animate-[spin_4s_linear_infinite]" />
                            <Sparkles className="w-4 h-4 text-amber-500" />
                          </div>
                          <span className="text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase text-amber-400">
                            Highly Anticipated
                          </span>
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-amber-200 transition-all duration-500">
                          {currentCar.make} <span className="font-light">{currentCar.model}</span>
                        </h3>
                        
                        {/* Specs */}
                        <div className="flex items-center gap-3 mb-6 lg:mb-0 flex-wrap">
                          <span className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider">{currentCar.year}</span>
                          <span className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider">{currentCar.fuelType || 'Fuel'}</span>
                          <span className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider">{currentCar.transmission || 'Auto'}</span>
                        </div>
                      </div>
                      
                      {/* Desktop Vertical Divider / Mobile Horizontal Divider */}
                      <div className="w-full lg:w-[1px] h-[1px] lg:h-24 bg-gradient-to-r lg:bg-gradient-to-b from-transparent via-amber-500/50 to-transparent my-6 lg:my-0 lg:mx-8 relative z-10" />
                      
                      {/* Right Area: Pricing & CTA */}
                      <div className="flex items-end lg:items-center justify-between lg:justify-end gap-6 w-full lg:w-auto relative z-10">
                        <div className="flex flex-col lg:items-end lg:text-right">
                          <p className="text-[10px] text-amber-500/70 uppercase tracking-[0.15em] font-bold mb-1.5 flex items-center gap-1.5">
                            Expected Pricing
                          </p>
                          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
                            {formatPrice(currentCar.price)}
                          </p>
                        </div>
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: -15 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-14 h-14 rounded-full bg-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center justify-center transition-all duration-300 relative overflow-hidden shrink-0"
                        >
                          <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
                          <ArrowRight className="w-6 h-6 text-black relative z-10" strokeWidth={2.5} />
                        </motion.div>
                      </div>

                      {/* Progress Bar locked to this specific car's slide duration */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                        <motion.div 
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 5, ease: "linear" }}
                          className="h-full bg-gradient-to-r from-amber-500 to-brand-orange origin-left shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* 3D Car Image Entrance */}
                  <div className="w-[100%] lg:w-[85%] h-auto relative lg:absolute lg:right-[-5%] lg:top-[5%] z-20 flex items-center justify-center mt-6 lg:mt-0 pointer-events-none">
                    <motion.div
                      animate={{ y: [0, -20, 0], rotateZ: [0, -1, 0, 1, 0] }} 
                      transition={{ 
                        y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                        rotateZ: { repeat: Infinity, duration: 8, ease: "easeInOut" }
                      }}
                      className="w-full flex justify-center"
                    >
                      <img
                        src={currentCar.image || 'https://placehold.co/800x400/111/333?text=Incoming+Vehicle'}
                        alt={`${currentCar.make} ${currentCar.model}`}
                        className="w-full h-auto object-contain drop-shadow-[0_50px_50px_rgba(0,0,0,0.85)] max-h-[40vh] lg:max-h-[65vh] transform-gpu scale-110 lg:scale-125"
                      />
                    </motion.div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            // Fallback empty state
            <div className="w-full h-full flex flex-col items-center justify-center opacity-30 select-none pointer-events-none z-10">
              <Car className="w-32 h-32 text-white/10 mb-4" />
              <h2 className="text-[4rem] font-black uppercase text-white/5 tracking-tighter">Premium Collection</h2>
            </div>
          )}
        </div>

      </div>

    </section>
  );
}