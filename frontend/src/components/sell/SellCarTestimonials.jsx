/**
 * @file frontend/src/components/sell/SellCarTestimonials.jsx
 * @description Testimonials section highlighting real car sellers in Surat who sold their
 * vehicles to Sadguru Car Melo and received instant payments and free RTO transfers.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle2, Car, Banknote } from 'lucide-react';
import { SELLER_TESTIMONIALS } from '../../data/sellCarData';

export default function SellCarTestimonials() {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden border-b border-slate-100">
      {/* Soft Ambient Radiance */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[400px] bg-amber-100/25 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-heading font-bold text-xs uppercase tracking-widest mb-3.5 shadow-xs">
            <Quote className="w-3.5 h-3.5 text-brand-orange" /> ગ્રાહકોના અનુભવ · HAPPY CAR SELLERS
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 font-heading tracking-tight leading-tight">
            સુરતના કાર માલિકોનો{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">
              અતૂટ વિશ્વાસ
            </span>
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-slate-600 font-medium leading-relaxed font-body">
            જેમણે પોતાની કાર સદગુરુ કાર મેળોને વેચીને ત્વરિત રોકડ પેમેન્ટ મેળવ્યું છે, સાંભળો તેમના સાચા શબ્દો:
          </p>
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {SELLER_TESTIMONIALS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -5, transition: { duration: 0.25 } }}
              className="p-6 sm:p-8 rounded-[28px] bg-[#F8FAFC] border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top Badge & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified Seller
                  </span>
                </div>

                {/* Quote Body */}
                <p className="text-xs sm:text-sm text-slate-700 font-medium font-body leading-relaxed mb-6 italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Author & Car Details Footer */}
              <div className="pt-4 border-t border-slate-200/80">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-heading font-black text-slate-900 text-sm sm:text-base">
                    {item.name}
                  </h4>
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {item.soldPrice}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{item.area}</p>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] font-heading font-bold text-brand-orange">
                  <Car className="w-3.5 h-3.5" />
                  <span>{item.car}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
