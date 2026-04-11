import React from 'react';
import { Fuel, Settings, User as UserIcon, Gauge, Car as CarIcon, Palette, Diamond, Key, Clock, Award } from 'lucide-react';

function LuxurySpec({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#1c1a16] to-[#0a0907] border border-[#362f21] rounded-lg relative overflow-hidden group hover:border-[#b38b45] transition-colors duration-500">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ffd700] to-transparent opacity-0 group-hover:opacity-50 transition-opacity"></div>
      
      <div className="text-[#a18856] group-hover:text-[#ffd700] transition-colors duration-500 mb-2 mt-1">
        {icon}
      </div>
      <span className="text-[#736341] text-[9px] font-bold uppercase tracking-[0.2em] mb-1 text-center">{label}</span>
      <span className="text-[#f5ebd8] text-xs font-black uppercase tracking-wider text-center">{value}</span>
    </div>
  )
}

function MainSpec({ icon, title, value }) {
  return (
    <div className="flex items-center gap-4 bg-[#14120e]/80 border-b border-[#2e281b] pb-3 pt-2 px-2 hover:bg-[#1f1b14] transition-colors">
       <div className="w-10 h-10 rounded-full border border-[#4a3e26] bg-[#0d0b08] flex items-center justify-center text-[#d4af37] shadow-[inset_0_0_10px_rgba(212,175,55,0.1)]">
         {icon}
       </div>
       <div className="flex flex-col">
         <span className="text-[10px] text-[#8a7b5e] uppercase tracking-[0.25em] font-medium">{title}</span>
         <span className="text-lg text-[#fcf6eb] uppercase font-black tracking-widest">{value}</span>
       </div>
    </div>
  )
}

export default function Poster2({ car }) {
  if (!car) return null;

  return (
    <div className="w-full relative shadow-[0_40px_80px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden bg-[#050403] border border-[#2a2315] min-h-[260px] lg:min-h-[280px]">
      
      {/* --- BACKGROUND METALLIC/STAGE LUXURY --- */}
      {/* Spotlight Radial Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_10%,_#2a2315_0%,_#050403_70%)] pointer-events-none"></div>
      
      {/* Light Beams */}
      <div className="absolute top-[-30%] left-[20%] w-[100%] h-[150%] bg-gradient-to-tr from-transparent via-[#d4af37]/5 to-transparent rotate-[35deg] pointer-events-none"></div>
      <div className="absolute top-[-30%] right-[10%] w-[80%] h-[150%] bg-gradient-to-tl from-transparent via-[#d4af37]/3 to-transparent -rotate-[45deg] pointer-events-none"></div>

      {/* Subtle Noisy Texture (CSS tricks) */}
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      <div className="relative z-10 flex flex-col h-full lg:p-6 p-4">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-[#362e1c] pb-6 mb-8 relative">
           {/* Absolute deco line */}
           <div className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-[30%] h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
           
           <div className="flex items-center gap-3 md:mb-0 mb-4">
              <Diamond className="text-[#d4af37] w-6 h-6" />
              <div className="flex flex-col">
                <span className="text-[#8c7853] text-[9px] uppercase tracking-[0.4em] font-medium leading-none mb-1">Elite Collection</span>
                <span className="text-[#e2cfa2] font-heading font-black text-xl tracking-widest uppercase leading-none">
                  SADGURU <span className="font-light text-[#94815a]">PREMIUM</span>
                </span>
              </div>
           </div>

           <div className="text-center">
             <h2 className="font-heading text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#ffedb3] via-[#d4af37] to-[#806410] tracking-[0.3em] uppercase drop-shadow-[0_4px_10px_rgba(212,175,55,0.2)]">
               COMING SOON
             </h2>
           </div>
        </div>

        {/* --- BODY --- */}
        <div className="flex-1 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          
          {/* Main Car Podium */}
          <div className="flex-1 w-full flex flex-col items-center justify-center relative">
             {/* Circular Gold Aura */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[70%] max-w-[500px] aspect-square rounded-full bg-[#1c1503]/50 border-[0.5px] border-[#d4af37]/10 shadow-[inset_0_0_80px_rgba(212,175,55,0.1)] pointer-events-none"></div>
             
             {/* Sub Podium Base */}
             <div className="absolute bottom-4 w-[90%] max-w-[600px] h-10 border-b border-[#d4af37]/30 rounded-[100%] shadow-[0_20px_40px_rgba(212,175,55,0.15)] pointer-events-none"></div>

             <div className="relative w-full shadow-2xl z-20">
               {car.image ? (
                  <img src={car.image} alt={car.title} className="w-[110%] h-auto -ml-[5%] object-contain max-h-[240px] lg:max-h-[350px] drop-shadow-[0_30px_40px_rgba(0,0,0,0.9)] transform scale-110 hover:scale-[1.15] transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)]" />
               ) : (
                  <div className="w-full min-h-[150px] md:min-h-[200px] border border-dashed border-[#594d30] rounded-xl flex items-center justify-center bg-[#0d0a04]/50 backdrop-blur">
                    <span className="text-[#a18a58] font-heading tracking-[0.2em] uppercase text-sm">Upload Elite Asset Here</span>
                  </div>
               )}
             </div>

             {/* Bold Name Under Car */}
             <div className="mt-8 text-center relative z-20 bg-black/40 px-8 py-3 rounded-full border border-[#2b2416] backdrop-blur-md">
               <h3 className="font-heading text-2xl md:text-3xl font-light text-[#f5ebd8] tracking-[0.4em] uppercase">
                 {car.make} <span className="font-black text-[#d4af37]">{car.model}</span>
               </h3>
             </div>
          </div>

          {/* Luxury Specifications Sidebar */}
          <div className="w-full lg:w-[340px] shrink-0 flex flex-col gap-6">
            
            <div className="flex flex-col gap-1 pr-4 border-r border-[#d4af37]/20">
              <MainSpec icon={<Settings className="w-5 h-5"/>} title="Powertrain" value={car.transmission} />
              <MainSpec icon={<Fuel className="w-5 h-5"/>} title="Energy Source" value={car.fuelType} />
              <MainSpec icon={<Palette className="w-5 h-5"/>} title="Exterior Finish" value={car.color || 'Unspecified'} />
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              <LuxurySpec icon={<CarIcon className="w-5 h-5"/>} label="Format" value={car.bodyType || 'SUV'} />
              <LuxurySpec icon={<Gauge className="w-5 h-5"/>} label="Logged" value={`${car.kms?.toLocaleString() || 0}K`} />
              <LuxurySpec icon={<Key className="w-5 h-5"/>} label="Owner" value={car.owner} />
            </div>
            
            {/* Authenticity seal */}
            <div className="mt-auto flex items-center justify-center gap-3 pt-6 border-t border-[#362e1c]">
              <Award className="text-[#d4af37] w-6 h-6" />
              <span className="text-[#8c7853] text-[10px] tracking-[0.3em] uppercase">Verified & Certified</span>
              <Award className="text-[#d4af37] w-6 h-6" />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
