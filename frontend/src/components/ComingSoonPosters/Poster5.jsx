import React from 'react';
import { Fuel, Settings, User as UserIcon, Gauge, Car as CarIcon, Palette, Leaf, ShieldCheck, Cpu } from 'lucide-react';

function EcoSpec({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 p-2 bg-white/40 backdrop-blur-xl rounded-lg border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(20,83,45,0.08)] hover:bg-white/60 transition-all duration-500 group relative overflow-hidden min-w-0">
      <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 group-hover:animate-[poster5shine_1s_ease-in-out]"></div>

      <div className="text-emerald-600 bg-gradient-to-br from-emerald-50 to-green-100 w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center border border-white shadow-inner group-hover:scale-110 transition-transform duration-500">
        {React.cloneElement(icon, { className: "w-4 h-4" })}
      </div>
      <div className="flex flex-col overflow-hidden min-w-0 flex-1">
        <span className="text-emerald-800/50 text-[8px] font-bold uppercase tracking-[0.15em] mb-0.5 truncate">{label}</span>
        <span className="text-emerald-950 font-black text-[11px] uppercase tracking-wider truncate drop-shadow-[0_1px_10px_rgba(255,255,255,1)]">{value}</span>
      </div>
    </div>
  )
}

export default function Poster5({ car }) {
  if (!car) return null;
  const isValid = (val) => val && val.toString().trim() !== '' && val !== 'N/A' && val.toString().trim() !== '0';

  const specs = [
    isValid(car.fuelType) && { icon: <Cpu />, label: "Powertrain", value: car.fuelType },
    isValid(car.transmission) && { icon: <Settings />, label: "Drivetrain", value: car.transmission },
    (car.kms > 0) && { icon: <Gauge />, label: "Odometer", value: `${car.kms.toLocaleString('en-IN')} KM` },
    isValid(car.color) && { icon: <Palette />, label: "Colorway", value: car.color },
    isValid(car.bodyType) && { icon: <CarIcon />, label: "Architecture", value: car.bodyType },
    isValid(car.owner) && { icon: <UserIcon />, label: "Ownership", value: car.owner },
  ].filter(Boolean);

  return (
    <div className="w-full h-full flex-1 relative shadow-[0_40px_100px_rgba(16,185,129,0.15)] overflow-hidden bg-[#f0fdf4] border border-emerald-200/50 rounded-2xl md:rounded-3xl">

      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-[#ecfdf5] to-[#d1fae5] z-0"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[40%] aspect-square bg-[#a7f3d0] rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-[poster5float_10s_ease-in-out_infinite] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square bg-[#d9f99d] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-[poster5float_12s_ease-in-out_infinite_reverse] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[20%] w-[30%] aspect-square bg-[#bae6fd] rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-[poster5float_8s_ease-in-out_infinite] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS1vcGFjaXR5PSIwLjAyIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] z-0 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col p-3 md:p-5 lg:p-4 gap-2">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 z-20">
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <Leaf className="text-emerald-500 w-4 h-4" />
            <span className="text-emerald-900 font-bold text-[11px] uppercase tracking-[0.15em]">Sadguru car melo</span>
          </div>

          <div className="flex flex-col items-center sm:items-end">
            <h2 className="font-heading text-xl md:text-2xl font-light text-emerald-950 tracking-[0.15em] uppercase flex items-center gap-2 drop-shadow-sm">
              <span className="font-black mix-blend-overlay opacity-80">COMING</span>
              <span className="relative">
                SOON
                <span className="absolute -right-4 bottom-2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-ping"></span>
                <span className="absolute -right-4 bottom-2 w-2 h-2 rounded-full bg-emerald-500"></span>
              </span>
            </h2>
            <div className="h-[1px] w-full max-w-[160px] mt-1 bg-gradient-to-r from-transparent via-emerald-800/20 to-emerald-800/20"></div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex-1 w-full flex flex-col lg:flex-row items-center gap-3 md:gap-4 relative">

          {/* Car Visual */}
          <div className="relative flex-1 w-full min-h-[140px] md:min-h-[200px] lg:min-h-0 flex items-center justify-center z-10">
            {/* Glass Platform */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] max-w-[320px] aspect-square rounded-full border-[1.5px] border-white/60 bg-white/10 backdrop-blur-md shadow-[0_30px_60px_rgba(16,185,129,0.1),inset_0_20px_40px_rgba(255,255,255,0.8)] pointer-events-none transform -rotate-12"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] max-w-[280px] aspect-square rounded-full bg-white blur-[40px] pointer-events-none z-0"></div>

            {car.image ? (
              <img src={car.image} alt={car.title} className="w-full h-full max-h-[160px] md:max-h-[240px] lg:max-h-[280px] object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.2)] hover:scale-105 hover:-translate-y-1 transition-all duration-[1s] ease-out relative z-10 p-2" style={{ transformOrigin: 'center bottom' }} />
            ) : (
              <div className="w-[70%] min-h-[120px] border border-dashed border-emerald-300/50 rounded-2xl bg-emerald-50/30 backdrop-blur-lg flex flex-col items-center justify-center text-emerald-800/40 font-heading font-medium tracking-[0.15em] relative z-10 shadow-[inset_0_0_30px_rgba(255,255,255,0.8)] gap-2">
                <ShieldCheck className="w-8 h-8 opacity-50" />
                <span className="text-sm">REVEAL PENDING</span>
              </div>
            )}

            {/* Floating Title */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl px-5 py-1.5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white z-20 w-[85%] lg:w-max text-center overflow-hidden">
              <span className="font-heading font-light text-sm md:text-base text-emerald-950 tracking-[0.2em] uppercase block truncate w-full">
                {car.make} <span className="font-black">{car.model}</span>
              </span>
            </div>
          </div>

          {/* Specs Cards */}
          <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 flex flex-col z-20 mt-2 lg:mt-0">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
              {specs.length > 0 ? specs.map((s, i) => (
                <EcoSpec key={i} icon={s.icon} label={s.label} value={s.value} />
              )) : (
                <div className="col-span-2 text-emerald-800/50 flex flex-col items-center justify-center p-4 border border-dashed border-emerald-400/50 bg-white/40 backdrop-blur-md rounded-2xl">
                  <ShieldCheck className="w-8 h-8 animate-pulse mb-2" />
                  <span className="text-[10px] tracking-[0.2em] font-bold uppercase text-center">PARAMETERS PENDING</span>
                </div>
              )}
            </div>

            {/* Notify Me Button */}
            <button className="w-full mt-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-[0.15em] rounded-xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all duration-500 hover:shadow-[0_15px_40px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 animate-pulse" /> Notify Me
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes poster5float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes poster5shine {
          100% { left: 200%; }
        }
      `}</style>
    </div>
  );
}
