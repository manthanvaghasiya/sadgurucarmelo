import { useState, useEffect } from 'react';
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

  const comingSoonCars = cars.filter(c => c.status === 'Coming Soon');

  // Ensure we ALWAYS show at least 5 posters so all 5 custom templates can be seen.
  // If there are >= 5 cars, it shows all of them.
  // If < 5 cars, it loops the available cars until it fills 5 slots.
  const displayItems = comingSoonCars.length > 0
    ? Array.from({ length: Math.max(5, comingSoonCars.length) }, (_, i) => comingSoonCars[i % comingSoonCars.length])
    : [];

  // Auto slide interval
  useEffect(() => {
    if (displayItems.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayItems.length);
    }, 6000); // 6 seconds

    return () => clearInterval(timer);
  }, [displayItems.length]); // depends on computed length

  if (isLoading) return null;
  if (comingSoonCars.length === 0) return null;

  // We have 5 posters. We cycle them based on the real index, ensuring variation.
  const renderTemplateForIndex = (car, index) => {
    const templateIndex = index % 5;
    switch (templateIndex) {
      case 0: return <Poster1 car={car} />;
      case 1: return <Poster2 car={car} />;
      case 2: return <Poster3 car={car} />;
      case 3: return <Poster4 car={car} />;
      case 4: return <Poster5 car={car} />;
      default: return <Poster1 car={car} />;
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayItems.length - 1 : prev - 1));
  };

  return (
    <section className={`${noPadding ? 'my-2' : 'py-8 lg:py-4'} bg-transparent px-4`}>
      <div className="max-w-7xl mx-auto relative group">

        {/* Carousel Window */}
        <div className="overflow-hidden rounded-[2rem] shadow-2xl relative transition-all duration-500 min-h-[200px] md:min-h-[280px] lg:min-h-[280px]">
          <div
            className="flex transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {displayItems.map((car, idx) => (
              <div key={car?._id ? `${car._id}-${idx}` : idx} className="w-full shrink-0 flex justify-center items-stretch p-2">
                {renderTemplateForIndex(car, idx)}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows - Only show if more than 1 item */}
        {displayItems.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 md:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] z-20 opacity-0 md:opacity-100 group-hover:opacity-100 transition-all duration-300 transform md:-translate-x-4 group-hover:translate-x-0"
              aria-label="Previous Poster"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 md:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] z-20 opacity-0 md:opacity-100 group-hover:opacity-100 transition-all duration-300 transform md:translate-x-4 group-hover:translate-x-0"
              aria-label="Next Poster"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {displayItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === idx ? 'bg-primary w-6' : 'bg-gray-400'}`}
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
