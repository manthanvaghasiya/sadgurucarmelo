import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SidebarFilter from '../components/SidebarFilter';
import InventoryGrid from '../components/InventoryGrid';
import { useCars } from '../context/CarContext';
import PromoBanner from '../components/PromoBanner';

export default function Inventory() {
  const [searchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);

  const { cars } = useCars();

  const availableBrands = useMemo(() => {
    return [...new Set(cars.map(c => c.make))].filter(Boolean).sort();
  }, [cars]);

  const availableFuels = useMemo(() => {
    return [...new Set(cars.map(c => c.fuelType))].filter(Boolean).sort();
  }, [cars]);

  const availableBodyTypes = useMemo(() => {
    return [...new Set(cars.map(c => c.bodyType))].filter(Boolean).sort();
  }, [cars]);

  const priceRangeBounds = useMemo(() => {
    if (!cars || cars.length === 0) return [0, 5000000];
    const prices = cars.map(c => Number(c.price)).filter(p => !isNaN(p));
    // Provide a default fallback if price maps fail
    if (prices.length === 0) return [0, 5000000];
    return [Math.min(...prices), Math.max(...prices)];
  }, [cars]);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Mobile Filter Button - Fixed at top */}
        <div className={`lg:hidden fixed top-[84px] left-0 right-0 z-[1000] px-4 pointer-events-none transition-all duration-300 ${isNearFooter ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <button
            onClick={() => setIsFilterOpen(true)}
            className={`w-full flex items-center justify-center gap-2 bg-white/95 backdrop-blur-md text-primary border border-gray-100 py-3.5 rounded-2xl font-heading font-bold shadow-xl shadow-black/5 active:scale-[0.98] transition-all ${isNearFooter ? 'pointer-events-none' : 'pointer-events-auto'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sliders-horizontal"><path d="m21 4h-7" /><path d="m14 4-3 3-3-3" /><path d="m21 12H11" /><path d="m11 12-3 3-3-3" /><path d="m21 20H7" /><path d="m7 20-3 3-3-3" /><path d="m11 4H3" /><path d="m7 12H3" /><path d="m3 20h0" /></svg>
            Advanced Filters
          </button>
        </div>

        {/* Breadcrumbs */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 font-body text-[13px] font-medium text-text-muted">
            <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
            <li><span className="text-gray-300">/</span></li>
            <li><a href="/" className="hover:text-primary transition-colors">Surat</a></li>
            <li><span className="text-gray-300">/</span></li>
            <li aria-current="page" className="text-text">Used Cars</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 sm:mb-10 lg:pt-0 pt-16">
          <div className="flex flex-col">
            <h1 className="font-heading font-extrabold text-[36px] sm:text-[42px] text-primary leading-tight tracking-tight">
              Explore Verified Cars
            </h1>
            <div className="flex items-center gap-3 mt-2 lg:hidden">
              <div className="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider leading-none">Live Inventory</span>
              </div>
              <span className="text-text-muted text-[13px] font-medium flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/60"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                Available stock in Surat
              </span>
            </div>
          </div>
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

            <div className={`
              absolute bottom-0 left-0 right-0 h-[85vh] lg:h-auto lg:relative lg:block bg-white rounded-t-[32px] lg:rounded-none overflow-hidden flex flex-col
              transition-transform duration-300 ${isFilterOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
            `}>
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

        {/* Promotional Banner (Hidden on mobile since it's injected inside grid) */}
        <div className="max-md:hidden">
          <PromoBanner />
        </div>

      </div>
    </div>
  );
}
