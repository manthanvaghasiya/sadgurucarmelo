import { Link, useLocation } from 'react-router-dom';
import { Phone, User, MessageCircle } from 'lucide-react';

export default function TopNavigation() {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Catalog', path: '/inventory' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  // Function to check if the current link is the active page
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-surface shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo / Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-heading font-black text-xl text-white shadow-md group-hover:bg-primary-hover transition-colors">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-xl text-primary leading-tight tracking-tight">Sadguru Car Melo</span>
              <span className="font-body text-[10px] text-text-muted font-bold uppercase tracking-widest">Premium Used Cars</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-body text-sm font-bold transition-colors ${isActive(link.path) ? 'text-primary border-b-2 border-primary pb-1' : 'text-text-muted hover:text-primary'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Call-to-Actions (Now partially visible on Mobile) */}
          <div className="flex items-center gap-2 md:gap-5">
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