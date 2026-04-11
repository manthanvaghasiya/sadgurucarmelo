import React from 'react';
import { Fuel, Settings, User as UserIcon, Gauge, Car as CarIcon, Palette, Target, Flag } from 'lucide-react';

export default function Poster4({ car }) {
  if (!car) return null;

  return (
    <div className="w-full relative shadow-2xl rounded-tr-[5rem] rounded-bl-[5rem] overflow-hidden bg-[#0d0d0d] border-t-2 border-r-2 border-red-600 min-h-[260px] lg:min-h-[150px] group/poster">

      {/* --- CARBON FIBER & RACING BG --- */}
      {/* Heavy Carbon Fiber Pattern */}
      <div className="absolute inset-0 opacity-40 z-0 mix-blend-luminosity" style={{ backgroundImage: `repeating-linear-gradient(45deg, #111, #111 5px, #1a1a1a 5px, #1a1a1a 10px)` }}></div>
      <div className="absolute inset-0 opacity-30 z-0 bg-gradient-to-tr from-black via-transparent to-transparent"></div>

      {/* Speed lines */}
      <div className="absolute top-0 right-[-20%] w-[80%] h-[150%] bg-[repeating-linear-gradient(-45deg,transparent,transparent_2px,rgba(220,38,38,0.1)_2px,rgba(220,38,38,0.1)_4px)] transform rotate-[15deg] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col p-4 md:p-6 h-full">

        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 relative">
          {/* Angled Red Block */}
          <div className="absolute -top-10 -left-10 w-[200px] h-[150px] bg-red-600 flex items-end p-6 transform -rotate-[15deg] shadow-[0_10px_30px_rgba(220,38,38,0.4)] z-0">
            <Flag className="text-black w-8 h-8 opacity-50 transform rotate-[15deg]" />
          </div>

          <div className="z-10 pl-6 md:pl-16 pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="text-red-500 w-4 h-4 animate-pulse" />
              <span className="text-red-500 font-black text-[10px] md:text-xs tracking-[0.4em] uppercase">PROJECT RS</span>
            </div>
            <h2 className="font-heading text-2xl md:text-4xl font-black text-white uppercase tracking-tighter transform skew-x-0 md:-skew-x-[10deg] drop-shadow-lg flex flex-wrap items-center gap-2">
              {car.make} <span className="text-transparent bg-clip-text bg-gradient-to-t from-red-700 via-red-500 to-red-400">{car.model}</span>

              {/* High-Impact Badge */}
              <div className="ml-2 mt-2 md:mt-0 px-3 py-1 lg:py-0.5 lg:px-2 bg-red-600 text-white text-[10px] md:text-sm lg:text-xs tracking-[0.2em] transform skew-x-0 md:-skew-x-[10deg] shadow-[4px_4px_0_#000] border-l-2 border-white">
                <span className="block transform skew-x-[10deg]">COMING SOON</span>
              </div>
            </h2>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-4 md:gap-8 mt-2 items-center">

          {/* Main Visual Display */}
          <div className="flex-1 relative w-full min-h-[150px] md:min-h-[220px] lg:min-h-[160px] flex items-center justify-center z-20 group/car">
            {/* Dynamic background behind car */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-2/3 bg-red-600/20 blur-[50px] rounded-full z-0 group-hover/car:bg-red-500/30 transition-colors duration-700"></div>

            {car.image ? (
              <img src={car.image} className="w-[95%] h-[95%] max-h-[180px] lg:max-h-[140px] object-contain relative z-10 drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] transform group-hover/car:scale-[1.05] group-hover/car:-translate-y-2 transition-transform duration-[1s] ease-out" alt={car.title} />
            ) : (
              <div className="w-[85%] md:w-[80%] h-[80%] lg:h-[60%] border border-dashed border-red-600/40 bg-black/50 backdrop-blur rounded flex flex-col items-center justify-center z-10 transform skew-x-0 md:-skew-x-[5deg] px-2 text-center">
                <span className="text-red-600/80 font-black text-lg md:text-2xl tracking-[0.1em] md:tracking-[0.2em]">CLASSIFIED</span>
                <span className="text-stone-500 text-[10px] md:text-xs tracking-widest mt-2">WAITING FOR VISUAL DATA</span>
              </div>
            )}
          </div>

          {/* Aggressive Specs Sidebar */}
          <div className="w-full lg:w-[350px] shrink-0 flex flex-col gap-2 md:gap-4 z-30">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-2 md:gap-4">
              <RaceBlock icon={<Fuel className="w-5 h-5" />} label="PWR/SRC" value={car.fuelType} />
              <RaceBlock icon={<Settings className="w-5 h-5" />} label="GEARBOX" value={car.transmission} />
              <RaceBlock icon={<Gauge className="w-5 h-5" />} label="TELEMETRY" value={`${car.kms?.toLocaleString() || 0} KM`} />
              <RaceBlock icon={<CarIcon className="w-5 h-5" />} label="AERO" value={car.bodyType || 'N/A'} />
              <RaceBlock icon={<UserIcon className="w-5 h-5" />} label="PILOT.HST" value={car.owner} />
              <RaceBlock icon={<Palette className="w-5 h-5" />} label="LIVERY" value={car.color || 'N/A'} />
            </div>
            
            {/* Notify Me Button */}
            <button className="w-full py-3.5 lg:py-2 mt-2 lg:mt-0 bg-red-600 hover:bg-red-500 text-white lg:text-xs font-black uppercase tracking-widest border-b-4 border-red-800 shadow-[0_10px_20px_rgba(220,38,38,0.4)] transition-all duration-300 transform skew-x-0 md:-skew-x-[15deg] hover:scale-[1.02] flex items-center justify-center gap-2 group/btn">
              <span className="skew-x-0 md:skew-x-[15deg] flex items-center gap-2"><Target className="w-5 h-5 lg:w-4 lg:h-4 group-hover/btn:animate-ping" /> Notify Me</span>
            </button>
          </div>
        </div>

      </div>

      {/* Decorative Corner lines */}
      <div className="absolute bottom-4 right-4 flex gap-1 pointer-events-none">
        <div className="w-2 h-12 bg-red-600/30 transform -skew-x-[20deg]"></div>
        <div className="w-2 h-12 bg-red-600/60 transform -skew-x-[20deg]"></div>
        <div className="w-4 h-12 bg-red-600 transform -skew-x-[20deg]"></div>
      </div>
    </div>
  );
}

function RaceBlock({ icon, label, value }) {
  return (
    <div className="bg-[#111] border-l-[4px] md:border-l-[6px] border-red-600 py-2 md:py-3 lg:py-1.5 px-3 md:px-4 lg:px-2 transform skew-x-0 md:-skew-x-[15deg] flex items-center justify-between group hover:bg-[#1a1a1a] hover:border-red-500 transition-colors shadow-[4px_4px_15px_rgba(0,0,0,0.5)]">
      <div className="flex flex-col transform skew-x-0 md:skew-x-[15deg] w-[calc(100%-1.5rem)]">
        <span className="text-stone-500 text-[9px] lg:text-[8px] font-black uppercase tracking-[0.2em] mb-0.5">{label}</span>
        <span className="text-white text-xs md:text-sm lg:text-xs font-black uppercase truncate group-hover:text-red-50 transition-colors">{value}</span>
      </div>
      <div className="text-red-700 group-hover:text-red-500 transform skew-x-0 md:skew-x-[15deg] transition-colors drop-shadow-[0_0_8px_rgba(220,38,38,0.2)] shrink-0">
        {icon}
      </div>
    </div>
  )
}
