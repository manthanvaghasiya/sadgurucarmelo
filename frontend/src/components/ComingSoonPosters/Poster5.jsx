import React from 'react';
import { Fuel, Settings, User as UserIcon, Gauge, Car as CarIcon, Palette, Leaf, ShieldCheck, Cpu } from 'lucide-react';

function EcoSpec({ icon, label, value }) {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 lg:gap-2 p-2 md:p-4 lg:p-2 bg-white/40 backdrop-blur-xl rounded-2xl lg:rounded-xl border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(20,83,45,0.08)] hover:bg-white/60 transition-all duration-500 group relative overflow-hidden">
      {/* Animated shine line */}
      <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 group-hover:animate-[shine_1s_ease-in-out]"></div>

      <div className="text-emerald-600 bg-gradient-to-br from-emerald-50 to-green-100 w-8 h-8 md:w-12 md:h-12 lg:w-8 lg:h-8 rounded-full flex items-center justify-center shrink-0 border border-white shadow-inner group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <div className="flex flex-col items-center md:items-start overflow-hidden w-full">
        <span className="text-emerald-800/50 text-[9px] lg:text-[8px] font-bold uppercase tracking-[0.2em] mb-1">{label}</span>
        <span className="text-emerald-950 font-black text-xs md:text-sm lg:text-xs uppercase tracking-wider truncate w-full text-center md:text-left drop-shadow-[0_1px_10px_rgba(255,255,255,1)]">{value}</span>
      </div>
      <style jsx>{`
         @keyframes shine {
           100% { left: 200%; }
         }
       `}</style>
    </div>
  )
}

export default function Poster5({ car }) {
  if (!car) return null;

  return (
    <div className="w-full relative shadow-[0_40px_100px_rgba(16,185,129,0.15)] rounded-[3rem] overflow-hidden bg-[#f0fdf4] border border-white min-h-[200px] lg:min-h-[150px] group/poster">

      {/* --- BACKGROUND ECO GLASSMORPHISM --- */}
      {/* Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-[#ecfdf5] to-[#d1fae5] z-0"></div>

      {/* Organic Floating Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] lg:w-[40%] aspect-square bg-[#a7f3d0] rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-[float_10s_ease-in-out_infinite] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] lg:w-[50%] aspect-square bg-[#d9f99d] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-[float_12s_ease-in-out_infinite_reverse] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[20%] w-[30%] aspect-square bg-[#bae6fd] rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-[float_8s_ease-in-out_infinite] pointer-events-none"></div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS1vcGFjaXR5PSIwLjAyIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] z-0 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col p-4 md:p-6 h-full justify-between gap-4 py-4 md:py-6">

        {/* Top Header Panel */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 z-20">

          {/* Logo / Badge Area */}
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <Leaf className="text-emerald-500 w-5 h-5" />
            <span className="text-emerald-900 font-bold text-xs uppercase tracking-[0.2em]">Next Generation Fleet</span>
          </div>

          {/* Elegant COMING SOON Typography */}
          <div className="flex flex-col items-center md:items-end">
            <h2 className="font-heading text-2xl md:text-4xl lg:text-3xl font-light text-emerald-950 tracking-[0.1em] md:tracking-[0.2em] uppercase flex items-center gap-2 md:gap-4 drop-shadow-sm">
              <span className="font-black mix-blend-overlay opacity-80">COMING</span>
              <span className="relative">
                SOON
                <span className="absolute -right-6 bottom-3 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-ping"></span>
                <span className="absolute -right-6 bottom-3 w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </span>
            </h2>
            <div className="h-[1px] w-full max-w-[200px] mt-2 bg-gradient-to-r from-transparent via-emerald-800/20 to-emerald-800/20 md:via-emerald-800/20 md:from-emerald-800/20 md:to-transparent"></div>
          </div>
        </div>

        {/* Central Display & Specs Layout */}
        <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative mt-4">

          {/* Main Car Visual */}
          <div className="relative w-full md:w-[55%] lg:w-[60%] min-h-[160px] md:min-h-[220px] flex items-center justify-center z-10">

            {/* 3D Glass Platform */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] aspect-square max-w-[300px] md:max-w-[400px] max-h-full rounded-full border-[1.5px] border-white/60 bg-white/10 backdrop-blur-md shadow-[0_30px_60px_rgba(16,185,129,0.1),inset_0_20px_40px_rgba(255,255,255,0.8)] pointer-events-none transform -rotate-12 transition-transform duration-[3s] group-hover/poster:rotate-0"></div>

            {/* Halo Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] max-w-[350px] aspect-square rounded-full bg-white blur-[40px] pointer-events-none z-0"></div>

            {car.image ? (
              <img src={car.image} alt={car.title} className="w-[110%] h-auto max-h-[220px] lg:max-h-[160px] object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.2)] hover:scale-105 hover:-translate-y-4 transition-all duration-[1s] ease-out relative z-10" />
            ) : (
              <div className="w-[85%] md:w-[70%] h-[70%] lg:h-[50%] border border-dashed border-emerald-300/50 rounded-[2rem] lg:rounded-xl bg-emerald-50/30 backdrop-blur-lg flex flex-col items-center justify-center text-emerald-800/40 font-heading font-medium tracking-[0.1em] md:tracking-[0.2em] relative z-10 shadow-[inset_0_0_30px_rgba(255,255,255,0.8)] gap-2 md:gap-4 px-4 text-center">
                <ShieldCheck className="w-8 h-8 md:w-12 md:h-12 lg:w-8 lg:h-8 opacity-50" />
                <span className="text-sm md:text-base lg:text-sm">REVEAL PENDING</span>
              </div>
            )}

            {/* Minimalist Title Floating */}
            <div className="absolute -bottom-8 md:-bottom-12 lg:-bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl px-4 md:px-8 lg:px-6 py-2 md:py-3.5 lg:py-2 rounded-2xl lg:rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white z-20 w-[95%] max-w-max text-center overflow-hidden">
              <span className="font-heading font-light text-sm md:text-xl lg:text-lg text-emerald-950 tracking-[0.1em] md:tracking-[0.3em] lg:tracking-[0.2em] uppercase block truncate w-full">
                {car.make} <span className="font-black">{car.model}</span>
              </span>
            </div>
          </div>

          {/* Side Floating Specs - Glassmorphism Cards */}
          <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col z-20 pb-4 md:pb-0">
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 lg:gap-5">
              <EcoSpec icon={<Cpu className="w-5 h-5" />} label="Powertrain" value={car.fuelType} />
              <EcoSpec icon={<Settings className="w-5 h-5" />} label="Drivetrain" value={car.transmission} />
              <EcoSpec icon={<Gauge className="w-5 h-5" />} label="Odometer" value={`${car.kms?.toLocaleString() || 0} KM`} />
              <EcoSpec icon={<Palette className="w-5 h-5" />} label="Colorway" value={car.color || 'Unlisted'} />
              <EcoSpec icon={<CarIcon className="w-5 h-5" />} label="Architecture" value={car.bodyType || 'Standard'} />
              <EcoSpec icon={<UserIcon className="w-5 h-5" />} label="Ownership" value={car.owner} />
            </div>
            
            {/* Notify Me Button */}
            <button className="w-full mt-5 lg:mt-2 py-4 lg:py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black lg:text-sm uppercase tracking-[0.2em] rounded-2xl lg:rounded-xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all duration-500 transform hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(16,185,129,0.4)] flex items-center justify-center gap-3">
              <ShieldCheck className="w-6 h-6 lg:w-4 lg:h-4 animate-pulse" /> Notify Me
            </button>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
