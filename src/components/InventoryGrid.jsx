import { useState } from 'react';
import CarCard from './CarCard';

export default function InventoryGrid() {
  const [stockTab, setStockTab] = useState('available');

  const catalogCars = [
    {
      id: 1,
      image: "https://placehold.co/600x400/223344/abcdef?text=Hyundai+Creta",
      title: "2022 Hyundai Creta SX",
      price: "₹8.50 Lakh",
      transmission: "Manual",
      fuel: "CNG",
      ownership: "1st Owner",
      km: "45,000 KM",
      status: "CERTIFIED"
    },
    {
      id: 2,
      image: "https://placehold.co/600x400/443322/fedcba?text=Toyota+Fortuner",
      title: "2021 Toyota Fortuner Base",
      price: "₹12.75 Lakh",
      transmission: "Automatic",
      fuel: "Diesel",
      ownership: "1st Owner",
      km: "32,000 KM",
      status: "HOT DEAL"
    },
    {
      id: 3,
      image: "https://placehold.co/600x400/112255/aabbff?text=Maruti+Baleno",
      title: "2020 Maruti Baleno Zeta",
      price: "₹5.20 Lakh",
      transmission: "Manual",
      fuel: "Petrol",
      ownership: "2nd Owner",
      km: "58,000 KM",
      status: ""
    },
    {
      id: 4,
      image: "https://placehold.co/600x400/882233/ffaaaa?text=Kia+Seltos",
      title: "2023 Kia Seltos HTX",
      price: "₹10.90 Lakh",
      transmission: "iVT",
      fuel: "Petrol",
      ownership: "1st Owner",
      km: "12,000 KM",
      status: ""
    },
    {
      id: 5,
      image: "https://placehold.co/600x400/1a1a1a/4ade80?text=Honda+Amaze",
      title: "2021 Honda Amaze VX",
      price: "₹7.15 Lakh",
      transmission: "CVT",
      fuel: "Petrol",
      ownership: "1st Owner",
      km: "36,500 KM",
      status: ""
    },
    {
      id: 6,
      image: "https://placehold.co/600x400/334155/94a3b8?text=Tata+Altroz",
      title: "2021 Tata Altroz XZ",
      price: "₹6.40 Lakh",
      transmission: "Manual",
      fuel: "Diesel",
      ownership: "1st Owner",
      km: "38,000 KM",
      status: ""
    }
  ];

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
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-body text-text font-medium bg-surface focus:outline-none focus:border-primary shadow-sm hover:border-gray-300">
            <option>Newly Listed</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Kilometers: Low to High</option>
          </select>
        </div>

      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalogCars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

    </div>
  );
}
