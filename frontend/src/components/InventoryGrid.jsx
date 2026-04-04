import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axiosInstance from '../api/axiosConfig';
import CarCard from './CarCard';

// ── Format helpers ──
function formatPrice(num) {
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lakh`;
  return `₹${num.toLocaleString('en-IN')}`;
}

function formatKm(num) {
  return `${num.toLocaleString('en-IN')} KM`;
}

export default function InventoryGrid({ filters = {} }) {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stockTab, setStockTab] = useState('available');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCars = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('limit', '12');
      params.set('status', stockTab === 'available' ? 'Available' : 'Coming Soon');

      if (sortBy !== 'newest') params.set('sort', sortBy);
      if (filters.fuelType) params.set('fuelType', filters.fuelType);
      if (filters.bodyType) params.set('bodyType', filters.bodyType);
      
      // Map new budget array back to min/max API requirements
      if (filters.budget && filters.budget.length === 2) {
        params.set('priceMin', filters.budget[0]);
        params.set('priceMax', filters.budget[1]);
      } else {
        if (filters.priceMin) params.set('priceMin', filters.priceMin);
        if (filters.priceMax) params.set('priceMax', filters.priceMax);
      }

      if (filters.makes && filters.makes.length === 1) {
        params.set('make', filters.makes[0]);
      }

      const res = await axiosInstance.get(`/cars?${params.toString()}`);
      let data = res.data.data || [];

      // Client-side multi-make filter (if more than 1 make selected)
      if (filters.makes && filters.makes.length > 1) {
        data = data.filter(c => filters.makes.includes(c.make));
      }

      setCars(data);
      setTotalPages(res.data.pages || 1);
      setTotalCount(res.data.total || data.length);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch cars');
    } finally {
      setIsLoading(false);
    }
  }, [page, stockTab, sortBy, filters]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // Reset to page 1 when filters or sort change
  useEffect(() => {
    setPage(1);
  }, [stockTab, sortBy, filters]);

  return (
    <div className="flex flex-col gap-6">

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-transparent border-b border-gray-200 pb-4 gap-4">

        {/* Toggle Pills */}
        <div className="bg-gray-100 p-1.5 rounded-full inline-flex w-full sm:w-auto">
          <button
            onClick={() => setStockTab('available')}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-full font-heading font-bold text-sm transition-all ${
              stockTab === 'available'
                ? 'bg-primary text-white shadow-md'
                : 'text-text hover:text-primary'
            }`}
          >
            Available Stock
          </button>
          <button
            onClick={() => setStockTab('soon')}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-full font-heading font-bold text-sm transition-all ${
              stockTab === 'soon'
                ? 'bg-primary text-white shadow-md'
                : 'text-text hover:text-primary'
            }`}
          >
            Coming Soon
          </button>
        </div>

        {/* Sort By + Count */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="font-body text-sm text-text-muted">
            <span className="font-semibold text-text">{totalCount}</span> cars found
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
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 font-heading font-semibold text-text-muted">Loading stock...</p>
        </div>
      ) : error ? (
        <div className="py-16 text-center">
          <p className="font-heading font-bold text-lg text-red-500">Error loading inventory</p>
          <p className="font-body text-sm text-text-muted mt-1">{error}</p>
        </div>
      ) : cars.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-heading font-bold text-lg text-text-muted">No vehicles found</p>
          <p className="font-body text-sm text-text-muted/60 mt-1">
            {stockTab === 'available' ? 'Try adjusting your filters or check back soon!' : 'No upcoming vehicles at the moment.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard
              key={car._id || car.id}
              id={car._id || car.id}
              image={car.image}
              title={`${car.year} ${car.make} ${car.model}`}
              price={formatPrice(car.price)}
              fuel={car.fuelType}
              transmission={car.transmission}
              owner={car.owner}
              kms={formatKm(car.kms)}
              badges={car.badges || []}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-100 gap-4">
          <p className="font-body text-sm text-text-muted">
            Page <span className="font-semibold text-text">{page}</span> of{' '}
            <span className="font-semibold text-text">{totalPages}</span>
            {' '}({totalCount} cars)
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
                  className={`w-9 h-9 rounded-lg font-body text-sm font-bold flex items-center justify-center transition-colors ${
                    pageNum === page
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
