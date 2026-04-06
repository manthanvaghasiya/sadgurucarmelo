import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, FileText, Landmark, Tag, Star, Banknote, RefreshCw, CarFront, CheckCircle, Clock } from 'lucide-react';

export default function AboutPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read service from URL or default to 'buy'
  const initialService = searchParams.get('service') || 'buy';
  const [activeTab, setActiveTab] = useState(initialService);

  // Sync state and scroll if URL changes
  useEffect(() => {
    const serviceFromUrl = searchParams.get('service');
    if (serviceFromUrl && ['buy', 'sell', 'exchange'].includes(serviceFromUrl)) {
      setActiveTab(serviceFromUrl);

      // Auto-scroll logic so users are instantly mapped to the matching content
      setTimeout(() => {
        const el = document.getElementById('core-services');
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 300);
    }
  }, [searchParams]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ service: tabId }, { replace: true });
  };

  const tabs = [
    { id: 'buy', label: 'Buy a Car' },
    { id: 'sell', label: 'Sell a Car' },
    { id: 'exchange', label: 'Exchange Offer' },
  ];

  return (
    <div className="flex flex-col flex-grow min-h-screen bg-background">
      <style>{`
        @keyframes customFadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: customFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      {/* 1. Hero Section (Old) */}
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

      {/* 2. Overlapping Stats Card (Old) */}
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

      {/* 3. More Than Just a Car Bazar Section (Old) */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] lg:h-[550px] bg-gray-900">
            <img
              src="about.png"
              alt="Premium Car Showcase"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
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

      {/* 4. The Sadguru Standard (Old) */}
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

      {/* NEW Interactive Tab Component -> Placed Here as requested */}
      <section id="core-services" className="py-12 px-4 bg-gray-50 border-t border-gray-100 relative z-10 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 flex flex-col items-center">
            <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-primary mb-2">
              Our Core Services
            </h2>
            <div className="w-12 h-1 bg-primary rounded-full mb-3"></div>
            <p className="font-body text-lg text-text-muted max-w-2xl">
              From robust inspections to 15-minute cash payments, click below to see how our processes run smoothly for you.
            </p>
          </div>

          {/* Tabs Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-8 py-3 rounded-full font-heading font-bold text-sm md:text-base transition-all duration-300 ${activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                  : 'bg-white text-text-muted hover:text-primary hover:bg-gray-50 shadow-sm border border-gray-100'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dynamic Content Area */}
          <div className="bg-white rounded-3xl shadow-xl ring-1 ring-black/[0.03] p-6 md:p-8 overflow-hidden relative min-h-[300px]">
            {activeTab === 'buy' && (
              <div className="flex flex-col md:flex-row items-center gap-6 animate-fade-in">
                <div className="flex-1 space-y-4">
                  <h2 className="font-heading font-extrabold text-2xl text-text">Drive Home with Confidence</h2>
                  <p className="font-body text-text-muted text-base md:text-lg leading-relaxed">
                    Buying a pre-owned car shouldn't feel like a gamble. We offer a premium, fully-transparent buying experience.
                  </p>
                  <ul className="space-y-4 pt-2">
                    <li className="flex items-start gap-3">
                      <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-heading font-bold text-text">110-Point Inspection</span>
                        <span className="font-body text-text-muted text-sm border-b-0">Every car is rigorously tested for mechanical perfection and structural integrity.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <Banknote className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-heading font-bold text-text">Easy Financing</span>
                        <span className="font-body text-text-muted text-sm border-b-0">Get quick loan approvals with competitive interest rates from top banks.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <CarFront className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-heading font-bold text-text">Huge Inventory</span>
                        <span className="font-body text-text-muted text-sm border-b-0">Explore over 150+ verified cars across all segments and budgets.</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/3 flex justify-center shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-blue-50 flex items-center justify-center relative shadow-sm border border-blue-100">
                    <CarFront className="w-12 h-12 md:w-16 md:h-16 text-primary" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sell' && (
              <div className="flex flex-col md:flex-row items-center gap-6 animate-fade-in">
                <div className="flex-1 space-y-4">
                  <h2 className="font-heading font-extrabold text-2xl text-text">Sell Instantly at the Best Price</h2>
                  <p className="font-body text-text-muted text-base md:text-lg leading-relaxed">
                    Skip the endless negotiations and risky private sales. Get a fair deal and money in your bank today.
                  </p>
                  <ul className="space-y-4 pt-2">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-heading font-bold text-text">Instant Fair Valuation</span>
                        <span className="font-body text-text-muted text-sm border-b-0">Our expert evaluators provide a fast, data-backed assessment of your car's true market value.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Clock className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-heading font-bold text-text">Payment in 15 Minutes</span>
                        <span className="font-body text-text-muted text-sm border-b-0">Once the deal is agreed, the money is wired to your bank account immediately.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <ShieldCheck className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-heading font-bold text-text">Free RC Transfer</span>
                        <span className="font-body text-text-muted text-sm border-b-0">We handle all the DTO paperwork and legal transfers securely at zero extra cost.</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/3 flex justify-center shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-green-50 flex items-center justify-center relative shadow-sm border border-green-100">
                    <Banknote className="w-12 h-12 md:w-16 md:h-16 text-green-600" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'exchange' && (
              <div className="flex flex-col md:flex-row items-center gap-6 animate-fade-in">
                <div className="flex-1 space-y-4">
                  <h2 className="font-heading font-extrabold text-2xl text-text">Seamless One-Day Upgrades</h2>
                  <p className="font-body text-text-muted text-base md:text-lg leading-relaxed">
                    Outgrown your current vehicle? Trade it in for maximum value and drive out with your next dream car simultaneously.
                  </p>
                  <ul className="space-y-4 pt-2">
                    <li className="flex items-start gap-3">
                      <RefreshCw className="w-6 h-6 text-orange-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-heading font-bold text-text">The Seamless Process</span>
                        <span className="font-body text-text-muted text-sm border-b-0">Bring in your old car, select a new one from our lot, and we adjust the value immediately.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Banknote className="w-6 h-6 text-orange-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-heading font-bold text-text">Attractive Exchange Bonus</span>
                        <span className="font-body text-text-muted text-sm border-b-0">Unlock special price adjustments exclusive to our exchange customers.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CarFront className="w-6 h-6 text-orange-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-heading font-bold text-text">Drive Out Same Day</span>
                        <span className="font-body text-text-muted text-sm border-b-0">We merge the buying and selling paperwork, so you can leave with your upgraded ride today.</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/3 flex justify-center shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-orange-50 flex items-center justify-center relative shadow-sm border border-orange-100">
                    <RefreshCw className="w-12 h-12 md:w-16 md:h-16 text-orange-600" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Testimonials (Old) */}
      <section className="py-24 px-4 bg-surface border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-text mb-3">What Surat is Saying</h2>
            <p className="font-body text-text-muted text-lg">Real experiences from our growing family of car owners.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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