import React from 'react';

/**
 * High-definition vector automotive brand logos.
 * Styled for luxury digital showrooms, supporting:
 * - 'pin': Circular frosted/white logo pin badge (bottom-right of car photos)
 * - 'inline': Horizontal icon for lists and filters
 * - 'badge': Larger branded badge for vehicle detail headers
 */
export default function BrandLogo({ make = '', className = '', variant = 'pin' }) {
  const brand = (make || '').toLowerCase().trim();

  // Helper to render brand SVG
  const renderSvg = () => {
    // 1. KIA
    if (brand.includes('kia')) {
      return (
        <svg viewBox="0 0 48 24" className="w-full h-full fill-current">
          <text x="24" y="17" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="16" letterSpacing="1.5">KIA</text>
        </svg>
      );
    }

    // 2. HYUNDAI
    if (brand.includes('hyundai')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 1.6c4.64 0 8.4 3.76 8.4 8.4s-3.76 8.4-8.4 8.4S3.6 16.64 3.6 12 7.36 3.6 12 3.6zm-3.2 4.4v8h2.1v-3.3h2.2V16h2.1V8h-2.1v3.1h-2.2V8H8.8z" />
        </svg>
      );
    }

    // 3. TATA
    if (brand.includes('tata')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 9h10M12 9v7.5M9.5 12h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    }

    // 4. MAHINDRA
    if (brand.includes('mahindra')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M4 17l4.5-10h3L7 17H4zm11.5 0l4.5-10H17l-4.5 10h3zm-3.5-3.5l2-4.5h2.5l-2 4.5H12z" />
        </svg>
      );
    }

    // 5. MARUTI / SUZUKI
    if (brand.includes('maruti') || brand.includes('suzuki')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M18.8 6.4L15.6 4H6.2l3 3.6h5.8l-7.2 8.6 3.2 2.4h9.4l-3-3.6H11.6l7.2-8.6z" />
        </svg>
      );
    }

    // 6. TOYOTA
    if (brand.includes('toyota')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <ellipse cx="12" cy="12" rx="9.5" ry="6.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <ellipse cx="12" cy="11.5" rx="3.5" ry="4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <ellipse cx="12" cy="9.5" rx="7" ry="2.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    }

    // 7. FORD
    if (brand.includes('ford')) {
      return (
        <svg viewBox="0 0 32 20" className="w-full h-full fill-current">
          <ellipse cx="16" cy="10" rx="15" ry="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text x="16" y="13.5" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="bold" fontSize="10">Ford</text>
        </svg>
      );
    }

    // 8. HONDA
    if (brand.includes('honda')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <rect x="3.5" y="3.5" width="17" height="17" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7.5 7h2v4.5h5V7h2v10h-2v-4h-5v4h-2V7z" />
        </svg>
      );
    }

    // 9. VOLKSWAGEN (VW)
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
          <path d="M12 6l2 4h-4l2-4zm-4 6l4 6 4-6H8z" />
        </svg>
      );
    }

    // 11. MG (Morris Garages)
    if (brand.includes('mg')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <polygon points="12,3 21,8.5 21,15.5 12,21 3,15.5 3,8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text x="12" y="14.5" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="8" letterSpacing="0.5">MG</text>
        </svg>
      );
    }

    // 12. BMW
    if (brand.includes('bmw')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="1" />
        </svg>
      );
    }

    // 13. MERCEDES
    if (brand.includes('mercedes') || brand.includes('benz')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 3.5v8.5l-7.3 4.2M12 12l7.3 4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

  // 1. PIN VARIANT (Circular badge for bottom-right corner of car cards)
  if (variant === 'pin') {
    return (
      <div
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.12)] border border-slate-200/80 flex items-center justify-center p-1.5 text-slate-800 transition-transform duration-300 group-hover:scale-110 ${className}`}
        title={`${make} Verified Vehicle`}
      >
        {renderSvg()}
      </div>
    );
  }

  // 2. INLINE VARIANT (For sidebar filters, brand counts, and tables)
  if (variant === 'inline') {
    return (
      <div className={`w-5 h-5 flex items-center justify-center shrink-0 text-slate-700 ${className}`}>
        {renderSvg()}
      </div>
    );
  }

  // 3. BADGE VARIANT (For car detail headers)
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-sm ${className}`}>
      <div className="w-4 h-4 text-amber-400">
        {renderSvg()}
      </div>
      <span className="uppercase tracking-wider font-heading">{make || 'VERIFIED'}</span>
    </div>
  );
}
