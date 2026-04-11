import React from 'react';
import { Fuel, Settings, User as UserIcon, Gauge, Car as CarIcon, Palette, Terminal, Zap } from 'lucide-react';

function NeonStat({ label, value, icon }) {
  return (
    <div className="flex items-center gap-2 md:gap-3 bg-black/60 border border-fuchsia-600/30 p-2 md:p-2.5 backdrop-blur-md group hover:bg-[#1a0b2e]/80 transition-colors duration-300 relative overflow-hidden transform skew-x-0 md:-skew-x-[12deg] rounded md:rounded-none">
      {/* Glitch hover effect */}
      <div className="absolute inset-0 w-full h-[2px] bg-cyan-400 opacity-0 group-hover:opacity-100 group-hover:animate-[scan_1s_ease-in-out_infinite] z-20 pointer-events-none"></div>
      
      <div className="text-fuchsia-400 group-hover:text-cyan-300 w-8 h-8 flex items-center justify-center shrink-0 skew-x-0 md:skew-x-[12deg] transition-colors drop-shadow-[0_0_8px_currentColor]">
        {icon}
      </div>
      <div className="flex flex-col skew-x-0 md:skew-x-[12deg] w-[calc(100%-2rem)]">
        <span className="text-fuchsia-300/80 text-[9px] font-black uppercase tracking-[0.2em] mb-0.5">{label}</span>
        <span className="text-white text-xs md:text-sm font-bold uppercase truncate drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{value}</span>
      </div>
      
      {/* Right glowing edge */}
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-fuchsia-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <style jsx>{`
        @keyframes scan {
           0% { top: -10%; }
           100% { top: 110%; }
        }
      `}</style>
    </div>
  )
}

export default function Poster3({ car }) {
  if (!car) return null;

  return (
    <div className="w-full relative shadow-[0_0_50px_rgba(192,38,211,0.3)] rounded-[2rem] overflow-hidden bg-[#0A0510] border border-fuchsia-900/40 p-1.5 min-h-[260px] lg:min-h-[280px] group/poster">
      
      {/* --- BACKGROUND RETROWAVE --- */}
      <div className="w-full h-full bg-gradient-to-b from-[#130724] to-[#040108] rounded-[1.6rem] relative overflow-hidden pb-6">
        
        {/* Retro Sun */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-gradient-to-b from-yellow-400 via-pink-500 to-purple-800 opacity-30 group-hover/poster:opacity-50 transition-opacity duration-1000 blur-[2px] shadow-[0_0_100px_rgba(236,72,153,0.5)] z-0" style={{clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 80%)', maskImage: 'repeating-linear-gradient(transparent, transparent 4px, black 4px, black 16px)'}}></div>

        {/* 3D Perspective Grid Floor */}
        <div className="absolute bottom-0 left-[-50%] right-[-50%] h-[60%] bg-[linear-gradient(rgba(217,70,239,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.4)_1px,transparent_1px)] bg-[size:40px_20px] [transform:perspective(500px)_rotateX(75deg)_translateY(-50px)_translateZ(-50px)] pointer-events-none z-0 opacity-40 group-hover/poster:opacity-80 transition-opacity duration-[2s]"></div>

        {/* Floating Particles */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50 mix-blend-screen pointer-events-none z-10"></div>

        <div className="relative z-20 flex flex-col h-full p-3 lg:p-6 mt-1">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0 mb-4">
             <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 border border-fuchsia-500/30 rounded backdrop-blur text-fuchsia-400 font-mono text-[10px] tracking-widest uppercase">
               <Terminal className="w-4 h-4 animate-pulse" />
               SYS_OVERRIDE_ACTIVE
             </div>
             
             {/* 3D Drop Shadow Glitch Title */}
             <div className="relative group/title z-30 transform hover:scale-105 transition-transform">
               <h2 className="font-heading text-2xl md:text-4xl font-black italic uppercase tracking-[0.1em] text-white absolute top-[2px] left-[2px] text-cyan-400 opacity-70 mix-blend-screen pointer-events-none">
                 COMING_SOON
               </h2>
               <h2 className="font-heading text-2xl md:text-4xl font-black italic uppercase tracking-[0.1em] text-white absolute top-[-2px] left-[-2px] text-fuchsia-500 opacity-70 mix-blend-screen pointer-events-none">
                 COMING_SOON
               </h2>
               <h2 className="relative font-heading text-2xl md:text-4xl font-black italic uppercase tracking-[0.1em] text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                 COMING_SOON
               </h2>
             </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row gap-4 items-center justify-center mt-1">
            
            {/* Left: Car Viewer */}
            <div className="flex-1 w-full relative flex items-center justify-center min-h-[150px] md:min-h-[180px] z-20">
               {car.image ? (
                 <div className="relative w-full max-w-2xl group/img cursor-pointer">
                    {/* Synthwave scan line behind image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-600/20 to-transparent blur-[20px] rounded-full group-hover/img:bg-cyan-500/20 transition-colors duration-700"></div>
                    <img src={car.image} alt={car.title} className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] transform group-hover/img:-translate-y-4 transition-transform duration-700 ease-out" />
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-6 bg-black blur-[15px] opacity-60 rounded-full"></div>
                 </div>
               ) : (
                 <div className="text-fuchsia-500 font-mono text-sm md:text-2xl font-black tracking-widest md:tracking-widest bg-black/50 px-4 md:px-8 py-3 md:py-4 border-2 border-dashed border-fuchsia-500/50 rounded-xl backdrop-blur animate-pulse text-center w-[90%] md:w-auto">
                   //_AWAITING_RENDER
                 </div>
               )}
            </div>

            {/* Right: Data Deck */}
            <div className="w-full md:w-[280px] flex flex-col gap-3 shrink-0 relative z-30">
              <div className="bg-black/50 border border-fuchsia-500/40 p-3 md:p-4 transform skew-x-0 md:-skew-x-[12deg] mb-2 shadow-[0_0_20px_rgba(217,70,239,0.15)] relative overflow-hidden backdrop-blur-md rounded md:rounded-none">
                 <div className="absolute top-0 right-0 w-8 h-full bg-cyan-400/10 skew-x-[20deg] translate-x-4"></div>
                 <h3 className="text-fuchsia-400 font-mono text-xs uppercase tracking-[0.2em] mb-1 skew-x-0 md:skew-x-[12deg]">Ident:</h3>
                 <p className="text-white font-heading text-xl md:text-2xl font-black italic tracking-wider skew-x-0 md:skew-x-[12deg] drop-shadow-[0_0_5px_rgba(255,255,255,0.4)] truncate">
                   {car.make} <span className="text-cyan-300">{car.model}</span>
                 </p>
              </div>

              <div className="flex flex-col gap-2">
                <NeonStat icon={<Fuel className="w-4 h-4"/>} label="PWR/DRV" value={`${car.fuelType} // ${car.transmission}`} />
                <NeonStat icon={<CarIcon className="w-4 h-4"/>} label="FORM.F" value={car.bodyType || 'SUV'} />
                <NeonStat icon={<Palette className="w-4 h-4"/>} label="CHROMA" value={car.color || 'DFT'} />
                <NeonStat icon={<Gauge className="w-4 h-4"/>} label="DST.LOG" value={`${car.kms?.toLocaleString() || 0}U`} />
              </div>
            </div>
            
          </div>
          
        </div>
        
        {/* Bottom Caution Tape animated */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-fuchsia-600 overflow-hidden flex items-center shadow-[0_-5px_20px_rgba(217,70,239,0.5)] z-30">
          <div className="whitespace-nowrap font-mono font-black text-[8px] tracking-widest text-[#0a0510] flex w-[200%]">
             <span className="inline-block animate-[slideright_15s_linear_infinite]" style={{ animation: 'slideright 20s linear infinite' }}>
                WARNING: HYPE LEVEL CRITICAL /// NEW ASSET DETECTED /// PREPARE FOR DROP /// WARNING: HYPE LEVEL CRITICAL /// NEW ASSET DETECTED /// PREPARE FOR DROP /// WARNING: HYPE LEVEL CRITICAL /// NEW ASSET DETECTED /// PREPARE FOR DROP /// 
             </span>
          </div>
        </div>
        <style jsx>{`
          @keyframes slideright {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </div>
  );
}
