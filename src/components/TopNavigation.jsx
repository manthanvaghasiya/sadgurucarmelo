import { Phone, MessageCircle } from 'lucide-react';

export default function TopNavigation() {
  return (
    <nav className="bg-surface border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <a href="#" className="font-heading font-extrabold text-2xl tracking-tighter text-primary">
              SADGURU CAR MELO
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-primary font-medium border-b-2 border-primary pb-1 text-sm font-body">Home</a>
            <a href="#" className="text-text hover:text-primary transition-colors text-sm font-body">Our Inventory</a>
            <a href="#" className="text-text hover:text-primary transition-colors text-sm font-body">Services</a>
            <a href="#" className="text-text hover:text-primary transition-colors text-sm font-body">About Us</a>
            <a href="#" className="text-text hover:text-primary transition-colors text-sm font-body">Contact</a>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase">Call Us Now</span>
              <a href="tel:+919876543210" className="flex items-center gap-1.5 text-primary font-heading font-semibold text-lg hover:underline">
                <Phone className="w-4 h-4 fill-primary" />
                +91 98765 43210
              </a>
            </div>
            <button className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-lg shadow-sm font-body font-medium transition-colors">
              <MessageCircle className="w-5 h-5 fill-current" />
              <span className="hidden sm:inline">WhatsApp Us</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
