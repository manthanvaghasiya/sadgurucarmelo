import { Link, useLocation } from 'react-router-dom';
import { Phone } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { useCompare } from '../context/CompareContext';
import { useDealershipContact } from '../context/DealershipContactContext';

export default function TopNavigation() {
  const location = useLocation();
  const { compareCars } = useCompare();
  const { telLink, getWhatsAppLink } = useDealershipContact();

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

          {/* Desktop Call-to-Actions */}
          <div className="flex items-center gap-2 md:gap-4">

            <a
              href={telLink}
              className="bg-accent hover:bg-accent-hover text-white p-2.5 md:px-6 md:py-2.5 rounded-lg md:rounded-lg font-body font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-accent/20 active:scale-95"
            >
              <Phone className="w-5 h-5 md:w-4 md:h-4 fill-current" />
              <span className="hidden md:inline">Call Me</span>
            </a>
            <a
              href={getWhatsAppLink('Hello Sadguru Car Melo, I would like to inquire about certified cars.')}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white p-2 md:px-5 md:py-2.5 rounded-lg font-body font-bold text-sm flex items-center gap-2 transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5 md:w-4 md:h-4" />
              <span className="hidden md:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}