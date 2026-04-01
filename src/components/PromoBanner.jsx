export default function PromoBanner() {
  return (
    <section className="mt-24 mb-12">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#0a1020] flex flex-col min-h-[400px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://placehold.co/1920x600/0f172a/334155?text=Dark+Tata+Nexon+Grille" 
            alt="Facelift Teaser" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-r from-[#0a1020] via-[#0a1020]/80 to-transparent"></div>
        </div>
        
        {/* Content Area */}
        <div className="relative z-10 p-10 md:p-16 flex flex-col justify-center h-full max-w-3xl">
          <span className="inline-flex items-center bg-blue-800 text-blue-100 px-4 py-1.5 rounded-full text-[10px] font-heading font-extrabold uppercase tracking-[0.2em] mb-6 self-start shadow-sm border border-blue-700/50">
            Exclusive Reveal
          </span>
          
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.1] mb-8">
            Hype Alert: 2024 Tata Nexon Facelift arriving soon.
          </h2>
          
          <button className="bg-[#0033aa] hover:bg-[#0044cc] text-white px-8 py-4 rounded-xl font-body font-semibold text-base inline-flex items-center self-start shadow-lg transition-transform hover:-translate-y-1">
            Notify Me First
          </button>
        </div>
      </div>
    </section>
  );
}
