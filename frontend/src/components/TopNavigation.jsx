import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle, User } from 'lucide-react';

export default function TopNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

          {/* Desktop Call-to-Actions */}
          <div className="hidden md:flex items-center gap-5">
            <a
              href="tel:+919913634447"
              className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-lg font-body font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-accent/20 active:scale-95"
            >
              <Phone className="w-4 h-4 fill-current" />
              Call Me
            </a>
            <Link
              to="/login"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-5 py-2.5 rounded-lg font-body font-bold text-sm flex items-center gap-2 transition-colors"
            >
              <User className="w-4 h-4" />
              Login
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="md:hidden p-2 text-text hover:bg-background rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-gray-100 py-4 px-4 shadow-xl absolute w-full">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-body text-base font-bold p-3 rounded-lg transition-colors ${isActive(link.path) ? 'bg-primary/5 text-primary' : 'text-text hover:bg-background'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
              <a href="tel:+919913634447" className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white py-3.5 rounded-xl font-body font-bold shadow-md shadow-accent/20 transition-colors">
                <Phone className="w-5 h-5 fill-current" />
                Call Me
              </a>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white py-3.5 rounded-xl font-body font-bold transition-colors"
              >
                <User className="w-5 h-5" /> Login / Portal Access
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}