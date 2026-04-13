import { Link, useNavigate } from 'react-router-dom';
import { Fuel, Settings2, User, Gauge, MessageCircle, Eye } from 'lucide-react';
import { getCarWhatsAppLink } from '../utils/whatsapp';

export default function CarCard({
  id = '1',
  image = 'https://placehold.co/600x400/e2e8f0/64748b?text=Premium+Car',
  title = '2020 Hyundai Creta SX (O)',
  price = '₹12.75 Lakhs',
  badges = ['CERTIFIED', 'VALID VIMO'],
  fuel = 'Diesel',
  transmission = 'Manual',
  owner = '1st Owner',
  kms = '45,000 KM'
}) {
  const navigate = useNavigate();
  const whatsappUrl = getCarWhatsAppLink({ title, price });

  const handleCardClick = () => {
    navigate(`/car-details/${id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-surface rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col h-full cursor-pointer"
    >

      {/* Image Container with Badges */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {badges.map((badge, index) => (
            <span
              key={index}
              className={`text-[10px] font-heading font-extrabold uppercase tracking-widest px-2.5 py-1 rounded shadow-sm ${badge === 'CERTIFIED' ? 'bg-[#10b981] text-white' : 'bg-primary text-white'
                }`}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 sm:p-5 flex flex-col flex-grow">

        {/* Title & Price */}
        <div className="mb-3 sm:mb-4">
          <h3 className="font-heading font-bold text-sm sm:text-lg text-text leading-tight mb-1 line-clamp-1">
            {title}
          </h3>
          <p className="font-heading font-extrabold text-lg sm:text-2xl text-[#10b981] sm:text-accent">
            {price}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-y-2 sm:gap-y-3 gap-x-1 sm:gap-x-2 mb-4 sm:mb-6 font-body text-[10px] sm:text-xs text-text-muted mt-auto">
          <div className="flex items-center gap-1 sm:gap-1.5 bg-gray-50 p-1 sm:p-0 rounded sm:bg-transparent">
            <Fuel className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="font-semibold truncate">{fuel}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 bg-gray-50 p-1 sm:p-0 rounded sm:bg-transparent">
            <Settings2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="font-semibold truncate">{transmission}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 bg-gray-50 p-1 sm:p-0 rounded sm:bg-transparent">
            <Gauge className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="font-semibold truncate">{kms}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 bg-gray-50 p-1 sm:p-0 rounded sm:bg-transparent">
            <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="font-semibold truncate">{owner}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-2 mt-auto pt-3 sm:pt-4 border-t border-gray-100">
          <Link
            to={`/car-details/${id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 sm:py-2.5 rounded-lg border border-primary text-primary font-body font-bold text-[9px] sm:text-xs hover:bg-primary/5 transition-colors"
          >
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" /> View
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 sm:py-2.5 rounded-lg bg-[#25D366] text-white font-body font-bold text-[9px] sm:text-xs hover:bg-[#20bd5a] transition-all shadow-md shadow-green-500/10 active:scale-95 uppercase"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /> WHATSAPP
          </a>
        </div>
      </div>

    </div>
  );
}