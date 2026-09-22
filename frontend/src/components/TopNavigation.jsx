import { Link, useLocation } from 'react-router-dom';
import { Phone, User, MessageCircle, ArrowLeftRight } from 'lucide-react';
import { useCompare } from '../context/CompareContext';

export default function TopNavigation() {
  const location = useLocation();
  const { compareCars } = useCompare();

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
    <header className="sticky top-0 z-50 bg-surface shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-20">

          {/* Logo / Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Sadguru Car Surat"
              className="h-7 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <span className="font-heading font-bold text-xl text-primary leading-tight tracking-tight">Sadguru Car Surat</span>
              <span className="font-body text-[10px] text-text-muted font-bold uppercase tracking-widest">Premium Used Cars</span>
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

          {/* Desktop Call-to-Actions & Compare Access */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Compare Quick Access Link with Live Count */}
            <Link
              to="/compare"
              className={`relative p-2 md:px-3.5 md:py-2 rounded-lg font-body font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                compareCars.length > 0
                  ? 'bg-amber-500/10 text-brand-orange border border-amber-500/30 shadow-sm'
                  : 'text-text-muted hover:text-text border border-gray-100 hover:border-gray-200'
              }`}
              title="Compare Vehicles"
            >
              <ArrowLeftRight className="w-4 h-4 md:w-3.5 md:h-3.5" />
              <span className="hidden lg:inline">Compare</span>
              {compareCars.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-brand-orange text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                  {compareCars.length}
                </span>
              )}
            </Link>

            <a
              href="tel:+919913634447"
              className="bg-accent hover:bg-accent-hover text-white p-2.5 md:px-6 md:py-2.5 rounded-lg md:rounded-lg font-body font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-accent/20 active:scale-95"
            >
              <Phone className="w-5 h-5 md:w-4 md:h-4 fill-current" />
              <span className="hidden md:inline">Call Me</span>
            </a>
            <a
              href="https://wa.me/919913634447"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white p-2 md:px-5 md:py-2.5 rounded-lg font-body font-bold text-sm flex items-center gap-2 transition-colors"
            >
              <MessageCircle className="w-5 h-5 md:w-4 md:h-4" />
              <span className="hidden md:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}