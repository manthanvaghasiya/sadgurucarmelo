import { useState, useEffect } from 'react';
import { CarFront, Truck, X } from 'lucide-react';
import axiosInstance from '../api/axiosConfig';

export default function SidebarFilter({ filters, setFilters }) {
  const [filterOptions, setFilterOptions] = useState({
    makes: [],
    bodyTypes: [],
    fuelTypes: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'],
    years: [],
  });

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await axiosInstance.get('/cars/filters');
        if (res.data.success) {
          setFilterOptions(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch filter options:', err);
      }
    };
    fetchFilters();
  }, []);

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

  const clearAll = () => {
    setFilters({ makes: [], fuelType: '', bodyType: '', priceMin: '', priceMax: '' });
  };

  const activeMakes = filters.makes || [];

  return (
    <aside className="w-full bg-surface rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h2 className="font-heading font-bold text-lg text-text">Advanced Filters</h2>
        <button onClick={clearAll} className="text-primary font-body text-sm font-semibold hover:underline">Clear All</button>
      </div>

      {/* Budget Filter */}
      <div className="flex flex-col gap-4">
        <h3 className="font-heading font-semibold text-sm text-text-muted tracking-widest uppercase">Budget</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Under ₹5L', min: '', max: '500000' },
            { label: '₹5L-₹10L', min: '500000', max: '1000000' },
            { label: '₹10L-₹20L', min: '1000000', max: '2000000' },
            { label: '₹20L+', min: '2000000', max: '' },
          ].map(range => {
            const isActive = filters.priceMin === range.min && filters.priceMax === range.max;
            return (
              <button
                key={range.label}
                onClick={() => {
                  if (isActive) {
                    setFilters({ ...filters, priceMin: '', priceMax: '' });
                  } else {
                    setFilters({ ...filters, priceMin: range.min, priceMax: range.max });
                  }
                }}
                className={`py-2.5 rounded-xl border font-body text-xs font-medium transition-colors ${
                  isActive
                    ? 'border-primary bg-primary/5 text-primary font-bold'
                    : 'border-gray-200 bg-surface text-text hover:border-primary hover:text-primary'
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="flex flex-col gap-4">
        <h3 className="font-heading font-semibold text-sm text-text-muted tracking-widest uppercase">Brand</h3>
        <div className="flex flex-col gap-3 font-body text-sm text-text max-h-48 overflow-y-auto">
          {filterOptions.makes.map(make => (
            <label key={make} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={activeMakes.includes(make)}
                  onChange={() => toggleMake(make)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer accent-primary"
                />
                <span className="group-hover:text-primary transition-colors font-medium">{make}</span>
              </div>
            </label>
          ))}
          {filterOptions.makes.length === 0 && (
            <p className="text-text-muted text-xs">Loading brands...</p>
          )}
        </div>
      </div>

      {/* Fuel Type Filter */}
      <div className="flex flex-col gap-4">
        <h3 className="font-heading font-semibold text-sm text-text-muted tracking-widest uppercase">Fuel Type</h3>
        <div className="grid grid-cols-2 gap-2">
          {filterOptions.fuelTypes.map(ft => {
            const isActive = filters.fuelType === ft;
            return (
              <button
                key={ft}
                onClick={() => setFuelType(ft)}
                className={`py-2.5 rounded-xl border font-body text-xs font-medium transition-colors ${
                  isActive
                    ? 'border-primary bg-primary/5 text-primary font-bold'
                    : 'border-gray-200 bg-surface text-text hover:border-primary hover:text-primary'
                }`}
              >
                {ft}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body Type Filter */}
      <div className="flex flex-col gap-4">
        <h3 className="font-heading font-semibold text-sm text-text-muted tracking-widest uppercase">Body Type</h3>
        <div className="flex flex-col gap-2">
          {filterOptions.bodyTypes.map(bt => {
            const isActive = filters.bodyType === bt;
            return (
              <button
                key={bt}
                onClick={() => setBodyType(bt)}
                className={`flex items-center gap-3 w-full p-3 rounded-xl border text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-primary/20 bg-primary/5 text-primary font-body font-bold'
                    : 'border-transparent hover:bg-gray-50 text-text font-body'
                }`}
              >
                {bt === 'SUV' ? (
                  <Truck className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-text-muted'}`} strokeWidth={isActive ? 2 : 1.5} />
                ) : (
                  <CarFront className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-text-muted'}`} strokeWidth={isActive ? 2 : 1.5} />
                )}
                {bt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(activeMakes.length > 0 || filters.fuelType || filters.bodyType || filters.priceMin || filters.priceMax) && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
          {activeMakes.map(m => (
            <span key={m} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full font-body text-xs font-bold">
              {m}
              <button onClick={() => toggleMake(m)}><X className="w-3 h-3" /></button>
            </span>
          ))}
          {filters.fuelType && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full font-body text-xs font-bold">
              {filters.fuelType}
              <button onClick={() => setFilters({ ...filters, fuelType: '' })}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.bodyType && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full font-body text-xs font-bold">
              {filters.bodyType}
              <button onClick={() => setFilters({ ...filters, bodyType: '' })}><X className="w-3 h-3" /></button>
            </span>
          )}
        </div>
      )}
    </aside>
  );
}
