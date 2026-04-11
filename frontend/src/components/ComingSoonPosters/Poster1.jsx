import React from 'react';
import { Fuel, Settings, Gauge, Car as CarIcon, Palette, Zap, Shield, Radar } from 'lucide-react';

function SpecItem({ icon, label, value, colorDot }) {
  const defaultColors = { blue: '#2563eb', red: '#dc2626', white: '#ffffff', black: '#000000', silver: '#c0c0c0', grey: '#808080', gray: '#808080' };
  const dotColor = colorDot ? (defaultColors[colorDot.toLowerCase()] || colorDot) : null;

  return (
    <div className="relative group flex items-center gap-2.5 p-2 md:p-2.5 overflow-hidden bg-sky-900/10 border border-sky-500/20 rounded-lg hover:bg-sky-800/30 transition-all duration-500">
      <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-sky-400/10 to-transparent -translate-x-[150%] group-hover:translate-x-[50%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>
      
      <div className="shrink-0 w-7 h-7 flex items-center justify-center rounded bg-sky-950/50 border border-sky-400/30 text-sky-400 group-hover:text-cyan-300 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-sky-400/20 blur group-hover:opacity-100 opacity-0 transition-opacity"></div>
        {React.cloneElement(icon, { className: "w-3.5 h-3.5 relative z-10" })}
      </div>
      <div className="flex flex-col overflow-hidden min-w-0 flex-1">
        <span className="text-[9px] text-sky-300/60 font-bold tracking-[0.15em] uppercase leading-none mb-0.5">{label}</span>
        <div className="flex items-center gap-1.5 truncate">
          {dotColor && <div className="shrink-0 w-2 h-2 rounded-sm border border-sky-300/50 shadow-[0_0_8px_rgba(255,255,255,0.3)]" style={{backgroundColor: dotColor}}></div>}
          <span className="text-xs font-black tracking-widest uppercase text-sky-50 group-hover:text-white transition-colors truncate">{value}</span>
        </div>
      </div>
    </div>
  )
}

export default function Poster1({ car }) {
  if (!car) return null;
  const isValid = (val) => val && val.toString().trim() !== '' && val !== 'N/A' && val.toString().trim() !== '0';

  const specs = [
    isValid(car.fuelType) && { icon: <Fuel />, label: "PWR.SRC", value: car.fuelType },
    isValid(car.transmission) && { icon: <Settings />, label: "TRNS.SYS", value: car.transmission },
    isValid(car.owner) && { icon: <Shield />, label: "OWN.CLR", value: car.owner },
    (car.kms > 0) && { icon: <Gauge />, label: "DIST.LOG", value: `${car.kms.toLocaleString('en-IN')} KM` },
    isValid(car.bodyType) && { icon: <CarIcon />, label: "CHASIS.F", value: car.bodyType },
    isValid(car.color) && { icon: <Palette />, label: "EXT.SKN", value: car.color, colorDot: car.color },
  ].filter(Boolean);

  return (
    <div className="w-full h-full flex-1 relative overflow-hidden bg-[#020617] border border-[#0c4a6e] shadow-[0_0_80px_rgba(2,132,199,0.15)] rounded-2xl md:rounded-3xl">
      
      {/* --- BACKGROUND ANIMATIONS --- */}
      <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
      <div className="absolute right-0 top-0 w-[800px] h-[800px] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(14,165,233,0.1)_360deg)] rounded-full -translate-y-1/2 translate-x-1/4 animate-[spin_6s_linear_infinite] pointer-events-none"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] bg-sky-700/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] bg-cyan-900/30 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(2,132,199,0.05)_2px,rgba(2,132,199,0.05)_4px)] z-[5] mix-blend-overlay"></div>

      <div className="relative z-10 flex flex-col lg:flex-row p-3 md:p-5 lg:p-4 gap-3 md:gap-4">
        
        {/* --- LEFT SIDE: CAR DISPLAY --- */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header HUD */}
          <div className="flex items-center justify-between mb-2 md:mb-3 border-b border-sky-800/50 pb-2 relative z-20">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 shrink-0 rounded bg-sky-950 border border-sky-500/30 flex items-center justify-center relative overflow-hidden">
                <Radar className="text-cyan-400 w-5 h-5 animate-[spin_4s_linear_infinite]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-cyan-400 font-mono text-[10px] tracking-[0.2em] uppercase opacity-80">Classification:</h3>
                <h2 className="text-white font-heading text-lg md:text-xl lg:text-xl font-black uppercase tracking-wider drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] truncate">
                  {car.make} <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">{car.model}</span>
                </h2>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-end shrink-0 ml-4">
               <h1 className="font-heading text-2xl lg:text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-white via-sky-200 to-sky-600 tracking-[0.15em] filter drop-shadow-[0_0_20px_rgba(56,189,248,0.6)]">
                 COMING SOON
               </h1>
               <div className="flex gap-1 mt-1">
                 <div className="w-4 h-1 bg-cyan-400/80"></div>
                 <div className="w-2 h-1 bg-cyan-400/60"></div>
                 <div className="w-1 h-1 bg-cyan-400/40"></div>
               </div>
            </div>
          </div>

          {/* Car Image Frame */}
          <div className="relative flex-1 bg-[#020815] rounded-xl border border-sky-400/20 flex items-center justify-center overflow-hidden shadow-[inset_0_0_60px_rgba(2,132,199,0.3)] min-h-[140px] md:min-h-[200px] lg:min-h-0">
            
            <div className="absolute inset-0 opacity-[0.15] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSI0OSIgdmlld0JveD0iMCAwIDI4IDQ5Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzOGJkZjgiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTEzLjk5IDEzLjYybS0xNC40IDEwLjkxbTE0LjQtMTAuOTFsMTQuNCAxMC45MW0tMTQuNC0xMC45MXYyOC44Mm0tMTQuNC0xMC45MWwxNC40LTEwLjkxbTAtMTAuOTFMMi4zOSAwTDI4IDI1LjQxbS0yOCAwTDI1LjYxIDQ5SDBWMHoiLz48L2c+PC9nPjwvc3ZnPg==')] pointer-events-none"></div>

            {/* Reticle brackets */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-lg"></div>
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-lg"></div>
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-lg"></div>
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-cyan-400/50 rounded-br-lg"></div>

            {car.image ? (
              <>
                <img src={car.image} alt={car.title} className="w-full h-full object-contain p-3 md:p-4 filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] z-10 max-h-[200px] md:max-h-[300px] lg:max-h-[350px]" />
                <div className="absolute bottom-6 w-[60%] h-4 bg-cyan-500/20 blur-[20px] rounded-full pointer-events-none z-0"></div>
              </>
            ) : (
              <div className="z-10 flex flex-col items-center py-8">
                 <Radar className="text-sky-500/40 w-14 h-14 mb-3 animate-[pulse_2s_infinite]" />
                 <span className="font-mono text-sky-400/60 tracking-widest text-xs uppercase">WAITING FOR VISUAL DATA /_</span>
              </div>
            )}
            
            {/* Scan line */}
            <div className="absolute top-[-100%] left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_15px_#22d3ee] animate-[poster1scan_4s_linear_infinite] z-20 pointer-events-none opacity-50"></div>
          </div>
          
          {/* Mobile COMING SOON */}
          <div className="md:hidden mt-3 text-center">
             <h1 className="font-heading text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white to-sky-500 tracking-[0.15em] filter drop-shadow-[0_0_15px_rgba(56,189,248,0.6)]">
               COMING SOON
             </h1>
          </div>
        </div>

        {/* --- RIGHT SIDE: DATA TERMINAL --- */}
        <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 border border-sky-400/20 bg-[#041224]/80 backdrop-blur-md rounded-xl flex flex-col overflow-hidden relative shadow-[0_0_40px_rgba(2,132,199,0.2)]">
          {/* Terminal Header */}
          <div className="bg-[#082040] px-3 py-2 flex items-center justify-between border-b border-sky-400/30">
            <div className="flex items-center gap-2">
              <Zap className="text-amber-400 w-3.5 h-3.5 animate-pulse" />
              <span className="font-mono text-[10px] text-sky-200 uppercase tracking-widest">Core Specifications</span>
            </div>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            </div>
          </div>

          {/* Specs List */}
          <div className="p-2.5 flex-1 grid grid-cols-2 lg:grid-cols-1 gap-1.5 font-mono content-start">
            {specs.length > 0 ? specs.map((s, i) => (
              <SpecItem key={i} icon={s.icon} label={s.label} value={s.value} colorDot={s.colorDot} />
            )) : (
               <div className="col-span-2 text-center text-sky-400/50 py-4 flex flex-col items-center">
                 <Radar className="w-5 h-5 animate-pulse mb-2" />
                 <span className="text-[10px] tracking-widest uppercase">Awaiting telemetry...</span>
               </div>
            )}
          </div>

          {/* Notify Me Button */}
          <div className="px-2.5 pb-2.5 mt-auto">
            <button className="w-full py-2 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-[#020815] text-sm font-black tracking-widest uppercase rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all duration-300 flex items-center justify-center gap-2">
              <Radar className="w-4 h-4 animate-[spin_4s_linear_infinite]" />
              Notify Me
            </button>
          </div>

          <div className="h-0.5 w-full bg-gradient-to-r from-sky-900 via-cyan-400 to-sky-900"></div>
        </div>

      </div>

      <style>{`
        @keyframes poster1scan {
          0% { top: -10%; }
          100% { top: 110%; }
        }
      `}</style>
    </div>
  );
}
