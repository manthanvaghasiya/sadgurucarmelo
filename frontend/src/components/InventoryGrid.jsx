import { useState, useMemo } from 'react';
import { useCars } from '../context/CarContext';
import CarCard from './CarCard';

// ── Format helpers ──
function formatPrice(num) {
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lakh`;
  return `₹${num.toLocaleString('en-IN')}`;
}

function formatKm(num) {
  return `${num.toLocaleString('en-IN')} KM`;
}

export default function InventoryGrid() {
  const { cars } = useCars();
  const [stockTab, setStockTab] = useState('available');
  const [sortBy, setSortBy] = useState('newest');

  // ── Filter by status tab ──
  const filtered = useMemo(() => {
    if (stockTab === 'available') {
      return cars.filter((c) => c.status === 'Available');
    }
    return cars.filter((c) => c.status === 'Coming Soon');
  }, [cars, stockTab]);

  // ── Sort ──
  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sortBy) {
      case 'price-low':
        return arr.sort((a, b) => a.price - b.price);
      case 'price-high':
        return arr.sort((a, b) => b.price - a.price);
      case 'km-low':
        return arr.sort((a, b) => a.kms - b.kms);
      case 'newest':
      default:
        return arr; // already newest-first from context
    }
  }, [filtered, sortBy]);

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

        {/* Sort By */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="font-heading font-semibold text-xs text-text-muted uppercase tracking-widest">Sort By:</span>
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
      {sorted.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-heading font-bold text-lg text-text-muted">No vehicles found</p>
          <p className="font-body text-sm text-text-muted/60 mt-1">
            {stockTab === 'available' ? 'New stock is arriving soon!' : 'No upcoming vehicles at the moment.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((car) => (
            <CarCard
              key={car.id}
              id={car.id}
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

    </div>
  );
}
