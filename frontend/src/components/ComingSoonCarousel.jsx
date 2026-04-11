import { useState, useEffect, useCallback } from 'react';
import { useCars } from '../context/CarContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Poster1 from './ComingSoonPosters/Poster1';
import Poster2 from './ComingSoonPosters/Poster2';
import Poster3 from './ComingSoonPosters/Poster3';
import Poster4 from './ComingSoonPosters/Poster4';
import Poster5 from './ComingSoonPosters/Poster5';

export default function ComingSoonCarousel({ noPadding = false }) {
  const { cars, isLoading } = useCars();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const comingSoonCars = cars.filter(c => c.status === 'Coming Soon');

  const displayItems = comingSoonCars.length > 0
    ? Array.from({ length: Math.max(5, comingSoonCars.length) }, (_, i) => comingSoonCars[i % comingSoonCars.length])
    : [];

  const goTo = useCallback((idx) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(idx);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const handleNext = useCallback(() => {
    goTo((currentIndex + 1) % displayItems.length);
  }, [currentIndex, displayItems.length, goTo]);

  const handlePrev = useCallback(() => {
    goTo(currentIndex === 0 ? displayItems.length - 1 : currentIndex - 1);
  }, [currentIndex, displayItems.length, goTo]);

  // Auto slide
  useEffect(() => {
    if (displayItems.length <= 1) return;
    const timer = setInterval(handleNext, 6000);
    return () => clearInterval(timer);
  }, [displayItems.length, handleNext]);

  if (isLoading) return null;
  if (comingSoonCars.length === 0) return null;

  const posterComponents = [Poster1, Poster2, Poster3, Poster4, Poster5];

  return (
    <section className={`${noPadding ? '' : 'py-4 md:py-6'} bg-transparent w-full overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 relative group">

        {/* Carousel Window */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl">
          <div
            className="flex items-stretch transition-transform ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transitionDuration: '800ms',
            }}
          >
            {displayItems.map((car, idx) => {
              const PosterComp = posterComponents[idx % 5];
              return (
                <div key={car?._id ? `${car._id}-${idx}` : idx} className="w-full shrink-0 flex flex-col">
                  <div className="flex-1 flex flex-col">
                    <PosterComp car={car} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Arrows */}
        {displayItems.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-0 sm:left-1 md:-left-2 lg:-left-5 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center z-30 opacity-70 hover:opacity-100 transition-all duration-300 shadow-lg"
              aria-label="Previous Poster"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 sm:right-1 md:-right-2 lg:-right-5 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center z-30 opacity-70 hover:opacity-100 transition-all duration-300 shadow-lg"
              aria-label="Next Poster"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center justify-center gap-1.5 mt-3">
              {displayItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={`h-1.5 rounded-full transition-all duration-400 ${currentIndex === idx ? 'bg-primary w-6' : 'bg-gray-400/50 w-1.5 hover:bg-gray-300'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  );
}
