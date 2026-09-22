import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, Sparkles, ShieldCheck, ChevronRight, ArrowRight } from 'lucide-react';
import axiosInstance from '../api/axiosConfig';

export default function LiveTicker() {
  const [latestCar, setLatestCar] = useState(null);

  useEffect(() => {
    const fetchLatestCar = async () => {
      try {
        const res = await axiosInstance.get('/cars?limit=1&status=Available&sort=-createdAt');
        if (res.data && res.data.data && res.data.data.length > 0) {
          setLatestCar(res.data.data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch latest car for ticker:', err);
      }
    };
    fetchLatestCar();
  }, []);

  if (!latestCar) return null;

  const carYear = latestCar.year || latestCar.manufacturingYear || latestCar.registerYear;
  const carPriceFormatted =
    latestCar.price >= 100000
      ? `₹${(latestCar.price / 100000).toFixed(2)} Lakhs`
      : `₹${(latestCar.price || 0).toLocaleString('en-IN')}`;

  const carLink = `/car-details/${latestCar._id || latestCar.id}`;

  return (
    <>
      <style>{`
        @keyframes ticker-shine {
          0% { left: -150%; }
          20% { left: 150%; }
          100% { left: 150%; }
        }
        .sadguru-shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 45%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(245, 148, 35, 0.15), transparent);
          transform: skewX(-25deg);
          animation: ticker-shine 6s infinite;
          pointer-events: none;
          z-index: 30;
        }
        @keyframes amber-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.04); }
        }
        .animate-amber-glow {
          animation: amber-glow 3.5s ease-in-out infinite;
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE VIEW (< 768px): Themed Amber/Gold Card
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="block md:hidden w-full py-2.5 px-3 relative z-20">
        <Link to={carLink} className="block relative max-w-lg mx-auto group">
          {/* Ambient Glow Aura */}
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-orange/30 via-amber-500/25 to-yellow-500/20 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />

          {/* Obsidian/Gold Card */}
          <div className="relative w-full rounded-2xl bg-[#0b0f19] border border-amber-500/20 shadow-[0_12px_35px_rgba(0,0,0,0.85)] overflow-hidden sadguru-shimmer select-none py-3.5 px-3 text-center">
            {/* Top Laser Accent */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent pointer-events-none" />

            {/* Header: નવું આગમન · JUST ARRIVED */}
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="w-4 h-[1px] bg-gradient-to-r from-transparent to-amber-400" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-200 font-extrabold text-[10px] tracking-[0.2em] uppercase">
                નવું આગમન · JUST ARRIVED
              </span>
              <span className="w-4 h-[1px] bg-gradient-to-l from-transparent to-amber-400" />
            </div>

            {/* Car Name */}
            <h3 className="font-heading font-black text-xl tracking-tight leading-tight text-white mb-1.5 group-hover:text-amber-300 transition-colors">
              {latestCar.make} {latestCar.model}
            </h3>

            {/* Badges Row */}
            <div className="flex items-center justify-center gap-2 mt-2">
              {carYear && (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                  <Calendar className="w-3 h-3" />
                  <span>{carYear}</span>
                </div>
              )}

              <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 text-[11px] font-black shadow-sm">
                <Tag className="w-3 h-3" />
                <span>{carPriceFormatted}</span>
              </div>

              {latestCar.isKmGenuine && (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Genuine KM</span>
                </div>
              )}
            </div>

            {/* Tap to View */}
            <p className="text-[10px] font-bold text-amber-400/80 mt-2 flex items-center justify-center gap-1">
              ગાડીની સંપૂર્ણ વિગત જુઓ · View Car Details <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </Link>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          DESKTOP / LAPTOP VIEW (>= 768px): Panoramic Luxury Ribbon
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block w-full py-2 px-6 lg:px-8 relative z-20">
        <Link to={carLink} className="block relative max-w-5xl mx-auto group">
          {/* Ambient Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-orange/25 via-amber-500/20 to-yellow-500/20 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />

          {/* Panoramic Ribbon Container */}
          <div className="relative flex items-center w-full rounded-full bg-gradient-to-r from-[#0b0f19] via-[#141b2d] to-[#0b0f19] border border-amber-500/20 shadow-[0_15px_35px_rgba(0,0,0,0.85)] overflow-hidden sadguru-shimmer select-none py-2.5 px-6">
            {/* Top Laser Accent */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent pointer-events-none" />

            {/* Inner Content Ribbon */}
            <div className="flex items-center justify-between gap-6 relative z-10 w-full">
              {/* Left Side: Sparkle Badge */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 shadow-sm backdrop-blur-xl">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                    નવું આગમન · Just Arrived
                  </span>
                </div>
              </div>

              {/* Center: Car Announcement in Gujarati + English */}
              <div className="flex-1 flex items-center justify-center text-center px-2">
                <p className="text-slate-300 text-sm font-normal tracking-wide">
                  સુરત શોરૂમમાં નવી કાર ઉપલબ્ધ:{' '}
                  <span className="text-white font-black text-base lg:text-lg tracking-tight group-hover:text-amber-300 transition-colors px-1">
                    {latestCar.make} {latestCar.model}
                  </span>{' '}
                  {carYear && (
                    <span className="text-amber-300 font-bold text-xs mx-0.5">
                      ({carYear} મોડેલ)
                    </span>
                  )}
                  {latestCar.fuelType && (
                    <span className="text-slate-400 text-xs ml-1">
                      · {latestCar.fuelType}
                    </span>
                  )}
                </p>
              </div>

              {/* Right Side: Price Badge & Arrow */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black text-sm shadow-md">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{carPriceFormatted}</span>
                </div>

                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-brand-orange group-hover:translate-x-1 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
