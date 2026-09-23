import React from 'react';

/**
 * High-definition vector automotive brand logos.
 * Supports:
 * - 'inline': Horizontal vector icon for sidebar filters, brand lists, and badges
 * - 'badge': Branded header badge for vehicle detail pages
 * - 'pin': Frosted circular stamp
 */
export default function BrandLogo({ make = '', className = '', variant = 'inline' }) {
  const brand = (make || '').toLowerCase().trim();

  // Helper to render brand SVG
  const renderSvg = () => {
    // 1. MARUTI SUZUKI / SUZUKI
    if (brand.includes('maruti') || brand.includes('suzuki')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M19 6.5l-3.2-2.5H6.5l3 3.5h6l-7.5 9 3.2 2.5h9.3l-3-3.5h-6l7.5-9z" />
        </svg>
      );
    }

    // 2. HYUNDAI
    if (brand.includes('hyundai')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 1.8c4.52 0 8.2 3.68 8.2 8.2s-3.68 8.2-8.2 8.2S3.8 16.52 3.8 12 7.48 3.8 12 3.8zm-3.5 4.5c-.3 0-.6.3-.5.6l1.2 7c.1.4.4.6.8.6h1.2c.4 0 .7-.3.7-.7v-3.2h2.2v3.2c0 .4.3.7.7.7h1.2c.4 0 .7-.2.8-.6l1.2-7c.1-.3-.2-.6-.5-.6h-1.4c-.4 0-.7.3-.8.6l-.6 4.1h-2.2v-4.1c0-.4-.3-.6-.7-.6H8.5z" />
        </svg>
      );
    }

    // 3. TATA
    if (brand.includes('tata')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M6.5 8.5h11M12 8.5V17M8.5 12h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    }

    // 4. MAHINDRA
    if (brand.includes('mahindra')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M3.5 17.5l4-11h3.5l-2.5 11h-5zm13 0l4-11H17l-2.5 11h2.5zm-5-3.5l2-5h2.5l-2 5h-2.5z" />
        </svg>
      );
    }

    // 5. KIA
    if (brand.includes('kia')) {
      return (
        <svg viewBox="0 0 44 20" className="w-full h-full fill-current">
          <path d="M2.5 3h3.5v5.5l5.5-5.5h4.5l-6 6 6.5 8h-4.5l-4.5-6v6H2.5V3zm16.5 0h3.5v14H19V3zm7 0h3.5l5 14h-3.8l-1-3.2h-4.2l-1 3.2H21l5-14zm3.7 8.2l-1.5-4.8-1.5 4.8h3z" />
        </svg>
      );
    }

    // 6. TOYOTA
    if (brand.includes('toyota')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <ellipse cx="12" cy="12" rx="9.5" ry="6.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <ellipse cx="12" cy="11" rx="3.2" ry="4.8" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <ellipse cx="12" cy="9.5" rx="7.2" ry="2.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    }

    // 7. FORD
    if (brand.includes('ford')) {
      return (
        <svg viewBox="0 0 32 20" className="w-full h-full fill-current">
          <ellipse cx="16" cy="10" rx="15" ry="8.8" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text x="16" y="13.5" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="bold" fontSize="10.5">Ford</text>
        </svg>
      );
    }

    // 8. HONDA
    if (brand.includes('honda')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M4 3.5h16c.8 0 1.5.7 1.5 1.5v14c0 .8-.7 1.5-1.5 1.5H4c-.8 0-1.5-.7-1.5-1.5V5c0-.8.7-1.5 1.5-1.5z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 6.5h2.2l.6 5.2h4.4l.6-5.2H17l-1.2 11h-2.3l-.3-3.8h-2.4l-.3 3.8H8.2L7 6.5z" />
        </svg>
      );
    }

    // 9. VOLKSWAGEN / VW
    if (brand.includes('volkswagen') || brand.includes('vw')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7.5 7.5l2.5 8h1.2l2-5 2 5h1.2l2.5-8h-1.5l-1.8 6-1.8-6h-1.2l-1.8 6-1.8-6H7.5z" />
        </svg>
      );
    }

    // 10. SKODA
    if (brand.includes('skoda')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 6l2.2 4.2h-4.4L12 6zm-4 6.2l4 5.6 4-5.6H8z" />
        </svg>
      );
    }

    // 11. MG (Morris Garages)
    if (brand.includes('mg')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <polygon points="12,2.8 21,7.8 21,16.2 12,21.2 3,16.2 3,7.8" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text x="12" y="14.5" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="8.5" letterSpacing="0.8">MG</text>
        </svg>
      );
    }

    // 12. RENAULT
    if (brand.includes('renault')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <polygon points="12,2.5 19.5,12 12,21.5 4.5,12" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <polygon points="12,7 16,12 12,17 8,12" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    }

    // 13. NISSAN
    if (brand.includes('nissan')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <rect x="2.5" y="9.5" width="19" height="5" rx="1" fill="currentColor" />
          <text x="12" y="13.2" textAnchor="middle" fill="#fff" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="3.8" letterSpacing="0.5">NISSAN</text>
        </svg>
      );
    }

    // 14. JEEP
    if (brand.includes('jeep')) {
      return (
        <svg viewBox="0 0 28 16" className="w-full h-full fill-current">
          <text x="14" y="12" textAnchor="middle" fontFamily="Impact, Arial Black, sans-serif" fontWeight="900" fontSize="13" letterSpacing="1">Jeep</text>
        </svg>
      );
    }

    // 15. BMW
    if (brand.includes('bmw')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    }

    // 16. MERCEDES-BENZ
    if (brand.includes('mercedes') || brand.includes('benz')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 2.8v9.2l-8 4.6M12 12l8 4.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    }

    // 17. AUDI
    if (brand.includes('audi')) {
      return (
        <svg viewBox="0 0 36 18" className="w-full h-full fill-current">
          <circle cx="7" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="13" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="19" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="25" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    }

    // Default Fallback: Automotive Shield with initial letter
    const initial = make ? make.trim().charAt(0).toUpperCase() : 'S';
    return (
      <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
        <path d="M12 3L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-3z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <text x="12" y="15" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="9">{initial}</text>
      </svg>
    );
  };

  // 1. INLINE VARIANT (For sidebar filters, brand counts, and tables)
  if (variant === 'inline') {
    return (
      <div className={`w-5 h-5 flex items-center justify-center shrink-0 text-slate-800 ${className}`}>
        {renderSvg()}
      </div>
    );
  }

  // 2. BADGE VARIANT (For car detail headers)
  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-sm ${className}`}>
        <div className="w-4 h-4 text-amber-400">
          {renderSvg()}
        </div>
        <span className="uppercase tracking-wider font-heading">{make || 'VERIFIED'}</span>
      </div>
    );
  }

  // 3. PIN VARIANT (Circular badge)
  return (
    <div
      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-slate-200/80 flex items-center justify-center p-1.5 text-slate-800 transition-transform duration-300 ${className}`}
      title={`${make} Verified Vehicle`}
    >
      {renderSvg()}
    </div>
  );
}

