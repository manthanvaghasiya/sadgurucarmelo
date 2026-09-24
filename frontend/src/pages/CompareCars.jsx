import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowLeftRight,
  X,
  Plus,
  Check,
  Fuel,
  Settings2,
  User,
  Gauge,
  Calendar,
  IndianRupee,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Eye,
  Layers
} from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useCars } from '../context/CarContext';
import { getOptimizedUrl } from '../utils/imageUtils';
import WhatsAppIcon from '../components/WhatsAppIcon';

export default function CompareCars() {
  const { compareCars, removeFromCompare, addToCompare, clearCompare } = useCompare();
  const { cars } = useCars();
  const [selectorSlot, setSelectorSlot] = useState(null); // index of slot opening modal
  const [searchTerm, setSearchTerm] = useState('');
  const [fuelFilter, setFuelFilter] = useState('All');
  const [highlightDiff, setHighlightDiff] = useState(false);

  // Allow comparing both Available and Coming Soon vehicles
  const availableCars = (cars || []).filter(
    (c) =>
      c.status !== 'Sold' &&
      c.status !== 'Draft' &&
      !compareCars.some((comp) => String(comp._id || comp.id) === String(c._id || c.id))
  );

  const filteredSelectable = availableCars.filter((c) => {
    if (fuelFilter !== 'All' && c.fuelType?.toLowerCase() !== fuelFilter.toLowerCase()) {
      return false;
    }
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.make?.toLowerCase().includes(q) ||
      c.model?.toLowerCase().includes(q) ||
      c.year?.toString().includes(q) ||
      c.fuelType?.toLowerCase().includes(q)
    );
  });

  const formatRupee = (num) => {
    if (!num || isNaN(num)) return '₹0';
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lakhs`;
    return `₹${Number(num).toLocaleString('en-IN')}`;
  };

  const calculateQuickEmi = (price) => {
    if (!price) return '₹0';
    const P = price * 0.8; // 20% down
    const r = 10.5 / 12 / 100;
    const n = 60; // 5 years
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return `₹${Math.round(emi).toLocaleString('en-IN')}/mo`;
  };

  const comparisonRows = [
    {
      category: 'મૂળભૂત માહિતી · Core Specs',
      items: [
        { label: 'કિંમત (Price)', key: 'price', render: (c) => <strong className="text-accent text-lg font-heading">{formatRupee(c.price)}</strong> },
        { label: 'અંદાજિત EMI (Est. EMI)', key: 'emi', render: (c) => <span className="font-bold text-slate-900">{calculateQuickEmi(c.price)}</span> },
        { label: 'મોડેલ વર્ષ (Year)', key: 'year', render: (c) => <span>{c.year || c.manufacturingYear || 'N/A'}</span> },
        { label: 'કિલોમીટર (KM Driven)', key: 'kms', render: (c) => (
          <span className="flex items-center gap-1 justify-center sm:justify-start">
            {c.kms ? `${c.kms.toLocaleString('en-IN')} KM` : 'N/A'}
            {c.isKmGenuine && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                Genuine
              </span>
            )}
          </span>
        )},
        { label: 'ઇંધણ પ્રકાર (Fuel)', key: 'fuelType', render: (c) => <span>{c.fuelType || 'N/A'}</span> },
        { label: 'ટ્રાન્સમિશન (Transmission)', key: 'transmission', render: (c) => <span>{c.transmission || 'N/A'}</span> },
        { label: 'માલિક (Owner)', key: 'owner', render: (c) => <span>{c.owner || '1st Owner'}</span> },
        { label: 'બોડી ટાઈપ (Body Type)', key: 'bodyType', render: (c) => <span>{c.bodyType || 'Car'}</span> },
        { label: 'રંગ (Color)', key: 'color', render: (c) => <span>{c.color || 'N/A'}</span> },
        { label: 'સ્થિતિ (Status)', key: 'status', render: (c) => (
          <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
            c.status === 'Coming Soon'
              ? 'bg-amber-100 text-amber-800 border border-amber-200'
              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
          }`}>
            {c.status === 'Coming Soon' ? 'જલ્દી આવી રહી છે · Coming Soon' : 'હાજર સ્ટોક · In Stock'}
          </span>
        )},
      ],
    },
    {
      category: 'એન્જિન અને પર્ફોર્મન્સ · Engine & Performance',
      items: [
        { label: 'ડિસ્પ્લેસમેન્ટ (Displacement)', key: 'displacement', render: (c) => <span>{c.displacement || 'N/A'}</span> },
        { label: 'મેક્સ પાવર (Max Power)', key: 'maxPower', render: (c) => <span>{c.maxPower || 'N/A'}</span> },
        { label: 'ડ્રાઈવ પ્રકાર (Drive Type)', key: 'driveType', render: (c) => <span>{c.driveType || 'FWD'}</span> },
        { label: 'સિલિન્ડર (Cylinders)', key: 'cylinders', render: (c) => <span>{c.cylinders || 'N/A'}</span> },
      ],
    },
    {
      category: 'આરામ અને સુવિધા · Comfort & Features',
      items: [
        { label: 'એર કન્ડિશનર (AC)', key: 'airConditioner', render: (c) => (
          <span>{c.airConditioner || 'ઉપલબ્ધ (Yes)'}</span>
        )},
        { label: 'પાવર વિન્ડો (Power Windows)', key: 'powerWindows', render: (c) => (
          <span>{c.powerWindows || 'Front & Rear'}</span>
        )},
        { label: 'સનરૂફ (Sunroof)', key: 'sunroof', render: (c) => (
          c.sunroof ? <span className="text-emerald-600 font-bold">✓ {c.sunroof}</span> : <span className="text-slate-400">✗ ઉપલબ્ધ નથી</span>
        )},
        { label: 'પાર્કિંગ સેન્સર (Parking Sensors)', key: 'parkingSensors', render: (c) => (
          c.parkingSensors ? <span className="text-emerald-600 font-bold">✓ {c.parkingSensors}</span> : <span className="text-slate-400">N/A</span>
        )},
        { label: '360° સ્પીન વ્યુઅર (360 Spin View)', key: 'spinImages', render: (c) => (
          (c.spinImages || []).length > 0 ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange bg-brand-orange/10 px-2 py-1 rounded-md">
              <Sparkles className="w-3.5 h-3.5" /> 360° Spin ઉપલબ્ધ
            </span>
          ) : (
            <span className="text-slate-400 text-xs">ફોટો ગેલેરી</span>
          )
        )},
      ],
    },
  ];

  // Helper to check if values differ between compared cars for a given key
  const hasRowDifference = (item) => {
    if (compareCars.length < 2) return false;
    const values = compareCars.map((c) => {
      const v = c[item.key];
      return v !== undefined && v !== null ? String(v).trim().toLowerCase() : '';
    });
    return values.some((val) => val !== values[0]);
  };

  const emptySlotsCount = Math.max(0, 3 - compareCars.length);

  // Generate comparison summary for WhatsApp
  const generateWhatsAppComparisonMessage = () => {
    const carNames = compareCars.map((c) => `${c.make} ${c.model} (${c.year || ''}) - ${formatRupee(c.price)}`).join(' vs ');
    return encodeURIComponent(
      `Hello Sadguru Car Melo, I am comparing these cars on your website:\n${carNames}\n\nPlease guide me on which one is the best choice and share your best deal.`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-8 md:py-16 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>કારની સરખામણી · Compare Used Cars in Surat | Sadguru Car Melo</title>
        <meta
          name="description"
          content="Compare certified pre-owned cars side by side at Sadguru Car Melo, Surat. Compare prices, EMI, specs, features, and mileage."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider mb-3">
              <ArrowLeftRight className="w-3.5 h-3.5" />
              વિગતવાર સરખામણી · Side-by-Side Comparison
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight">
              કારની સરખામણી <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">· Compare Cars</span>
            </h1>
            <p className="text-slate-600 font-body text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              તમારી પસંદગીની ૨ થી ૩ ગાડીઓની કિંમત, EMI, એન્જિન ક્ષમતા અને સુવિધાઓની સાથે સરખામણી કરી શ્રેષ્ઠ નિર્ણય લો.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            {compareCars.length >= 2 && (
              <button
                onClick={() => setHighlightDiff(!highlightDiff)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
                  highlightDiff
                    ? 'bg-amber-500 text-white border-amber-500 shadow-amber-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-amber-400 hover:bg-amber-50/50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{highlightDiff ? '✓ તફાવત હાઇલાઇટ છે · Highlighting Differences' : 'તફાવત હાઇલાઇટ કરો · Highlight Differences'}</span>
              </button>
            )}

            {compareCars.length > 0 && (
              <button
                onClick={clearCompare}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 text-xs font-bold transition-all"
              >
                બધું સાફ કરો (Clear All)
              </button>
            )}
          </div>
        </div>

        {compareCars.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-slate-100 shadow-sm max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-amber-50 text-brand-orange flex items-center justify-center mx-auto mb-6">
              <ArrowLeftRight className="w-10 h-10" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading mb-3">
              સરખામણી માટે કોઈ કાર પસંદ કરેલ નથી
            </h2>
            <p className="text-slate-600 font-body text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed">
              અમારી ઇન્વેન્ટરીમાંથી કોઈપણ ૨ અથવા ૩ ગાડીઓ પસંદ કરો અને તેમની વિશેષતાઓ એકબીજા સાથે સરખાવો.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setSelectorSlot(0)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500 text-slate-950 font-heading font-black text-sm shadow-lg shadow-brand-orange/20 hover:scale-[1.02] transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>અહીંથી કાર પસંદ કરો · Select Cars to Compare</span>
              </button>
              <Link
                to="/inventory"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-heading font-bold text-sm transition-all"
              >
                <span>બધી કાર જુઓ · Browse Inventory</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Comparison Table */
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Top Car Cards Row */}
            <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {compareCars.map((car) => {
                  const carId = car._id || car.id;
                  const img = car.image || (car.images && car.images[0]) || '';
                  return (
                    <div
                      key={carId}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between relative group hover:border-brand-orange/40 transition-colors"
                    >
                      {/* Delete Button */}
                      <button
                        onClick={() => removeFromCompare(carId)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-red-600 hover:text-white text-slate-400 shadow-sm border border-slate-200 flex items-center justify-center transition-all z-10"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div>
                        {/* Car Image */}
                        <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 mb-3 relative">
                          <img
                            src={getOptimizedUrl(img, 600)}
                            alt={car.model}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {car.status === 'Coming Soon' && (
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow">
                              Coming Soon
                            </div>
                          )}
                        </div>

                        {/* Car Info */}
                        <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider block">
                          {car.make}
                        </span>
                        <h3 className="font-heading font-bold text-lg text-slate-900 leading-snug mb-1 truncate">
                          {car.model} {car.year ? `(${car.year})` : ''}
                        </h3>
                        <p className="font-heading font-black text-xl text-accent mb-4">
                          {formatRupee(car.price)}
                        </p>
                      </div>

                      {/* Action Links */}
                      <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100">
                        <Link
                          to={`/car-details/${carId}`}
                          className="flex-1 py-2 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs text-center transition-colors truncate"
                        >
                          <span className="sm:hidden">Details</span>
                          <span className="hidden sm:inline">વિગત જુઓ · Details</span>
                        </Link>
                        <a
                          href={`https://wa.me/919913634447?text=${encodeURIComponent(
                            `Hello Sadguru Car Melo, I am comparing ${car.make} ${car.model} (${car.year}). Please share best offer.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 sm:w-auto sm:px-3 py-2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors shrink-0"
                          title="WhatsApp"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  );
                })}

                {/* Empty Slots to Add Cars */}
                {Array.from({ length: emptySlotsCount }).map((_, slotIdx) => (
                  <div
                    key={`slot-${slotIdx}`}
                    onClick={() => setSelectorSlot(slotIdx)}
                    className="rounded-2xl border-2 border-dashed border-slate-200 hover:border-brand-orange bg-slate-50/50 hover:bg-brand-orange/5 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[280px] group"
                  >
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 text-brand-orange flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6" />
                    </div>
                    <p className="font-heading font-bold text-slate-800 text-sm mb-1">
                      બીજી કાર ઉમેરો · Add Car
                    </p>
                    <p className="text-slate-500 text-xs">
                      સરખામણી માટે ઇન્વેન્ટરીમાંથી પસંદ કરો
                    </p>
                  </div>
                ))}
              </div>

              {/* Compare WhatsApp Helper Banner */}
              {compareCars.length >= 2 && (
                <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <WhatsAppIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-slate-900 text-sm">
                        ગાડી પસંદ કરવામાં મુશ્કેલી છે? સદ્ગુરુ કાર એક્સપર્ટની સલાહ લો!
                      </p>
                      <p className="text-xs text-slate-500">
                        Ask our experts on WhatsApp to help you pick the best car out of these {compareCars.length} models.
                      </p>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/919913634447?text=${generateWhatsAppComparisonMessage()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-bold text-xs flex items-center gap-2 shadow-sm shrink-0 active:scale-95 transition-all"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>એક્સપર્ટની સલાહ લો · Consult Expert</span>
                  </a>
                </div>
              )}
            </div>

            {/* Spec Comparison Rows */}
            <div className="divide-y divide-slate-100">
              {comparisonRows.map((cat, catIdx) => (
                <div key={catIdx} className="p-6 sm:p-8">
                  <h3 className="font-heading font-bold text-base text-brand-orange uppercase tracking-wider mb-4 pb-2 border-b border-amber-500/20">
                    {cat.category}
                  </h3>

                  <div className="space-y-2">
                    {cat.items.map((item, itemIdx) => {
                      const differs = highlightDiff && hasRowDifference(item);
                      return (
                        <div
                          key={itemIdx}
                          className={`grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-6 py-2.5 px-3 rounded-xl border-b border-slate-50 items-center text-sm transition-colors ${
                            differs
                              ? 'bg-amber-500/10 border-l-4 border-l-brand-orange text-slate-900 font-medium'
                              : 'hover:bg-slate-50/50'
                          }`}
                        >
                          {/* Row Label */}
                          <div className="font-semibold text-slate-600 text-xs sm:text-sm flex items-center gap-2">
                            <span>{item.label}</span>
                            {differs && (
                              <span className="text-[10px] bg-brand-orange text-white px-1.5 py-0.5 rounded font-black tracking-wider uppercase">
                                Diff
                              </span>
                            )}
                          </div>

                          {/* Car 1, 2, 3 values */}
                          {compareCars.map((car) => {
                            const carId = car._id || car.id;
                            return (
                              <div
                                key={carId}
                                className="font-medium text-slate-800 text-xs sm:text-sm"
                              >
                                {item.render(car)}
                              </div>
                            );
                          })}

                          {/* Empty placeholders */}
                          {Array.from({ length: emptySlotsCount }).map((_, i) => (
                            <div key={`empty-val-${i}`} className="text-slate-300 text-xs hidden md:block">
                              —
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Select Car to Add */}
      {selectorSlot !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectorSlot(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-xl text-slate-900">
                  સરખામણી માટે કાર પસંદ કરો
                </h3>
                <p className="text-xs text-slate-500">Select a vehicle from available stock to compare</p>
              </div>
              <button
                onClick={() => setSelectorSlot(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Tabs & Search Input */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 space-y-3">
              <input
                type="text"
                placeholder="શોધો · Search by make, model, year (e.g. Swift, Creta, Safari)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
              />

              {/* Fuel Quick Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {['All', 'Petrol', 'Diesel', 'CNG', 'Electric'].map((fuel) => (
                  <button
                    key={fuel}
                    type="button"
                    onClick={() => setFuelFilter(fuel)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
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

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredSelectable.length === 0 ? (
                <p className="text-center text-slate-500 py-8 text-sm">કોઈ કાર મળી નથી · No cars available matching your criteria</p>
              ) : (
                filteredSelectable.map((c) => {
                  const cId = c._id || c.id;
                  const img = c.image || (c.images && c.images[0]) || '';
                  return (
                    <div
                      key={cId}
                      onClick={() => {
                        addToCompare(c);
                        setSelectorSlot(null);
                      }}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-brand-orange hover:bg-brand-orange/5 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          <img
                            src={getOptimizedUrl(img, 200)}
                            alt={c.model}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          {c.status === 'Coming Soon' && (
                            <div className="absolute inset-x-0 bottom-0 bg-amber-500 text-white text-[8px] font-black text-center uppercase">
                              Soon
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-heading font-bold text-slate-900 text-sm">
                              {c.make} {c.model} ({c.year || c.manufacturingYear})
                            </p>
                            {c.status === 'Coming Soon' && (
                              <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                                Coming Soon
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            {c.fuelType} · {c.transmission} · {c.kms?.toLocaleString('en-IN')} KM
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-heading font-black text-accent text-sm block">
                          {formatRupee(c.price)}
                        </span>
                        <span className="text-[10px] font-bold text-brand-orange group-hover:underline">
                          + Add
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
