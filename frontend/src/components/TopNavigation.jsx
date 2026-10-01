import { Link, useLocation } from 'react-router-dom';
import { PhoneCall } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { useCompare } from '../context/CompareContext';
import { useDealershipContact } from '../context/DealershipContactContext';

export default function TopNavigation() {
  const location = useLocation();
  const { compareCars } = useCompare();
  const { telLink, getWhatsAppLink } = useDealershipContact();

  const handleCallClick = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch (_) {}
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Catalog', path: '/inventory' },
    { name: 'Sell Car', path: '/sell-your-car' },
    { name: 'Compare', path: '/compare', badge: compareCars.length > 0 ? compareCars.length : null },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  // Function to check if the current link is the active page
  const isActive = (path) => location.pathname === path;

  return (
    <header
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl shadow-xs border-b border-slate-100 transition-all"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-20">

          {/* Logo / Branding */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group active:scale-98 transition-transform">
            <img
              src="/logo.png"
              alt="Sadguru Car Surat"
              className="h-7 sm:h-8 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-2xs"
            />
            <div className="flex flex-col">
              <span className="font-heading font-bold text-base sm:text-xl text-primary leading-tight tracking-tight">
                Sadguru Car Surat
              </span>
              <span className="font-body text-[9px] sm:text-[10px] text-text-muted font-bold uppercase tracking-widest">
                Surat's Trusted Pre-Owned Cars
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-body text-sm font-bold transition-colors flex items-center gap-1.5 ${isActive(link.path) ? 'text-primary border-b-2 border-primary pb-1' : 'text-text-muted hover:text-primary'
                  }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="px-1.5 py-0.2 rounded-full bg-brand-orange text-white text-[10px] font-black">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Action CTAs (Call & WhatsApp) */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            {/* High-Converting Mobile-First Call CTA */}
            <a
              href={telLink}
              onClick={handleCallClick}
              aria-label="Call Sadguru Car Surat Dealership"
              className="relative group overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-brand-orange hover:brightness-110 active:brightness-95 text-white h-9 md:h-10 px-3 md:px-5 rounded-full font-heading font-bold text-xs md:text-sm flex items-center gap-1.5 md:gap-2 shadow-[0_3px_12px_rgba(245,148,35,0.38)] hover:shadow-[0_4px_16px_rgba(245,148,35,0.5)] active:scale-95 transition-all select-none"
            >
              {/* Phone Icon with ringing animation and live beacon dot */}
              <span className="relative flex items-center justify-center">
                <PhoneCall className="w-4 h-4 md:w-4 md:h-4 stroke-[2.4] animate-phone-ring transition-transform" />
                {/* Micro live beacon dot */}
                <span className="absolute -top-1 -right-1 flex h-2 w-2 pointer-events-none">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 border border-white/60" />
                </span>
              </span>

              <span className="tracking-wide">Call</span>
              <span className="hidden md:inline font-normal opacity-90">Us</span>
            </a>

            {/* Matching WhatsApp CTA */}
            <a
              href={getWhatsAppLink('Hello Sadguru Car Melo, I would like to inquire about certified cars.')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with Sadguru Car Surat on WhatsApp"
              className="h-9 md:h-10 w-9 md:w-auto md:px-4 rounded-full border border-emerald-500/40 bg-emerald-50/80 hover:bg-[#25D366] text-[#25D366] hover:text-white flex items-center justify-center gap-1.5 font-heading font-bold text-xs md:text-sm transition-all shadow-xs hover:shadow-emerald-500/20 active:scale-95 select-none"
            >
              <WhatsAppIcon className="w-4 h-4 md:w-4 md:h-4 fill-current transition-transform group-hover:scale-110" />
              <span className="hidden md:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}