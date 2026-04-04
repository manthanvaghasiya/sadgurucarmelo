import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Settings2, Wallet, Search } from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [selectedModel, setSelectedModel] = useState('All Models');
  const [selectedBudget, setSelectedBudget] = useState('Any Budget');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedBrand && selectedBrand !== 'All Brands') params.set('brand', selectedBrand);
    if (selectedModel && selectedModel !== 'All Models') params.set('model', selectedModel);

    if (selectedBudget && selectedBudget !== 'Any Budget') {
      params.set('budget', selectedBudget);
    }

    navigate(`/inventory?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[80vh] flex items-center pt-20 pb-24 font-['Inter',sans-serif]">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="image.png"
          alt="Premium Car"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl text-left">
          <h1 className="text-5xl md:text-7xl text-white font-bold tracking-tight leading-tight">
            Your Dream Car, Now Within Your Reach!
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mt-6 max-w-2xl">
            Surat's most trusted premium and pre-owned car dealership.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/inventory')}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Browse Inventory
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold rounded-xl backdrop-blur-md transition-all duration-300"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Floating Search & Filter Bar */}
      <div className="absolute -bottom-16 left-0 right-0 px-4 z-20">
        <div className="max-w-6xl mx-auto backdrop-blur-xl bg-white/95 border border-white/20 shadow-2xl rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Brand */}
            <div className="flex flex-col">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Car className="w-4 h-4" />
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-red-600 focus:border-red-600 text-slate-900 outline-none transition-all duration-300"
              >
                <option value="All Brands">All Brands</option>
                <option value="Tata">Tata</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Maruti Suzuki">Maruti Suzuki</option>
                <option value="Mahindra">Mahindra</option>
              </select>
            </div>

            {/* Model */}
            <div className="flex flex-col">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Settings2 className="w-4 h-4" />
                Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-red-600 focus:border-red-600 text-slate-900 outline-none transition-all duration-300"
              >
                <option value="All Models">All Models</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
              </select>
            </div>

            {/* Budget */}
            <div className="flex flex-col">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Wallet className="w-4 h-4" />
                Budget
              </label>
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-red-600 focus:border-red-600 text-slate-900 outline-none transition-all duration-300"
              >
                <option value="Any Budget">Any Budget</option>
                <option value="Under ₹5 Lakh">Under ₹5 Lakh</option>
                <option value="₹5 - ₹10 Lakh">₹5 - ₹10 Lakh</option>
                <option value="Over ₹10 Lakh">Over ₹10 Lakh</option>
              </select>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="w-full h-12 mt-4 md:mt-0 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-xl"
            >
              <Search className="w-5 h-5" />
              Search Cars
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
