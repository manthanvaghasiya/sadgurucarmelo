import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axiosInstance from '../api/axiosConfig';

export default function PromoBanners() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axiosInstance.get('/promo-posters');
        if (res.data?.success && Array.isArray(res.data.data)) {
          setBanners(res.data.data);
        }
      } catch (err) {
        console.warn('Failed to load promo banners:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Autoplay
  useEffect(() => {
    if (banners.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [banners.length]);

  if (loading || banners.length === 0) {
    return null; // Don't render anything if no banners exist
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto w-full">
      {/* Section Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold font-heading uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block mb-2">
          સ્પેશિયલ ઓફર્સ અને ડીલ્સ / OFFERS & PROMOTIONS
        </span>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
          સદગુરુ કાર મેળો <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">ધમાકા ઓફર્સ</span>
        </h2>
      </div>

      {banners.length === 1 ? (
        /* Single Banner */
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-white/10 group w-full">
          {banners[0].link ? (
            <a href={banners[0].link} className="block w-full h-full">
              <img
                src={banners[0].desktopImageUrl}
                alt={banners[0].title || 'Promo Banner'}
                className="w-full h-auto hidden md:block transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <img
                src={banners[0].mobileImageUrl}
                alt={banners[0].title || 'Promo Banner'}
                className="w-full h-auto md:hidden transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </a>
          ) : (
            <>
              <img
                src={banners[0].desktopImageUrl}
                alt={banners[0].title || 'Promo Banner'}
                className="w-full h-auto hidden md:block"
              />
              <img
                src={banners[0].mobileImageUrl}
                alt={banners[0].title || 'Promo Banner'}
                className="w-full h-auto md:hidden"
              />
            </>
          )}
        </div>
      ) : banners.length === 2 ? (
        /* Two Banners Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((b) => (
            <div
              key={b._id}
              className="relative rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-white/10 group w-full"
            >
              {b.link ? (
                <a href={b.link} className="block w-full h-full">
                  <img
                    src={b.desktopImageUrl}
                    alt={b.title || 'Promo Banner'}
                    className="w-full h-auto hidden md:block transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <img
                    src={b.mobileImageUrl}
                    alt={b.title || 'Promo Banner'}
                    className="w-full h-auto md:hidden transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </a>
              ) : (
                <>
                  <img
                    src={b.desktopImageUrl}
                    alt={b.title || 'Promo Banner'}
                    className="w-full h-auto hidden md:block"
                  />
                  <img
                    src={b.mobileImageUrl}
                    alt={b.title || 'Promo Banner'}
                    className="w-full h-auto md:hidden"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* 3+ Banners Carousel */
        <div className="relative group/slider overflow-hidden rounded-3xl shadow-xl border border-gray-100 dark:border-white/10">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {banners.map((b) => (
              <div key={b._id} className="w-full shrink-0 relative">
                {b.link ? (
                  <a href={b.link} className="block w-full h-full">
                    <img
                      src={b.desktopImageUrl}
                      alt={b.title || 'Promo Banner'}
                      className="w-full h-auto hidden md:block"
                    />
                    <img
                      src={b.mobileImageUrl}
                      alt={b.title || 'Promo Banner'}
                      className="w-full h-auto md:hidden"
                    />
                  </a>
                ) : (
                  <>
                    <img
                      src={b.desktopImageUrl}
                      alt={b.title || 'Promo Banner'}
                      className="w-full h-auto hidden md:block"
                    />
                    <img
                      src={b.mobileImageUrl}
                      alt={b.title || 'Promo Banner'}
                      className="w-full h-auto md:hidden"
                    />
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Nav Controls */}
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all active:scale-95"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all active:scale-95"
          >
            <ChevronRight size={22} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`transition-all rounded-full ${
                  currentIndex === i ? 'w-6 h-2 bg-amber-500' : 'w-2 h-2 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
