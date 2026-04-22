import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';
import axiosInstance from '../api/axiosConfig';
import { getOptimizedUrl } from '../utils/imageUtils';

export default function HappyCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {customers.map((customer, index) => (
            <motion.div
              key={customer._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="break-inside-avoid"
            >
              <div className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-white border border-gray-100">
                {/* Delivery Photo */}
                <img
                  src={getOptimizedUrl(customer.photo, 600)}
                  alt={`Delivery to ${customer.customerName}`}
                  loading="lazy"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Always-visible Name Overlay (Bottom gradient) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
                <div className={`absolute bottom-0 left-0 right-0 p-5 pt-12 transform transition-transform duration-500 ${customer.reviewText ? 'group-hover:translate-y-full' : ''}`}>
                  <h3 className="font-heading font-bold text-white text-lg drop-shadow-md">
                    {customer.customerName}
                  </h3>
                  <div className="w-8 h-1 bg-primary rounded-full mt-2" />
                </div>

                {/* Review Text Overlay (Slide up on hover) */}
                {customer.reviewText && (
                  <div className="absolute inset-0 bg-primary/95 backdrop-blur-sm p-6 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-500">
                    <Quote className="w-8 h-8 text-white/20 mb-4" />
                    <p className="font-body text-white font-medium italic text-sm sm:text-base leading-relaxed line-clamp-6">
                      "{customer.reviewText}"
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/20 w-3/4">
                      <h3 className="font-heading font-bold text-white tracking-wider">
                        — {customer.customerName}
                      </h3>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
