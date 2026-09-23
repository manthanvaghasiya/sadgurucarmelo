import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SidebarFilter from '../components/SidebarFilter';
import InventoryGrid from '../components/InventoryGrid';
import { useCars } from '../context/CarContext';

export default function Inventory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);

  const { cars } = useCars();

  // Only use 'Available' cars for filter options — exclude 'Coming Soon', 'Sold', etc.
  const availableCars = useMemo(() => {
    return cars.filter(c => c.status === 'Available');
  }, [cars]);

  const availableBrands = useMemo(() => {
    return [...new Set(availableCars.map(c => c.make))].filter(Boolean).sort();
  }, [availableCars]);

  const availableFuels = useMemo(() => {
    return [...new Set(availableCars.map(c => c.fuelType))].filter(Boolean).sort();
  }, [availableCars]);

  const availableBodyTypes = useMemo(() => {
    return [...new Set(availableCars.map(c => c.bodyType))].filter(Boolean).sort();
  }, [availableCars]);

  const priceRangeBounds = useMemo(() => {
    if (!availableCars || availableCars.length === 0) return [0, 5000000];
    const prices = availableCars.map(c => Number(c.price)).filter(p => !isNaN(p));
    // Provide a default fallback if price maps fail
    if (prices.length === 0) return [0, 5000000];
    return [Math.min(...prices), Math.max(...prices)];
  }, [availableCars]);

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

  return (
    <div className="bg-background min-h-screen py-8">
      <Helmet>
        <title>Buy Certified Pre-Owned Cars in Surat — Sadguru Car Surat Inventory</title>
        <meta name="description" content="Browse 150+ certified pre-owned cars at Sadguru Car Surat, Surat. Filter by brand, fuel type, budget, and more. Transparent pricing, non-accidental vehicles." />
        <meta property="og:title" content="Explore Verified Cars — Sadguru Car Surat" />
        <meta property="og:description" content="150+ certified pre-owned cars with transparent pricing in Surat." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Mobile Filter Button - Fixed at top */}
        <div className={`lg:hidden fixed top-[64px] left-0 right-0 z-[1000] px-4 pointer-events-none transition-all duration-300 ${isNearFooter ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <button
            onClick={() => setIsFilterOpen(true)}
            className={`w-full flex items-center justify-center gap-2 bg-white/95 backdrop-blur-md text-primary border border-gray-100 py-3.5 rounded-2xl font-heading font-bold shadow-xl shadow-black/5 active:scale-[0.98] transition-all ${isNearFooter ? 'pointer-events-none' : 'pointer-events-auto'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sliders-horizontal"><path d="m21 4h-7" /><path d="m14 4-3 3-3-3" /><path d="m21 12H11" /><path d="m11 12-3 3-3-3" /><path d="m21 20H7" /><path d="m7 20-3 3-3-3" /><path d="m11 4H3" /><path d="m7 12H3" /><path d="m3 20h0" /></svg>
            Advanced Filters
          </button>
        </div>

        {/* Breadcrumbs */}
        <nav className="flex mb-3" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 font-body text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <li><a href="/" className="hover:text-slate-800 transition-colors">Home</a></li>
            <li><span className="text-slate-300">/</span></li>
            <li><a href="/inventory" className="hover:text-slate-800 transition-colors">Surat</a></li>
            <li><span className="text-slate-300">/</span></li>
            <li aria-current="page" className="text-brand-orange">Verified Showroom</li>
          </ol>
        </nav>

        {/* Ampère Page Headline */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-slate-200/70">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-heading font-black tracking-widest uppercase bg-orange-50 text-brand-orange border border-orange-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
                Live Stock • Surat
              </span>
              <span className="text-xs font-semibold text-slate-400">
                120+ Points Inspected
              </span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
              {availableCars.length}+ Cars, Inspected & Ready
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              🛡️ Non-Accidental Guarantee
            </span>
            <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              ⚡ Instant Loan in 2h
            </span>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Sidebar (Filters) - Desktop: Column, Mobile: Drawer */}
          <div className={`
            fixed inset-0 z-[10001] lg:sticky lg:top-[90px] lg:self-start lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto lg:inset-auto lg:z-30 lg:w-[280px] xl:w-[310px] shrink-0 lg:block
            transition-transform duration-300 ease-in-out scrollbar-none
            ${isFilterOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
          `}>
            {/* Mobile Overlay */}
            <div
              className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              onClick={() => setIsFilterOpen(false)}
            ></div>

            <div className={`
              absolute bottom-0 left-0 right-0 h-[85vh] lg:h-auto lg:relative lg:block bg-white rounded-t-[32px] lg:rounded-none overflow-hidden flex flex-col
              transition-transform duration-300 ${isFilterOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
            `}>
              {/* Mobile Drawer Handle/Header */}
              <div className="lg:hidden flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
                <h2 className="font-heading font-bold text-lg text-slate-900">Vehicle Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-100 rounded-full text-slate-500 hover:bg-gray-200">
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
                  availableCars={availableCars}
                  onClose={() => setIsFilterOpen(false)}
                />
              </div>
            </div>
          </div>

          {/* Right Area (Grid + Top Bar) - Flex 1 */}
          <div className="w-full flex-1 min-w-0">
            <InventoryGrid filters={filters} setFilters={setFilters} totalCarsCount={availableCars.length} />
          </div>

        </div>


      </div>
    </div>
  );
}
