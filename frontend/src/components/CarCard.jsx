import { Link, useNavigate } from 'react-router-dom';
import { Fuel, Settings2, User, Gauge, Eye, CheckCircle2, ArrowLeftRight, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCarWhatsAppLink } from '../utils/whatsapp';
import { getOptimizedUrl } from '../utils/imageUtils';
import { useCompare } from '../context/CompareContext';
import CarImage from './CarImage';
import WhatsAppIcon from './WhatsAppIcon';

export default function CarCard({
  id = '1',
  image = 'https://placehold.co/600x400/e2e8f0/64748b?text=Premium+Car',
  title = '2020 Hyundai Creta SX (O)',
  price = '₹12.75 Lakhs',
  badges = ['CERTIFIED', 'VALID VIMO'],
  fuel = 'Diesel',
  transmission = 'Manual',
  owner = '1st Owner',
  kms = '45,000 KM',
  isKmGenuine = false,
  status = 'Available'
}) {
  const navigate = useNavigate();
  const { toggleCompare, isInCompare } = useCompare();
  const whatsappUrl = getCarWhatsAppLink({ title, price });
  const isCompared = isInCompare(id);
  const isComingSoon = (status || '').toLowerCase().includes('soon');

  // Permanently remove Peti-pack and normalize badges
  const visibleBadges = (badges || []).filter(
    (b) => typeof b === 'string' && !b.toLowerCase().includes('peti')
  );

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
      className={`car-card-glass rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col h-full cursor-pointer ${isCompared ? 'ring-2 ring-brand-orange shadow-brand-orange/10' : ''
        }`}
    >

      {/* Image Container with Badges */}
      <div className="car-card-image-wrap relative overflow-hidden bg-gray-100">
        <CarImage
          src={image}
          alt={title}
          width={500}
          className="group-hover:scale-105 transition-transform duration-500"
          aspectRatio="aspect-[4/3]"
        />

        {/* Top Badges (Side-by-side horizontal row) */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-row flex-wrap items-center gap-1 sm:gap-1.5 z-10 max-w-[85%] pointer-events-none">
          {isComingSoon && (
            <span className="premium-badge text-[8px] sm:text-[10px] font-heading font-black uppercase tracking-wider px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded shadow-sm bg-gradient-to-r from-brand-orange to-amber-500 text-white flex items-center gap-1 ring-1 ring-white/40">
              ✨ COMING SOON
            </span>
          )}
          {isCompared && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-heading font-black uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-brand-orange text-white shadow-md ring-1 ring-white/50">
              <ArrowLeftRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
              In Compare
            </span>
          )}
          {visibleBadges.map((badge, index) => {
            const isCert = badge.toUpperCase() === 'CERTIFIED';
            return (
              <span
                key={index}
                className={`premium-badge text-[8px] sm:text-[10px] font-heading font-bold uppercase tracking-wider px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded shadow-sm ${
                  isCert ? 'bg-[#10b981] text-white' : 'bg-primary text-white'
                }`}
              >
                {badge}
              </span>
            );
          })}
        </div>

        {/* Top-Right Action Buttons (Desktop Only — On Mobile, positioned right of price) */}
        <div className="absolute top-3 right-3 hidden sm:flex items-center gap-1.5 z-10">
          <button
            onClick={handleDownloadImages}
            className="w-8 h-8 rounded-full bg-white/85 hover:bg-white text-slate-700 hover:text-primary flex items-center justify-center transition-all shadow-md active:scale-95"
            title="ફોટો ડાઉનલોડ કરો · Download Photo"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
          <button
            onClick={handleCompareToggle}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md active:scale-90 ${isCompared
                ? 'bg-brand-orange text-white scale-110 ring-2 ring-white shadow-brand-orange/40'
                : 'bg-white/85 hover:bg-white text-slate-700 hover:text-brand-orange'
              }`}
            title={isCompared ? 'સરખામણીમાંથી દૂર કરો · Remove from Compare' : 'સરખામણીમાં ઉમેરો · Add to Compare'}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-grow">

        {/* Title & Price */}
        <div className="mb-1.5 sm:mb-2.5">
          <h3 className="font-heading font-bold text-xs sm:text-base md:text-lg text-text leading-tight mb-1 line-clamp-1" title={title}>
            {title}
          </h3>
          <div className="flex items-center justify-between gap-1 pt-0.5 min-w-0">
            <p className="car-price-highlight font-heading font-black text-sm sm:text-2xl text-accent transition-all duration-300 truncate">
              {price}
            </p>

            {/* Mobile Action Buttons (Right side of car price) */}
            <div className="flex sm:hidden items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleDownloadImages}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all active:scale-90 border border-slate-200/80 shadow-2xs"
                title="ફોટો ડાઉનલોડ કરો · Download Photo"
                aria-label="Download Photo"
              >
                <Download className="w-3 h-3 stroke-[2.2]" />
              </button>
              <button
                type="button"
                onClick={handleCompareToggle}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all active:scale-90 border shadow-2xs ${
                  isCompared
                    ? 'bg-brand-orange text-white border-brand-orange shadow-brand-orange/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/80'
                }`}
                title={isCompared ? 'સરખામણીમાંથી દૂર કરો · Remove from Compare' : 'સરખામણીમાં ઉમેરો · Add to Compare'}
                aria-label="Add to Compare"
              >
                <ArrowLeftRight className="w-3 h-3 stroke-[2.2]" />
              </button>
            </div>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-y-1 sm:gap-y-2 gap-x-1 sm:gap-x-2 mb-2 sm:mb-3 font-body text-[9px] sm:text-xs text-text-muted mt-auto">
          <div className="car-spec-chip flex items-center gap-1 sm:gap-1.5 bg-gray-50 p-1 sm:p-1.5 rounded-md min-w-0">
            <Fuel className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-primary shrink-0" />
            <span className="font-semibold truncate">{fuel}</span>
          </div>
          <div className="car-spec-chip flex items-center gap-1 sm:gap-1.5 bg-gray-50 p-1 sm:p-1.5 rounded-md min-w-0">
            <Settings2 className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-primary shrink-0" />
            <span className="font-semibold truncate">{transmission}</span>
          </div>
          <div className="car-spec-chip flex items-center gap-1 sm:gap-1.5 bg-gray-50 p-1 sm:p-1.5 rounded-md min-w-0 overflow-hidden">
            <Gauge className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-primary shrink-0" />
            <span className="font-semibold truncate">{kms}</span>
          </div>
          <div className="car-spec-chip flex items-center gap-1 sm:gap-1.5 bg-gray-50 p-1 sm:p-1.5 rounded-md min-w-0">
            <User className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-primary shrink-0" />
            <span className="font-semibold truncate">{owner}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="car-action-row flex items-center gap-1.5 sm:gap-2 mt-auto pt-1.5 sm:pt-2 border-t border-gray-100">
          <Link
            to={`/car-details/${id}`}
            onClick={(e) => e.stopPropagation()}
            className="car-action-btn flex-1 h-8 sm:h-10 px-2 sm:px-3 rounded-lg sm:rounded-xl border border-primary/25 bg-primary/5 hover:bg-primary text-primary hover:text-white font-body font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 transition-all duration-300 shadow-2xs active:scale-95 group/btn whitespace-nowrap min-w-0"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover/btn:scale-110 shrink-0 text-primary group-hover/btn:text-white" />
            <span className="tracking-wide">
              <span className="sm:hidden">View</span>
              <span className="hidden sm:inline">View Details</span>
            </span>
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="car-action-btn h-8 w-8 sm:h-10 sm:w-auto p-0 sm:px-3.5 rounded-lg sm:rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-1.5 font-body font-bold text-xs transition-all duration-300 shadow-sm shadow-green-500/25 active:scale-90 shrink-0"
            title="Chat on WhatsApp"
            aria-label="Chat on WhatsApp"
          >
            <WhatsAppIcon className="w-4 h-4 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden sm:inline tracking-wider font-semibold">WhatsApp</span>
          </a>
        </div>
      </div>

    </div>
  );
}