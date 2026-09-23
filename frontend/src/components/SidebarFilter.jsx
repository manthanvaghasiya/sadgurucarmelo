import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RotateCcw, Check, Sparkles, ShieldCheck, CheckCircle2, Search } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function SidebarFilter({
  filters = {},
  setFilters,
  availableBrands = [],
  availableFuels = [],
  availableBodyTypes = [],
  priceRangeBounds = [0, 5000000],
  availableCars = [],
  onClose
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [brandSearch, setBrandSearch] = useState('');

  // Price Range Bounds snapping
  const exactMin = Number(priceRangeBounds[0]) || 0;
  const exactMax = Number(priceRangeBounds[1]) || 5000000;
  const minBound = Math.floor(exactMin / 25000) * 25000;
  const maxBound = Math.ceil(exactMax / 50000) * 50000 || 5000000;

  const currentMin = filters.budget ? filters.budget[0] : minBound;
  const currentMax = filters.budget ? filters.budget[1] : maxBound;

  const handleBudgetChange = useCallback((newMin, newMax) => {
    setFilters(prev => ({
      ...prev,
      budget: [newMin, newMax]
    }));
  }, [setFilters]);

  // Format currency in Indian Lakhs / K format for clean Ampère look
  const formatPriceShort = (val) => {
    if (!val || val === 0) return '₹0';
    if (val >= 100000) {
      const lakhs = val / 100000;
      return `₹${lakhs % 1 === 0 ? lakhs : lakhs.toFixed(2)} Lakh`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const getPercent = (value) => {
    if (maxBound === minBound) return 0;
    return Math.max(0, Math.min(100, Math.round(((value - minBound) / (maxBound - minBound)) * 100)));
  };

  const currentMinPercent = getPercent(currentMin);
  const currentMaxPercent = getPercent(currentMax);

  // Price Distribution Histogram computation (14 bins)
  const histogramBins = useMemo(() => {
    const binsCount = 14;
    const step = (maxBound - minBound) / binsCount || 100000;
    const bins = Array.from({ length: binsCount }, (_, i) => ({
      start: minBound + i * step,
      end: minBound + (i + 1) * step,
      count: 0
    }));

    (availableCars || []).forEach(car => {
      const p = Number(car.price);
      if (isNaN(p)) return;
      const idx = Math.min(binsCount - 1, Math.max(0, Math.floor((p - minBound) / step)));
      if (bins[idx]) bins[idx].count += 1;
    });

    const maxCount = Math.max(1, ...bins.map(b => b.count));
    return bins.map(b => ({
      ...b,
      heightPercent: Math.max(16, Math.round((b.count / maxCount) * 100)),
      isActive: b.end >= currentMin && b.start <= currentMax
    }));
  }, [availableCars, minBound, maxBound, currentMin, currentMax]);

  // Count vehicles per brand
  const brandCounts = useMemo(() => {
    const counts = {};
    (availableCars || []).forEach(car => {
      if (car.make) {
        counts[car.make] = (counts[car.make] || 0) + 1;
      }
    });
    return counts;
  }, [availableCars]);

  // Count vehicles per body type
  const bodyCounts = useMemo(() => {
    const counts = {};
    (availableCars || []).forEach(car => {
      if (car.bodyType) {
        counts[car.bodyType] = (counts[car.bodyType] || 0) + 1;
      }
    });
    return counts;
  }, [availableCars]);

  const toggleMake = (make) => {
    const current = filters.makes || [];
    if (current.includes(make)) {
      setFilters(prev => ({ ...prev, makes: current.filter(m => m !== make) }));
    } else {
      setFilters(prev => ({ ...prev, makes: [...current, make] }));
    }
  };

  const setFuelType = (ft) => {
    setFilters(prev => ({ ...prev, fuelType: prev.fuelType === ft ? '' : ft }));
  };

  const setBodyType = (bt) => {
    setFilters(prev => ({ ...prev, bodyType: prev.bodyType === bt ? '' : bt }));
  };

  const toggleToggleFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const clearAll = () => {
    setFilters({
      makes: [],
      fuelType: '',
      bodyType: '',
      budget: null,
      priceMin: '',
      priceMax: '',
      genuineKmOnly: false,
      loanOnly: false,
      inspectedOnly: false
    });
    if (searchParams.toString()) {
      setSearchParams({});
    }
  };

  const activeMakes = filters.makes || [];
  const hasActiveFilters = Boolean(
    activeMakes.length > 0 ||
    filters.fuelType ||
    filters.bodyType ||
    filters.budget ||
    filters.genuineKmOnly ||
    filters.loanOnly ||
    filters.inspectedOnly
  );

  return (
    <aside className="w-full lg:sticky lg:top-24 h-full lg:h-fit lg:max-h-[calc(100vh-6.5rem)] overflow-y-auto bg-white p-5 sm:p-6 lg:rounded-3xl lg:shadow-[0_4px_24px_rgba(0,0,0,0.05)] lg:border lg:border-slate-200/90 flex flex-col gap-6 select-none">

      {/* ── Sidebar Header ── */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <h2 className="font-heading font-extrabold text-xl text-slate-900 tracking-tight">
          Filter
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-brand-orange transition-colors px-2.5 py-1 rounded-lg hover:bg-orange-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* ── 1. Body Type Quick Pills ── */}
      {availableBodyTypes.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400">
              Body Type
            </h3>
            {filters.bodyType && (
              <button
                onClick={() => setBodyType('')}
                className="text-[11px] font-semibold text-brand-orange hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setBodyType('')}
              className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
                !filters.bodyType
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              All
            </button>
            {availableBodyTypes.map(bt => {
              const count = bodyCounts[bt];
              const isSelected = filters.bodyType === bt;
              return (
                <button
                  key={bt}
                  type="button"
                  onClick={() => setBodyType(bt)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
                    isSelected
                      ? 'bg-brand-orange text-white shadow-sm shadow-orange-500/25 ring-2 ring-brand-orange/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  <span>{bt}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-500'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 2. Price Distribution Histogram & Dual Slider ── */}
      <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400">
            Price Range
          </h3>
          <span className="text-[11px] font-medium text-slate-400">
            Surat Verified Stock
          </span>
        </div>

        {/* Histogram Bars */}
        <div className="h-14 flex items-end justify-between gap-1 pt-2 px-1">
          {histogramBins.map((bin, idx) => (
            <div
              key={idx}
              className="flex-1 flex flex-col justify-end items-center h-full group/bar relative"
            >
              {/* Tooltip on bar hover */}
              <div className="absolute -top-7 hidden group-hover/bar:flex bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap z-30 pointer-events-none">
                {bin.count} cars
              </div>
              <div
                style={{ height: `${bin.heightPercent}%` }}
                className={`w-full rounded-t transition-all duration-200 ${
                  bin.isActive
                    ? 'bg-brand-orange opacity-90 group-hover/bar:opacity-100'
                    : 'bg-slate-200 opacity-60'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Dual Thumb Slider */}
        <div className="relative w-full h-6 flex items-center group">
          {/* Base Track */}
          <div className="absolute w-full h-1.5 bg-slate-200 rounded-full" />

          {/* Active Highlight Track */}
          <div
            className="absolute h-1.5 bg-brand-orange rounded-full transition-all duration-75"
            style={{
              left: `${currentMinPercent}%`,
              width: `${Math.max(0, currentMaxPercent - currentMinPercent)}%`
            }}
          />

          {/* Min Input Slider */}
          <input
            type="range"
            min={minBound}
            max={maxBound}
            value={currentMin}
            step={25000}
            onChange={(e) => {
              const value = Math.min(Number(e.target.value), currentMax - 25000);
              handleBudgetChange(value, currentMax);
            }}
            className="absolute w-full appearance-none bg-transparent pointer-events-none 
              [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:w-[20px] [&::-webkit-slider-thumb]:h-[20px] 
              [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-orange
              [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:scale-110 
              [&::-webkit-slider-thumb]:transition-transform z-20 cursor-grab active:cursor-grabbing"
          />

          {/* Max Input Slider */}
          <input
            type="range"
            min={minBound}
            max={maxBound}
            value={currentMax}
            step={25000}
            onChange={(e) => {
              const value = Math.max(Number(e.target.value), currentMin + 25000);
              handleBudgetChange(currentMin, value);
            }}
            className="absolute w-full appearance-none bg-transparent pointer-events-none 
              [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:w-[20px] [&::-webkit-slider-thumb]:h-[20px] 
              [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-orange
              [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:scale-110 
              [&::-webkit-slider-thumb]:transition-transform z-20 cursor-grab active:cursor-grabbing"
          />
        </div>

        {/* FROM - TO Display Boxes */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Min Price
            </span>
            <span className="font-heading font-extrabold text-sm text-slate-900">
              {formatPriceShort(currentMin)}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Max Price
            </span>
            <span className="font-heading font-extrabold text-sm text-slate-900">
              {formatPriceShort(currentMax)}
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. Brand Filter with Authentic Vector Logos & Counts ── */}
      {availableBrands.length > 0 && (
        <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400">
              Brand / Make
            </h3>
            {activeMakes.length > 0 && (
              <span className="text-[11px] font-bold text-brand-orange">
                {activeMakes.length} selected
              </span>
            )}
          </div>

          {/* Quick Search if more than 5 brands */}
          {availableBrands.length > 5 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Search brand..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/80 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-orange focus:bg-white transition-all shadow-2xs"
              />
            </div>
          )}

          <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
            {availableBrands
              .filter(make => !brandSearch.trim() || (make || '').toLowerCase().includes(brandSearch.toLowerCase().trim()))
              .map(make => {
                const isChecked = activeMakes.includes(make);
                const count = brandCounts[make] || 0;
                return (
                  <button
                    key={make}
                    type="button"
                    onClick={() => toggleMake(make)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left group ${
                      isChecked
                        ? 'bg-orange-50 border border-brand-orange/40 text-slate-900 font-bold'
                        : 'hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Custom Checkbox */}
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center transition-colors border ${
                          isChecked
                            ? 'bg-brand-orange border-brand-orange text-white'
                            : 'border-slate-300 bg-white group-hover:border-slate-400'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      {/* Official Automotive Vector Logo */}
                      <BrandLogo make={make} variant="inline" className="w-5 h-5 text-slate-800 shrink-0" />

                      {/* Brand Name */}
                      <span className="text-sm truncate font-heading uppercase tracking-wide">{make}</span>
                    </div>

                    {/* Vehicle Count Badge */}
                    {count > 0 && (
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                        isChecked
                          ? 'bg-brand-orange/15 text-brand-orange'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* ── 4. Fuel Type Filter (Segmented Pills) ── */}
      {availableFuels.length > 0 && (
        <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400">
              Fuel Type
            </h3>
            {filters.fuelType && (
              <button
                onClick={() => setFuelType('')}
                className="text-[11px] font-semibold text-brand-orange hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFuelType('')}
              className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
                !filters.fuelType
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              All
            </button>
            {availableFuels.map(ft => {
              const isSelected = filters.fuelType === ft;
              return (
                <button
                  key={ft}
                  type="button"
                  onClick={() => setFuelType(ft)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
                    isSelected
                      ? 'bg-brand-orange text-white shadow-sm shadow-orange-500/25 ring-2 ring-brand-orange/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  {ft}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 5. Trust & Quality Toggles (iOS-style switch) ── */}
      <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
        <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400">
          Trust & Financing
        </h3>

        {/* Genuine KM Only */}
        <label className="flex items-center justify-between cursor-pointer group py-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">
              100% Genuine KM
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={Boolean(filters.genuineKmOnly)}
            onClick={() => toggleToggleFilter('genuineKmOnly')}
            className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
              filters.genuineKmOnly ? 'bg-emerald-500' : 'bg-slate-200'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                filters.genuineKmOnly ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </label>

        {/* Loan Available Only */}
        <label className="flex items-center justify-between cursor-pointer group py-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">
              Loan / EMI Support
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={Boolean(filters.loanOnly)}
            onClick={() => toggleToggleFilter('loanOnly')}
            className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
              filters.loanOnly ? 'bg-blue-600' : 'bg-slate-200'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                filters.loanOnly ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </label>

        {/* 120-Point Inspected */}
        <label className="flex items-center justify-between cursor-pointer group py-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">
              120+ Point Inspected
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={Boolean(filters.inspectedOnly)}
            onClick={() => toggleToggleFilter('inspectedOnly')}
            className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
              filters.inspectedOnly ? 'bg-amber-500' : 'bg-slate-200'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                filters.inspectedOnly ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </label>
      </div>

      {/* ── Mobile Apply / Reset Buttons ── */}
      <div className="lg:hidden mt-auto pt-4 border-t border-slate-100 flex gap-2.5">
        <button 
          onClick={clearAll}
          className="flex-1 py-3 border border-slate-200 rounded-2xl font-heading font-bold text-sm text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Reset
        </button>
        <button 
          onClick={onClose}
          className="flex-2 py-3 bg-slate-900 text-white rounded-2xl font-heading font-bold text-sm shadow-lg shadow-black/10 hover:bg-slate-800 transition-all active:scale-95"
        >
          Show Vehicles
        </button>
      </div>

    </aside>
  );
}

