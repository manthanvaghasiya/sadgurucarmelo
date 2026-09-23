import { Link, useNavigate } from 'react-router-dom';
import { Fuel, Settings2, User, Gauge, MessageCircle, Eye, CheckCircle2, ArrowLeftRight, Download, Sparkles, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCarWhatsAppLink } from '../utils/whatsapp';
import { getOptimizedUrl } from '../utils/imageUtils';
import { useCompare } from '../context/CompareContext';

export default function CarCard({
  id = '1',
  image = 'https://placehold.co/600x400/e2e8f0/64748b?text=Premium+Car',
  title = '2020 Hyundai Creta SX (O)',
  price = '₹12.75 Lakhs',
  rawPrice = null,
  badges = ['CERTIFIED'],
  fuel = 'Diesel',
  transmission = 'Manual',
  owner = '1st Owner',
  kms = '45,000 KM',
  isKmGenuine = false,
  make = '',
  model = '',
  year = '',
  location = 'Surat',
  comingSoon = false,
  car = null
}) {
  const navigate = useNavigate();
  const { toggleCompare, isInCompare } = useCompare();
  const whatsappUrl = getCarWhatsAppLink({ title, price });
  const isCompared = isInCompare(id);

  // Calculate monthly EMI estimate (80% loan principal, 10.5% rate, 5-year tenure)
  const calculateEmi = () => {
    let num = rawPrice || (car && car.price);
    if (!num && typeof price === 'string') {
      const lakhMatch = price.match(/([\d.]+)\s*lakh/i);
      if (lakhMatch) {
        num = parseFloat(lakhMatch[1]) * 100000;
      } else {
        const clean = price.replace(/[^0-9]/g, '');
        if (clean) num = parseInt(clean, 10);
      }
    }
    if (!num || num < 50000) return null;
    const principal = num * 0.8;
    const rate = 10.5 / (12 * 100);
    const tenure = 60;
    const emi = Math.round((principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1));
    return emi ? `₹${emi.toLocaleString('en-IN')}` : null;
  };

  const monthlyEmi = calculateEmi();

  const handleCardClick = () => {
    navigate(`/car-details/${id}`);
  };

  const handleDownloadImages = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!image) {
      toast.error('No image available');
      return;
    }

    toast.success('ફોટો ડાઉનલોડ થઈ રહ્યો છે... / Downloading photo...', { duration: 3000 });

    try {
      const response = await fetch(getOptimizedUrl(image, 1200));
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${title.replace(/[^a-zA-Z0-9]/g, '-')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      const link = document.createElement('a');
      link.href = getOptimizedUrl(image, 1200);
      link.download = `${title.replace(/[^a-zA-Z0-9]/g, '-')}.jpg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCompareToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare({
      id,
      _id: id,
      image,
      model: title,
      price,
      fuelType: fuel,
      transmission,
      owner,
      kms,
      isKmGenuine,
    });
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_18px_36px_rgba(0,0,0,0.09)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full cursor-pointer overflow-hidden ${
        isCompared ? 'ring-2 ring-brand-orange shadow-brand-orange/15' : ''
      }`}
    >
      {/* ── Image Showcase Area (Clean, natural aspect like old design) ── */}
      <div className="car-card-image-wrap relative overflow-hidden bg-slate-100 flex items-center justify-center">
        <img
          src={getOptimizedUrl(image, 600)}
          alt={title}
          loading="lazy"
          className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top-Left Status Pill */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {comingSoon || (car && car.status === 'Coming Soon') ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-heading font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500 text-white shadow-md">
              <Sparkles className="w-3 h-3" />
              Coming Soon
            </span>
          ) : isCompared ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-heading font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-orange text-white shadow-md">
              <ArrowLeftRight className="w-3 h-3 stroke-[2.5]" />
              In Compare
            </span>
          ) : isKmGenuine ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-md">
              <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
              100% Genuine KM
            </span>
          ) : (
            badges && badges.length > 0 ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white border border-white/10 shadow-sm">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                {badges[0]}
              </span>
            ) : null
          )}
        </div>

        {/* Top-Right Frosted Action Buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={handleDownloadImages}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-primary flex items-center justify-center transition-all shadow-md active:scale-95 border border-white/60"
            title="ફોટો ડાઉનલોડ કરો · Download Photo"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>
          <button
            onClick={handleCompareToggle}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md active:scale-90 border ${
              isCompared
                ? 'bg-brand-orange text-white border-brand-orange scale-105 shadow-brand-orange/30'
                : 'bg-white/90 hover:bg-white text-slate-700 hover:text-brand-orange border-white/60'
            }`}
            title={isCompared ? 'સરખામણીમાંથી દૂર કરો · Remove from Compare' : 'સરખામણીમાં ઉમેરો · Add to Compare'}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* ── Content & Spec Body ── */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Title */}
          <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 group-hover:text-primary transition-colors line-clamp-1 mb-2">
            {title}
          </h3>

          {/* Pricing Row: Price + Est. EMI Badge */}
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3.5">
            <span className="font-heading font-extrabold text-xl sm:text-2xl text-accent tracking-tight">
              {price}
            </span>
            {monthlyEmi && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-brand-orange border border-orange-200/70 tracking-tight">
                Est. {monthlyEmi}/mo*
              </span>
            )}
          </div>

          {/* Core Specs Grid: 4 Clean Chips */}
          <div className="grid grid-cols-2 gap-2 mb-4 font-body text-xs text-slate-600">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100/90 px-2.5 py-1.5 rounded-xl">
              <Fuel className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="font-semibold truncate">{fuel}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100/90 px-2.5 py-1.5 rounded-xl">
              <Settings2 className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="font-semibold truncate">{transmission}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100/90 px-2.5 py-1.5 rounded-xl overflow-hidden">
              <Gauge className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="font-semibold truncate">{kms}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100/90 px-2.5 py-1.5 rounded-xl">
              <User className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="font-semibold truncate">{owner || '1st Owner'}</span>
            </div>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mt-auto">
          <Link
            to={`/car-details/${id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-heading font-bold text-xs hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-200 shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>ગાડી જુઓ · View</span>
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#25D366] text-white font-heading font-bold text-xs hover:bg-[#20bd5a] transition-all duration-200 shadow-md shadow-emerald-500/15 active:scale-95 uppercase"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>WHATSAPP</span>
          </a>
        </div>
      </div>
    </div>
  );
}
