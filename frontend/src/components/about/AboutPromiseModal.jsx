/**
 * @file frontend/src/components/about/AboutPromiseModal.jsx
 * @description Detailed modal dialog revealing comprehensive technical specifications,
 * lab diagnostics, and checkpoints for an individual Sadguru Standard guarantee pillar.
 */

// External dependencies
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X as LucideX, CheckCircle2, ChevronRight } from 'lucide-react';

// Internal local imports
import WhatsAppIcon from '../WhatsAppIcon';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

// Animation variants
const BACKDROP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const MODAL_PANEL_VARIANTS = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
};

/**
 * About Promise Pillar Modal Component
 * @param {Object} props
 * @param {Object|null} props.pillar - Active pillar data object or null
 * @param {Function} props.onClose - Modal close handler
 */
export default function AboutPromiseModal({ pillar, onClose }) {
  if (!pillar) return null;

  const whatsappInquiryUrl = buildWhatsAppUrl(
    `નમસ્તે, હું સદગુરુ ${pillar.title} (${pillar.gujSub}) વિશે વધુ માહિતી મેળવવા માગું છું.`
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          variants={BACKDROP_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Panel */}
        <motion.div
          variants={MODAL_PANEL_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.25 }}
          onClick={handleStopPropagation}
          className="relative bg-white rounded-3xl sm:rounded-[32px] border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden z-10 my-8"
        >
          {/* Modal Header */}
          <div className="relative py-8 px-6 sm:px-8 w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden border-b border-slate-800">
            {/* Ambient Glows */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-orange/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20 z-20"
              aria-label="Close"
            >
              <LucideX className="w-5 h-5" />
            </button>

            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-brand-orange flex items-center justify-center shrink-0">
                {React.createElement(pillar.icon, { className: 'w-6 h-6' })}
              </div>

              <div className="text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                    {pillar.code} · {pillar.categoryTag}
                  </span>
                  <span className="text-[10px] font-heading font-black text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {pillar.liveBadge}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-heading">{pillar.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 font-heading font-semibold">
                  {pillar.gujSub}
                </p>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
              {pillar.description}
            </p>

            {/* Modal Specs */}
            <div>
              <h4 className="text-xs font-heading font-black text-slate-900 uppercase tracking-wider mb-3">
                મુખ્ય ટેકનિકલ માપદંડો · SPECIFICATIONS
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                {pillar.modalSpecs.map((spec, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/90">
                    <span className="text-[10px] font-heading font-semibold text-slate-400 block">
                      {spec.label}
                    </span>
                    <span className="text-xs sm:text-sm font-heading font-black text-slate-900">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Features */}
            <div>
              <h4 className="text-xs font-heading font-black text-slate-900 uppercase tracking-wider mb-3">
                સદગુરુ ક્વોલિટી ચેકપોઇન્ટ્સ · VERIFICATION POINTS
              </h4>
              <div className="space-y-2.5">
                {pillar.detailedFeatures.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-black text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp પર માહિતી મેળવો</span>
              </a>
              <Link
                to="/inventory"
                onClick={onClose}
                className="py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-black text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>કાર સ્ટોક જુઓ</span>
                <ChevronRight className="w-4 h-4 text-brand-orange" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
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
