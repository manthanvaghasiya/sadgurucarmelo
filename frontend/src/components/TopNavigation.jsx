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
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group active:scale-98 transition-transform shrink-0">
            <img
              src="/logo.png"
              alt="Sadguru Car Surat"
              className="h-7 sm:h-8 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-2xs shrink-0"
            />
            <div className="flex flex-col">
              <span className="font-heading font-bold text-sm sm:text-xl text-primary leading-tight tracking-tight whitespace-nowrap">
                Sadguru Car Surat
              </span>
              <span className="font-body text-[8.5px] sm:text-[10px] text-text-muted font-bold uppercase tracking-widest whitespace-nowrap">
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
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Clean Mobile Call Button */}
            <a
              href={telLink}
              onClick={handleCallClick}
              aria-label="Call Sadguru Car Surat Dealership"
              className="w-9 h-9 md:w-auto md:px-5 md:py-2.5 rounded-full md:rounded-xl bg-brand-orange hover:bg-orange-600 text-white flex items-center justify-center gap-2 font-heading font-bold text-sm shadow-md shadow-brand-orange/25 active:scale-90 transition-all select-none"
            >
              <PhoneCall className="w-4 h-4 stroke-[2.3]" />
              <span className="hidden md:inline">Call Us</span>
            </a>

            {/* Clean Mobile WhatsApp Button */}
            <a
              href={getWhatsAppLink('Hello Sadguru Car Melo, I would like to inquire about certified cars.')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with Sadguru Car Surat on WhatsApp"
              className="w-9 h-9 md:w-auto md:px-5 md:py-2.5 rounded-full md:rounded-xl border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center gap-2 font-heading font-bold text-sm active:scale-90 transition-all select-none"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span className="hidden md:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}