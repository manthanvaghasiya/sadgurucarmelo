import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

export default function ArrivingShortly() {
  const [poster, setPoster] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const res = await axiosInstance.get('/promo-posters');
        const fetch_data = res.data;
        
        if (fetch_data.success && fetch_data.data && fetch_data.data.length > 0) {
          // Select exactly ONE poster pair randomly
          const randomIndex = Math.floor(Math.random() * fetch_data.data.length);
          setPoster(fetch_data.data[randomIndex]);
        }
      } catch (error) {
        console.error('Failed to fetch promo posters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosters();
  }, []);

  if (isLoading || !poster) {
    return null; // Return empty space or soft skeleton if desired. Returning null for seamless failure.
  }

  return (
    <section className="py-20 bg-background px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-accent animate-ping absolute"></div>
            <div className="w-2 h-2 rounded-full bg-accent relative"></div>
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-primary uppercase tracking-[0.15em]">
            Arriving Shortly
          </h2>
        </div>

        {/* Poster Container */}
        <div className="w-full rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-700 ease-out hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-gray-900 border border-gray-800 relative group">
          <picture>
            <source media="(min-width: 768px)" srcSet={poster.desktopImageUrl} />
            <img 
              src={poster.mobileImageUrl} 
              alt="Arriving Shortly Promotional Poster" 
              className="w-full h-auto max-h-[80vh] md:max-h-[700px] object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
            />
          </picture>
        </div>
        
      </div>
    </section>
  );
}
