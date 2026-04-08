import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Settings2, Wallet, Search, MapPin, ChevronDown } from 'lucide-react';
import axiosInstance from '../api/axiosConfig';

export default function HeroSection() {
  const navigate = useNavigate();
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');

  const [availableBrands, setAvailableBrands] = useState([]);
  const [brandModelMap, setBrandModelMap] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await axiosInstance.get('/cars/filters');
        if (res.data && res.data.data) {
          const fetchedMakes = res.data.data.makes || [];
          const fetchedMap = res.data.data.brandModelMap || [];

          setAvailableBrands(fetchedMakes);
          setBrandModelMap(fetchedMap);

          // Populate default all models
          const allModels = [...new Set(fetchedMap.flatMap(item => item.models))].filter(Boolean).sort();
          setAvailableModels(allModels);
        }
      } catch (error) {
        console.error('Failed to fetch car metadata', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetadata();
  }, []);

  const handleBrandChange = (e) => {
    const newBrand = e.target.value;
    setSelectedBrand(newBrand);
    setSelectedModel(''); // Reset model match to prevent orphaned queries

    // Filter models downward
    if (newBrand) {
      const match = brandModelMap.find(m => m._id === newBrand);
      setAvailableModels(match && match.models ? match.models.filter(Boolean).sort() : []);
    } else {
      const allModels = [...new Set(brandModelMap.flatMap(item => item.models))].filter(Boolean).sort();
      setAvailableModels(allModels);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedBrand) params.set('make', selectedBrand);
    if (selectedModel) params.set('model', selectedModel);

    if (selectedBudget && selectedBudget.includes('-')) {
      const [minPrice, maxPrice] = selectedBudget.split('-');
      if (minPrice) params.set('priceMin', minPrice);
      if (maxPrice) params.set('priceMax', maxPrice);
    }

    navigate(`/inventory?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[85vh] flex items-center pt-4 md:pt-4 pb-52 md:pb-12 font-['Inter',sans-serif]">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="image.png"
          alt="Premium Car"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/60 to-transparent md:bg-gradient-to-r md:from-slate-950 md:via-slate-900/80"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl text-left">
          <h1 className="text-4xl sm:text-5xl md:text-7xl text-white font-bold tracking-tight leading-[1.1] drop-shadow-2xl">
            Your <span className="text-brand-orange">Dream Car,</span><br />Now Within Your Reach!
          </h1>
          <p className="text-base md:text-xl text-slate-200 mt-6 max-w-2xl font-medium leading-relaxed drop-shadow-md">
            Surat&apos;s premier destination for curated luxury and certified pre-owned vehicles. Built on trust, driven by quality.
          </p>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap items-center gap-2 md:gap-8">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 group hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm tracking-wide">4.8 Rating</span>
                <div className="h-4 w-[1px] bg-white/20"></div>
                <span className="text-slate-300 text-xs uppercase tracking-widest font-semibold">Google Reviews</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div>
                <MapPin className="w-4 h-4 text-brand-orange shrink-0" />
              </div>
              <span className="text-white font-semibold text-sm tracking-wide">Varachha, Surat</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:gap-4">
            <button
              onClick={() => navigate('/inventory')}
              className="px-4 md:px-8 py-3.5 md:py-4 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-xl transition-all duration-300 shadow-[0_8px_20px_rgba(245,148,35,0.3)] hover:shadow-[0_12px_24px_rgba(245,148,35,0.4)] hover:-translate-y-0.5"
            >
              Browse Cars
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-4 md:px-8 py-3.5 md:py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold rounded-xl backdrop-blur-md transition-all duration-300"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Floating Search & Filter Bar */}
      <div className="absolute -bottom-24 md:-bottom-12 left-0 right-0 px-4 sm:px-8 md:px-12 z-20">
        <div className="max-w-6xl mx-auto backdrop-blur-2xl bg-white/95 border border-white/40 shadow-xl md:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15),0_16px_32px_-8px_rgba(245,148,35,0.08)] rounded-[2rem] p-3.5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-6 items-end">

            {/* Brand */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10 transition-transform duration-300 group-focus-within:scale-110">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-brand-orange/5 flex items-center justify-center text-brand-orange border border-brand-orange/10 shadow-sm group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                  <Car className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>
              <select
                value={selectedBrand}
                onChange={handleBrandChange}
                disabled={isLoading}
                className="appearance-none w-full h-12 md:h-16 pl-12 md:pl-16 pr-10 md:pr-12 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-brand-dark font-bold focus:ring-4 focus:ring-brand-orange/10 focus:border-brand-orange focus:bg-white outline-none transition-all duration-300 disabled:opacity-50 cursor-pointer text-[11px] md:text-base"
              >
                <option value="">{isLoading ? 'Loading...' : 'Select Brand'}</option>
                {availableBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-focus-within:text-brand-orange transition-colors" />
            </div>

            {/* Model */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10 transition-transform duration-300 group-focus-within:scale-110">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-brand-orange/5 flex items-center justify-center text-brand-orange border border-brand-orange/10 shadow-sm group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                  <Settings2 className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={isLoading || availableModels.length === 0}
                className="appearance-none w-full h-12 md:h-16 pl-12 md:pl-16 pr-10 md:pr-12 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-brand-dark font-bold focus:ring-4 focus:ring-brand-orange/10 focus:border-brand-orange focus:bg-white outline-none transition-all duration-300 disabled:opacity-50 cursor-pointer text-[11px] md:text-base"
              >
                <option value="">{isLoading ? 'Loading...' : 'Select Model'}</option>
                {availableModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-focus-within:text-brand-orange transition-colors" />
            </div>

            {/* Budget */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10 transition-transform duration-300 group-focus-within:scale-110">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-brand-orange/5 flex items-center justify-center text-brand-orange border border-brand-orange/10 shadow-sm group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                  <Wallet className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="appearance-none w-full h-12 md:h-16 pl-12 md:pl-16 pr-10 md:pr-12 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-brand-dark font-bold focus:ring-4 focus:ring-brand-orange/10 focus:border-brand-orange focus:bg-white outline-none transition-all duration-300 cursor-pointer text-[11px] md:text-base"
              >
                <option value="">Any Budget</option>
                <option value="0-500000">Under ₹5 Lakh</option>
                <option value="500000-1000000">₹5 Lakh - ₹10 Lakh</option>
                <option value="1000000-2000000">₹10 Lakh - ₹20 Lakh</option>
                <option value="2000000-99999999">Above ₹20 Lakh</option>
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-focus-within:text-brand-orange transition-colors" />
            </div>

            {/* Search Button */}
            <div className="relative h-12 md:h-16">
              <button
                onClick={handleSearch}
                className="w-full h-full bg-gradient-to-br from-brand-orange to-[#e68415] hover:from-[#e68415] hover:to-brand-orange text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all duration-500 shadow-[0_12px_24px_-8_rgba(245,148,35,0.4)] hover:shadow-[0_20px_40px_-12px_rgba(245,148,35,0.5)] hover:-translate-y-1 active:scale-95 group text-sm md:text-base"
              >
                <Search className="w-4 h-4 md:w-6 md:h-6 transition-transform duration-500 group-hover:rotate-12" />
                <span className="tracking-wide uppercase text-[10px] md:text-base">Search Inventory</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}