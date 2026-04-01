import { Car, Banknote, ArrowLeftRight, CheckCircle2, MapPin } from 'lucide-react';

export default function Services() {
  return (
    <div className="flex flex-col flex-grow min-h-screen">
      
      {/* 1. Page Header Section */}
      <section className="bg-surface py-20 px-4 pt-28">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading font-extrabold text-[40px] md:text-[52px] text-text leading-tight tracking-tight mb-4">
            Complete Auto Solutions in Surat
          </h1>
          <p className="font-body text-lg md:text-xl text-text-muted">
            Buy, Sell, or Exchange with total confidence.
          </p>
        </div>
      </section>

      {/* 2. Services Grid */}
      <section className="bg-background py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Buy */}
            <div className="bg-surface rounded-xl shadow-md border border-gray-100 border-t-[4px] border-t-primary p-8 md:p-10 flex flex-col h-full hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-8">
                <Car className="w-8 h-8 text-primary stroke-[2]" />
              </div>
              <h2 className="font-heading font-bold text-2xl text-text mb-6">Buy Certified Cars</h2>
              
              <ul className="space-y-4 mb-10 flex-grow font-body text-sm text-text">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  <span>Verified Inventory</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  <span>Test Drives</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  <span>Free Polish</span>
                </li>
              </ul>
              
              <button className="w-full mt-auto py-3.5 rounded-lg border-2 border-primary text-primary font-body font-bold text-sm hover:bg-primary hover:text-white transition-colors">
                View Stock
              </button>
            </div>

            {/* Card 2: Sell */}
            <div className="bg-surface rounded-xl shadow-md border border-gray-100 border-t-[4px] border-t-primary p-8 md:p-10 flex flex-col h-full hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-8">
                <Banknote className="w-8 h-8 text-[#10b981] stroke-[2]" />
              </div>
              <h2 className="font-heading font-bold text-2xl text-text mb-6">Sell for Cash</h2>
              
              <ul className="space-y-4 mb-10 flex-grow font-body text-sm text-text">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0" />
                  <span>Best Market Value</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0" />
                  <span>Same Day Payment</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0" />
                  <span>RC Transfer</span>
                </li>
              </ul>
              
              <button className="w-full mt-auto py-3.5 rounded-lg bg-accent text-white font-body font-bold text-sm hover:bg-accent-hover transition-colors shadow-sm">
                Get Free Valuation
              </button>
            </div>

            {/* Card 3: Exchange */}
            <div className="bg-surface rounded-xl shadow-md border border-gray-100 border-t-[4px] border-t-primary p-8 md:p-10 flex flex-col h-full hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-8">
                <ArrowLeftRight className="w-8 h-8 text-[#f97316] stroke-[2]" />
              </div>
              <h2 className="font-heading font-bold text-2xl text-text mb-6">Exchange & Upgrade</h2>
              
              <ul className="space-y-4 mb-10 flex-grow font-body text-sm text-text">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#f97316] shrink-0" />
                  <span>Great exchange bonus</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#f97316] shrink-0" />
                  <span>Easy paperwork</span>
                </li>
              </ul>
              
              <button className="w-full mt-auto py-3.5 rounded-lg bg-accent text-white font-body font-bold text-sm hover:bg-accent-hover transition-colors shadow-sm">
                Discuss Exchange
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Finance Banner */}
      <section className="bg-primary py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="font-heading font-extrabold text-[32px] sm:text-[40px] text-white leading-tight mb-3">
              Need Finance? We've got you covered.
            </h2>
            <p className="font-body text-[17px] text-blue-100">
              Low EMI options and quick approvals with leading banks.
            </p>
          </div>
          <div className="shrink-0 mt-4 md:mt-0">
            <button className="bg-surface text-primary px-8 py-4 rounded-xl font-heading font-bold text-base shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
              Check Eligibility
            </button>
          </div>
        </div>
      </section>

      {/* 4. Location / Find Us Section */}
      <section className="bg-background py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="font-heading font-extrabold text-4xl text-text mb-4">
            Find Us in Surat
          </h2>
          <p className="font-body text-lg text-text-muted mb-10 leading-relaxed">
            Trilok Car Bazar, Simada Canal BRTS Rd, Varachha.
          </p>
          
          <button className="bg-primary text-white px-10 py-4 rounded-xl font-body font-bold text-base shadow-lg hover:bg-primary-hover transition-colors hover:shadow-xl focus:ring-4 focus:ring-primary/20">
            Get Directions
          </button>
        </div>
      </section>

    </div>
  );
}
