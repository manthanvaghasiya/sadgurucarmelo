import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Car, Info, Phone } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Catalog', path: '/inventory', icon: Car },
  { name: 'About', path: '/about', icon: Info },
  { name: 'Contact', path: '/contact', icon: Phone },
];

export default function MobileBottomNav() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-sm">
      <div className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2.5rem] p-2 flex items-center justify-around relative">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className="relative flex flex-col items-center justify-center w-16 h-14 group"
            >
              {/* Active Indicator Background */}
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-7 w-14 h-14 bg-white rounded-full shadow-[0_10px_20px_rgba(245,148,35,0.3)] flex items-center justify-center border-4 border-slate-50"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                >
                  <div className="w-full h-full rounded-full bg-brand-orange/5 flex items-center justify-center text-brand-orange">
                    <item.icon className="w-6 h-6 stroke-[2.5]" />
                  </div>
                </motion.div>
              )}

              {/* Icon (for non-active tabs) */}
              {!active && (
                <item.icon
                  className="w-5 h-5 text-slate-400 group-hover:text-brand-orange transition-colors duration-300"
                />
              )}

              {/* Label */}
              <span
                className={`text-[10px] font-bold mt-1 tracking-wider uppercase transition-colors duration-300 ${
                  active ? 'text-brand-orange mt-7' : 'text-slate-400'
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
