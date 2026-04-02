import { MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-gray-300 pt-16 pb-8 border-t-4 border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          <div className="space-y-4">
            <h2 className="font-heading font-extrabold text-2xl tracking-tighter text-white">
              SADGURU CAR MELO
            </h2>
            <p className="font-body text-sm text-gray-400 leading-relaxed">
              Surat's premium destination for high-quality, pre-owned cars.
              We offer certified vehicles with complete peace of mind since 2012.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary transition-colors">
                <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.324V1.325C24 .597 23.403 0 22.675 0z" /></svg>
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary transition-colors">
                <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary transition-colors">
                <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
              </a>
            </div>

          </div>

          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg text-white">Explore</h3>
            <ul className="space-y-3 font-body text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">Latest Inventory</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Sell Your Car</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Car Finance Options</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Certified Programs</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg text-white">Visit Our Showroom</h3>
            <ul className="space-y-4 font-body text-sm">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                <span>10 & 11, Shri Balaji Plaza, Adajan Gam, Surat, Gujarat 395009</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <span>contact@sadgurucarmelo.com</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg text-white">Location Map</h3>
            <div className="w-full h-32 bg-gray-800 rounded-xl overflow-hidden relative">
              <img
                src="https://placehold.co/400x300/333333/666666?text=Map+Placeholder"
                alt="Showroom Map Location"
                className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-800 text-sm font-body text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Sadguru Car Melo. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
