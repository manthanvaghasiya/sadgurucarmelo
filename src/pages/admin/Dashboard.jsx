import { useState } from 'react';
import {
  Car,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Edit3,
  Trash2,
  MoreVertical,
  Eye,
  Filter,
  ChevronDown,
} from 'lucide-react';

// Mock data for stats
const statsData = [
  {
    id: 'total-cars',
    title: 'Total Cars in Stock',
    value: '47',
    change: '+3',
    trend: 'up',
    subtitle: 'from last month',
    icon: Car,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    id: 'inventory-value',
    title: 'Total Inventory Value',
    value: '₹2.84 Cr',
    change: '+12.5%',
    trend: 'up',
    subtitle: 'portfolio growth',
    icon: DollarSign,
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
  },
  {
    id: 'recent-leads',
    title: 'Recent Leads',
    value: '23',
    change: '-2',
    trend: 'down',
    subtitle: 'this week',
    icon: Users,
    iconBg: 'bg-[#8b5cf6]/10',
    iconColor: 'text-[#8b5cf6]',
  },
];

// Mock data for inventory table
const inventoryData = [
  {
    id: 1,
    image: 'https://placehold.co/120x80/e2e8f0/64748b?text=Swift',
    name: 'Maruti Suzuki Swift VXI',
    year: 2022,
    price: '₹5,85,000',
    km: '23,000 KM',
    fuel: 'Petrol',
    status: 'Available',
  },
  {
    id: 2,
    image: 'https://placehold.co/120x80/e2e8f0/64748b?text=Creta',
    name: 'Hyundai Creta SX(O)',
    year: 2021,
    price: '₹13,50,000',
    km: '35,400 KM',
    fuel: 'Diesel',
    status: 'Available',
  },
  {
    id: 3,
    image: 'https://placehold.co/120x80/e2e8f0/64748b?text=City',
    name: 'Honda City V CVT',
    year: 2023,
    price: '₹11,25,000',
    km: '12,000 KM',
    fuel: 'Petrol',
    status: 'Sold',
  },
  {
    id: 4,
    image: 'https://placehold.co/120x80/e2e8f0/64748b?text=Nexon',
    name: 'Tata Nexon EV Max',
    year: 2023,
    price: '₹14,75,000',
    km: '8,500 KM',
    fuel: 'Electric',
    status: 'Available',
  },
  {
    id: 5,
    image: 'https://placehold.co/120x80/e2e8f0/64748b?text=Fortuner',
    name: 'Toyota Fortuner 4X4 AT',
    year: 2020,
    price: '₹32,00,000',
    km: '45,000 KM',
    fuel: 'Diesel',
    status: 'Reserved',
  },
  {
    id: 6,
    image: 'https://placehold.co/120x80/e2e8f0/64748b?text=Baleno',
    name: 'Maruti Suzuki Baleno Zeta',
    year: 2022,
    price: '₹7,20,000',
    km: '18,600 KM',
    fuel: 'Petrol',
    status: 'Available',
  },
];

const statusStyles = {
  Available: 'bg-[#10b981]/10 text-[#059669] ring-[#10b981]/20',
  Sold: 'bg-red-50 text-red-600 ring-red-500/20',
  Reserved: 'bg-amber-50 text-amber-600 ring-amber-500/20',
};

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-text">Dashboard</h1>
          <p className="font-body text-sm text-text-muted mt-1">
            Welcome back — here's your inventory overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-gray-200 rounded-xl font-body text-sm font-semibold text-text-muted hover:border-primary/30 hover:text-text transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <select className="px-4 py-2.5 bg-surface border border-gray-200 rounded-xl font-body text-sm font-semibold text-text-muted appearance-none cursor-pointer hover:border-primary/30 outline-none pr-8 transition-colors">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="bg-surface rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} strokeWidth={2} />
                </div>
                <div className={`flex items-center gap-1 font-body text-xs font-bold px-2.5 py-1 rounded-full ${
                  stat.trend === 'up'
                    ? 'bg-[#10b981]/10 text-[#059669]'
                    : 'bg-red-50 text-red-500'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="font-body text-sm font-semibold text-text-muted mb-1">
                {stat.title}
              </h3>
              <p className="font-heading font-bold text-3xl text-text leading-none mb-1">
                {stat.value}
              </p>
              <span className="font-body text-xs text-text-muted/60">
                {stat.subtitle}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Inventory Table ── */}
      <div className="bg-surface rounded-2xl border border-gray-100 overflow-hidden">
        {/* Table Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 pb-4 gap-4">
          <div>
            <h2 className="font-heading font-bold text-lg text-text">
              Current Inventory
            </h2>
            <p className="font-body text-sm text-text-muted mt-0.5">
              {inventoryData.length} vehicles in database
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-background rounded-xl font-body text-sm font-semibold text-text-muted hover:text-text transition-colors">
              <Eye className="w-4 h-4" />
              View All
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl font-body text-sm font-bold hover:bg-accent-hover transition-colors shadow-sm shadow-accent/20">
              + Add Vehicle
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-t border-gray-100">
                <th className="text-left font-body text-[11px] font-bold text-text-muted uppercase tracking-wider px-6 py-3.5 bg-background/50">
                  Vehicle
                </th>
                <th className="text-left font-body text-[11px] font-bold text-text-muted uppercase tracking-wider px-4 py-3.5 bg-background/50">
                  Year
                </th>
                <th className="text-left font-body text-[11px] font-bold text-text-muted uppercase tracking-wider px-4 py-3.5 bg-background/50">
                  Price
                </th>
                <th className="text-left font-body text-[11px] font-bold text-text-muted uppercase tracking-wider px-4 py-3.5 bg-background/50">
                  KM Driven
                </th>
                <th className="text-left font-body text-[11px] font-bold text-text-muted uppercase tracking-wider px-4 py-3.5 bg-background/50">
                  Fuel
                </th>
                <th className="text-left font-body text-[11px] font-bold text-text-muted uppercase tracking-wider px-4 py-3.5 bg-background/50">
                  Status
                </th>
                <th className="text-right font-body text-[11px] font-bold text-text-muted uppercase tracking-wider px-6 py-3.5 bg-background/50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((car, index) => (
                <tr
                  key={car.id}
                  className={`border-t border-gray-50 hover:bg-background/50 transition-colors ${
                    index === inventoryData.length - 1 ? '' : ''
                  }`}
                >
                  {/* Vehicle Cell */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-16 h-11 rounded-lg overflow-hidden bg-background shrink-0">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-body text-sm font-semibold text-text truncate max-w-[200px]">
                        {car.name}
                      </span>
                    </div>
                  </td>
                  {/* Year */}
                  <td className="px-4 py-4">
                    <span className="font-body text-sm text-text-muted font-medium">
                      {car.year}
                    </span>
                  </td>
                  {/* Price */}
                  <td className="px-4 py-4">
                    <span className="font-heading font-bold text-sm text-text">
                      {car.price}
                    </span>
                  </td>
                  {/* KM Driven */}
                  <td className="px-4 py-4">
                    <span className="font-body text-sm text-text-muted font-medium">
                      {car.km}
                    </span>
                  </td>
                  {/* Fuel */}
                  <td className="px-4 py-4">
                    <span className="font-body text-sm text-text-muted font-medium">
                      {car.fuel}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full font-body text-[11px] font-bold ring-1 ${statusStyles[car.status]}`}
                    >
                      {car.status}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === car.id ? null : car.id)}
                          className="p-2 text-text-muted hover:text-text hover:bg-background rounded-lg transition-colors"
                          title="More"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {activeMenu === car.id && (
                          <div className="absolute right-0 top-full mt-1 w-40 bg-surface rounded-xl shadow-xl shadow-primary/10 border border-gray-100 py-1.5 z-20">
                            <button className="w-full text-left px-4 py-2 font-body text-sm text-text hover:bg-background transition-colors">
                              View Details
                            </button>
                            <button className="w-full text-left px-4 py-2 font-body text-sm text-text hover:bg-background transition-colors">
                              Mark as Sold
                            </button>
                            <button className="w-full text-left px-4 py-2 font-body text-sm text-red-500 hover:bg-red-50 transition-colors">
                              Remove Listing
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 pt-4 border-t border-gray-100 gap-4">
          <p className="font-body text-sm text-text-muted">
            Showing <span className="font-semibold text-text">1-6</span> of{' '}
            <span className="font-semibold text-text">47</span> vehicles
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3.5 py-2 bg-background rounded-lg font-body text-sm font-semibold text-text-muted hover:text-text transition-colors">
              Previous
            </button>
            <button className="w-9 h-9 bg-primary text-white rounded-lg font-body text-sm font-bold flex items-center justify-center">
              1
            </button>
            <button className="w-9 h-9 bg-background rounded-lg font-body text-sm font-semibold text-text-muted hover:text-text transition-colors flex items-center justify-center">
              2
            </button>
            <button className="w-9 h-9 bg-background rounded-lg font-body text-sm font-semibold text-text-muted hover:text-text transition-colors flex items-center justify-center">
              3
            </button>
            <button className="px-3.5 py-2 bg-background rounded-lg font-body text-sm font-semibold text-text-muted hover:text-text transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
