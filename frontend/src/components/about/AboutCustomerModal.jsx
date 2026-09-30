/**
 * @file frontend/src/components/about/AboutCustomerModal.jsx
 * @description Accessible dialog modal showcasing verified customer delivery photos,
 * vehicle model details, star ratings, and detailed testimonials.
 */

// External dependencies
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X as LucideX, Star, Quote } from 'lucide-react';

// Internal local imports
import { getOptimizedUrl } from '../../utils/imageUtils';

// Animation presets
const MODAL_BACKDROP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const MODAL_CONTENT_VARIANTS = {
  hidden: { scale: 0.9, y: 20 },
  visible: { scale: 1, y: 0 },
  exit: { scale: 0.9, y: 20 },
};

/**
 * Customer Delivery Detail Modal
 * @param {Object} props
 * @param {Object|null} props.customer - Selected customer object or null
 * @param {Function} props.onClose - Dismissal callback
 */
export default function AboutCustomerModal({ customer, onClose }) {
  if (!customer) return null;

  return (
    <AnimatePresence>
      <motion.div
        variants={MODAL_BACKDROP_VARIANTS}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      >
        <motion.div
          variants={MODAL_CONTENT_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleStopPropagation}
          className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close customer story"
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
          >
            <LucideX className="w-5 h-5" />
          </button>

          {/* Delivery Photo Hero */}
          <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
            <img
              src={getOptimizedUrl(customer.photo, 800)}
              alt={customer.customerName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-brand-orange text-white text-xs font-black tracking-wider uppercase shadow-md">
              {customer.deliveryTag}
            </div>
          </div>

          {/* Customer Details & Testimonial */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-heading font-black text-xl text-slate-900">
                {customer.customerName}
              </h3>
              <div className="flex items-center gap-1 text-amber-500 font-black text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>5.0</span>
              </div>
            </div>

            <p className="text-xs text-brand-orange font-bold uppercase tracking-wider mb-4">
              {customer.carModel} · {customer.location}
            </p>

            {customer.reviewText && (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 relative">
                <Quote className="w-5 h-5 text-brand-orange/40 mb-1" />
                <p className="text-slate-700 font-medium italic text-sm leading-relaxed">
                  "{customer.reviewText}"
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Prevents inner modal card clicks from bubbling up to backdrop dismissal
 * @param {React.MouseEvent} e
 */
function handleStopPropagation(e) {
  e.stopPropagation();
}
