import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import SidebarFilter from '../components/SidebarFilter';
import InventoryGrid from '../components/InventoryGrid';
import { useCars } from '../context/CarContext';
import PromoBanner from '../components/PromoBanner';

export default function Inventory() {
  const [searchParams] = useSearchParams();

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

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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
        <h1 className="font-heading font-extrabold text-[36px] sm:text-[42px] text-primary leading-tight mb-10 tracking-tight">
          Explore Verified Pre-Owned Cars
        </h1>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar (Filters) - 1/4 Width Desktop */}
          <div className="w-full lg:w-1/4 shrink-0">
            <SidebarFilter
              filters={filters}
              setFilters={setFilters}
              availableBrands={availableBrands}
              availableFuels={availableFuels}
              availableBodyTypes={availableBodyTypes}
              priceRangeBounds={priceRangeBounds}
            />
          </div>

          {/* Right Area (Grid + Top Bar) - 3/4 Width Desktop */}
          <div className="w-full lg:w-3/4">
            <InventoryGrid filters={filters} />
          </div>

        </div>

        {/* Promotional Banner */}
        <PromoBanner />

      </div>
    </div>
  );
}
