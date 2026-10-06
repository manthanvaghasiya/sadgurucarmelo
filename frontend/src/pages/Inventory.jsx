import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SlidersHorizontal, X } from 'lucide-react';
import SidebarFilter from '../components/SidebarFilter';
import InventoryGrid from '../components/InventoryGrid';
import { useCars } from '../context/CarContext';

export default function Inventory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);

  const { cars } = useCars();

  // Include Available and Sold cars for showroom inventory options
  const activeStockCars = useMemo(() => {
    return cars.filter(c => c.status === 'Available' || c.status === 'Sold');
  }, [cars]);

  const availableBrands = useMemo(() => {
    return [...new Set(activeStockCars.map(c => c.make))].filter(Boolean).sort();
  }, [activeStockCars]);

  const availableFuels = useMemo(() => {
    return [...new Set(activeStockCars.map(c => c.fuelType))].filter(Boolean).sort();
  }, [activeStockCars]);

  const availableBodyTypes = useMemo(() => {
    return [...new Set(activeStockCars.map(c => c.bodyType))].filter(Boolean).sort();
  }, [activeStockCars]);

  const priceRangeBounds = useMemo(() => {
    if (!activeStockCars || activeStockCars.length === 0) return [0, 5000000];
    const prices = activeStockCars.map(c => Number(c.price)).filter(p => !isNaN(p));
    // Provide a default fallback if price maps fail
    if (prices.length === 0) return [0, 5000000];
    return [Math.min(...prices), Math.max(...prices)];
  }, [activeStockCars]);

  // Initialize filters from URL query params (from Home page search)
  const [filters, setFilters] = useState(() => {
    const initial = { makes: [], fuelType: '', bodyType: '', budget: null };
    const make = searchParams.get('make');
    const fuelType = searchParams.get('fuelType');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const bodyType = searchParams.get('bodyType');

    if (make) initial.makes = [make];
    if (fuelType) initial.fuelType = fuelType;
    if (bodyType) initial.bodyType = bodyType;

    // Handle budget from URL safely
    const parsedMin = priceMin ? Number(priceMin) : null;
    const parsedMax = priceMax ? Number(priceMax) : null;
    if (parsedMin !== null || parsedMax !== null) {
      initial.budget = [
        parsedMin !== null && !isNaN(parsedMin) ? parsedMin : 0,
        parsedMax !== null && !isNaN(parsedMax) ? parsedMax : 5000000
      ];
    }
    return initial;
  });

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (filters.makes && filters.makes.length > 0) {
      params.set('make', filters.makes.join(','));
    } else {
      params.delete('make');
    }

    if (filters.fuelType) {
      params.set('fuelType', filters.fuelType);
    } else {
      params.delete('fuelType');
    }

    if (filters.bodyType) {
      params.set('bodyType', filters.bodyType);
    } else {
      params.delete('bodyType');
    }

    if (filters.budget && filters.budget.length === 2 && (filters.budget[0] !== 0 || filters.budget[1] !== 5000000)) {
      params.set('priceMin', filters.budget[0].toString());
      params.set('priceMax', filters.budget[1].toString());
    } else {
      params.delete('priceMin');
      params.delete('priceMax');
    }

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  useEffect(() => {
    const handleScroll = () => {
      // The footer plus mobile nav space is roughly 800px tall. 
      const distFromBottom = document.documentElement.scrollHeight - (window.innerHeight + window.scrollY);
      setIsNearFooter(distFromBottom < 800);
    };

    // Check initially
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Count active filter parameters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.makes && filters.makes.length > 0) count += filters.makes.length;
    if (filters.fuelType) count += 1;
    if (filters.bodyType) count += 1;
    if (filters.budget && (filters.budget[0] > 0 || filters.budget[1] < 5000000)) count += 1;
    return count;
  }, [filters]);

  return (
    <div className="bg-background min-h-screen py-6 sm:py-8">
      <Helmet>
        <title>Buy Certified Pre-Owned Cars in Surat — Sadguru Car Surat Inventory</title>
        <meta name="description" content="Browse 150+ certified pre-owned cars at Sadguru Car Surat, Surat. Filter by brand, fuel type, budget, and more. Transparent pricing, non-accidental vehicles." />
        <meta property="og:title" content="Explore Verified Cars — Sadguru Car Surat" />
        <meta property="og:description" content="150+ certified pre-owned cars with transparent pricing in Surat." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumbs (Hidden on Mobile View) */}
        <nav className="hidden md:flex mb-3 sm:mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 font-body text-[12px] sm:text-[13px] font-medium text-text-muted">
            <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
            <li><span className="text-gray-300">/</span></li>
            <li><a href="/" className="hover:text-primary transition-colors">Surat</a></li>
            <li><span className="text-gray-300">/</span></li>
            <li aria-current="page" className="text-text font-bold">Used Cars</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-8">
          <div className="flex flex-col">
            <h1 className="font-heading font-medium text-2xl sm:text-[38px] text-primary leading-tight tracking-tight">
              Explore Verified Cars
            </h1>
          </div>
        </div>


        {/* ── FLOATING MOBILE FILTER PILL (Appears on scroll for 1-tap filtering) ── */}
        <div
          className={`lg:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 pointer-events-auto ${
            isNearFooter ? 'opacity-0 translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'
          }`}
        >
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 bg-slate-900/95 backdrop-blur-xl text-white px-5 py-2.5 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.35)] font-heading font-black text-xs border border-white/20 active:scale-95 transition-transform"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand-orange" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-brand-orange text-white text-[9px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar (Filters) - Desktop: Column, Mobile: Drawer */}
          <div className={`
            fixed inset-0 z-[10001] lg:sticky lg:top-[100px] lg:self-start lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:inset-auto lg:z-40 lg:w-1/4 lg:block
            transition-transform duration-300 ease-in-out scrollbar-none
            ${isFilterOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
          `}>
            {/* Mobile Overlay */}
            <div
              className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              onClick={() => setIsFilterOpen(false)}
            ></div>

            <div
              className={`
                absolute bottom-0 left-0 right-0 h-[88vh] lg:h-auto lg:relative lg:block bg-white rounded-t-[32px] lg:rounded-none overflow-hidden flex flex-col
                transition-transform duration-300 ${isFilterOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
              `}
              style={{
                paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))',
              }}
            >
              {/* Mobile Drawer Handle/Header */}
              <div className="lg:hidden flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
                <h2 className="font-heading font-bold text-xl text-primary">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-100 rounded-full text-text-muted">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
              </div>

              <div className="flex-grow overflow-y-auto lg:overflow-visible">
                <SidebarFilter
                  filters={filters}
                  setFilters={setFilters}
                  availableBrands={availableBrands}
                  availableFuels={availableFuels}
                  availableBodyTypes={availableBodyTypes}
                  priceRangeBounds={priceRangeBounds}
                  onClose={() => setIsFilterOpen(false)}
                />
              </div>
            </div>
          </div>

          {/* Right Area (Grid + Top Bar) - 3/4 Width Desktop */}
          <div className="w-full lg:w-3/4">
            <InventoryGrid filters={filters} />
          </div>

        </div>


      </div>
    </div>
  );
}
