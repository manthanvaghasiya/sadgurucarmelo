import React from 'react';
import { Home, Search, Heart, User, MapPin, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function MobileNavigation() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Top Navbar - Mobile Only */}
            <nav className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-sm border-b border-slate-100 px-4 flex items-center justify-between z-[60]">
                {/* Left Side: Brand Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <img
                      src="/logo.png"
                      alt="Sadguru Car Melo"
                      className="h-11 w-auto object-contain"
                    />
                    <div className="flex flex-col">
                        <span className="text-brand-dark font-black text-base leading-none tracking-tight">SADGURU</span>
                        <span className="text-brand-dark font-medium text-[10px] leading-none tracking-wide mt-0.5">CAR MELO</span>
                    </div>
                </Link>

                {/* Right Side: Location & Menu */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="w-4 h-4 text-brand-orange" />
                        <span className="text-sm font-medium">Surat</span>
                    </div>
                    <button className="p-1 text-brand-dark">
                        <Menu className="w-7 h-7" />
                    </button>
                </div>
            </nav>

            {/* Bottom Tab Bar - Mobile Only */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 flex items-center justify-around z-[60] pb-safe">
                <TabItem
                    to="/"
                    icon={<Home className="w-6 h-6" />}
                    label="Home"
                    active={isActive('/')}
                />
                <TabItem
                    to="/inventory"
                    icon={<Search className="w-6 h-6" />}
                    label="Search"
                    active={isActive('/inventory')}
                />
                <TabItem
                    to="/wishlist"
                    icon={<Heart className="w-6 h-6" />}
                    label="Wishlist"
                    active={isActive('/wishlist')}
                />
                <TabItem
                    to="/profile"
                    icon={<User className="w-6 h-6" />}
                    label="Profile"
                    active={isActive('/profile')}
                />
            </div>

            {/* Spacer for fixed bars to keep main content visible */}
            <div className="md:hidden h-16" /> {/* Top Spacer */}
        </>
    );
}

function TabItem({ to, icon, label, active }) {
    return (
        <Link
            to={to}
            className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-brand-orange font-bold' : 'text-slate-400'
                }`}
        >
            <div className="flex flex-col items-center gap-1">
                {icon}
                <span className="text-[10px] font-semibold">{label}</span>
            </div>
        </Link>
    );
}
