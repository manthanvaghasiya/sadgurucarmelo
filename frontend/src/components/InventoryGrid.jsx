import { useState, useEffect, Fragment } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import CarCard from './CarCard';
import ComingSoonCarousel from './ComingSoonCarousel';
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

export default function InventoryGrid({ filters = {} }) {
  const { cars: allCars, isLoading: isContextLoading, error: contextError } = useCars();
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const currentModelParam = searchParams.get('model');
  const [searchTerm, setSearchTerm] = useState('');

  // Reset to page 1 when filters or sort change
  useEffect(() => {
    setPage(1);
  }, [sortBy, filters, searchTerm]);

  // Client-side filtering
  const filteredCars = (allCars || []).filter(c => {
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
    
    return true;
  });

  // Client-side sorting
  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'km-low') return (a.kms || 0) - (b.kms || 0);
    // newest (default)
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  // Search filter
  const displayedCars = sortedCars.filter((car) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase().trim();
    const corpus = `${car.make || ''} ${car.model || ''} ${car.variant || ''} ${car.year || ''} ${car.color || ''} ${car.owner || ''} ${car.fuelType || ''} ${car.transmission || ''} ${car.title || ''} ${car.price || ''}`.toLowerCase();
    return corpus.includes(q);
  });

  const displayCount = displayedCars.length;
  const itemsPerPage = 12;
  const totalPages = Math.ceil(displayCount / itemsPerPage) || 1;
  const paginatedCars = displayedCars.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="flex flex-col gap-6">

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-transparent border-b border-gray-200 pb-4 gap-4">

        {/* Header Title */}
        <div className="flex flex-col max-md:hidden">
          <h2 className="font-heading font-bold text-2xl text-primary">Live Inventory</h2>
          <p className="font-body text-sm text-text-muted hidden lg:block">Available stock in Surat</p>
        </div>

        {/* Universal Local Search */}
        <div className="flex-1 w-full flex items-center justify-center px-0 sm:px-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Quick search loaded cars... (e.g. White, Swift)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm font-body text-text focus:outline-none focus:border-primary shadow-sm hover:border-gray-300 transition-colors bg-surface"
            />
          </div>
        </div>

        {/* Sort By + Count */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="font-body text-sm text-text-muted">
            <span className="font-semibold text-text">{displayCount}</span> cars found
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-body text-text font-medium bg-surface focus:outline-none focus:border-primary shadow-sm hover:border-gray-300"
          >
            <option value="newest">Newly Listed</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="km-low">Kilometers: Low to High</option>
          </select>
        </div>

      </div>

      {/* Grid */}
      {isContextLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCarCard key={index} />
          ))}
        </div>
      ) : contextError ? (
        <div className="py-16 text-center">
          <p className="font-heading font-bold text-lg text-red-500">Error loading inventory</p>
          <p className="font-body text-sm text-text-muted mt-1">{contextError}</p>
        </div>
      ) : paginatedCars.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-heading font-bold text-lg text-text-muted">No vehicles found</p>
          <p className="font-body text-sm text-text-muted/60 mt-1">
            Try adjusting your filters or check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {paginatedCars.map((car, index) => (
            <Fragment key={car._id || car.id}>
              <CarCard
                id={car._id || car.id}
                image={car.image}
                title={`${car.make} ${car.model} (${car.year})`}
                price={formatPrice(car.price)}
                fuel={car.fuelType}
                transmission={car.transmission}
                owner={car.owner}
                kms={formatKm(car.kms)}
                isKmGenuine={car.isKmGenuine}
                badges={car.badges || []}
              />
              {/* Insert PromoBanner after every 8 cars exclusively for mobile screens */}
              {(index + 1) % 8 === 0 && (
                <div className="col-span-full hidden max-md:block">
                  <ComingSoonCarousel />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-100 gap-4">
          <p className="font-body text-sm text-text-muted">
            Page <span className="font-semibold text-text">{page}</span> of{' '}
            <span className="font-semibold text-text">{totalPages}</span>
            {' '}({displayCount} cars)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3.5 py-2 bg-background rounded-lg font-body text-sm font-semibold text-text-muted hover:text-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
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
                  className={`w-9 h-9 rounded-lg font-body text-sm font-bold flex items-center justify-center transition-colors ${pageNum === page
                    ? 'bg-primary text-white shadow-sm shadow-primary/20'
                    : 'bg-background text-text-muted hover:text-text'
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3.5 py-2 bg-background rounded-lg font-body text-sm font-semibold text-text-muted hover:text-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
