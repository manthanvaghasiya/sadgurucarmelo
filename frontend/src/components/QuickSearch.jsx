import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Settings2, Wallet, Search, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../api/axiosConfig';

export default function QuickSearch({ compact = false }) {
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
    setSelectedModel('');

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
    <div className={`w-full mx-auto relative z-20 ${
      compact ? 'p-0 bg-transparent' : 'bg-white border border-gray-200 shadow-xl rounded-[2rem] p-6 max-w-6xl'
    }`}>
      <div className={`grid ${
        compact 
          ? 'items-center grid-cols-2 lg:grid-cols-4 gap-3' 
          : 'items-end grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6'
      }`}>
        {/* Brand */}
        <div className="relative group w-full">
          {!compact && <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 mb-2">Make</label>}
          <div className={`absolute left-3 ${compact ? 'top-1/2 -translate-y-1/2' : 'bottom-4 left-4'} flex items-center z-10 text-gray-400 group-focus-within:text-brand-orange transition-colors`}>
            <Car className={compact ? "w-4 h-4" : "w-5 h-5"} />
          </div>
          <select
            value={selectedBrand}
            onChange={handleBrandChange}
            disabled={isLoading}
            className={`appearance-none w-full border border-gray-200 text-gray-800 font-semibold focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all duration-300 disabled:opacity-50 cursor-pointer ${
              compact 
                ? 'h-11 pl-9 pr-6 rounded-xl text-sm bg-white shadow-sm hover:border-gray-300' 
                : 'h-14 pl-12 pr-10 rounded-xl text-sm lg:text-base bg-gray-50/50 focus:bg-white'
            }`}
          >
            <option value="">{isLoading ? 'Loading...' : 'Any Brand'}</option>
            {availableBrands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
          <ChevronDown className={`absolute ${compact ? 'right-3 top-1/2 -translate-y-1/2' : 'right-4 bottom-4'} w-4 h-4 text-gray-400 pointer-events-none`} />
        </div>

        {/* Model */}
        <div className="relative group w-full">
          {!compact && <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 mb-2">Model</label>}
          <div className={`absolute left-3 ${compact ? 'top-1/2 -translate-y-1/2' : 'bottom-4 left-4'} flex items-center z-10 text-gray-400 group-focus-within:text-brand-orange transition-colors`}>
            <Settings2 className={compact ? "w-4 h-4" : "w-5 h-5"} />
          </div>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={isLoading || availableModels.length === 0}
            className={`appearance-none w-full border border-gray-200 text-gray-800 font-semibold focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all duration-300 disabled:opacity-50 cursor-pointer ${
              compact 
                ? 'h-11 pl-9 pr-6 rounded-xl text-sm bg-white shadow-sm hover:border-gray-300' 
                : 'h-14 pl-12 pr-10 rounded-xl text-sm lg:text-base bg-gray-50/50 focus:bg-white'
            }`}
          >
            <option value="">{isLoading ? 'Loading...' : 'Any Model'}</option>
            {availableModels.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
          <ChevronDown className={`absolute ${compact ? 'right-3 top-1/2 -translate-y-1/2' : 'right-4 bottom-4'} w-4 h-4 text-gray-400 pointer-events-none`} />
        </div>

        {/* Budget */}
        <div className="relative group w-full">
          {!compact && <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest pl-1 mb-2">Budget</label>}
          <div className={`absolute left-3 ${compact ? 'top-1/2 -translate-y-1/2' : 'bottom-4 left-4'} flex items-center z-10 text-gray-400 group-focus-within:text-brand-orange transition-colors`}>
            <Wallet className={compact ? "w-4 h-4" : "w-5 h-5"} />
          </div>
          <select
            value={selectedBudget}
            onChange={(e) => setSelectedBudget(e.target.value)}
            className={`appearance-none w-full border border-gray-200 text-gray-800 font-semibold focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all duration-300 cursor-pointer ${
              compact 
                ? 'h-11 pl-9 pr-6 rounded-xl text-sm bg-white shadow-sm hover:border-gray-300' 
                : 'h-14 pl-12 pr-10 rounded-xl text-sm lg:text-base bg-gray-50/50 focus:bg-white'
            }`}
          >
            <option value="">Any Budget</option>
            <option value="0-500000">Under ₹5 Lakh</option>
            <option value="500000-1000000">₹5 Lakh - ₹10 Lakh</option>
            <option value="1000000-2000000">₹10 Lakh - ₹20 Lakh</option>
            <option value="2000000-99999999">Above ₹20 Lakh</option>
          </select>
          <ChevronDown className={`absolute ${compact ? 'right-3 top-1/2 -translate-y-1/2' : 'right-4 bottom-4'} w-4 h-4 text-gray-400 pointer-events-none`} />
        </div>

        {/* Search Button */}
        <div className={`relative w-full ${compact ? 'h-11' : 'h-14 mt-2 lg:mt-0'}`}>
          <button
            onClick={handleSearch}
            className={`w-full h-full bg-brand-orange hover:bg-[#e68415] text-white font-bold flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 group shadow-[0_4px_15px_rgba(245,148,35,0.3)] shadow-brand-orange/30 ${compact ? 'rounded-xl text-sm' : 'rounded-xl text-sm lg:text-base'}`}
          >
            <Search className={compact ? "w-4 h-4" : "w-5 h-5"} />
            <span className="tracking-wide uppercase">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}
