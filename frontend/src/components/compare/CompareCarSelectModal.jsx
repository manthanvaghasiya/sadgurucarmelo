/**
 * @file frontend/src/components/compare/CompareCarSelectModal.jsx
 * @description Modal dialog allowing customers to search, filter by fuel type, and
 * select available inventory vehicles to populate comparison slots.
 */

import React from 'react';
import { X, Search } from 'lucide-react';
import { getOptimizedUrl } from '../../utils/imageUtils';

export default function CompareCarSelectModal({
  isOpen,
  onClose,
  searchTerm,
  setSearchTerm,
  fuelFilter,
  setFuelFilter,
  filteredCars = [],
  onSelectCar,
  formatRupee,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-black text-lg sm:text-xl text-slate-900">
              સરખામણી માટે કાર પસંદ કરો
            </h3>
            <p className="text-xs text-slate-500 font-body">Select a vehicle from live available stock to compare</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Tabs & Search Input */}
        <div className="p-4 border-b border-slate-100 bg-[#F8FAFC] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="શોધો · Search by make, model, year (e.g. Swift, Creta, Safari)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 font-medium"
            />
          </div>

          {/* Fuel Quick Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {['All', 'Petrol', 'Diesel', 'CNG', 'Electric'].map((fuel) => (
              <button
                key={fuel}
                type="button"
                onClick={() => setFuelFilter(fuel)}
                className={`px-3 py-1 rounded-lg text-xs font-heading font-bold whitespace-nowrap transition-all cursor-pointer ${
                  fuelFilter === fuel
                    ? 'bg-brand-orange text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {fuel === 'All' ? 'બધા ઇંધણ (All)' : fuel}
              </button>
            ))}
          </div>
        </div>

        {/* Car Select List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredCars.length === 0 ? (
            <p className="text-center text-slate-500 py-8 text-sm font-medium">
              કોઈ કાર મળી નથી · No cars available matching your criteria
            </p>
          ) : (
            filteredCars.map((car) => {
              const carId = car._id || car.id;
              const img = car.image || (car.images && car.images[0]) || '';
              return (
                <div
                  key={carId}
                  onClick={() => onSelectCar(car)}
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:border-brand-orange hover:bg-orange-50/20 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={getOptimizedUrl(img, 200)}
                        alt={car.model}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {car.status === 'Coming Soon' && (
                        <div className="absolute inset-x-0 bottom-0 bg-amber-500 text-white text-[8px] font-black text-center uppercase">
                          Soon
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-heading font-black text-slate-900 text-sm">
                          {car.make} {car.model} ({car.year || car.manufacturingYear})
                        </p>
                        {car.status === 'Coming Soon' && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                            Soon
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {car.fuelType} · {car.transmission} · {car.kms ? `${car.kms.toLocaleString('en-IN')} KM` : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-heading font-black text-brand-orange text-sm block">
                      {formatRupee(car.price)}
                    </span>
                    <span className="text-[10px] font-heading font-black text-slate-950 group-hover:text-brand-orange group-hover:underline">
                      + Add to Compare
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
