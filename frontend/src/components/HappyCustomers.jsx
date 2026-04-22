import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';
import axiosInstance from '../api/axiosConfig';
import { getOptimizedUrl } from '../utils/imageUtils';

export default function HappyCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axiosInstance.get('/happy-customers');
        if (res.data.success) {
          setCustomers(res.data.data.slice(0, 12)); // Max 12
        }
      } catch (error) {
        console.error('Failed to fetch happy customers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) return null;
  if (customers.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-slate-50 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-200/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="flex items-center justify-center gap-2 text-sm font-heading font-bold text-[#d1108a] uppercase tracking-widest mb-4">
            <Sparkles className="w-4 h-4" /> The Sadguru Family
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#1a2b3c] mb-6 leading-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-400 to-yellow-500">Happy Customers</span>
          </h2>
          <p className="font-body text-text-muted text-lg leading-relaxed">
            Every delivery is a celebration. Join the growing family of satisfied car owners who found their dream vehicle with us.
          </p>
        </div>

        {/* CSS-based Masonry Grid using Tailwind Columns */}
        <div className="columns-2 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 sm:gap-6 space-y-3 sm:space-y-6">
          {customers.map((customer, index) => (
            <motion.div
              key={customer._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{ y: -8 }}
              className="break-inside-avoid cursor-pointer"
            >
              <div
                className="group relative rounded-xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(235,9,14,0.3)] transition-all duration-500 bg-white border border-gray-100/50 sm:border-white ring-1 ring-white/50 justify-center items-center"
                onClick={() => customer.reviewText && setActiveCard(activeCard === customer._id ? null : customer._id)}
              >
                {/* Delivery Photo */}
                <img
                  src={getOptimizedUrl(customer.photo, 600)}
                  alt={`Delivery to ${customer.customerName}`}
                  loading="lazy"
                  className={`w-full h-auto object-cover transition-transform duration-700 ${activeCard === customer._id ? 'scale-105' : 'sm:group-hover:scale-105'}`}
                />

                {/* Always-visible Name Overlay (Bottom gradient) */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none transition-opacity duration-500 ${activeCard === customer._id ? 'opacity-40' : 'sm:group-hover:opacity-40'}`} />
                
                {/* Review Glassmorphism Overlay (Fades in on hover) */}
                {customer.reviewText && (
                  <div className={`absolute inset-0 bg-gradient-to-br from-primary/95 to-accent/95 backdrop-blur-md p-4 sm:p-8 flex flex-col justify-center items-center text-center transition-all duration-500 z-10 ${activeCard === customer._id ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'}`}>
                    <Quote className={`w-6 h-6 sm:w-12 sm:h-12 text-white/30 mb-2 sm:mb-4 transform transition-transform duration-500 delay-100 ${activeCard === customer._id ? 'translate-y-0' : '-translate-y-2 sm:-translate-y-4 sm:group-hover:translate-y-0'}`} />
                    <p className={`font-body text-white font-medium italic text-[11px] leading-snug sm:text-base sm:leading-relaxed line-clamp-4 sm:line-clamp-6 mb-3 sm:mb-6 transform transition-transform duration-500 delay-150 ${activeCard === customer._id ? 'translate-y-0' : 'translate-y-4 sm:group-hover:translate-y-0'}`}>
                      "{customer.reviewText}"
                    </p>
                    <div className={`flex flex-col items-center transform transition-transform duration-500 delay-200 ${activeCard === customer._id ? 'translate-y-0' : 'translate-y-4 sm:group-hover:translate-y-0'}`}>
                      <h3 className="font-heading font-bold text-white tracking-wider mb-2 text-xs sm:text-base">
                        — {customer.customerName}
                      </h3>
                      <div className="w-8 sm:w-12 h-0.5 sm:h-1 bg-white/40 rounded-full" />
                    </div>
                  </div>
                )}

                {/* Name Tag (Always at bottom, z-index above initial gradient but below blur) */}
                <div className={`absolute bottom-0 left-0 right-0 p-3 sm:p-6 z-20 flex justify-between items-end transform transition-all duration-500 ${activeCard === customer._id ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0 sm:group-hover:opacity-0 sm:group-hover:translate-y-2'}`}>
                  <div className="flex flex-col">
                    <h3 className="font-heading font-black text-white text-sm sm:text-xl tracking-wide drop-shadow-lg leading-tight">
                      {customer.customerName}
                    </h3>
                    <div className="w-6 sm:w-10 h-0.5 sm:h-1 bg-primary rounded-full mt-1.5 sm:mt-2 shadow-[0_0_10px_rgba(235,9,14,0.8)]" />
                  </div>
                  {customer.reviewText && (
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-1.5 sm:p-2.5 animate-pulse shadow-lg border border-white/30 shrink-0 ml-2">
                       <Quote className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
