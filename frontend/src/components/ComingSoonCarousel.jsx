import { useState, useEffect, useCallback } from 'react';
import { useCars } from '../context/CarContext';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import axiosInstance from '../api/axiosConfig';
import toast from 'react-hot-toast';
import Poster1 from './ComingSoonPosters/Poster1';
import Poster2 from './ComingSoonPosters/Poster2';
import Poster3 from './ComingSoonPosters/Poster3';
import Poster4 from './ComingSoonPosters/Poster4';
import Poster5 from './ComingSoonPosters/Poster5';

export default function ComingSoonCarousel({ noPadding = false }) {
  const { cars, isLoading } = useCars();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return toast.error('Please fill in both fields');
    try {
      setIsSubmitting(true);
      const message = `I am interested in the coming soon car: ${selectedCar?.make} ${selectedCar?.model} ${selectedCar?.year ? `(${selectedCar.year})` : ''}`;
      await axiosInstance.post('/messages', {
        name: formData.name,
        phone: formData.phone,
        message,
        type: 'Notify'
      });
      toast.success("We'll notify you when it's available!");
      setShowModal(false);
      setFormData({ name: '', phone: '' });
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <div 
                  key={car?._id ? `${car._id}-${idx}` : idx} 
                  className="w-full shrink-0 flex flex-col cursor-pointer transition-transform hover:scale-[1.01]"
                  onClick={() => {
                    setSelectedCar(car);
                    setShowModal(true);
                  }}
                >
                  <div className="flex-1 flex flex-col pointer-events-none">
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

        {/* Notify Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-28 sm:p-4 animate-fade-in" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-3xl sm:rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-[slide-up_0.4s_cubic-bezier(0.16,1,0.3,1)] sm:animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-heading font-bold text-xl text-text">Get Notified</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {selectedCar && (
                  <p className="text-sm font-body text-text-muted mb-4">
                    Register your interest for the <span className="font-semibold text-primary">{selectedCar.make} {selectedCar.model}</span>.
                  </p>
                )}
                <div>
                  <label className="block text-sm font-semibold text-text mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text mb-1">Mobile Number</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-70 mt-2"
                >
                  {isSubmitting ? 'Submitting...' : 'Notify Me'}
                </button>
              </form>
            </div>
          </div>
        )}
    </section>
  );
}
