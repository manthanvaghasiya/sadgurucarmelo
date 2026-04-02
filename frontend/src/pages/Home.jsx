import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, Banknote, ShieldCheck, 
  Search, Play, Star, Landmark, Headphones, Loader2
} from 'lucide-react';
import CarCard from '../components/CarCard';
import { useCars } from '../context/CarContext';

export default function Home() {
  const [inventoryTab, setInventoryTab] = useState('present'); // 'present' or 'soon'
  const { cars, isLoading } = useCars();

  return (
    <div className="min-h-screen flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative h-[600px] sm:h-[700px] flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://placehold.co/1920x800/001a4d/ffffff?text=Premium+Audi+Sedan" 
            alt="Premium Showroom Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto -mt-32">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
            Surat’s Most Trusted & Verified Pre-Owned Cars
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2 bg-yellow-500/90 text-yellow-950 px-4 py-2 rounded-full font-heading font-bold text-sm shadow-md">
              <Star className="w-4 h-4 fill-current" />
              <span>4.9/5 Rating on Google Reviews</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full font-body font-medium text-sm border border-white/20">
              <span>📍 Adajan Gam, Surat</span>
            </div>
          </div>
        </div>

        {/* Quick Search Overlapping Card */}
        <div className="absolute -bottom-16 left-0 right-0 px-4 z-20">
          <div className="max-w-6xl mx-auto bg-surface rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col lg:flex-row gap-4 lg:items-end border border-gray-100">
            <div className="flex-1 w-full">
              <label className="block text-xs font-heading font-semibold text-text-muted mb-2 uppercase tracking-wide">Select Brand</label>
              <select className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-primary font-body text-text shadow-sm outline-none">
                <option>All Brands</option>
                <option>Hyundai</option>
                <option>Maruti Suzuki</option>
                <option>Honda</option>
                <option>Tata</option>
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-heading font-semibold text-text-muted mb-2 uppercase tracking-wide">Select Model</label>
              <select className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-primary font-body text-text shadow-sm outline-none">
                <option>All Models</option>
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-heading font-semibold text-text-muted mb-2 uppercase tracking-wide">Select Budget</label>
              <select className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-primary font-body text-text shadow-sm outline-none">
                <option>Any Budget</option>
                <option>₹1L - ₹5L</option>
                <option>₹5L - ₹10L</option>
                <option>₹10L - ₹20L</option>
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-heading font-semibold text-text-muted mb-2 uppercase tracking-wide">Fuel Type</label>
              <select className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-primary font-body text-text shadow-sm outline-none">
                <option>All Types</option>
                <option>Petrol</option>
                <option>Diesel</option>
                <option>CNG</option>
              </select>
            </div>
            <div className="w-full lg:w-auto">
              <button className="w-full lg:w-48 h-12 bg-primary hover:bg-primary-hover text-white rounded-xl font-heading font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-md">
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Services Section */}
      <section className="pt-32 pb-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary mb-4">Complete Buy-Sell-Exchange Solutions in Surat</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-3">Buy Certified Cars</h3>
              <p className="font-body text-text-muted leading-relaxed mb-6">Choose from 150+ rigorously inspected cars for total peace of mind.</p>
              <a href="#" className="font-heading font-semibold text-primary hover:underline mt-auto flex items-center gap-2">View Details →</a>
            </div>
            
            <div className="bg-surface rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Banknote className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-3">Sell Your Car Instantly</h3>
              <p className="font-body text-text-muted leading-relaxed mb-6">Get the best market value with instant payment and transparent processes.</p>
              <a href="#" className="font-heading font-semibold text-primary hover:underline mt-auto flex items-center gap-2">View Details →</a>
            </div>

            <div className="bg-surface rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-3">Best Value Exchange</h3>
              <p className="font-body text-text-muted leading-relaxed mb-6">Quality cars available for attractive exchange bonuses when you trade in.</p>
              <a href="#" className="font-heading font-semibold text-primary hover:underline mt-auto flex items-center gap-2">View Details →</a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Inventory Grid Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary mb-3">Explore Our Verified Vehicles</h2>
              <p className="font-body text-text-muted max-w-2xl">Quality pre-owned vehicles with complete service history and multi-point inspection.</p>
            </div>
            
            <div className="bg-gray-200 p-1.5 rounded-xl inline-flex selbst-start">
              <button 
                onClick={() => setInventoryTab('present')}
                className={`px-6 py-2.5 rounded-lg font-heading font-bold text-sm transition-all sm:w-auto w-1/2 ${
                  inventoryTab === 'present' 
                    ? 'bg-surface text-primary shadow-sm' 
                    : 'text-text-muted hover:text-text'
                }`}
              >
                Available Now
              </button>
              <button 
                onClick={() => setInventoryTab('soon')}
                className={`px-6 py-2.5 rounded-lg font-heading font-bold text-sm transition-all sm:w-auto w-1/2 ${
                  inventoryTab === 'soon' 
                    ? 'bg-surface text-primary shadow-sm' 
                    : 'text-text-muted hover:text-text'
                }`}
              >
                Coming Soon
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="font-body text-text-muted font-semibold">Loading inventory...</p>
              </div>
            ) : (!cars || cars.length === 0) ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="font-heading text-lg text-text font-bold mb-2">Our inventory is currently being updated.</p>
                <p className="font-body text-text-muted">Check back soon for the latest arrivals!</p>
              </div>
            ) : (
              cars.slice(0, 6).map((car) => (
                <CarCard key={car._id} car={car} />
              ))
            )}
          </div>

          <div className="mt-12 text-center">
            <Link to="/inventory" className="inline-block px-8 py-3 rounded-full border-2 border-primary text-primary font-heading font-bold hover:bg-primary hover:text-white transition-colors cursor-pointer">
              View Full Inventory
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Highlight Banner Section */}
      <section className="py-20 bg-background px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-gray-400 uppercase tracking-widest mb-8">Arriving Shortly</h2>
          
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-primary flex flex-col md:flex-row min-h-[400px]">
            <div className="md:w-[60%] relative h-64 md:h-auto">
              <img 
                src="https://placehold.co/1000x800/1a1a1a/444444?text=2023+KIA+SELTOS" 
                alt="Incoming Kia Seltos" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-primary md:to-primary"></div>
            </div>
            
            <div className="md:w-[40%] p-10 md:p-16 flex flex-col justify-center relative z-10 bg-surface md:bg-transparent rounded-t-3xl md:rounded-l-none md:rounded-r-3xl text-left shadow-lg md:shadow-none -mt-6 md:mt-0 ml-0 md:-ml-8">
              <span className="inline-block bg-primary/20 text-primary md:text-white md:bg-white/20 px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider mb-6 self-start backdrop-blur-sm border md:border-white/20 border-primary/20">
                Join Waitlist
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-primary md:text-white leading-tight mb-4">
                <span className="italic block font-light text-2xl sm:text-3xl mb-1 text-gray-500 md:text-gray-300">HYPE ALERT:</span>
                2023 KIA SELTOS
              </h2>
              <div className="flex items-center gap-3 mb-8 border-l-4 border-accent pl-4 text-text-muted md:text-blue-100">
                <p className="font-body text-lg">Coming to lot this Thursday</p>
              </div>
              <button className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-heading font-bold text-lg inline-flex items-center self-start gap-3 shadow-xl transition-all hover:-translate-y-1">
                Get Early Access → 
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us & Testimonials */}
      <section className="py-24 px-4 bg-surface border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary mb-4">Why Choose Us?</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center px-4">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 shadow-sm">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold text-text mb-3">Certified & Tested Cars</h3>
                <p className="font-body text-text-muted text-sm">Every vehicle undergoes a 120+ point inspection for your peace of mind.</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 shadow-sm">
                  <Landmark className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold text-text mb-3">Easy Loan Assistance</h3>
                <p className="font-body text-text-muted text-sm">Get quick approval and flexible EMI options from top banks.</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 shadow-sm">
                  <Headphones className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold text-text mb-3">Local Surat Support</h3>
                <p className="font-body text-text-muted text-sm">Dedicated local team providing post-purchase assistance and service.</p>
              </div>
            </div>

            {/* Testimonials snippet */}
            <div className="lg:col-span-1 flex items-center justify-center mt-8 lg:mt-0">
               <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-50 flex flex-col relative overflow-hidden w-full h-full justify-center">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400 rounded-bl-full opacity-10 blur-2xl"></div>
                   
                   <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-6">
                     <div className="flex bg-yellow-500/10 p-4 rounded-xl items-center justify-center">
                       <span className="font-heading text-3xl font-extrabold text-text">4.8</span>
                       <Star className="w-6 h-6 fill-yellow-400 text-yellow-400 ml-1 pb-1" />
                     </div>
                     <div className="flex flex-col">
                        <span className="font-body text-sm font-semibold text-text">Google Reviews</span>
                        <span className="text-xs text-text-muted">Based on customer rating</span>
                     </div>
                   </div>

                   <p className="font-body italic text-text-muted leading-relaxed mb-6">
                     "Excellent service and genuine cars! The sales team was very transparent regarding the vehicle's history."
                   </p>
                   
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-heading font-bold">SM</div>
                     <div>
                       <h4 className="font-heading font-bold text-text text-sm">Sahil Modh</h4>
                       <span className="text-xs text-accent font-body">Verified Customer</span>
                     </div>
                   </div>
               </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
