import { MessageCircle } from 'lucide-react';
import { getGeneralWhatsAppLink } from '../utils/whatsapp';

export default function FloatingWhatsApp() {
  return (
    <a
      href={getGeneralWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-28 md:bottom-6 right-6 z-[9999] group flex flex-col items-center"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative">
        {/* Pulsing hidden ring for visual attraction */}
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
        
        {/* Main Floating Button */}
        <div className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-2xl shadow-green-500/40 transition-all duration-300 transform group-hover:scale-110 group-hover:-translate-y-1">
          <MessageCircle className="w-7 h-7 md:w-9 md:h-9 fill-current" />
        </div>
      </div>
      
      {/* Tooltip on Hover */}
      <span className="absolute right-full mr-4 bg-white text-text-muted font-body font-bold text-xs px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-gray-100 top-1/2 -translate-y-1/2">
        Chat with us
      </span>
    </a>
  );
}
