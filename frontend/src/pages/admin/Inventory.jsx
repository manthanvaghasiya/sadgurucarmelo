import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Edit3,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  SlidersHorizontal,
  Car,
  Calendar,
  IndianRupee,
  MoreHorizontal,
  X,
  AlertTriangle,
} from 'lucide-react';

import { useCars } from '../../context/CarContext';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 10;

// Status badge style map
const statusConfig = {
  Available: {
    bg: 'bg-[#10b981]/10',
    text: 'text-[#059669]',
    ring: 'ring-[#10b981]/20',
    dot: 'bg-[#10b981]',
  },
  Sold: {
    bg: 'bg-gray-100',
    text: 'text-gray-500',
    ring: 'ring-gray-200',
    dot: 'bg-gray-400',
  },
  'Coming Soon': {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    ring: 'ring-amber-500/20',
    dot: 'bg-amber-500',
  },
};

export default function Inventory() {
  const { cars, deleteCar } = useCars();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Map backend cars to the local unified format dynamically
  const allCars = useMemo(() => {
    return cars.map((c) => ({
      id: c._id || c.id,
      image: c.image || 'https://placehold.co/120x80/e2e8f0/64748b?text=Car',
      title: `${c.year} ${c.make} ${c.model}`,
      make: c.make || '',
      model: c.model || '',
      km: `${(c.kms || 0).toLocaleString('en-IN')} KM`,
      price: c.price >= 100000 ? `₹${(c.price / 100000).toFixed(2)} Lakhs` : `₹${(c.price || 0).toLocaleString('en-IN')}`,
      priceRaw: c.price || 0,
      status: c.status || 'Available',
      dateAdded: new Date(c.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' }),
      fuel: c.fuelType || 'Unknown',
    }));
  }, [cars]);

  // ── Filtering ──
  const filtered = useMemo(() => {
    let list = allCars;

    // Status filter
    if (statusFilter !== 'All') {
      list = list.filter((c) => c.status === statusFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.make.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortField === 'price') {
      list = [...list].sort((a, b) =>
        sortDir === 'asc' ? a.priceRaw - b.priceRaw : b.priceRaw - a.priceRaw
      );
    }

    return list;
  }, [allCars, searchQuery, statusFilter, sortField, sortDir]);

  // ── Pagination ──
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const showingFrom = filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingTo = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

  // Reset to page 1 when filters change
  const handleSearch = (v) => {
    setSearchQuery(v);
    setCurrentPage(1);
  };
  const handleStatusFilter = (v) => {
    setStatusFilter(v);
    setCurrentPage(1);
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  // Status counts for filter pills
  const counts = useMemo(() => {
    const c = { All: allCars.length, Available: 0, Sold: 0, 'Coming Soon': 0 };
    allCars.forEach((car) => {
      if (c[car.status] !== undefined) c[car.status]++;
    });
    return c;
  }, [allCars]);

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════════════
          Delete Confirmation Modal
         ═══════════════════════════════════════════════ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative bg-surface rounded-2xl shadow-2xl shadow-primary/10 border border-gray-100 w-full max-w-sm p-6 space-y-5 animate-[fadeScale_200ms_ease-out]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-text">Delete Vehicle?</h3>
                <p className="font-body text-sm text-text-muted mt-0.5">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 bg-background rounded-xl font-body text-sm font-semibold text-text-muted hover:text-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteCar(deleteTarget);
                    toast.success('Vehicle deleted successfully.');
                  } catch (error) {
                    toast.error('Failed to delete vehicle.');
                  }
                  setDeleteTarget(null);
                }}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-body text-sm font-bold transition-colors shadow-sm shadow-red-500/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          Page Header
         ═══════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-text">
            Inventory Management
          </h1>
          <p className="font-body text-sm text-text-muted mt-1 max-w-lg">
            Manage your showroom listings, update prices, and mark cars as sold.
          </p>
        </div>
        <Link
          to="/admin/add-car"
          className="inline-flex items-center gap-2 px-5 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl font-body text-sm font-bold transition-colors shadow-lg shadow-accent/20 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Add New Car
        </Link>
      </div>

      {/* ═══════════════════════════════════════════════
          Status Filter Pills
         ═══════════════════════════════════════════════ */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1 scrollbar-none">
        {['All', 'Available', 'Sold', 'Coming Soon'].map((status) => {
          const active = statusFilter === status;
          const cfg = statusConfig[status];
          return (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl font-body text-sm font-semibold
                transition-all duration-200 whitespace-nowrap shrink-0
                ${active
                  ? 'bg-primary text-white shadow-md shadow-primary/15'
                  : 'bg-surface text-text-muted border border-gray-100 hover:border-primary/20 hover:text-text'
                }
              `}
            >
              {status !== 'All' && cfg && (
                <span className={`w-2 h-2 rounded-full ${active ? 'bg-white' : cfg.dot}`} />
              )}
              {status}
              <span
                className={`
                  text-[11px] font-bold px-1.5 py-0.5 rounded-md
                  ${active ? 'bg-white/20 text-white' : 'bg-background text-text-muted'}
                `}
              >
                {counts[status]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════
          Search & Sort Bar
         ═══════════════════════════════════════════════ */}
      <div className="bg-surface rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by Make, Model, or ID..."
            className="w-full pl-10 pr-10 py-2.5 bg-background border border-transparent focus:border-primary/20 rounded-xl font-body text-sm text-text placeholder:text-text-muted/60 outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-text-muted hover:text-text transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort by Price Toggle */}
        <button
          onClick={() => toggleSort('price')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-body text-sm font-semibold transition-colors whitespace-nowrap ${
            sortField === 'price'
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'bg-background text-text-muted hover:text-text border border-transparent'
          }`}
        >
          <ArrowUpDown className="w-4 h-4" />
          Price {sortField === 'price' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
        </button>

        {/* Status Dropdown (mobile-friendly alternative) */}
        <div className="relative sm:hidden">
          <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-background rounded-xl font-body text-sm text-text appearance-none cursor-pointer outline-none border border-transparent focus:border-primary/20 transition-colors"
          >
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
            <option value="Coming Soon">Coming Soon</option>
          </select>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          Data Table
         ═══════════════════════════════════════════════ */}
      <div className="bg-surface rounded-2xl border border-gray-100 overflow-hidden">
        {/* ── Desktop / Tablet Table ── */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left font-body text-[11px] font-bold text-text-muted uppercase tracking-wider px-6 py-4 bg-background/40">
                  Vehicle
                </th>
                <th className="text-left font-body text-[11px] font-bold text-text-muted uppercase tracking-wider px-4 py-4 bg-background/40">
                  <button
                    onClick={() => toggleSort('price')}
                    className="flex items-center gap-1 hover:text-text transition-colors"
                  >
                    Price
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left font-body text-[11px] font-bold text-text-muted uppercase tracking-wider px-4 py-4 bg-background/40">
                  Status
                </th>
                <th className="text-left font-body text-[11px] font-bold text-text-muted uppercase tracking-wider px-4 py-4 bg-background/40">
                  Date Added
                </th>
                <th className="text-right font-body text-[11px] font-bold text-text-muted uppercase tracking-wider px-6 py-4 bg-background/40">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center">
                        <Car className="w-7 h-7 text-text-muted/40" />
                      </div>
                      <p className="font-body text-sm font-semibold text-text-muted">
                        No vehicles found
                      </p>
                      <p className="font-body text-xs text-text-muted/60">
                        Try adjusting your search or filter criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((car) => {
                  const cfg = statusConfig[car.status] || statusConfig['Available'];
                  return (
                    <tr
                      key={car.id}
                      className="border-t border-gray-50 hover:bg-background/40 transition-colors group"
                    >
                      {/* Vehicle */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-[72px] h-[48px] rounded-lg overflow-hidden bg-background shrink-0 ring-1 ring-gray-100">
                            <img
                              src={car.image}
                              alt={car.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-body text-sm font-semibold text-text truncate">
                              {car.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-body text-xs text-text-muted">
                                {car.km}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-gray-300" />
                              <span className="font-body text-xs text-text-muted">
                                {car.fuel}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-gray-300" />
                              <span className="font-body text-[11px] text-text-muted/60 font-mono">
                                {car.id}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-4">
                        <span className="font-heading font-bold text-[15px] text-text">
                          {car.price}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-[11px] font-bold ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {car.status}
                        </span>
                      </td>

                      {/* Date Added */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-text-muted/40" />
                          <span className="font-body text-sm text-text-muted">
                            {car.dateAdded}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => navigate(`/admin/edit-car/${car.id}`)}
                            className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(car.id)}
                            className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile Card List ── */}
        <div className="md:hidden divide-y divide-gray-50">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center">
                <Car className="w-7 h-7 text-text-muted/40" />
              </div>
              <p className="font-body text-sm font-semibold text-text-muted">
                No vehicles found
              </p>
            </div>
          ) : (
            paginated.map((car) => {
              const cfg = statusConfig[car.status] || statusConfig['Available'];
              return (
                <div key={car.id} className="p-4 hover:bg-background/40 transition-colors">
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-background shrink-0 ring-1 ring-gray-100">
                      <img
                        src={car.image}
                        alt={car.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-body text-sm font-semibold text-text truncate">
                          {car.title}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-body text-[10px] font-bold ring-1 shrink-0 ${cfg.bg} ${cfg.text} ${cfg.ring}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {car.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-body text-xs text-text-muted">{car.km}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="font-body text-xs text-text-muted">{car.fuel}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="font-heading font-bold text-sm text-text">
                          {car.price}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => navigate(`/admin/edit-car/${car.id}`)}
                            className="p-1.5 text-text-muted hover:text-primary rounded-md transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(car.id)}
                            className="p-1.5 text-text-muted hover:text-red-500 rounded-md transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ═══════════════════════════════════════════════
            Pagination Footer
           ═══════════════════════════════════════════════ */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 gap-4">
            <p className="font-body text-sm text-text-muted">
              Showing{' '}
              <span className="font-semibold text-text">{showingFrom}</span> to{' '}
              <span className="font-semibold text-text">{showingTo}</span> of{' '}
              <span className="font-semibold text-text">{filtered.length}</span>{' '}
              entries
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3.5 py-2 bg-background rounded-lg font-body text-sm font-semibold text-text-muted hover:text-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {/* Page Number Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg font-body text-sm font-bold flex items-center justify-center transition-colors ${
                    page === currentPage
                      ? 'bg-primary text-white shadow-sm shadow-primary/20'
                      : 'bg-background text-text-muted hover:text-text'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3.5 py-2 bg-background rounded-lg font-body text-sm font-semibold text-text-muted hover:text-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
