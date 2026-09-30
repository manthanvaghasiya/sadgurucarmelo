/**
 * @file frontend/src/pages/CompareCars.jsx
 * @description Master composition root for the Compare Cars route, assembling
 * the Comparison Hero, Trending Matchups, Smart Buyer's Guide, Interactive Matrix Table,
 * Live Inventory Quick-Add Deck, and Expert Consultation CTA.
 */

import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCompare } from '../context/CompareContext';
import { useCars } from '../context/CarContext';
import CompareHero from '../components/compare/CompareHero';
import ComparePopularMatchups from '../components/compare/ComparePopularMatchups';
import CompareMatrixTable from '../components/compare/CompareMatrixTable';
import CompareQuickAddDeck from '../components/compare/CompareQuickAddDeck';
import CompareCarSelectModal from '../components/compare/CompareCarSelectModal';
import CompareExpertCta from '../components/compare/CompareExpertCta';
import toast from 'react-hot-toast';

const SEO_CONFIG = {
  title: 'કારની સ્માર્ટ સરખામણી · Compare Used Cars in Surat | Sadguru Car Melo',
  description:
    'Compare certified pre-owned cars side by side at Sadguru Car Melo, Surat. Compare prices, EMI, specs, features, mileage, and condition.',
  ogTitle: 'Compare Used Cars Side-by-Side in Surat | Sadguru Car Melo',
  ogDescription:
    'Smart automotive comparison: specs, fair valuation, genuine KM, and ownership costs side by side.',
};

export default function CompareCars() {
  const { compareCars, removeFromCompare, addToCompare, clearCompare } = useCompare();
  const { cars } = useCars();
  const matrixRef = useRef(null);

  const [selectorSlot, setSelectorSlot] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [fuelFilter, setFuelFilter] = useState('All');
  const [highlightDiff, setHighlightDiff] = useState(false);

  // Available selectable cars
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
    const P = price * 0.8;
    const r = 10.5 / 12 / 100;
    const n = 60;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return `₹${Math.round(emi).toLocaleString('en-IN')}/mo`;
  };

  const comparisonRows = [
    {
      category: 'મૂળભૂત માહિતી · Core Specs',
      items: [
        {
          label: 'કિંમત (Price)',
          key: 'price',
          render: (c) => <strong className="text-brand-orange text-lg font-heading font-black">{formatRupee(c.price)}</strong>,
        },
        {
          label: 'અંદાજિત EMI (Est. EMI)',
          key: 'emi',
          render: (c) => <span className="font-bold text-slate-900 font-heading">{calculateQuickEmi(c.price)}</span>,
        },
        {
          label: 'મોડેલ વર્ષ (Year)',
          key: 'year',
          render: (c) => <span>{c.year || c.manufacturingYear || 'N/A'}</span>,
        },
        {
          label: 'કિલોમીટર (KM Driven)',
          key: 'kms',
          render: (c) => (
            <span className="flex items-center gap-1">
              {c.kms ? `${c.kms.toLocaleString('en-IN')} KM` : 'N/A'}
              {c.isKmGenuine && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                  Genuine
                </span>
              )}
            </span>
          ),
        },
        {
          label: 'ઇંધણ પ્રકાર (Fuel)',
          key: 'fuelType',
          render: (c) => <span>{c.fuelType || 'N/A'}</span>,
        },
        {
          label: 'ટ્રાન્સમિશન (Transmission)',
          key: 'transmission',
          render: (c) => <span>{c.transmission || 'N/A'}</span>,
        },
        {
          label: 'માલિક (Owner)',
          key: 'owner',
          render: (c) => <span>{c.owner || '1st Owner'}</span>,
        },
        {
          label: 'બોડી ટાઈપ (Body Type)',
          key: 'bodyType',
          render: (c) => <span>{c.bodyType || 'Car'}</span>,
        },
        {
          label: 'રંગ (Color)',
          key: 'color',
          render: (c) => <span>{c.color || 'N/A'}</span>,
        },
        {
          label: 'સ્થિતિ (Status)',
          key: 'status',
          render: (c) => (
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-heading font-bold ${
                c.status === 'Coming Soon'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {c.status === 'Coming Soon' ? 'જલ્દી આવી રહી છે' : 'હાજર સ્ટોક · In Stock'}
            </span>
          ),
        },
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
        { label: 'એર કન્ડિશનર (AC)', key: 'airConditioner', render: (c) => <span>{c.airConditioner || 'ઉપલબ્ધ (Yes)'}</span> },
        { label: 'પાવર વિન્ડો (Power Windows)', key: 'powerWindows', render: (c) => <span>{c.powerWindows || 'Front & Rear'}</span> },
        {
          label: 'સનરૂફ (Sunroof)',
          key: 'sunroof',
          render: (c) =>
            c.sunroof ? (
              <span className="text-emerald-600 font-bold">✓ {c.sunroof}</span>
            ) : (
              <span className="text-slate-400">✗ ઉપલબ્ધ નથી</span>
            ),
        },
        {
          label: 'પાર્કિંગ સેન્સર (Parking Sensors)',
          key: 'parkingSensors',
          render: (c) =>
            c.parkingSensors ? (
              <span className="text-emerald-600 font-bold">✓ {c.parkingSensors}</span>
            ) : (
              <span className="text-slate-400">N/A</span>
            ),
        },
      ],
    },
  ];

  const hasRowDifference = (item) => {
    if (compareCars.length < 2) return false;
    const values = compareCars.map((c) => {
      const v = c[item.key];
      return v !== undefined && v !== null ? String(v).trim().toLowerCase() : '';
    });
    return values.some((val) => val !== values[0]);
  };

  const emptySlotsCount = Math.max(0, 3 - compareCars.length);

  const generateWhatsAppMessage = () => {
    const carNames = compareCars
      .map((c) => `${c.make} ${c.model} (${c.year || ''}) - ${formatRupee(c.price)}`)
      .join(' vs ');
    return encodeURIComponent(
      `નમસ્તે સદગુરુ કાર મેળો, હું તમારી વેબસાઇટ પર આ ગાડીઓ સરખાવી રહ્યો છું:\n${carNames}\n\nકૃપા કરીને મને યોગ્ય સલાહ અને શ્રેષ્ઠ ડીલ આપો.`
    );
  };

  const handleSelectMatchup = (matchup) => {
    // Try to find matching inventory vehicles
    const car1 = (cars || []).find(
      (c) =>
        c.status !== 'Sold' &&
        (c.model?.toLowerCase().includes(matchup.car1Query.toLowerCase()) ||
          c.make?.toLowerCase().includes(matchup.car1Query.toLowerCase()))
    );
    const car2 = (cars || []).find(
      (c) =>
        c.status !== 'Sold' &&
        (c.model?.toLowerCase().includes(matchup.car2Query.toLowerCase()) ||
          c.make?.toLowerCase().includes(matchup.car2Query.toLowerCase()))
    );

    if (car1 || car2) {
      if (car1) addToCompare(car1);
      if (car2) addToCompare(car2);
      toast.success(`${matchup.title} સરખામણીમાં ઉમેરાઈ ગઈ છે!`);
      if (matrixRef.current) {
        matrixRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Open selector with prefilled search
      setSearchTerm(matchup.car1Query);
      setSelectorSlot(0);
      toast('ઇન્વેન્ટરીમાંથી ગાડી પસંદ કરો');
    }
  };

  return (
    <div className="flex flex-col flex-grow min-h-screen bg-[#FDFCFB] text-slate-800 font-body selection:bg-brand-orange selection:text-white">
      {/* Route SEO & OpenGraph Metadata */}
      <Helmet>
        <title>{SEO_CONFIG.title}</title>
        <meta name="description" content={SEO_CONFIG.description} />
        <meta property="og:title" content={SEO_CONFIG.ogTitle} />
        <meta property="og:description" content={SEO_CONFIG.ogDescription} />
      </Helmet>

      {/* 1. Comparison Hero with Quick Value Badges & Actions */}
      <CompareHero
        compareCount={compareCars.length}
        highlightDiff={highlightDiff}
        onToggleHighlight={() => setHighlightDiff(!highlightDiff)}
        onClearCompare={clearCompare}
        onOpenSelector={(slot) => setSelectorSlot(slot)}
      />

      {/* 2. Top Trending Pre-Curated Matchups in Surat (Commented out per client request) */}
      {/* <ComparePopularMatchups onSelectMatchup={handleSelectMatchup} /> */}

      {/* 3. Live Comparison Matrix Section */}
      <section
        ref={matrixRef}
        id="compare-matrix-section"
        className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100 relative"
      >
        <div className="max-w-7xl mx-auto">
          {compareCars.length > 0 ? (
            <CompareMatrixTable
              compareCars={compareCars}
              emptySlotsCount={emptySlotsCount}
              comparisonRows={comparisonRows}
              highlightDiff={highlightDiff}
              hasRowDifference={hasRowDifference}
              formatRupee={formatRupee}
              onRemoveFromCompare={removeFromCompare}
              onOpenSelector={(slot) => setSelectorSlot(slot)}
              whatsappMessage={generateWhatsAppMessage()}
            />
          ) : (
            /* Helpful State with Quick Add Callout */
            <div className="bg-[#F8FAFC] rounded-[32px] p-8 sm:p-12 text-center border border-slate-200/90 shadow-xs max-w-2xl mx-auto mb-8">
              <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mx-auto mb-4">
                <span className="font-heading font-black text-2xl">VS</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading mb-2">
                કોઈપણ 2 અથવા 3 કાર પસંદ કરો
              </h3>
              <p className="text-slate-600 font-body text-xs sm:text-sm mb-6 leading-relaxed">
                નીચે આપેલી લાઇવ ઇન્વેન્ટરીમાંથી સીધા '+ સરખામણીમાં ઉમેરો' બટન પર ક્લિક કરો અથવા શોધો.
              </p>
              <button
                type="button"
                onClick={() => setSelectorSlot(0)}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-950 hover:bg-brand-orange text-white font-heading font-black text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>શોરૂમમાંથી કાર શોધો · Select from Inventory</span>
              </button>
            </div>
          )}

          {/* Quick-Add Showroom Shelf */}
          {compareCars.length < 3 && (
            <CompareQuickAddDeck
              availableCars={availableCars}
              compareCars={compareCars}
              onAddToCompare={addToCompare}
              formatRupee={formatRupee}
            />
          )}
        </div>
      </section>

      {/* 4. Expert Consultation Banner */}
      <CompareExpertCta />

      {/* Selection Modal */}
      <CompareCarSelectModal
        isOpen={selectorSlot !== null}
        onClose={() => setSelectorSlot(null)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        fuelFilter={fuelFilter}
        setFuelFilter={setFuelFilter}
        filteredCars={filteredSelectable}
        onSelectCar={(car) => {
          addToCompare(car);
          setSelectorSlot(null);
        }}
        formatRupee={formatRupee}
      />
    </div>
  );
}
