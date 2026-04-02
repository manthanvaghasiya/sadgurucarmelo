import { createContext, useContext, useState, useEffect } from 'react';

const CarContext = createContext();

// ── Default seed data (shown when localStorage is empty) ──
const defaultCars = [
  {
    id: 'car-001',
    make: 'Hyundai',
    model: 'Creta SX',
    year: 2022,
    price: 850000,
    kms: 45000,
    fuelType: 'Diesel',
    transmission: 'Manual',
    owner: '1st Owner',
    badges: ['Certified', 'Valid Vimo'],
    image: 'https://placehold.co/600x400/223344/abcdef?text=Hyundai+Creta',
    status: 'Available',
  },
  {
    id: 'car-002',
    make: 'Toyota',
    model: 'Fortuner Base',
    year: 2021,
    price: 1275000,
    kms: 32000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    owner: '1st Owner',
    badges: ['Certified'],
    image: 'https://placehold.co/600x400/443322/fedcba?text=Toyota+Fortuner',
    status: 'Available',
  },
  {
    id: 'car-003',
    make: 'Tata',
    model: 'Nexon EV Max',
    year: 2023,
    price: 1490000,
    kms: 12000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    owner: '1st Owner',
    badges: ['Certified', 'Peti-pack', 'Valid Vimo'],
    image: 'https://placehold.co/600x400/112255/aabbff?text=Tata+Nexon+EV',
    status: 'Available',
  },
  {
    id: 'car-004',
    make: 'Maruti Suzuki',
    model: 'Baleno Zeta',
    year: 2020,
    price: 520000,
    kms: 58000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    owner: '2nd Owner',
    badges: [],
    image: 'https://placehold.co/600x400/334155/94a3b8?text=Maruti+Baleno',
    status: 'Available',
  },
  {
    id: 'car-005',
    make: 'Kia',
    model: 'Seltos HTX',
    year: 2023,
    price: 1090000,
    kms: 12000,
    fuelType: 'Petrol',
    transmission: 'CVT',
    owner: '1st Owner',
    badges: ['Certified'],
    image: 'https://placehold.co/600x400/882233/ffaaaa?text=Kia+Seltos',
    status: 'Available',
  },
  {
    id: 'car-006',
    make: 'Honda',
    model: 'Amaze VX',
    year: 2021,
    price: 715000,
    kms: 36500,
    fuelType: 'Petrol',
    transmission: 'CVT',
    owner: '1st Owner',
    badges: ['Valid Vimo'],
    image: 'https://placehold.co/600x400/1a1a1a/4ade80?text=Honda+Amaze',
    status: 'Available',
  },
];

// ── Load from localStorage or use defaults ──
function loadCars() {
  try {
    const stored = localStorage.getItem('sadguru_cars');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load cars from localStorage:', e);
  }
  return defaultCars;
}

// ── Provider ──
export function CarProvider({ children }) {
  const [cars, setCars] = useState(loadCars);

  // Sync to localStorage on every change
  useEffect(() => {
    localStorage.setItem('sadguru_cars', JSON.stringify(cars));
  }, [cars]);

  const addCar = (carData) => {
    const newCar = {
      id: `car-${Date.now()}`,
      ...carData,
    };
    setCars((prev) => [newCar, ...prev]); // newest first
    return newCar;
  };

  const deleteCar = (id) => {
    setCars((prev) => prev.filter((car) => car.id !== id));
  };

  const updateCarStatus = (id, status) => {
    setCars((prev) =>
      prev.map((car) => (car.id === id ? { ...car, status } : car))
    );
  };

  return (
    <CarContext.Provider value={{ cars, addCar, deleteCar, updateCarStatus }}>
      {children}
    </CarContext.Provider>
  );
}

// ── Custom hook ──
export function useCars() {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCars must be used within a <CarProvider>');
  }
  return context;
}
