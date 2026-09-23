import { useState, useEffect, useMemo, Fragment } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, X, SlidersHorizontal, ArrowUpDown, RotateCcw } from 'lucide-react';
import CarCard from './CarCard';
import { useCars } from '../context/CarContext';
import SkeletonCarCard from './SkeletonCarCard';

// ── Format helpers ──
function formatPrice(num) {
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lakh`;
  return `₹${num.toLocaleString('en-IN')}`;
}

function formatKm(num) {
  return `${num.toLocaleString('en-IN')} KM`;
}

function formatLakhShort(num) {
  if (!num) return '₹0';
  if (num >= 100000) {
    const l = num / 100000;
    return `₹${l % 1 === 0 ? l : l.toFixed(1)}L`;
  }
  return `₹${(num / 1000).toFixed(0)}k`;
}

export default function InventoryGrid({ filters = {}, setFilters = () => {}, totalCarsCount = 0 }) {
  const { cars: allCars, isLoading: isContextLoading, error: contextError } = useCars();
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentModelParam = searchParams.get('model');
  const [searchTerm, setSearchTerm] = useState('');

  // Reset to page 1 when filters or sort change
  useEffect(() => {
    setPage(1);
  }, [sortBy, filters, searchTerm]);

  // Client-side filtering
  const filteredCars = useMemo(() => {
    return (allCars || []).filter(c => {
      if (c.status !== 'Available') return false;
      
      if (filters.fuelType && c.fuelType !== filters.fuelType) return false;
      if (filters.bodyType && c.bodyType !== filters.bodyType) return false;
      
      if (filters.budget && filters.budget.length === 2) {
        if (c.price < filters.budget[0] || c.price > filters.budget[1]) return false;
      } else {
        if (filters.priceMin && c.price < filters.priceMin) return false;
        if (filters.priceMax && c.price > filters.priceMax) return false;
      }
      
      if (filters.makes && filters.makes.length > 0) {
        if (!filters.makes.includes(c.make)) return false;
      }
      
      if (currentModelParam && c.model !== currentModelParam) return false;

      // Quality & Trust toggles
      if (filters.genuineKmOnly && !c.isKmGenuine) return false;
      if (filters.loanOnly && c.loanAvailable === false) return false;
      
      return true;
    });
  }, [allCars, filters, currentModelParam]);

  // Client-side sorting
  const sortedCars = useMemo(() => {
    return [...filteredCars].sort((a, b) => {
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'km-low') return (a.kms || 0) - (b.kms || 0);
      if (sortBy === 'year-new') return (b.year || 0) - (a.year || 0);
      // newest (default)
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [filteredCars, sortBy]);

  // Search filter
  const displayedCars = useMemo(() => {
    if (!searchTerm.trim()) return sortedCars;
    const q = searchTerm.toLowerCase().trim();
    return sortedCars.filter((car) => {
      const corpus = `${car.make || ''} ${car.model || ''} ${car.variant || ''} ${car.year || ''} ${car.color || ''} ${car.owner || ''} ${car.fuelType || ''} ${car.transmission || ''} ${car.title || ''} ${car.price || ''}`.toLowerCase();
      return corpus.includes(q);
    });
  }, [sortedCars, searchTerm]);

  const displayCount = displayedCars.length;
  const itemsPerPage = 12;
  const totalPages = Math.ceil(displayCount / itemsPerPage) || 1;
  const paginatedCars = displayedCars.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Active filter removal helpers
  const removeMake = (makeToRemove) => {
    setFilters(prev => ({
      ...prev,
      makes: (prev.makes || []).filter(m => m !== makeToRemove)
    }));
  };

  const removeBodyType = () => {
    setFilters(prev => ({ ...prev, bodyType: '' }));
  };

  const removeFuelType = () => {
    setFilters(prev => ({ ...prev, fuelType: '' }));
  };

  const removeBudget = () => {
    setFilters(prev => ({ ...prev, budget: null, priceMin: '', priceMax: '' }));
  };

  const removeToggle = (key) => {
    setFilters(prev => ({ ...prev, [key]: false }));
  };

  const clearAllFilters = () => {
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
    setSearchTerm('');
    if (searchParams.toString()) {
      setSearchParams({});
    }
  };

  // Determine which filter chips are active
  const hasActiveFilters = Boolean(
    (filters.makes && filters.makes.length > 0) ||
    filters.bodyType ||
    filters.fuelType ||
    filters.budget ||
    filters.genuineKmOnly ||
    filters.loanOnly ||
    filters.inspectedOnly ||
    searchTerm.trim()
  );

  return (
    <div className="flex flex-col gap-5 sm:gap-6">

      {/* ── Top Controls Bar: Search, Result Count, Sort ── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-3 sm:p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
        
        {/* Universal Search Input */}
        <div className="relative flex-1 max-w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search make, model, variant, or color... (e.g. Creta, Swift)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-800 placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-brand-orange focus:bg-white transition-all shadow-2xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Results Counter & Sort Selector */}
        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
          <span className="text-xs sm:text-sm font-medium text-slate-500">
            Showing <strong className="text-slate-900 font-bold">{displayCount}</strong> vehicles
          </span>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-800 text-xs font-bold py-2.5 pl-3.5 pr-8 rounded-xl cursor-pointer focus:outline-none focus:border-brand-orange transition-colors"
            >
              <option value="newest">Sort by: Newly Listed</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="km-low">Kilometers: Low to High</option>
              <option value="year-new">Model Year: Newest First</option>
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Active Filter Dismissible Chips Bar ── */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Active:
          </span>

          {/* Makes */}
          {(filters.makes || []).map(make => (
            <button
              key={make}
              onClick={() => removeMake(make)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-2xs"
            >
              <span>{make}</span>
              <X className="w-3 h-3 stroke-[2.5]" />
            </button>
          ))}

          {/* Body Type */}
          {filters.bodyType && (
            <button
              onClick={removeBodyType}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-orange text-white hover:bg-brand-orange/90 transition-all shadow-2xs"
            >
              <span>Body: {filters.bodyType}</span>
              <X className="w-3 h-3 stroke-[2.5]" />
            </button>
          )}

          {/* Fuel Type */}
          {filters.fuelType && (
            <button
              onClick={removeFuelType}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-2xs"
            >
              <span>Fuel: {filters.fuelType}</span>
              <X className="w-3 h-3 stroke-[2.5]" />
            </button>
          )}

          {/* Budget */}
          {filters.budget && (
            <button
              onClick={removeBudget}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-all border border-slate-200"
            >
              <span>{formatLakhShort(filters.budget[0])} - {formatLakhShort(filters.budget[1])}</span>
              <X className="w-3 h-3 stroke-[2.5]" />
            </button>
          )}

          {/* Genuine KM */}
          {filters.genuineKmOnly && (
            <button
              onClick={() => removeToggle('genuineKmOnly')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-2xs"
            >
              <span>Genuine KM</span>
              <X className="w-3 h-3 stroke-[2.5]" />
            </button>
          )}

          {/* Loan Support */}
          {filters.loanOnly && (
            <button
              onClick={() => removeToggle('loanOnly')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-2xs"
            >
              <span>Loan Support</span>
              <X className="w-3 h-3 stroke-[2.5]" />
            </button>
          )}

          {/* Search Term */}
          {searchTerm.trim() && (
            <button
              onClick={() => setSearchTerm('')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800 hover:bg-slate-300 transition-all"
            >
              <span>&ldquo;{searchTerm}&rdquo;</span>
              <X className="w-3 h-3 stroke-[2.5]" />
            </button>
          )}

          {/* Reset All */}
          <button
            onClick={clearAllFilters}
            className="text-xs font-bold text-brand-orange hover:underline ml-2 inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Clear all
          </button>
        </div>
      )}

      {/* ── Vehicle Inventory Grid ── */}
      {isContextLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCarCard key={index} />
          ))}
        </div>
      ) : contextError ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-red-100 p-8">
          <p className="font-heading font-bold text-lg text-red-500">Error loading inventory</p>
          <p className="font-body text-sm text-slate-400 mt-1">{contextError}</p>
        </div>
      ) : paginatedCars.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200/80 text-brand-orange flex items-center justify-center mb-4">
            <SlidersHorizontal className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">
            No matching cars found
          </h3>
          <p className="font-body text-sm text-slate-500 max-w-md mx-auto mb-6">
            We couldn&apos;t find any verified vehicles matching your current combination of filters. Try broadening your price or clearing selected brands.
          </p>
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-heading font-bold text-xs hover:bg-slate-800 transition-all shadow-md active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {paginatedCars.map((car) => (
            <Fragment key={car._id || car.id}>
              <CarCard
                id={car._id || car.id}
                image={car.image}
                title={`${car.make} ${car.model} (${car.year})`}
                price={formatPrice(car.price)}
                rawPrice={car.price}
                fuel={car.fuelType}
                transmission={car.transmission}
                owner={car.owner || '1st Owner'}
                kms={formatKm(car.kms)}
                isKmGenuine={car.isKmGenuine}
                make={car.make}
                model={car.model}
                year={car.year}
                location="Surat, Gujarat"
                comingSoon={car.status === 'Coming Soon'}
                badges={car.badges || []}
                car={car}
              />
            </Fragment>
          ))}
        </div>
      )}

      {/* ── Modern Pagination Controls ── */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-200/80 gap-4">
          <p className="font-body text-xs sm:text-sm text-slate-500">
            Showing <span className="font-bold text-slate-800">{(page - 1) * itemsPerPage + 1}</span>–<span className="font-bold text-slate-800">{Math.min(displayCount, page * itemsPerPage)}</span> of{' '}
            <span className="font-bold text-slate-800">{displayCount}</span> vehicles
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 font-heading text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 rounded-xl font-heading text-xs font-bold flex items-center justify-center transition-all ${
                    pageNum === page
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 font-heading text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

