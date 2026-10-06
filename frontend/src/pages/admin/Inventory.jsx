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
  Tag,
  RotateCcw,
  Scissors,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

import { useCars } from '../../context/CarContext';
import toast from 'react-hot-toast';

// Status badge style map
const statusConfig = {
  Available: {
    bg: 'bg-[#10b981]/10',
    text: 'text-[#059669]',
    ring: 'ring-[#10b981]/20',
    dot: 'bg-[#10b981]',
  },
  'Coming Soon': {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    ring: 'ring-amber-500/20',
    dot: 'bg-amber-500',
  },
  Draft: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    ring: 'ring-blue-500/20',
    dot: 'bg-blue-500',
  },
  Sold: {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    ring: 'ring-rose-500/20',
    dot: 'bg-rose-500',
  },
};

export default function Inventory() {
  const {
    cars,
    isLoading: carsLoading,
    deleteCar,
    toggleFeatured,
    markCarAsSold,
    revertCarSold,
    purgeCarPhotos,
  } = useCars();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Sold modal states (24-Hour Grace Period)
  const [soldModalTarget, setSoldModalTarget] = useState(null);
  const [purgeImmediately, setPurgeImmediately] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Map backend cars to the local unified format dynamically
  const allCars = useMemo(() => {
    return (cars || [])
      .map((c) => ({
        id: c?._id || c?.id || '',
        registration: c?.registration || 'N/A',
        image: c?.image || 'https://placehold.co/120x80/e2e8f0/64748b?text=Car',
        title: `${c?.make || ''} ${c?.model || ''} (${c?.year || ''})`.trim(),
        make: c?.make || '',
        model: c?.model || '',
        km: `${(c?.kms || 0).toLocaleString('en-IN')} KM`,
        price: (c?.price || 0) >= 100000 ? `₹${((c?.price || 0) / 100000).toFixed(2)} Lakhs` : `₹${(c?.price || 0).toLocaleString('en-IN')}`,
        priceRaw: c?.price || 0,
        status: c?.status || 'Available',
        soldAt: c?.soldAt || null,
        photosPurged: Boolean(c?.photosPurged),
        photosPurgedAt: c?.photosPurgedAt || null,
        imagesCount: Array.isArray(c?.images) ? c.images.length : (c?.image ? 1 : 0),
        isFeaturedOnHome: c?.isFeaturedOnHome || false,
        dateAdded: new Date(c?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' }),
        fuel: c?.fuelType || 'Unknown',
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

  // Reset filters change
  const handleSearch = (v) => {
    setSearchQuery(v);
  };
  const handleStatusFilter = (v) => {
    setStatusFilter(v);
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
    const c = { All: allCars.length, Available: 0, Sold: 0, 'Coming Soon': 0, Draft: 0 };
    allCars.forEach((car) => {
      if (c[car.status] !== undefined) c[car.status]++;
    });
    return c;
  }, [allCars]);

  // ── 24-Hour Grace Period Actions ──
  const handleConfirmMarkSold = async () => {
    if (!soldModalTarget) return;
    setActionLoadingId(soldModalTarget.id);
    try {
      await markCarAsSold(soldModalTarget.id, { purgeImmediately });
      toast.success(
        purgeImmediately
          ? `"${soldModalTarget.title}" marked as Sold. Extra photos purged from storage!`
          : `"${soldModalTarget.title}" marked as Sold! 24-hour safety grace period has started.`
      );
      setSoldModalTarget(null);
      setPurgeImmediately(false);
    } catch (err) {
      toast.error('Failed to mark car as sold: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRevertSold = async (car) => {
    setActionLoadingId(car.id);
    try {
      await revertCarSold(car.id);
      toast.success(
        car.photosPurged
          ? `"${car.title}" restored to Available. (Note: Extra photos were already purged)`
          : `"${car.title}" restored to Available with all photos intact!`
      );
    } catch (err) {
      toast.error('Failed to undo sold status: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePurgeNow = async (car) => {
    if (!window.confirm(`Permanently purge extra photos for "${car.title}" from cloud storage now? Only the 1st primary photo will be kept.`)) {
      return;
    }
    setActionLoadingId(car.id);
    try {
      await purgeCarPhotos(car.id);
      toast.success(`Extra photos permanently deleted for "${car.title}". Primary photo kept.`);
    } catch (err) {
      toast.error('Failed to purge extra photos: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoadingId(null);
    }
  };

  // Calculate remaining grace period hours helper
  const getRemainingGraceHours = (soldAt) => {
    if (!soldAt) return 24;
    const elapsedMs = Date.now() - new Date(soldAt).getTime();
    const elapsedHrs = elapsedMs / (1000 * 60 * 60);
    return Math.max(0, Math.ceil(24 - elapsedHrs));
  };

  // ── Loading State ──
  if (carsLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="font-body text-sm text-text-muted">Loading inventory...</p>
        </div>
      </div>
    );
  }

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
                  This action permanently removes the vehicle from the database.
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
          Mark as Sold Confirmation Modal (24-Hour Grace Period)
         ═══════════════════════════════════════════════ */}
      {soldModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={() => {
              if (!actionLoadingId) {
                setSoldModalTarget(null);
                setPurgeImmediately(false);
              }
            }}
          />
          <div className="relative bg-surface rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md p-6 space-y-5 animate-[fadeScale_200ms_ease-out] z-10">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shrink-0 ring-4 ring-rose-500/10">
                <Tag className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-text">
                  Mark as Sold · વેચાઈ ગઈ છે
                </h3>
                <p className="font-body text-xs text-text-muted mt-0.5">
                  Confirm sale status and initiate 24-hour safety timer
                </p>
              </div>
            </div>

            {/* Car Preview Card */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-background border border-gray-100">
              <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={soldModalTarget.image}
                  alt={soldModalTarget.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-heading font-bold text-sm text-text truncate">
                  {soldModalTarget.title}
                </h4>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-text-muted">
                  <span className="font-bold text-primary">{soldModalTarget.price}</span>
                  <span>•</span>
                  <span>{soldModalTarget.registration}</span>
                </div>
              </div>
            </div>

            {/* 24-Hour Grace Period Explainer Banner */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-800 font-heading font-bold text-xs uppercase tracking-wide">
                <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>24-Hour Safety Grace Period</span>
              </div>
              <ul className="space-y-1.5 font-body text-xs text-amber-900/90 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>
                    The vehicle will instantly display as <strong>SOLD OUT</strong> on your website.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>
                    All 9–10 gallery photos remain safe in storage for <strong>24 hours</strong>. If the deal falls through, click <strong>Undo Sold</strong> to restore everything.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>
                    After 24 hours, extra photos will be automatically purged to save cloud storage space, keeping <strong>1 permanent cover photo</strong> for showroom records.
                  </span>
                </li>
              </ul>
            </div>

            {/* Purge Immediately Checkbox */}
            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/70 transition-colors">
              <input
                type="checkbox"
                checked={purgeImmediately}
                onChange={(e) => setPurgeImmediately(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-rose-600 rounded border-gray-300 focus:ring-rose-500"
              />
              <div className="text-xs">
                <span className="font-bold text-text block">
                  Purge extra photos immediately
                </span>
                <span className="text-text-muted">
                  Skip the 24-hour grace period and delete extra photos from cloud storage right now. (Only 1 primary photo will be kept).
                </span>
              </div>
            </label>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 justify-end pt-2">
              <button
                type="button"
                disabled={Boolean(actionLoadingId)}
                onClick={() => {
                  setSoldModalTarget(null);
                  setPurgeImmediately(false);
                }}
                className="px-4 py-2.5 bg-background rounded-xl font-body text-sm font-semibold text-text-muted hover:text-text transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={Boolean(actionLoadingId)}
                onClick={handleConfirmMarkSold}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-body text-sm font-bold transition-all shadow-md shadow-rose-600/20 active:scale-95 disabled:opacity-50"
              >
                {actionLoadingId ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Tag className="w-4 h-4" />
                    <span>Confirm Sold</span>
                  </>
                )}
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
            Manage showroom listings, prices, and mark cars as sold with a 24-hour safety grace period.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            to="/admin/add-car"
            className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl font-body text-sm font-bold transition-colors shadow-lg shadow-accent/20 shrink-0"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Add New Car
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          Status Filter Tabs (Edge-to-Edge Touch Scrolling on Mobile)
         ═══════════════════════════════════════════════ */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          { label: 'All Cars', value: 'All', count: counts.All },
          { label: 'Available', value: 'Available', count: counts.Available },
          { label: 'Sold', value: 'Sold', count: counts.Sold },
          { label: 'Coming Soon', value: 'Coming Soon', count: counts['Coming Soon'] },
          { label: 'Drafts', value: 'Draft', count: counts.Draft },
        ].map((tab) => {
          const isActive = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => handleStatusFilter(tab.value)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-body text-sm font-semibold transition-all shrink-0 min-h-[40px] active:scale-95 ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/10 ring-1 ring-primary'
                  : 'bg-surface hover:bg-background text-text-muted hover:text-text border border-gray-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-background text-text-muted'
                }`}
              >
                {tab.count || 0}
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

        <button
          onClick={() => toggleSort('price')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-body text-sm font-semibold transition-colors whitespace-nowrap ${sortField === 'price'
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'bg-background text-text-muted hover:text-text border border-transparent'
            }`}
        >
          <ArrowUpDown className="w-4 h-4" />
          Price {sortField === 'price' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
        </button>
      </div>

      {/* ═══════════════════════════════════════════════
          Data Table
         ═══════════════════════════════════════════════ */}
      <div className="bg-surface rounded-2xl border border-gray-100 overflow-hidden">
        {/* ── Desktop / Tablet Table ── */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left font-body text-[11px] font-bold text-text-muted uppercase tracking-wider px-6 py-4 bg-background/40">
                  Vehicle
                </th>
                <th className="text-left font-body text-[11px] font-bold text-text-muted uppercase tracking-wider px-4 py-4 bg-background/40">
                  Status & Grace Period
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
                  Show on Home
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
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
                filtered.map((car) => {
                  const cfg = statusConfig[car.status] || statusConfig['Available'];
                  const isSold = car.status === 'Sold';
                  const remainingGrace = isSold ? getRemainingGraceHours(car.soldAt) : 0;

                  return (
                    <tr
                      key={car.id}
                      className="border-t border-gray-50 hover:bg-background/40 transition-colors group"
                    >
                      {/* Vehicle */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-[72px] h-[48px] rounded-lg overflow-hidden bg-background shrink-0 ring-1 ring-gray-100 relative">
                            <img
                              src={car.image}
                              alt={car.title}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                            {isSold && (
                              <div className="absolute inset-0 bg-rose-950/40 backdrop-blur-[1px] flex items-center justify-center">
                                <span className="text-[9px] font-heading font-black text-white bg-rose-600 px-1 py-0.2 rounded uppercase tracking-wider">
                                  SOLD
                                </span>
                              </div>
                            )}
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
                                {car.registration}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status & Grace Period */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {car.status}
                          </span>

                          {isSold && (
                            car.photosPurged ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full ring-1 ring-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                1 Photo Kept
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full ring-1 ring-amber-500/20" title="Extra photos will be auto-purged in 24 hours">
                                <Clock className="w-3 h-3 text-amber-500 animate-pulse" />
                                {remainingGrace > 0 ? `${remainingGrace}h grace left` : 'Pending purge'}
                              </span>
                            )
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-4">
                        <span className="font-heading font-bold text-[15px] text-text">
                          {car.price}
                        </span>
                      </td>

                      {/* Show on Home Page Toggle */}
                      <td className="px-4 py-4">
                        <button
                          disabled={isSold}
                          onClick={async () => {
                            if (isSold) {
                              toast.error('Sold vehicles cannot be featured on the Home Page.');
                              return;
                            }
                            try {
                              await toggleFeatured(car.id);
                              toast.success(`Vehicle ${car.isFeaturedOnHome ? 'removed from' : 'added to'} Home Page`);
                            } catch (err) {
                              toast.error('Failed to update featured status');
                            }
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                            isSold ? 'opacity-40 cursor-not-allowed bg-gray-200' : (car.isFeaturedOnHome ? 'bg-primary' : 'bg-gray-200')
                          }`}
                          title={isSold ? 'Sold cars cannot be featured' : 'Toggle Home Page feature'}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${car.isFeaturedOnHome && !isSold ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
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
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Sold Workflow Actions */}
                          {!isSold ? (
                            <button
                              onClick={() => {
                                setSoldModalTarget(car);
                                setPurgeImmediately(false);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-body text-xs font-bold transition-colors shadow-2xs active:scale-95"
                              title="Mark this car as Sold with 24h grace period"
                            >
                              <Tag className="w-3.5 h-3.5" />
                              <span>Mark Sold</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-1">
                              {/* Undo Sold */}
                              <button
                                onClick={() => handleRevertSold(car)}
                                disabled={actionLoadingId === car.id}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg font-body text-xs font-bold transition-colors shadow-2xs active:scale-95 disabled:opacity-50"
                                title="Undo Sold and restore to Available"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Undo</span>
                              </button>

                              {/* Manual Purge Now (if photos not already purged) */}
                              {!car.photosPurged && (
                                <button
                                  onClick={() => handlePurgeNow(car)}
                                  disabled={actionLoadingId === car.id}
                                  className="inline-flex items-center gap-1 px-2 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-body text-xs font-bold transition-colors shadow-2xs active:scale-95 disabled:opacity-50"
                                  title="Purge 9-10 extra photos immediately to save cloud storage"
                                >
                                  <Scissors className="w-3.5 h-3.5" />
                                  <span className="hidden xl:inline">Purge</span>
                                </button>
                              )}
                            </div>
                          )}

                          {/* Standard Edit & Delete */}
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
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center">
                <Car className="w-7 h-7 text-text-muted/40" />
              </div>
              <p className="font-body text-sm font-semibold text-text-muted">
                No vehicles found
              </p>
            </div>
          ) : (
            filtered.map((car) => {
              const cfg = statusConfig[car.status] || statusConfig['Available'];
              const isSold = car.status === 'Sold';
              const remainingGrace = isSold ? getRemainingGraceHours(car.soldAt) : 0;

              return (
                <div key={car.id} className="p-4 hover:bg-background/40 transition-colors">
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-background shrink-0 ring-1 ring-gray-100 relative">
                      <img
                        src={car.image}
                        alt={car.title}
                        className="w-full h-full object-contain"
                      />
                      {isSold && (
                        <div className="absolute inset-0 bg-rose-950/40 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="text-[8px] font-heading font-black text-white bg-rose-600 px-1 py-0.2 rounded uppercase">
                            SOLD
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-body text-sm font-semibold text-text truncate">
                          {car.title}
                        </p>
                        <button
                          disabled={isSold}
                          onClick={async () => {
                            if (isSold) {
                              toast.error('Sold vehicles cannot be featured');
                              return;
                            }
                            try {
                              await toggleFeatured(car.id);
                            } catch (err) {
                              toast.error('Failed to update');
                            }
                          }}
                          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                            isSold ? 'opacity-40 cursor-not-allowed bg-gray-200' : (car.isFeaturedOnHome ? 'bg-primary' : 'bg-gray-200')
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${car.isFeaturedOnHome && !isSold ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-body text-xs text-text-muted">{car.km}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="font-body text-xs text-text-muted">{car.fuel}</span>
                      </div>

                      {/* Status + Price */}
                      <div className="flex items-center justify-between mt-2 flex-wrap gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-sm text-text">
                            {car.price}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {car.status}
                          </span>
                        </div>

                        {/* Grace Period Timer on Mobile */}
                        {isSold && (
                          car.photosPurged ? (
                            <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> 1 Photo
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-amber-700 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-500 animate-pulse" /> {remainingGrace}h grace
                            </span>
                          )
                        )}
                      </div>

                      {/* Action Bar on Mobile */}
                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100 flex-wrap gap-2">
                        {/* Sold Workflow Actions */}
                        {!isSold ? (
                          <button
                            onClick={() => {
                              setSoldModalTarget(car);
                              setPurgeImmediately(false);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-colors active:scale-95"
                          >
                            <Tag className="w-3.5 h-3.5" />
                            <span>Mark Sold</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleRevertSold(car)}
                              disabled={actionLoadingId === car.id}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-bold transition-colors active:scale-95 disabled:opacity-50"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Undo</span>
                            </button>
                            {!car.photosPurged && (
                              <button
                                onClick={() => handlePurgeNow(car)}
                                disabled={actionLoadingId === car.id}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-bold transition-colors active:scale-95 disabled:opacity-50"
                              >
                                <Scissors className="w-3 h-3" />
                                <span>Purge</span>
                              </button>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-1 ml-auto">
                          <button
                            onClick={() => navigate(`/admin/edit-car/${car.id}`)}
                            className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-colors active:scale-90"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(car.id)}
                            className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors active:scale-90"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
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

      </div>
    </div>
  );
}
