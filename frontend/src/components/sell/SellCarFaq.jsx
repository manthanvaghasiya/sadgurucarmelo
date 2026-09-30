/**
 * @file frontend/src/components/sell/SellCarFaq.jsx
 * @description Frequently Asked Questions accordion component resolving customer doubts
 * about valuation calculation, payment speed, active bank loans, and RTO paperwork.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Check } from 'lucide-react';
import { SELL_CAR_FAQS } from '../../data/sellCarData';

export default function SellCarFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] relative overflow-hidden border-b border-slate-100">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-heading font-bold text-xs uppercase tracking-widest mb-3.5 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-brand-orange" /> વારંવાર પૂછાતા પ્રશ્નો · FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 font-heading tracking-tight leading-tight">
            તમારા પ્રશ્નો,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-500 to-yellow-500">
              અમારા સ્પષ્ટ જવાબો
            </span>
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-slate-600 font-medium leading-relaxed font-body">
            ગાડી વેચતાં પહેલાં મનમાં કોઈ પણ પ્રશ્ન હોય, તો નીચે આપેલા જવાબો વાંચો:
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {SELL_CAR_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                >
                  <span className="font-heading font-black text-sm sm:text-base text-slate-900 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-brand-orange/10 text-brand-orange text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-brand-orange text-white' : 'text-slate-500'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 font-medium font-body leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
