import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BadgeDollarSign, Compass, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  // Hide on Car Details (it has its own native sticky action bar) and login page
  if (
    location.pathname.startsWith('/car-details') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/login')
  ) {
    return null;
  }

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Sell Car', path: '/sell-your-car', icon: BadgeDollarSign, badge: 'Free' },
    { name: 'Track Deal', path: '/inventory', icon: Compass, badge: 'Cars' },
    { name: user ? 'Admin' : 'Profile', path: user ? '/admin' : '/login', icon: User },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleTabClick = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch (_) {}
    }
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
        className="pointer-events-auto w-full max-w-[390px] bg-white/92 backdrop-blur-2xl border border-slate-200/80 shadow-[0_14px_38px_rgba(15,23,42,0.14)] rounded-[2rem] p-1.5 flex items-center justify-between relative select-none"
      >
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={handleTabClick}
              className={`relative flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 active:scale-90 ${
                active ? 'text-brand-orange' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {/* Active Tab Liquid Pill Background (iOS/Flutter style) */}
              {active && (
                <motion.div
                  layoutId="mobileNavActivePill"
                  className="absolute inset-0 bg-orange-50/90 rounded-2xl border border-brand-orange/25 -z-10 shadow-2xs"
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
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-brand-orange text-white text-[7px] font-black uppercase tracking-tight shadow-xs">
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
