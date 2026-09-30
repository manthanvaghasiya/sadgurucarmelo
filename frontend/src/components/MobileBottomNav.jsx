import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Car, Users, Phone, BadgeDollarSign } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Catalog', path: '/inventory', icon: Car, badge: 'Live' },
  { name: 'Sell Car', path: '/sell-your-car', icon: BadgeDollarSign },
  { name: 'About', path: '/about', icon: Users },
  { name: 'Contact', path: '/contact', icon: Phone },
];

export default function MobileBottomNav() {
  const location = useLocation();

  // Hide on Car Details (it has its own native sticky action bar), admin panel, and login
  if (
    location.pathname.startsWith('/car-details') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/login')
  ) {
    return null;
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className="md:hidden fixed bottom-2.5 inset-x-0 z-[60] flex justify-center pointer-events-none px-3"
      style={{
        paddingBottom: 'max(0.25rem, env(safe-area-inset-bottom, 0px))',
      }}
    >
      <nav
        aria-label="Mobile Bottom App Bar"
        className="pointer-events-auto w-full max-w-[390px] bg-white/92 dark:bg-slate-900/92 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-[0_14px_38px_rgba(15,23,42,0.14)] rounded-[2rem] p-1.5 flex items-center justify-between relative select-none"
      >
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`relative flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 active:scale-90 ${
                active ? 'text-brand-orange' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {/* Active Tab Liquid Pill Background (Flutter/iOS style) */}
              {active && (
                <motion.div
                  layoutId="mobileNavActivePill"
                  className="absolute inset-0 bg-orange-50/90 dark:bg-brand-orange/15 rounded-2xl border border-brand-orange/25 -z-10 shadow-2xs"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              )}

              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    active ? 'scale-110 stroke-[2.4]' : 'stroke-[1.9]'
                  }`}
                />

                {/* Micro live badge */}
                {item.badge && !active && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-emerald-500 text-white text-[7px] font-black uppercase tracking-tight shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] font-heading mt-1 leading-none tracking-tight transition-all duration-200 ${
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
