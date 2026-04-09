import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, ChevronDown } from 'lucide-react';

export default function SidebarFilter({
  filters,
  setFilters,
  availableBrands = [],
  availableFuels = [],
  availableBodyTypes = [],
  priceRangeBounds = [0, 5000000],
  onClose
}) {

  // Range Slider implementation directly integrated
  const exactMin = Number(priceRangeBounds[0]) || 0;
  const exactMax = Number(priceRangeBounds[1]) || 5000000;
  
  // Mathematically snap slider bounds beyond actual max so users can scale properly
  const minBound = Math.floor(exactMin / 10000) * 10000;
  const maxBound = Math.ceil(exactMax / 10000) * 10000;

  // Use filter's budget or fallback to overall bounds
  const currentMin = filters.budget ? filters.budget[0] : minBound;
  const currentMax = filters.budget ? filters.budget[1] : maxBound;

  const handleBudgetChange = useCallback((newMin, newMax) => {
    setFilters(prev => ({
      ...prev,
      budget: [newMin, newMax]
    }));
  }, [setFilters]);

  // Format currency
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getPercent = (value) => {
    if (maxBound === minBound) return 0;
    return Math.round(((value - minBound) / (maxBound - minBound)) * 100);
  };

  const currentMinPercent = getPercent(currentMin);
  const currentMaxPercent = getPercent(currentMax);

  const toggleMake = (make) => {
    const current = filters.makes || [];
    if (current.includes(make)) {
      setFilters({ ...filters, makes: current.filter(m => m !== make) });
    } else {
      setFilters({ ...filters, makes: [...current, make] });
    }
  };

  const setFuelType = (ft) => {
    setFilters({ ...filters, fuelType: filters.fuelType === ft ? '' : ft });
  };

  const setBodyType = (bt) => {
    setFilters({ ...filters, bodyType: filters.bodyType === bt ? '' : bt });
  };

  const [searchParams, setSearchParams] = useSearchParams();

  const clearAll = () => {
    setFilters({ makes: [], fuelType: '', bodyType: '', budget: null, priceMin: '', priceMax: '' });
    if (searchParams.toString()) {
        setSearchParams({});
    }
  };

  const activeMakes = filters.makes || [];

  return (
    <aside className="w-full lg:sticky lg:top-28 h-full lg:h-fit lg:max-h-[calc(100vh-7rem)] overflow-y-auto bg-white p-6 lg:rounded-2xl lg:shadow-xl lg:ring-1 lg:ring-black/[0.03] flex flex-col gap-6">

      {/* Header (Desktop Only, Mobile has its own in drawer) */}
      <div className="hidden lg:flex items-center justify-between pb-4 border-b border-gray-100">
        <h2 className="font-heading font-bold text-lg text-text">Advanced Filters</h2>
        <button onClick={clearAll} className="text-primary font-body text-sm font-semibold hover:underline">Clear All</button>
      </div>

      {/* Budget Filter - Dual Thumb Range Slider */}
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h3 className="font-heading font-semibold text-sm text-text-muted tracking-widest uppercase">Budget</h3>
        </div>

        {/* Render formatted selected budget */}
        <div className="flex items-center justify-between font-heading font-bold text-[15px] text-text bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100">
          <span>{formatINR(currentMin)}</span>
          <span className="text-text-muted">-</span>
          <span>{formatINR(currentMax)}</span>
        </div>

        {/* Dual Thumb Slider */}
        <div className="relative w-full h-8 flex items-center group mt-2">
          {/* Track Background */}
          <div className="absolute w-full h-1.5 bg-slate-200 rounded-full"></div>

          {/* Track Active Highlight */}
          <div
            className="absolute h-1.5 bg-brand-orange rounded-full transition-all duration-100"
            style={{
              left: `${currentMinPercent}%`,
              width: `${currentMaxPercent - currentMinPercent}%`
            }}
          ></div>

          {/* Min Slider */}
          <input
            type="range"
            min={minBound}
            max={maxBound}
            value={currentMin}
            step={10000}
            onChange={(e) => {
              const value = Math.min(Number(e.target.value), currentMax - 10000);
              handleBudgetChange(value, currentMax);
            }}
            className="absolute w-full appearance-none bg-transparent pointer-events-none 
                [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
                [&::-webkit-slider-thumb]:w-[22px] [&::-webkit-slider-thumb]:h-[22px] 
                [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full 
                [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:ring-1 [&::-webkit-slider-thumb]:ring-black/5
                hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform
                z-20"
          />

          {/* Max Slider */}
          <input
            type="range"
            min={minBound}
            max={maxBound}
            value={currentMax}
            step={10000}
            onChange={(e) => {
              const value = Math.max(Number(e.target.value), currentMin + 10000);
              handleBudgetChange(currentMin, value);
            }}
            className="absolute w-full appearance-none bg-transparent pointer-events-none 
                [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
                [&::-webkit-slider-thumb]:w-[22px] [&::-webkit-slider-thumb]:h-[22px] 
                [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full 
                [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:ring-1 [&::-webkit-slider-thumb]:ring-black/5
                hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform
                z-20"
          />
        </div>
      </div>

      {/* Brand Filter */}
      {availableBrands.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="font-heading font-semibold text-sm text-text-muted tracking-widest uppercase">Brand</h3>
          <div className="flex flex-col gap-3 font-body text-sm text-text max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 lg:max-h-none lg:overflow-visible max-md:max-h-none max-md:overflow-visible">
            {availableBrands.map(make => (
              <label key={make} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={activeMakes.includes(make)}
                    onChange={() => toggleMake(make)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer accent-primary transition-colors"
                  />
                  <span className="group-hover:text-primary transition-colors font-medium">{make}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Fuel Type Filter */}
      {availableFuels.length > 0 && (
        <div className="flex flex-col gap-3">
          <label htmlFor="fuelType" className="font-heading font-semibold text-sm text-text-muted tracking-widest uppercase">Fuel Type</label>
          <div className="relative">
            <select
              id="fuelType"
              value={filters.fuelType || ''}
              onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
              className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all cursor-pointer font-body text-sm font-semibold shadow-sm hover:border-slate-300 hover:bg-white"
            >
              <option value="">All Fuel Types</option>
              {availableFuels.map(ft => (
                <option key={ft} value={ft}>{ft}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Body Type Filter */}
      {availableBodyTypes.length > 0 && (
        <div className="flex flex-col gap-3">
          <label htmlFor="bodyType" className="font-heading font-semibold text-sm text-text-muted tracking-widest uppercase">Body Type</label>
          <div className="relative">
            <select
              id="bodyType"
              value={filters.bodyType || ''}
              onChange={(e) => setFilters({ ...filters, bodyType: e.target.value })}
              className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all cursor-pointer font-body text-sm font-semibold shadow-sm hover:border-slate-300 hover:bg-white"
            >
              <option value="">All Body Types</option>
              {availableBodyTypes.map(bt => (
                <option key={bt} value={bt}>{bt}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      )}



      {/* Apply Button (Mobile Only) */}
      <div className="lg:hidden mt-auto pt-6 border-t border-gray-100 flex gap-3">
        <button 
          onClick={clearAll}
          className="flex-1 py-4 border border-gray-200 rounded-2xl font-heading font-bold text-text hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button 
          onClick={onClose}
          className="flex-2 py-4 bg-primary text-white rounded-2xl font-heading font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
        >
          Show Vehicles
        </button>
      </div>
    </aside>
  );
}
