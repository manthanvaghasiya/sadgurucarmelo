import {
  MapPin, Mail, Phone,
  ChevronRight, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] text-gray-400 pt-20 pb-10 border-t border-white/5 selection:bg-primary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* 1. Brand Identity */}
          <div className="space-y-6">
            <Link to="/" className="inline-block group">
              <h2 className="font-heading font-black text-2xl tracking-tighter text-white group-hover:text-accent transition-colors duration-500">
                SADGURU <span className="text-accent group-hover:text-white">CAR MELO</span>
              </h2>
              <div className="h-0.5 w-0 group-hover:w-full bg-accent transition-all duration-500 mt-1 shadow-[0_0_8px_rgba(37,211,102,0.4)]"></div>
            </Link>
            <p className="font-body text-sm leading-relaxed pr-4">
              Elevating Surat's pre-owned car experience since 2012.
              We deal in certified luxury and premium vehicles with 100% transparency.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-accent shadow-inner">
                Certified Dealer
              </div>
            </div>
          </div>

          {/* 2. Quick Navigation */}
          <div className="space-y-7">
            <h3 className="font-heading font-bold text-[11px] text-white uppercase tracking-[0.2em] opacity-50">
              Quick Navigation
            </h3>
            <ul className="space-y-4 font-body text-sm">
              {[
                { name: 'Browse Inventory', path: '/inventory' },
                { name: 'About Our Mission', path: '/about' },
                { name: 'Core Services', path: '/about?service=buy' },
                { name: 'Contact Support', path: '/contact' },
                { name: 'Staff Login', path: '/login' }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-3 hover:text-white transition-all group w-fit"
                  >
                    <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-300">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Get in Touch */}
          <div className="space-y-7">
            <h3 className="font-heading font-bold text-[11px] text-white uppercase tracking-[0.2em] opacity-50">
              Visit Our Lot
            </h3>
            <div className="space-y-6 font-body text-[13px]">
              {/* Address */}
              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-500 shadow-xl group-hover:shadow-accent/20">
                  <MapPin className="w-5 h-5 text-white group-hover:text-black transition-colors duration-300" />
                </div>
                <p className="leading-[1.6] text-gray-400 group-hover:text-white transition-colors pt-1">
                  Trilok Car Bazar, Simada Canal Rd,<br />
                  Canal Chokdi, Varachha, Surat
                </p>
              </div>

              {/* Phone */}
              <a href="tel:+919913634447" className="flex items-center gap-4 group">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-500 shadow-xl group-hover:shadow-accent/20">
                  <Phone className="w-5 h-5 text-white group-hover:text-black transition-colors duration-300" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5 group-hover:text-accent transition-colors">Call Sales</span>
                  <span className="font-heading font-bold text-lg text-white group-hover:text-accent transition-colors">
                    +91 99136 34447
                  </span>
                </div>
              </a>

              {/* Email */}
              <a href="mailto:info@sadgurucarmelo.com" className="flex items-center gap-4 group">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-500 shadow-xl group-hover:shadow-accent/20">
                  <Mail className="w-5 h-5 text-white group-hover:text-black transition-colors duration-300" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5 group-hover:text-accent transition-colors">Email Us</span>
                  <span className="text-gray-400 group-hover:text-white transition-colors">info@sadgurucarmelo.com</span>
                </div>
              </a>
            </div>
          </div>

          {/* 4. Social Connect */}
          <div className="space-y-7">
            <h3 className="font-heading font-bold text-[11px] text-white uppercase tracking-[0.2em] opacity-50">
              Social Presence
            </h3>
            <div className="flex flex-col gap-4">

              {/* Instagram Card */}
              <a
                href="https://instagram.com/sadgurucarmelo"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.05] hover:bg-white/[0.08] hover:border-pink-500/40 transition-all duration-500"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-0.5 opacity-60">Instagram</p>
                    <p className="text-[12px] font-heading font-bold text-white group-hover:text-primary transition-colors leading-none">@sadgurucarmelo</p>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-pink-400 transition-all" />
              </a>

              {/* Facebook Card */}
              <a
                href="https://facebook.com/sadgurucarmelo"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.05] hover:bg-white/[0.08] hover:border-blue-500/40 transition-all duration-500"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.324V1.325C24 .597 23.403 0 22.675 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-0.5 opacity-60">Facebook</p>
                    <p className="text-[12px] font-heading font-bold text-white group-hover:text-primary transition-colors leading-none">sadgurucarmelo</p>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-blue-400 transition-all" />
              </a>

              {/* YouTube Card */}
              <a
                href="https://youtube.com/@sadgurucarmelo"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.05] hover:bg-white/[0.08] hover:border-red-500/40 transition-all duration-500"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/20">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-0.5 opacity-60">YouTube</p>
                    <p className="text-[12px] font-heading font-bold text-white group-hover:text-primary transition-colors leading-none">@sadgurucarmelo</p>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-red-400 transition-all" />
              </a>

            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 text-[11px] font-heading font-bold uppercase tracking-widest text-gray-600 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <p>© {currentYear} Sadguru Car Melo. All rights reserved.</p>
          </div>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
