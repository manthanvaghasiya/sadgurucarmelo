import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ShoppingCart,
  MessageSquare,
  HandCoins,
  Download,
} from 'lucide-react';
import axiosInstance from '../../api/axiosConfig';
import { useCars } from '../../context/CarContext';
import TrafficGrowthChart from '../../components/admin/TrafficGrowthChart';
import SystemStorageHealth from '../../components/admin/SystemStorageHealth';

const statusStyles = {
  Available: 'bg-[#10b981]/10 text-[#059669] ring-[#10b981]/20',
  Booked: 'bg-amber-50 text-amber-600 ring-amber-500/20',
  Sold: 'bg-red-50 text-red-600 ring-red-500/20',
  'Coming Soon': 'bg-[#3b82f6]/10 text-[#2563eb] ring-[#3b82f6]/20',
};

export default function Dashboard() {
  const { cars, isLoading: carsLoading } = useCars();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [sellRequestCount, setSellRequestCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [appInstalls, setAppInstalls] = useState(0);
  const [carStats, setCarStats] = useState({ totalCars: 0, availableCars: 0, soldThisMonth: 0, totalValue: 0 });

  // Fetch live stats
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const [sellRes, carRes, msgRes, installsRes] = await Promise.allSettled([
          axiosInstance.get('/sell-requests'),
          axiosInstance.get('/cars/stats'),
          axiosInstance.get('/messages'),
          axiosInstance.get('/analytics/app-installs/total'),
        ]);

        if (sellRes.status === 'fulfilled' && sellRes.value.data?.success) {
          const resData = sellRes.value.data;
          const pending = resData.pendingCount !== undefined
            ? resData.pendingCount
            : (resData.data || []).filter((r) => r.status === 'Pending').length;
          setSellRequestCount(pending);
        } else {
          setSellRequestCount(0);
        }

        if (carRes.status === 'fulfilled' && carRes.value.data?.success) {
          setCarStats(carRes.value.data.data || {});
        }

        if (msgRes.status === 'fulfilled' && msgRes.value.data?.success) {
          const resData = msgRes.value.data;
          const msgs = resData.data || [];
          const unread = resData.unreadCount !== undefined
            ? resData.unreadCount
            : msgs.filter((m) => m.status === 'Unread').length;
          setUnreadMessages(unread);
          setTotalMessages(resData.total !== undefined ? resData.total : msgs.length);
        } else {
          setUnreadMessages(0);
          setTotalMessages(0);
        }

        if (installsRes.status === 'fulfilled' && installsRes.value.data?.success) {
          setAppInstalls(installsRes.value.data.total ?? 0);
        } else {
          setAppInstalls(0);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalValue = carStats?.totalValue || 0;
  const totalValueFormatted = totalValue >= 10000000
    ? `₹${(totalValue / 10000000).toFixed(2)} Cr`
    : totalValue >= 100000
      ? `₹${(totalValue / 100000).toFixed(2)} Lakhs`
      : `₹${totalValue.toLocaleString('en-IN')}`;

  const statsData = [
    {
      id: 'total-inventory',
      title: 'Total Inventory',
      value: (carStats?.availableCars || (cars || []).length || 0).toString(),
      subtext: 'Active Listings',
      icon: Car,
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
      glow: 'shadow-[0_0_30px_rgba(168,85,247,0.12)]',
    },
    {
      id: 'new-messages',
      title: 'New Messages',
      value: unreadMessages.toString(),
      subtext: `${totalMessages} total received`,
      icon: MessageSquare,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
      glow: 'shadow-[0_0_30px_rgba(96,165,250,0.12)]',
    },
    {
      id: 'sell-requests',
      title: 'Sell Requests',
      value: sellRequestCount.toString(),
      subtext: 'Pending evaluations',
      icon: HandCoins,
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
      glow: 'shadow-[0_0_30px_rgba(52,211,153,0.12)]',
    },
    {
      id: 'app-installs',
      title: 'App Installs',
      value: appInstalls.toString(),
      subtext: 'Total PWA installations',
      icon: Download,
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-400',
      glow: 'shadow-[0_0_30px_rgba(249,115,22,0.12)]',
    },
  ];

  // Map backend featured cars (exclude Sold cars)
  const inventoryData = (cars || []).filter(c => c?.isFeaturedOnHome && c?.status !== 'Sold').map((c) => ({
    id: c._id || c.id,
    image: c.image || 'https://placehold.co/120x80/e2e8f0/64748b?text=Car',
    name: `${c.make || ''} ${c.model || ''}`.trim(),
    year: c.year,
    price: (c.price || 0) >= 100000 ? `₹${((c.price || 0) / 100000).toFixed(2)} Lakhs` : `₹${(c.price || 0).toLocaleString('en-IN')}`,
    km: `${(c.kms || 0).toLocaleString('en-IN')} KM`,
    fuel: c.fuelType || 'N/A',
  }));

  // ── Loading State ──
  if (carsLoading && statsLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="font-body text-sm text-text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
      </div>

      {/* ── Stats Row (4 Columns matching Hari Ram Motors) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className={`relative overflow-hidden bg-surface rounded-2xl border border-gray-100 p-4 sm:p-5 hover:-translate-y-1 transition-all duration-300 ${stat.glow || ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 sm:w-11 sm:h-11 ${stat.iconBg} rounded-xl flex items-center justify-center transition-transform hover:scale-105`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} strokeWidth={2} />
                </div>
              </div>

              <div>
                <p className="font-heading font-bold text-2xl sm:text-3xl text-text tracking-tight leading-none">
                  {statsLoading ? '—' : stat.value}
                </p>
                <h3 className="font-body text-xs sm:text-sm font-semibold text-text mt-1.5 truncate">
                  {stat.title}
                </h3>
                <p className="font-body text-[10px] sm:text-xs text-text-muted mt-0.5 truncate">
                  {stat.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Website Traffic Growth Analytics ── */}
      <TrafficGrowthChart />

      {/* ── System Storage & Health Telemetry ── */}
      <SystemStorageHealth />

      {/* ── Inventory Table ── */}
      <div className="bg-surface rounded-2xl border border-gray-100 overflow-hidden">
        {/* Table Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 pb-4 gap-4">
          <div>
            <h2 className="font-heading font-bold text-lg text-text">
              Home Page Inventory
            </h2>
            <p className="font-body text-sm text-text-muted mt-0.5">
              {inventoryData.length} vehicles selected for Home Page
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/inventory')}
              className="flex items-center gap-2 px-4 py-2 bg-background rounded-xl font-body text-sm font-semibold text-text-muted hover:text-text transition-colors"
            >
              <Eye className="w-4 h-4" />
              View All
            </button>
            <button
              onClick={() => navigate('/admin/add-car')}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl font-body text-sm font-bold hover:bg-accent-hover transition-colors shadow-sm shadow-accent/20"
            >
              + Add Vehicle
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
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
                <th className="text-right font-body text-[11px] font-bold text-text-muted uppercase tracking-wider px-6 py-3.5 bg-background/50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((car) => (
                <tr
                  key={car.id}
                  className="border-t border-gray-50 hover:bg-background/50 transition-colors"
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
                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/admin/edit-car/${car.id}`)}
                        className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="md:hidden divide-y divide-gray-50">
          {inventoryData.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center">
                <Car className="w-7 h-7 text-text-muted/40" />
              </div>
              <p className="font-body text-sm font-semibold text-text-muted">
                No featured vehicles
              </p>
            </div>
          ) : (
            inventoryData.map((car) => (
              <div key={car.id} className="p-4 hover:bg-background/40 transition-colors">
                <div className="flex gap-3">
                  <div className="w-20 h-14 rounded-lg overflow-hidden bg-background shrink-0 ring-1 ring-gray-100">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold text-text truncate">
                      {car.name} ({car.year})
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-body text-xs text-text-muted">{car.km}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="font-body text-xs text-text-muted">{car.fuel}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-heading font-bold text-sm text-text">
                        {car.price}
                      </span>
                      <button
                        onClick={() => navigate(`/admin/edit-car/${car.id}`)}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-colors active:scale-90"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Table Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 pt-4 border-t border-gray-100 gap-4">
          <p className="font-body text-sm text-text-muted">
            Showing <span className="font-semibold text-text">{inventoryData.length > 0 ? `1-${inventoryData.length}` : '0'}</span> of{' '}
            <span className="font-semibold text-text">{(cars || []).length}</span> vehicles
          </p>
          <button
            onClick={() => navigate('/admin/inventory')}
            className="px-4 py-2 bg-primary text-white rounded-lg font-body text-sm font-bold hover:bg-primary-hover transition-colors"
          >
            View Full Inventory →
          </button>
        </div>
      </div>
    </div>
  );
}
