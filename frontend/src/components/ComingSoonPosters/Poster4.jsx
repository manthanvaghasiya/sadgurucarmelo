import React from 'react';
import { Fuel, Settings, User as UserIcon, Gauge, Car as CarIcon, Palette, Target, Flag } from 'lucide-react';

function RaceBlock({ icon, label, value }) {
  return (
    <div className="bg-[#111] border-l-[3px] border-red-600 py-2 px-2.5 flex items-center justify-between group hover:bg-[#1a1a1a] hover:border-red-500 transition-colors shadow-[4px_4px_15px_rgba(0,0,0,0.5)] min-w-0 rounded-r-sm">
      <div className="flex flex-col overflow-hidden min-w-0 flex-1 pr-2">
        <span className="text-stone-500 text-[8px] font-black uppercase tracking-[0.15em] mb-0.5 truncate">{label}</span>
        <span className="text-white text-xs font-black uppercase truncate group-hover:text-red-50 transition-colors">{value}</span>
      </div>
      <div className="text-red-700 group-hover:text-red-500 transition-colors drop-shadow-[0_0_8px_rgba(220,38,38,0.2)] shrink-0">
        {React.cloneElement(icon, { className: "w-4 h-4" })}
      </div>
    </div>
  )
}

export default function Poster4({ car }) {
  if (!car) return null;
  const isValid = (val) => val && val.toString().trim() !== '' && val !== 'N/A' && val.toString().trim() !== '0';

  const specs = [
    isValid(car.fuelType) && { icon: <Fuel />, label: "PWR/SRC", value: car.fuelType },
    isValid(car.transmission) && { icon: <Settings />, label: "GEARBOX", value: car.transmission },
    (car.kms > 0) && { icon: <Gauge />, label: "TELEMETRY", value: `${car.kms.toLocaleString('en-IN')} KM` },
    isValid(car.bodyType) && { icon: <CarIcon />, label: "AERO", value: car.bodyType },
    isValid(car.owner) && { icon: <UserIcon />, label: "PILOT.HST", value: car.owner },
    isValid(car.color) && { icon: <Palette />, label: "LIVERY", value: car.color },
  ].filter(Boolean);

  return (
    <div className="w-full h-full flex-1 relative shadow-2xl overflow-hidden bg-[#0d0d0d] border-t-2 border-r-2 border-red-600 group/poster rounded-2xl md:rounded-3xl">

      {/* --- CARBON FIBER & RACING BG --- */}
      <div className="absolute inset-0 opacity-40 z-0 mix-blend-luminosity" style={{ backgroundImage: `repeating-linear-gradient(45deg, #111, #111 5px, #1a1a1a 5px, #1a1a1a 10px)` }}></div>
      <div className="absolute inset-0 opacity-30 z-0 bg-gradient-to-tr from-black via-transparent to-transparent"></div>
      <div className="absolute top-0 right-[-20%] w-[80%] h-[150%] bg-[repeating-linear-gradient(-45deg,transparent,transparent_2px,rgba(220,38,38,0.1)_2px,rgba(220,38,38,0.1)_4px)] transform rotate-[15deg] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col p-3 md:p-5 lg:p-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 relative">
          {/* Angled Red Block */}
          <div className="absolute -top-8 -left-8 w-[160px] h-[120px] bg-red-600 flex items-end p-4 transform -rotate-[15deg] shadow-[0_10px_30px_rgba(220,38,38,0.4)] z-0">
            <Flag className="text-black w-6 h-6 opacity-50 transform rotate-[15deg]" />
          </div>

          <div className="z-10 pl-10 md:pl-14 pt-2">
            <div className="flex items-center gap-2 mb-0.5">
              <Target className="text-red-500 w-3.5 h-3.5 animate-pulse" />
              <span className="text-red-500 font-black text-[9px] tracking-[0.3em] uppercase">PROJECT RS</span>
            </div>
            <h2 className="font-heading text-xl md:text-2xl font-black text-white uppercase tracking-tighter drop-shadow-lg flex flex-wrap items-center gap-2">
              <span className="truncate">SADGURU</span> <span className="text-transparent bg-clip-text bg-gradient-to-t from-red-700 via-red-500 to-red-400 truncate">CAR MELO</span>
              <div className="px-2 py-0.5 bg-red-600 text-white text-[9px] tracking-[0.15em] shadow-[3px_3px_0_#000] border-l-2 border-white">
                COMING SOON
              </div>
            </h2>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-3 md:gap-4 items-center">

          {/* Main Visual */}
          <div className="flex-1 relative w-full min-h-[140px] md:min-h-[200px] lg:min-h-0 flex flex-col items-center justify-center z-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-2/3 bg-red-600/15 blur-[50px] rounded-full z-0 pointer-events-none"></div>

            {car.image ? (
              <img src={car.image} alt={car.title} className="w-full h-full object-contain max-h-[160px] md:max-h-[240px] lg:max-h-[280px] relative z-10 drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] hover:scale-105 transition-transform duration-[1s] ease-out p-2" style={{ transformOrigin: 'center bottom' }} />
            ) : (
              <div className="w-[85%] min-h-[120px] border border-dashed border-red-600/40 bg-black/50 backdrop-blur rounded flex flex-col items-center justify-center z-10 text-center">
                <span className="text-red-600/80 font-black text-lg tracking-[0.1em]">CLASSIFIED</span>
                <span className="text-stone-500 text-[10px] tracking-widest mt-1">WAITING FOR VISUAL DATA</span>
              </div>
            )}

            {/* Car Name */}
            <div className="mt-2 bg-[#111] border-l-[3px] border-r-[3px] border-red-600 px-4 py-1.5 shadow-[4px_4px_15px_rgba(220,38,38,0.3)] relative overflow-hidden text-center z-30 w-[80%] lg:w-[70%]">
              <h3 className="text-red-500 font-mono text-[9px] uppercase tracking-[0.3em] mb-0.5">TARGET ACQUIRED</h3>
              <p className="text-white font-heading text-lg md:text-xl font-black uppercase tracking-tighter drop-shadow-lg truncate">
                {car.make} <span className="text-transparent bg-clip-text bg-gradient-to-t from-red-700 via-red-500 to-red-400">{car.model}</span>
              </p>
            </div>
          </div>

          {/* Specs Sidebar */}
          <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 flex flex-col gap-2 z-30">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
              {specs.length > 0 ? specs.map((s, i) => (
                <RaceBlock key={i} icon={s.icon} label={s.label} value={s.value} />
              )) : (
                 <div className="col-span-2 text-red-500/50 flex flex-col items-center justify-center p-4 border border-dashed border-red-900/50 bg-[#111] rounded-sm">
                    <Target className="w-6 h-6 animate-pulse mb-2" />
                    <span className="text-[10px] tracking-[0.2em] font-mono uppercase text-center">DATA CLASSIFIED</span>
                 </div>
              )}
            </div>
            
            {/* Notify Me Button */}
            <button className="w-full py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-black uppercase tracking-widest border-b-4 border-red-800 shadow-[0_10px_20px_rgba(220,38,38,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group/btn rounded-sm">
              <Target className="w-4 h-4 group-hover/btn:animate-ping" /> Notify Me
            </button>
          </div>
        </div>

      </div>

      {/* Decorative Corner lines */}
      <div className="absolute bottom-3 right-3 flex gap-0.5 pointer-events-none">
        <div className="w-1.5 h-10 bg-red-600/30 transform -skew-x-[20deg]"></div>
        <div className="w-1.5 h-10 bg-red-600/60 transform -skew-x-[20deg]"></div>
        <div className="w-3 h-10 bg-red-600 transform -skew-x-[20deg]"></div>
      </div>
    </div>
  );
}
