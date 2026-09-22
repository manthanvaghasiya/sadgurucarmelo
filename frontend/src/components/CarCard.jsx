import { Link, useNavigate } from 'react-router-dom';
import { Fuel, Settings2, User, Gauge, MessageCircle, Eye, CheckCircle2, ArrowLeftRight, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCarWhatsAppLink } from '../utils/whatsapp';
import { getOptimizedUrl } from '../utils/imageUtils';
import { useCompare } from '../context/CompareContext';

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
  isKmGenuine = false
}) {
  const navigate = useNavigate();
  const { toggleCompare, isInCompare } = useCompare();
  const whatsappUrl = getCarWhatsAppLink({ title, price });
  const isCompared = isInCompare(id);

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
      className={`car-card-glass rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col h-full cursor-pointer ${
        isCompared ? 'ring-2 ring-brand-orange shadow-brand-orange/10' : ''
      }`}
    >

      {/* Image Container with Badges */}
      <div className="car-card-image-wrap relative overflow-hidden bg-gray-100">
        <img
          src={getOptimizedUrl(image, 500)}
          alt={title}
          loading="lazy"
          className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isCompared && (
            <span className="inline-flex items-center gap-1 text-[10px] font-heading font-black uppercase tracking-wider px-2.5 py-1 rounded bg-brand-orange text-white shadow-md ring-1 ring-white/50 animate-[fadeScale_150ms_ease-out]">
              <ArrowLeftRight className="w-3 h-3 stroke-[3]" />
              In Compare
            </span>
          )}
          {badges.map((badge, index) => (
            <span
              key={index}
              className={`premium-badge text-[10px] font-heading font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow-sm ${badge === 'CERTIFIED' ? 'bg-[#10b981] text-white' : 'bg-primary text-white'
                }`}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Top-Right Action Buttons (Download + Compare) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={handleDownloadImages}
            className="w-8 h-8 rounded-full bg-white/85 hover:bg-white text-slate-700 hover:text-primary flex items-center justify-center transition-all shadow-md active:scale-95"
            title="ફોટો ડાઉનલોડ કરો · Download Photo"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
          <button
            onClick={handleCompareToggle}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md active:scale-90 ${
              isCompared
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
      <div className="p-3 sm:p-5 flex flex-col flex-grow">

        {/* Title & Price */}
        <div className="mb-3 sm:mb-4">
          <h3 className="font-heading font-bold text-sm sm:text-lg text-text leading-tight mb-1 line-clamp-1">
            {title}
          </h3>
          <p className="car-price-highlight font-heading font-bold text-lg sm:text-2xl text-accent transition-all duration-300">
            {price}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-y-2 sm:gap-y-3 gap-x-1 sm:gap-x-2 mb-4 sm:mb-6 font-body text-[10px] sm:text-xs text-text-muted mt-auto">
          <div className="car-spec-chip flex items-center gap-1 sm:gap-1.5 bg-gray-50 p-1 sm:p-1.5 rounded-md sm:bg-gray-50/80">
            <Fuel className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="font-semibold truncate">{fuel}</span>
          </div>
          <div className="car-spec-chip flex items-center gap-1 sm:gap-1.5 bg-gray-50 p-1 sm:p-1.5 rounded-md sm:bg-gray-50/80">
            <Settings2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="font-semibold truncate">{transmission}</span>
          </div>
          <div className="car-spec-chip flex items-center gap-1 sm:gap-1.5 bg-gray-50 p-1 sm:p-1.5 rounded-md sm:bg-gray-50/80 overflow-hidden">
            <Gauge className="w-3 h-3 sm:w-4 sm:h-4 text-primary shrink-0" />
            <span className="font-semibold truncate">{kms}</span>
          </div>
          <div className="car-spec-chip flex items-center gap-1 sm:gap-1.5 bg-gray-50 p-1 sm:p-1.5 rounded-md sm:bg-gray-50/80">
            <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="font-semibold truncate">{owner}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="car-action-row flex flex-row gap-2 mt-auto pt-3 sm:pt-4 border-t border-gray-100">
          <Link
            to={`/car-details/${id}`}
            onClick={(e) => e.stopPropagation()}
            className="car-action-btn flex-1 flex items-center justify-center gap-1 py-1.5 sm:py-2.5 rounded-lg border border-primary text-primary font-body font-bold text-[9px] sm:text-xs hover:bg-primary hover:text-white transition-all duration-300"
          >
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" /> View
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="car-action-btn flex-1 flex items-center justify-center gap-1 py-1.5 sm:py-2.5 rounded-lg bg-[#25D366] text-white font-body font-bold text-[9px] sm:text-xs hover:bg-[#20bd5a] transition-all shadow-md shadow-green-500/10 active:scale-95 uppercase"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /> WHATSAPP
          </a>
        </div>
      </div>

    </div>
  );
}