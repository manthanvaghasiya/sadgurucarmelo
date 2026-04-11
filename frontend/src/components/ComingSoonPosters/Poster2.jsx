import React from 'react';
import { Fuel, Settings, Gauge, Car as CarIcon, Palette, Diamond, Key, Clock, Award } from 'lucide-react';

function MainSpec({ icon, title, value }) {
  return (
    <div className="flex items-center gap-3 bg-[#14120e]/80 border-b border-[#2e281b] py-2 px-2.5 hover:bg-[#1f1b14] transition-colors overflow-hidden">
      <div className="w-8 h-8 rounded-full border border-[#4a3e26] bg-[#0d0b08] flex items-center justify-center text-[#d4af37] shadow-[inset_0_0_10px_rgba(212,175,55,0.1)] shrink-0">
        {React.cloneElement(icon, { className: "w-4 h-4" })}
      </div>
      <div className="flex flex-col overflow-hidden min-w-0">
        <span className="text-[9px] text-[#8a7b5e] uppercase tracking-[0.2em] font-medium truncate">{title}</span>
        <span className="text-sm text-[#fcf6eb] uppercase font-black tracking-widest leading-none mt-0.5 truncate">{value}</span>
      </div>
    </div>
  )
}

function LuxurySpec({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center justify-center p-2 bg-gradient-to-b from-[#1c1a16] to-[#0a0907] border border-[#362f21] rounded-lg relative overflow-hidden group hover:border-[#b38b45] transition-colors duration-500 flex-1 min-w-0">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ffd700] to-transparent opacity-0 group-hover:opacity-50 transition-opacity"></div>
      <div className="text-[#a18856] group-hover:text-[#ffd700] transition-colors duration-500 mb-1 shrink-0">
        {React.cloneElement(icon, { className: "w-4 h-4" })}
      </div>
      <span className="text-[#736341] text-[8px] font-bold uppercase tracking-[0.15em] mb-0.5 text-center truncate w-full">{label}</span>
      <span className="text-[#f5ebd8] text-[10px] font-black uppercase tracking-wider text-center truncate w-full">{value}</span>
    </div>
  )
}

export default function Poster2({ car }) {
  if (!car) return null;
  const isValid = (val) => val && val.toString().trim() !== '' && val !== 'N/A' && val.toString().trim() !== '0';

  const mainSpecs = [
    isValid(car.transmission) && { icon: <Settings />, title: "Powertrain", value: car.transmission },
    isValid(car.fuelType) && { icon: <Fuel />, title: "Energy Source", value: car.fuelType },
    isValid(car.color) && { icon: <Palette />, title: "Exterior Finish", value: car.color },
  ].filter(Boolean);

  const luxurySpecs = [
    isValid(car.bodyType) && { icon: <CarIcon />, label: "Format", value: car.bodyType },
    (car.kms > 0) && { icon: <Gauge />, label: "Logged", value: `${car.kms.toLocaleString('en-IN')}K` },
    isValid(car.owner) && { icon: <Key />, label: "Owner", value: car.owner },
  ].filter(Boolean);

  return (
    <div className="w-full h-full flex-1 relative shadow-[0_40px_80px_rgba(0,0,0,0.8)] overflow-hidden bg-[#050403] border border-[#2a2315] rounded-2xl md:rounded-3xl">

      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_10%,_#2a2315_0%,_#050403_70%)] pointer-events-none"></div>
      <div className="absolute top-[-30%] left-[20%] w-[100%] h-[150%] bg-gradient-to-tr from-transparent via-[#d4af37]/5 to-transparent rotate-[35deg] pointer-events-none"></div>
      <div className="absolute top-[-30%] right-[10%] w-[80%] h-[150%] bg-gradient-to-tl from-transparent via-[#d4af37]/3 to-transparent -rotate-[45deg] pointer-events-none"></div>
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      <div className="relative z-10 flex flex-col p-3 md:p-5 lg:p-4">

        {/* --- HEADER --- */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 border-b border-[#362e1c] pb-2 mb-3 relative">
          <div className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-[30%] h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>

          <div className="flex items-center gap-3">
            <Diamond className="text-[#d4af37] w-5 h-5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[#8c7853] text-[8px] uppercase tracking-[0.3em] font-medium leading-none mb-0.5">Elite Collection</span>
              <span className="text-[#e2cfa2] font-heading font-black text-base tracking-widest uppercase leading-none">
                SADGURU <span className="font-light text-[#94815a]">PREMIUM</span>
              </span>
            </div>
          </div>

          <h2 className="font-heading text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#ffedb3] via-[#d4af37] to-[#806410] tracking-[0.2em] uppercase drop-shadow-[0_4px_10px_rgba(212,175,55,0.2)]">
            COMING SOON
          </h2>
        </div>

        {/* --- BODY --- */}
        <div className="flex-1 flex flex-col lg:flex-row gap-3 md:gap-4 items-center">

          {/* Main Car Podium */}
          <div className="flex-1 w-full flex flex-col items-center justify-center relative min-h-[140px] md:min-h-[200px] lg:min-h-0">
            {/* Gold Aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] max-w-[400px] aspect-square rounded-full bg-[#1c1503]/50 border-[0.5px] border-[#d4af37]/10 shadow-[inset_0_0_80px_rgba(212,175,55,0.1)] pointer-events-none"></div>

            <div className="relative w-full flex items-center justify-center z-20">
              {car.image ? (
                <img src={car.image} alt={car.title} className="w-full h-full object-contain max-h-[160px] md:max-h-[240px] lg:max-h-[280px] drop-shadow-[0_40px_50px_rgba(0,0,0,0.9)] hover:scale-105 transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)] p-2" style={{ transformOrigin: 'center bottom' }} />
              ) : (
                <div className="w-full min-h-[120px] border border-dashed border-[#594d30] rounded-xl flex items-center justify-center bg-[#0d0a04]/50 backdrop-blur">
                  <span className="text-[#a18a58] font-heading tracking-[0.2em] uppercase text-sm">Upload Elite Asset</span>
                </div>
              )}
            </div>

            {/* Name Badge */}
            <div className="mt-2 text-center relative z-20 bg-black/40 px-5 py-1.5 rounded-full border border-[#2b2416] backdrop-blur-md">
              <h3 className="font-heading text-lg md:text-xl font-light text-[#f5ebd8] tracking-[0.3em] uppercase truncate">
                {car.make} <span className="font-black text-[#d4af37]">{car.model}</span>
              </h3>
            </div>
          </div>

          {/* Specifications Sidebar */}
          <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 flex flex-col gap-2 justify-center">

            {mainSpecs.length > 0 && (
              <div className="flex flex-col lg:border-r border-[#d4af37]/20 lg:pr-3">
                {mainSpecs.map((s, i) => <MainSpec key={i} icon={s.icon} title={s.title} value={s.value} />)}
              </div>
            )}

            {luxurySpecs.length > 0 && (
              <div className="flex gap-1.5">
                {luxurySpecs.map((s, i) => <LuxurySpec key={i} icon={s.icon} label={s.label} value={s.value} />)}
              </div>
            )}

            {(mainSpecs.length === 0 && luxurySpecs.length === 0) && (
              <div className="flex flex-col items-center justify-center p-4 border border-dashed border-[#d4af37]/30 rounded-xl bg-[#0a0805]/50 gap-3 shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]">
                <Diamond className="text-[#d4af37]/40 w-8 h-8 animate-pulse" />
                <span className="text-[#d4af37]/50 text-[10px] tracking-[0.3em] uppercase font-mono text-center">Awaiting Elite<br />Verification</span>
              </div>
            )}

            {/* Authenticity seal */}
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-[#362e1c]">
              <Award className="text-[#d4af37] w-4 h-4" />
              <span className="text-[#8c7853] text-[9px] tracking-[0.2em] uppercase truncate">Verified & Certified</span>
              <Award className="text-[#d4af37] w-4 h-4" />
            </div>

            {/* Notify Me Button */}
            <button className="w-full py-2 bg-gradient-to-r from-[#d4af37] via-[#ffedb3] to-[#d4af37] hover:from-[#e3be46] hover:via-[#fff1c4] hover:to-[#e3be46] text-[#14120e] text-sm font-black uppercase tracking-widest rounded-md shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              Notify Me
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
