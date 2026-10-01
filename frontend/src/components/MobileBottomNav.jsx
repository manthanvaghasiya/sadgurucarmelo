import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Car, BadgeDollarSign, ArrowLeftRight, Users, Phone } from 'lucide-react';
import { useCompare } from '../context/CompareContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { compareCars = [] } = useCompare();

  // Hide on Car Details (it has its own native sticky action bar), admin panel, and login
  if (
    location.pathname.startsWith('/car-details') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/login')
  ) {
    return null;
  }

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Catalog', path: '/inventory', icon: Car },
    { name: 'Sell Car', path: '/sell-your-car', icon: BadgeDollarSign },
    {
      name: 'Compare',
      path: '/compare',
      icon: ArrowLeftRight,
      badge: compareCars.length > 0 ? compareCars.length : null,
    },
    { name: 'About Us', path: '/about', icon: Users },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleTabClick = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch (_) {}
    }
  };

  return (
    <div
      className="md:hidden fixed bottom-2 inset-x-0 z-[60] flex justify-center pointer-events-none px-2"
      style={{
        paddingBottom: 'max(0.2rem, env(safe-area-inset-bottom, 0px))',
      }}
    >
      <nav
        aria-label="Mobile Bottom App Bar"
        className="pointer-events-auto w-full max-w-[430px] bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-[0_12px_36px_rgba(15,23,42,0.12)] rounded-[1.75rem] p-1 flex items-center justify-between relative select-none"
      >
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={handleTabClick}
              className={`relative flex-1 flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all duration-200 active:scale-90 ${
                active ? 'text-brand-orange' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {/* Active Tab Liquid Pill Background (iOS/Flutter style) */}
              {active && (
                <motion.div
                  layoutId="mobileNavActivePill"
                  className="absolute inset-0 bg-orange-50/90 rounded-xl border border-brand-orange/25 -z-10 shadow-2xs"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}

              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-[18px] h-[18px] transition-transform duration-200 ${
                    active ? 'scale-110 stroke-[2.3]' : 'stroke-[1.8]'
                  }`}
                />

                {/* Micro live / count badge */}
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 px-1 min-w-[14px] h-[14px] rounded-full bg-brand-orange text-white text-[8px] font-black flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[9px] font-heading mt-0.5 leading-tight tracking-tight transition-all duration-200 truncate max-w-full ${
                  active ? 'font-black text-brand-orange scale-105' : 'font-semibold text-slate-500'
                }`}
              >
                {item.name}
              </span>

              {/* Micro active dot */}
              {active && (
                <span className="w-1 h-1 rounded-full bg-brand-orange mt-0.5 shadow-xs" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
