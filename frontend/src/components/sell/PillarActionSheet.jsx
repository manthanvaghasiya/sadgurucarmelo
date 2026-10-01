import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import WhatsAppIcon from '../WhatsAppIcon';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

export default function PillarActionSheet({ pillar, isOpen, onClose, onScrollToForm }) {
  // Prevent background scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!pillar) return null;
  const PillarIcon = pillar.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[9990]"
          />

          {/* Bottom Action Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
            className="fixed bottom-0 inset-x-0 z-[9999] bg-white rounded-t-[32px] shadow-2xl border-t border-slate-100 max-h-[85vh] overflow-y-auto px-6 pt-3 pb-8"
            style={{
              paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 20px))',
            }}
          >
            {/* Native Drag Handle */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-5" />

            {/* Header with Close */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl ${pillar.bg} border flex items-center justify-center shrink-0`}>
                  <PillarIcon className={`w-6 h-6 ${pillar.color}`} />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange font-mono font-bold text-[10px] uppercase mb-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{pillar.badge || 'ગેરંટીડ ફાયદો'}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 font-heading leading-tight">
                    {pillar.title}
                  </h3>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    {pillar.sub}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-5">
              <p className="text-sm font-medium text-slate-700 leading-relaxed font-body">
                {pillar.desc}
              </p>
            </div>

            {/* Benefits Checklist */}
            <div className="space-y-2.5 mb-6">
              <p className="text-xs font-heading font-black text-slate-400 uppercase tracking-wider">
                આ સુવિધામાં શું મળશે? (Key Highlights)
              </p>
              {(pillar.benefits || []).map((benefit, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm font-semibold text-slate-800 font-body">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  if (onScrollToForm) onScrollToForm();
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-brand-orange text-white font-heading font-black text-sm shadow-lg shadow-brand-orange/30 active:scale-95 transition-all"
              >
                <span>ઓનલાઇન કિંમત જાણો</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={buildWhatsAppUrl(`નમસ્તે, હું સદગુરુ કાર મેળો પર "${pillar.title}" વિશે વધુ વિગત જાણવા માગું છું.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#25D366] text-white font-heading font-black text-sm shadow-md active:scale-95 transition-all"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp પર વાત કરો</span>
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
