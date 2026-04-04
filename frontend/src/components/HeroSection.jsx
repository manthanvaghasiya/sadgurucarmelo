import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Settings2, Wallet, Search } from 'lucide-react';
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
                onChange={handleBrandChange}
                disabled={isLoading}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-red-600 focus:border-red-600 text-slate-900 outline-none transition-all duration-300 disabled:opacity-50"
              >
                <option value="">{isLoading ? 'Loading...' : 'All Brands'}</option>
                {availableBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Model (Dependent logic) */}
            <div className="flex flex-col">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Settings2 className="w-4 h-4" />
                Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={isLoading || availableModels.length === 0}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-red-600 focus:border-red-600 text-slate-900 outline-none transition-all duration-300 disabled:opacity-50"
              >
                <option value="">{isLoading ? 'Loading...' : 'All Models'}</option>
                {availableModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
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
                <option value="">Any Budget</option>
                <option value="0-500000">Under ₹5 Lakh</option>
                <option value="500000-1000000">₹5 Lakh - ₹10 Lakh</option>
                <option value="1000000-2000000">₹10 Lakh - ₹20 Lakh</option>
                <option value="2000000-99999999">Above ₹20 Lakh</option>
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
