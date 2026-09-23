import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useCars } from './CarContext';

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const { cars } = useCars();

  const [compareCars, setCompareCars] = useState(() => {
    try {
      const saved = localStorage.getItem('sadguru_compare_cars');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever compareCars updates
  useEffect(() => {
    try {
      localStorage.setItem('sadguru_compare_cars', JSON.stringify(Array.isArray(compareCars) ? compareCars : []));
    } catch (e) {
      console.warn('Failed to save compare cars to storage', e);
    }
  }, [compareCars]);

  // Sync with latest cars data from CarContext to ensure full specs are populated
  useEffect(() => {
    if (!Array.isArray(cars) || cars.length === 0 || !Array.isArray(compareCars) || compareCars.length === 0) return;

    setCompareCars((prev) => {
      if (!Array.isArray(prev)) return [];
      let changed = false;
      const updated = prev.map((item) => {
        if (!item) return item;
        const itemId = String(item._id || item.id || '');
        const fullCar = cars.find((c) => String(c?._id || c?.id || '') === itemId);
        if (fullCar && (!item.displacement || !item.features || !item.manufacturingYear)) {
          changed = true;
          return { ...fullCar, ...item, ...fullCar };
        }
        return item;
      }).filter(Boolean);
      return changed ? updated : prev;
    });
  }, [cars]);

  const getCarId = (c) => String(c?._id || c?.id || '');

  const addToCompare = (carOrId) => {
    if (!carOrId) return;

    const rawId = typeof carOrId === 'string' ? carOrId : (carOrId._id || carOrId.id);
    const carId = String(rawId || '');

    if (!carId) return;

    // Check if already in comparison
    if (compareCars.some((c) => getCarId(c) === carId)) {
      toast('આ કાર સરખામણીમાં પહેલેથી છે · Already in comparison', { icon: 'ℹ️' });
      return;
    }

    if (compareCars.length >= 3) {
      toast.error('મહત્તમ ૩ કારની સરખામણી કરી શકાય છે · Maximum 3 cars can be compared');
      return;
    }

    // Find full car details from CarContext if available
    const fullCar = (cars || []).find((c) => getCarId(c) === carId);
    const carToStore = fullCar ? { ...fullCar } : (typeof carOrId === 'object' ? carOrId : { _id: carId, id: carId });

    setCompareCars((prev) => [...prev, carToStore]);
    const carName = carToStore.make ? `${carToStore.make} ${carToStore.model || ''}`.trim() : 'Vehicle';
    toast.success(`${carName} સરખામણીમાં ઉમેરાઈ · Added to comparison`);
  };

  const removeFromCompare = (carId) => {
    if (!carId) return;
    const targetId = String(carId);
    setCompareCars((prev) => prev.filter((c) => getCarId(c) !== targetId));
    toast('સરખામણીમાંથી દૂર કરી · Removed from comparison');
  };

  const toggleCompare = (carOrId) => {
    if (!carOrId) return;
    const rawId = typeof carOrId === 'string' ? carOrId : (carOrId._id || carOrId.id);
    const targetId = String(rawId || '');

    if (isInCompare(targetId)) {
      removeFromCompare(targetId);
    } else {
      addToCompare(carOrId);
    }
  };

  const clearCompare = () => {
    setCompareCars([]);
    toast('સરખામણી સાફ કરી · Comparison cleared');
  };

  const isInCompare = (carId) => {
    if (!carId) return false;
    const targetId = String(carId);
    return compareCars.some((c) => getCarId(c) === targetId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareCars,
        compareCount: compareCars.length,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
