import React from 'react';
import { Fuel, Settings, User as UserIcon, Gauge, Car as CarIcon, Palette, Terminal, Zap } from 'lucide-react';

function NeonStat({ label, value, icon }) {
  return (
    <div className="flex items-center gap-2.5 bg-black/60 border border-fuchsia-600/30 p-2 backdrop-blur-md group hover:bg-[#1a0b2e]/80 transition-colors duration-300 relative overflow-hidden rounded-md min-w-0">
      <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-fuchsia-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="text-fuchsia-400 group-hover:text-cyan-300 w-7 h-7 flex items-center justify-center shrink-0 transition-colors drop-shadow-[0_0_8px_currentColor]">
        {React.cloneElement(icon, { className: "w-4 h-4" })}
      </div>
      <div className="flex flex-col overflow-hidden min-w-0 flex-1 border-l border-fuchsia-900/30 pl-2">
        <span className="text-fuchsia-300/80 text-[8px] font-black uppercase tracking-[0.15em] mb-0.5 truncate">{label}</span>
        <span className="text-white text-xs font-bold uppercase truncate drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{value}</span>
      </div>
    </div>
  )
}

export default function Poster3({ car }) {
  if (!car) return null;
  const isValid = (val) => val && val.toString().trim() !== '' && val !== 'N/A' && val.toString().trim() !== '0';

  const specs = [
    isValid(car.transmission) && { icon: <Settings />, label: "DRV", value: car.transmission },
    isValid(car.fuelType) && { icon: <Fuel />, label: "PWR", value: car.fuelType },
    isValid(car.bodyType) && { icon: <CarIcon />, label: "FORM", value: car.bodyType },
    isValid(car.color) && { icon: <Palette />, label: "CHROMA", value: car.color },
    (car.kms > 0) && { icon: <Gauge />, label: "DST.LOG", value: `${car.kms.toLocaleString('en-IN')}U` },
    isValid(car.owner) && { icon: <UserIcon />, label: "USR", value: car.owner },
  ].filter(Boolean);

  return (
    <div className="w-full h-full flex-1 relative shadow-[0_0_50px_rgba(192,38,211,0.3)] overflow-hidden bg-[#0A0510] border border-fuchsia-900/40 rounded-2xl md:rounded-3xl">

      {/* Inner wrapper with rounded internal background */}
      <div className="w-full h-full bg-gradient-to-b from-[#130724] to-[#040108] relative overflow-hidden">

        {/* Retro Sun */}
        <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[250px] h-[250px] rounded-full bg-gradient-to-b from-yellow-400 via-pink-500 to-purple-800 opacity-25 blur-[2px] shadow-[0_0_100px_rgba(236,72,153,0.5)] z-0" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 80%)', maskImage: 'repeating-linear-gradient(transparent, transparent 4px, black 4px, black 16px)' }}></div>

        {/* 3D Perspective Grid */}
        <div className="absolute bottom-0 left-[-50%] right-[-50%] h-[50%] bg-[linear-gradient(rgba(217,70,239,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.4)_1px,transparent_1px)] bg-[size:40px_20px] [transform:perspective(500px)_rotateX(75deg)_translateY(-50px)_translateZ(-50px)] pointer-events-none z-0 opacity-40"></div>

        {/* Particles */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50 mix-blend-screen pointer-events-none z-10"></div>

        <div className="relative z-20 flex flex-col p-3 md:p-5 lg:p-4">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1 border border-fuchsia-500/30 rounded backdrop-blur text-fuchsia-400 font-mono text-[10px] tracking-widest uppercase">
              <Terminal className="w-3.5 h-3.5 animate-pulse" />
              Sadguru car melo
            </div>

            {/* Glitch Title */}
            <div className="relative z-30">
              <h2 className="font-heading text-xl md:text-2xl font-black italic uppercase tracking-[0.1em] text-cyan-400 absolute top-[1px] left-[1px] opacity-70 mix-blend-screen pointer-events-none">
                COMING_SOON
              </h2>
              <h2 className="font-heading text-xl md:text-2xl font-black italic uppercase tracking-[0.1em] text-fuchsia-500 absolute top-[-1px] left-[-1px] opacity-70 mix-blend-screen pointer-events-none">
                COMING_SOON
              </h2>
              <h2 className="relative font-heading text-xl md:text-2xl font-black italic uppercase tracking-[0.1em] text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                COMING_SOON
              </h2>
            </div>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row gap-3 md:gap-4 items-center">

            {/* Left: Car Viewer */}
            <div className="flex-1 w-full relative flex flex-col items-center justify-center min-h-[140px] md:min-h-[200px] lg:min-h-0 z-20">
              {car.image ? (
                <div className="relative w-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-600/15 to-transparent blur-[20px] rounded-full pointer-events-none"></div>
                  <img src={car.image} alt={car.title} className="w-full h-full object-contain max-h-[160px] md:max-h-[240px] lg:max-h-[280px] relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform duration-[1.5s] ease-[cubic-bezier(0.2,0.8,0.2,1)] p-2" style={{ transformOrigin: 'center bottom' }} />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[70%] h-4 bg-black blur-[15px] opacity-80 rounded-full pointer-events-none"></div>
                </div>
              ) : (
                <div className="text-fuchsia-500 font-mono text-sm font-black tracking-widest bg-black/50 px-6 py-3 border-2 border-dashed border-fuchsia-500/50 rounded-xl backdrop-blur animate-pulse text-center">
                   //_AWAITING_RENDER
                </div>
              )}

              {/* Car Name Block */}
              <div className="mt-3 bg-black/50 border border-fuchsia-500/40 px-4 py-2 shadow-[0_0_20px_rgba(217,70,239,0.15)] relative overflow-hidden backdrop-blur-md rounded-md text-center z-30 w-[80%] lg:w-[70%]">
                <div className="absolute top-0 right-0 w-6 h-full bg-cyan-400/10 skew-x-[20deg] translate-x-3"></div>
                <h3 className="text-fuchsia-400 font-mono text-[9px] uppercase tracking-[0.2em] mb-0.5">Ident:</h3>
                <p className="text-white font-heading text-lg md:text-xl font-black italic tracking-wider drop-shadow-[0_0_5px_rgba(255,255,255,0.4)] truncate">
                  {car.make} <span className="text-cyan-300">{car.model}</span>
                </p>
              </div>
            </div>

            {/* Right: Data Deck */}
            <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 flex flex-col gap-2 relative z-20 justify-center">

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
                {specs.length > 0 ? specs.map((s, i) => (
                  <NeonStat key={i} icon={s.icon} label={s.label} value={s.value} />
                )) : (
                  <div className="col-span-2 text-fuchsia-500/50 flex flex-col items-center justify-center p-4 border border-dashed border-fuchsia-900/50 bg-black/30 rounded-md">
                    <Terminal className="w-5 h-5 animate-pulse mb-2" />
                    <span className="text-[10px] tracking-[0.2em] font-mono uppercase">SYSTEM.DAT MISSING</span>
                  </div>
                )}
              </div>

              {/* Notify Me Button */}
              <button className="w-full py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-sm font-black italic tracking-[0.15em] uppercase rounded-md shadow-[0_0_20px_rgba(217,70,239,0.5)] transition-all duration-300 flex items-center justify-center gap-2 border border-fuchsia-400">
                <Zap className="w-4 h-4 animate-pulse" /> Notify Me
              </button>
            </div>

          </div>
        </div>

        {/* Bottom Caution Tape */}
        <div className="absolute bottom-0 left-0 right-0 h-3.5 bg-fuchsia-600 overflow-hidden flex items-center shadow-[0_-5px_20px_rgba(217,70,239,0.5)] z-30">
          <div className="whitespace-nowrap font-mono font-black text-[7px] tracking-widest text-[#0a0510] flex w-[200%]">
            <span className="inline-block" style={{ animation: 'poster3slide 20s linear infinite' }}>
              WARNING: HYPE LEVEL CRITICAL /// NEW ASSET DETECTED /// PREPARE FOR DROP /// WARNING: HYPE LEVEL CRITICAL /// NEW ASSET DETECTED /// PREPARE FOR DROP /// WARNING: HYPE LEVEL CRITICAL /// NEW ASSET DETECTED /// PREPARE FOR DROP ///
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes poster3slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
