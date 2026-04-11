import React from 'react';
import { Fuel, Settings, User as UserIcon, Gauge, Car as CarIcon, Palette, Cpu, Zap, Shield, Radar } from 'lucide-react';

function SpecItem({ icon, label, value, colorDot }) {
  const defaultColors = { blue: '#2563eb', red: '#dc2626', white: '#ffffff', black: '#000000', silver: '#c0c0c0', grey: '#808080' };
  const dotColor = colorDot ? (defaultColors[colorDot.toLowerCase()] || colorDot) : null;

  return (
    <div className="relative group flex items-center justify-between p-3 overflow-hidden bg-sky-900/10 border border-sky-500/20 rounded-lg hover:bg-sky-800/30 transition-all duration-500">
      {/* Hover Light Sweep */}
      <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-sky-400/10 to-transparent -translate-x-[150%] group-hover:translate-x-[50%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>
      
      <div className="flex items-center gap-3 z-10 relative">
        <div className="w-8 h-8 flex items-center justify-center rounded bg-sky-950/50 border border-sky-400/30 text-sky-400 group-hover:text-cyan-300 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-sky-400/20 blur group-hover:opacity-100 opacity-0 transition-opacity"></div>
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-sky-300/60 font-bold tracking-[0.2em] uppercase leading-none mb-1">{label}</span>
          <div className="flex items-center gap-2">
            {dotColor && <div className="w-2.5 h-2.5 rounded-sm border border-sky-300/50 shadow-[0_0_8px_rgba(255,255,255,0.3)]" style={{backgroundColor: dotColor}}></div>}
            <span className="text-sm font-black tracking-wider uppercase text-sky-50 group-hover:text-white transition-colors drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{value}</span>
          </div>
        </div>
      </div>
      
      {/* Decorative side ticks */}
      <div className="flex flex-col gap-1 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-1 h-3 bg-cyan-400"></div>
        <div className="w-1 h-1 bg-cyan-400"></div>
      </div>
    </div>
  )
}

export default function Poster1({ car }) {
  if (!car) return null;

  return (
    <div className="w-full relative rounded-3xl overflow-hidden bg-[#020617] border border-[#0c4a6e] min-h-[260px] lg:min-h-[280px] shadow-[0_0_80px_rgba(2,132,199,0.15)] group/poster">
      
      {/* --- BACKGROUND ANIMATIONS --- */}
      {/* Base Grid */}
      <div className="absolute inset-0 opacity-[0.03] group-hover/poster:opacity-[0.08] transition-opacity duration-1000" style={{backgroundImage: 'linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
      
      {/* Radar Sweep */}
      <div className="absolute right-0 top-0 w-[800px] h-[800px] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(14,165,233,0.1)_360deg)] rounded-full -translate-y-1/2 translate-x-1/4 animate-[spin_6s_linear_infinite] pointer-events-none"></div>

      {/* Deep Space Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] bg-sky-700/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] bg-cyan-900/30 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(2,132,199,0.05)_2px,rgba(2,132,199,0.05)_4px)] z-50 mix-blend-overlay"></div>

      <div className="relative z-10 flex flex-col lg:flex-row h-full p-4 lg:p-8 gap-4 lg:gap-8">
        
        {/* --- LEFT SIDE: CAR DISPLAY --- */}
        <div className="flex-1 w-full flex flex-col relative mt-4 lg:mt-0">
          
          {/* Header HUD */}
          <div className="flex items-center justify-between mb-6 border-b border-sky-800/50 pb-4 relative z-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-sky-950 border border-sky-500/30 flex items-center justify-center relative overflow-hidden">
                <Radar className="text-cyan-400 w-6 h-6 animate-[spin_4s_linear_infinite]" />
                <div className="absolute inset-0 box-shadow-[inset_0_0_10px_rgba(34,211,238,0.5)]"></div>
              </div>
              <div>
                <h3 className="text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase opacity-80">System Classification:</h3>
                <h2 className="text-white font-heading text-2xl md:text-3xl font-black uppercase tracking-wider drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  {car.make} <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">{car.model}</span>
                </h2>
              </div>
            </div>

            {/* Glowing COMING SOON Text */}
            <div className="hidden md:flex flex-col items-end">
               <h1 className="font-heading text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-white via-sky-200 to-sky-600 tracking-[0.2em] filter drop-shadow-[0_0_20px_rgba(56,189,248,0.6)]">
                 COMING SOON
               </h1>
               <div className="flex gap-1 mt-1">
                 <div className="w-4 h-1 bg-cyan-400/80"></div>
                 <div className="w-2 h-1 bg-cyan-400/60"></div>
                 <div className="w-1 h-1 bg-cyan-400/40"></div>
               </div>
            </div>
          </div>

          {/* Holographic Image Frame */}
          <div className="relative w-full aspect-[16/9] lg:flex-1 bg-[#020815] rounded-xl border border-sky-400/20 flex flex-col items-center justify-center overflow-hidden group/image shadow-[inset_0_0_60px_rgba(2,132,199,0.3)]">
            
            {/* Hexagon tech background behind car */}
            <div className="absolute inset-0 opacity-[0.15] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSI0OSIgdmlld0JveD0iMCAwIDI4IDQ5Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzOGJkZjgiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTEzLjk5IDEzLjYybS0xNC40IDEwLjkxbTE0LjQtMTAuOTFsMTQuNCAxMC45MW0tMTQuNC0xMC45MXYyOC44Mm0tMTQuNC0xMC45MWwxNC40LTEwLjkxbTAtMTAuOTFMMi4zOSAwTDI4IDI1LjQxbS0yOCAwTDI1LjYxIDQ5SDBWMHoiLz48L2c+PC9nPjwvc3ZnPg==')] pointer-events-none"></div>

            {/* Reticle brackets */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-lg transition-transform duration-700 group-hover/image:-translate-x-2 group-hover/image:-translate-y-2"></div>
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-lg transition-transform duration-700 group-hover/image:translate-x-2 group-hover/image:-translate-y-2"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-lg transition-transform duration-700 group-hover/image:-translate-x-2 group-hover/image:translate-y-2"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-cyan-400/50 rounded-br-lg transition-transform duration-700 group-hover/image:translate-x-2 group-hover/image:translate-y-2"></div>

            {car.image ? (
              <>
                <img src={car.image} alt={car.title} className="w-[90%] h-[90%] object-contain rounded-lg filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] z-10 group-hover/image:scale-[1.03] transition-transform duration-[1.5s] ease-[cubic-bezier(0.2,0.8,0.2,1)]" />
                <div className="absolute bottom-10 w-[70%] h-4 bg-cyan-500/20 blur-[20px] rounded-full pointer-events-none z-0"></div>
              </>
            ) : (
              <div className="z-10 flex flex-col items-center">
                 <Cpu className="text-sky-500/40 w-20 h-20 mb-4 animate-[pulse_2s_infinite]" />
                 <span className="font-mono text-sky-400/60 tracking-widest text-sm uppercase">WAITING FOR VISUAL DATA /_</span>
              </div>
            )}
            
            {/* Holographic light sweep line */}
            <div className="absolute top-[-100%] left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_15px_#22d3ee] animate-[scan_4s_linear_infinite] z-20 pointer-events-none opacity-50"></div>
            <style jsx>{`
              @keyframes scan {
                0% { top: -10%; }
                100% { top: 110%; }
              }
            `}</style>
          </div>
          
          <div className="md:hidden mt-6 text-center">
             <h1 className="font-heading text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white to-sky-500 tracking-[0.2em] filter drop-shadow-[0_0_15px_rgba(56,189,248,0.6)]">
               COMING SOON
             </h1>
          </div>
        </div>

        {/* --- RIGHT SIDE: DATA TERMINAL --- */}
        <div className="w-full lg:w-[380px] shrink-0 border border-sky-400/20 bg-[#041224]/80 backdrop-blur-md rounded-xl flex flex-col overflow-hidden relative shadow-[0_0_40px_rgba(2,132,199,0.2)]">
          {/* Terminal Header */}
          <div className="bg-[#082040] p-4 flex items-center justify-between border-b border-sky-400/30">
            <div className="flex items-center gap-2">
              <Zap className="text-amber-400 w-4 h-4 animate-pulse" />
              <span className="font-mono text-xs text-sky-200 uppercase tracking-widest">Core Specifications</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
          </div>

          {/* Specs List */}
          <div className="p-5 flex-1 flex flex-col gap-3 font-mono">
            <SpecItem icon={<Fuel className="w-4 h-4"/>} label="PWR.SRC" value={car.fuelType} />
            <SpecItem icon={<Settings className="w-4 h-4"/>} label="TRNS.SYS" value={car.transmission} />
            <SpecItem icon={<Shield className="w-4 h-4"/>} label="OWN.CLR" value={car.owner} />
            <SpecItem icon={<Gauge className="w-4 h-4"/>} label="DIST.LOG" value={`${car.kms?.toLocaleString('en-IN') || 0} KM`} />
            <SpecItem icon={<CarIcon className="w-4 h-4"/>} label="CHASIS.F" value={car.bodyType || 'N/A'} />
            <SpecItem icon={<Palette className="w-4 h-4"/>} label="EXT.SKN" value={car.color || 'N/A'} colorDot={car.color} />
          </div>

          {/* Abstract Footer Bar */}
          <div className="h-1 w-full bg-gradient-to-r from-sky-900 via-cyan-400 to-sky-900"></div>
        </div>

      </div>
    </div>
  );
}
