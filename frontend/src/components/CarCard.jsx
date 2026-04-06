import { Link } from 'react-router-dom';
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
  const whatsappUrl = getCarWhatsAppLink({ title, price });
  return (
    <div className="bg-surface rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col h-full">

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
      <div className="p-5 flex flex-col flex-grow">

        {/* Title & Price */}
        <div className="mb-4">
          <h3 className="font-heading font-bold text-lg text-text leading-tight mb-1 line-clamp-1">
            {title}
          </h3>
          <p className="font-heading font-extrabold text-2xl text-accent">
            {price}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-6 font-body text-xs text-text-muted mt-auto">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-primary" />
            <span className="font-semibold">{kms}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="w-4 h-4 text-primary" />
            <span className="font-semibold">{fuel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Settings2 className="w-4 h-4 text-primary" />
            <span className="font-semibold">{transmission}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-primary" />
            <span className="font-semibold">{owner}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
          <Link
            to={`/car-details/${id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-primary text-primary font-body font-bold text-xs hover:bg-primary/5 transition-colors"
          >
            <Eye className="w-4 h-4" /> View
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#25D366] text-white font-body font-bold text-xs hover:bg-[#20bd5a] transition-all shadow-md shadow-green-500/10 active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-current" /> Chat
          </a>
        </div>
      </div>

    </div>
  );
}