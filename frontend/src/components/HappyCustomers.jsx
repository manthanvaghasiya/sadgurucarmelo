import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Sparkles, X, ChevronRight } from 'lucide-react';
import axiosInstance from '../api/axiosConfig';
import { getOptimizedUrl } from '../utils/imageUtils';

export default function HappyCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axiosInstance.get('/happy-customers');
        if (res.data.success) {
          setCustomers(res.data.data); // Fetch all customers
        }
      } catch (error) {
        console.error('Failed to fetch happy customers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Auto-slide 4 photos every 5 seconds
  useEffect(() => {
    if (customers.length <= 4) return;

    // Pause auto-sliding when modal is open
    if (isModalOpen) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 4 >= customers.length ? 0 : prev + 4));
    }, 5000);

    return () => clearInterval(interval);
  }, [customers.length, isModalOpen]);

  // Handle hardware back button to close modal
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      window.history.pushState(null, '', window.location.href);

      const handlePopState = () => {
        setIsModalOpen(false);
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isModalOpen]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // If we close via button, we must pop the history state we pushed
    window.history.back();
  };

  if (loading) return null;
  if (customers.length === 0) return null;

  // Get current 4 customers for the carousel
  const visibleCustomers = [];
  for (let i = 0; i < Math.min(4, customers.length); i++) {
    visibleCustomers.push(customers[(currentIndex + i) % customers.length]);
  }

  // Extracted card component for reuse in both views
  const CustomerCard = ({ customer, index, isModal = false }) => (
    <motion.div
      initial={isModal ? { opacity: 0, y: 20 } : { opacity: 0, scale: 0.9 }}
      animate={isModal ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1 }}
      exit={isModal ? undefined : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: isModal ? (index % 12) * 0.05 : index * 0.1 }}
      whileHover={{ y: -8 }}
      className={`cursor-pointer ${isModal ? 'break-inside-avoid mb-3 sm:mb-6' : 'h-full'}`}
    >
      <div
        className={`group relative overflow-hidden shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(235,9,14,0.3)] transition-all duration-500 bg-white border border-gray-100/50 sm:border-white ring-1 ring-white/50 justify-center items-center ${isModal ? 'rounded-xl sm:rounded-3xl h-auto' : 'rounded-2xl sm:rounded-3xl aspect-[3/4] sm:aspect-[4/5]'}`}
        onClick={() => customer.reviewText && setActiveCard(activeCard === customer._id ? null : customer._id)}
      >
        <img
          src={getOptimizedUrl(customer.photo, 600)}
          alt={`Delivery to ${customer.customerName}`}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-700 ${activeCard === customer._id ? 'scale-105' : 'sm:group-hover:scale-105'}`}
        />

        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none transition-opacity duration-500 ${activeCard === customer._id ? 'opacity-40' : 'sm:group-hover:opacity-40'}`} />

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
  );

  return (
    <section className="py-20 px-4 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-200/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 max-w-3xl mx-auto">
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

        {/* 4 Items Carousel Grid */}
        <div className="relative min-h-[300px] sm:min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5, ease: "easeOut", staggerChildren: 0.1 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
            >
              {visibleCustomers.map((customer, index) => (
                <CustomerCard key={customer._id} customer={customer} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* View All Button */}
        {customers.length > 4 && (
          <div className="mt-8 sm:mt-12 text-center flex justify-center relative z-20">
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-heading font-bold rounded-full border border-gray-200 shadow-sm hover:shadow-lg hover:border-primary/20 hover:-translate-y-1 transition-all duration-300"
            >
              <span>View All {customers.length} Happy Customers</span>
              <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* Full-Screen Modal for All Customers */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex flex-col bg-slate-50/95 backdrop-blur-xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-white/80 backdrop-blur-md px-4 sm:px-8 py-4 sm:py-5 border-b border-gray-200/50 flex items-center justify-center shadow-sm relative z-20 min-h-[80px]">
                <h2 className="font-heading font-bold text-xl sm:text-3xl text-slate-800 flex items-center gap-2 sm:gap-3 text-center">
                  <Sparkles className="w-5 h-5 sm:w-8 sm:h-8 text-brand-orange" /> The Sadguru Family
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="absolute right-4 sm:right-8 group flex items-center gap-2 px-3 py-2 sm:px-5 sm:py-2.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 rounded-full transition-all duration-300 shadow-sm border border-transparent hover:border-red-200"
                >
                  <span className="font-heading font-bold text-sm sm:text-base hidden sm:inline">Close</span>
                  <X className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              {/* Modal Content - Reliable Grid Layout to prevent right-side gap */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 scrollbar-thin scrollbar-thumb-gray-300 pb-32">
                <div className="max-w-[1600px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 items-start">
                  {customers.map((customer, index) => (
                    <CustomerCard key={customer._id} customer={customer} index={index} isModal={true} />
                  ))}
                </div>
              </div>


            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
