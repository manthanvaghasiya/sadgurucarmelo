import { ShieldCheck, FileText, Landmark, Tag, Star } from 'lucide-react';

export default function Services() {
  return (
    <div className="flex flex-col flex-grow min-h-screen bg-background">

      {/* 1. Hero Section (Dark Blue) */}
      <section className="bg-primary pt-24 pb-40 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading font-extrabold text-[40px] md:text-[56px] text-white leading-[1.1] mb-6 tracking-tight">
            Driving Trust in Surat<br className="hidden md:block" /> Since 2010
          </h1>
          <p className="font-body text-lg md:text-xl text-blue-100/90 font-medium max-w-2xl mx-auto">
            Varachha's top destination for premium, verified pre-owned cars.
          </p>
        </div>
      </section>

      {/* 2. Overlapping Stats Card */}
      <section className="px-4 -mt-24 relative z-10 mb-20">
        <div className="max-w-4xl mx-auto bg-surface rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between divide-y md:divide-y-0 md:divide-x divide-gray-100 gap-8 md:gap-0 text-center">

          <div className="flex flex-col items-center justify-center w-full pb-8 md:pb-0">
            <span className="font-heading font-extrabold text-4xl text-text mb-2">500<span className="text-gray-400 font-medium">+</span></span>
            <span className="font-heading text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Happy Customers</span>
          </div>

          <div className="flex flex-col items-center justify-center w-full py-8 md:py-0">
            <div className="flex items-center gap-1 mb-2">
              <span className="font-heading font-extrabold text-4xl text-text">4.8/5</span>
              <Star className="w-5 h-5 fill-primary text-primary -mt-3" />
            </div>
            <span className="font-heading text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Google Rating</span>
          </div>

          <div className="flex flex-col items-center justify-center w-full pt-8 md:pt-0">
            <span className="font-heading font-extrabold text-4xl text-text mb-2">50<span className="text-gray-400 font-medium">+</span></span>
            <span className="font-heading text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Verified Cars</span>
          </div>

        </div>
      </section>

      {/* 3. More Than Just a Car Bazar Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] lg:h-[550px] bg-gray-900">
            <img
              src="https://placehold.co/800x1000/111827/ffffff?text=Premium+Sports+Car"
              alt="Premium Car Showcase"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col">
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-text mb-6 leading-tight">
              More Than Just a Car Bazar
            </h2>
            <div className="font-body text-base text-text-muted space-y-6 leading-relaxed mb-10">
              <p>
                At Sadguru Car Melo, we believe that buying a pre-owned vehicle should be as prestigious as buying a new one. Founded in 2010, we have built our reputation on the pillars of transparency and absolute quality.
              </p>
              <p>
                Every vehicle at our showroom undergoes a rigorous vetting process. Our focus remains exclusively on <span className="font-bold text-text">non-accidental, RTO-verified vehicles</span>. We are proud partners of Trilok Car Bazar, ensuring a legacy of trust that the people of Varachha have relied on for over a decade.
              </p>
            </div>
            <button className="bg-primary text-white font-heading font-bold text-sm px-8 py-4 rounded-xl shadow-lg hover:bg-primary-hover hover:shadow-xl transition-all w-max hover:-translate-y-0.5">
              Explore Our Legacy
            </button>
          </div>

        </div>
      </section>

      {/* 4. The Sadguru Standard */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16 flex flex-col items-center">
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-text mb-4">
              The Sadguru Standard
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="bg-surface p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-[#eef2ff] flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-primary stroke-[2]" />
              </div>
              <h3 className="font-heading font-bold text-lg text-text mb-3">110-Point Inspection</h3>
              <p className="font-body text-sm text-text-muted leading-relaxed">
                Every car is checked by experts to ensure mechanical perfection and aesthetic integrity before it reaches you.
              </p>
            </div>

            <div className="bg-surface p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-[#eef2ff] flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-primary stroke-[2]" />
              </div>
              <h3 className="font-heading font-bold text-lg text-text mb-3">Instant RC Transfer</h3>
              <p className="font-body text-sm text-text-muted leading-relaxed">
                Say goodbye to paperwork hassles. We handle the complete documentation process with speed and transparency.
              </p>
            </div>

            <div className="bg-surface p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-[#eef2ff] flex items-center justify-center mb-6">
                <Landmark className="w-6 h-6 text-primary stroke-[2]" />
              </div>
              <h3 className="font-heading font-bold text-lg text-text mb-3">Easy Loan Approvals</h3>
              <p className="font-body text-sm text-text-muted leading-relaxed">
                Collaborations with top banks allow us to offer competitive interest rates and quick disbursement for your dream car.
              </p>
            </div>

            <div className="bg-surface p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-[#eef2ff] flex items-center justify-center mb-6">
                <Tag className="w-6 h-6 text-primary stroke-[2]" />
              </div>
              <h3 className="font-heading font-bold text-lg text-text mb-3">Transparent Pricing</h3>
              <p className="font-body text-sm text-text-muted leading-relaxed">
                No hidden fees or last-minute surprises. What you see is exactly what you pay for your chosen vehicle.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Testimonials: What Surat is Saying */}
      <section className="py-24 px-4 bg-surface border-t border-gray-100">
        <div className="max-w-7xl mx-auto">

          <div className="mb-16">
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-text mb-3">What Surat is Saying</h2>
            <p className="font-body text-text-muted text-lg">Real experiences from our growing family of car owners.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Review 1 */}
            <div className="bg-surface p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#10b981] text-[#10b981]" />
                ))}
              </div>
              <p className="font-body italic text-text-muted leading-relaxed mb-8 flex-grow">
                "Buying my Swift from Sadguru Car Melo was so smooth. The car looked brand new and the papers were ready in no time. Best in Varachha!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#dbeafe] flex items-center justify-center font-heading font-bold text-primary">PK</div>
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-sm text-text">Pritesh K.</span>
                  <span className="font-body text-[11px] text-text-muted">Verified Buyer</span>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-surface p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#10b981] text-[#10b981]" />
                ))}
              </div>
              <p className="font-body italic text-text-muted leading-relaxed mb-8 flex-grow">
                "I was worried about accident history, but they showed me the full report of the Swift VXI I bought. Very honest people."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#dbeafe] flex items-center justify-center font-heading font-bold text-primary">RS</div>
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-sm text-text">Rajesh S.</span>
                  <span className="font-body text-[11px] text-text-muted">Verified Buyer</span>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-surface p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#10b981] text-[#10b981]" />
                ))}
              </div>
              <p className="font-body italic text-text-muted leading-relaxed mb-8 flex-grow">
                "Transparent pricing and great hospitality. Got a wonderful deal on a Maruti Swift. Highly recommended for pre-owned cars in Surat."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#dbeafe] flex items-center justify-center font-heading font-bold text-primary">AM</div>
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-sm text-text">Ankit M.</span>
                  <span className="font-body text-[11px] text-text-muted">Verified Buyer</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}