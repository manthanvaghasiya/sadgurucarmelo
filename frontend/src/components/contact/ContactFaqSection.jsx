import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

const CONTACT_FAQS = [
  {
    q: 'શું રવિવારે (Sunday) અથવા જાહેર રજાઓમાં શોરૂમ ખુલ્લો હોય છે?',
    en: 'Is Sadguru Car Melo open on Sundays and public holidays?',
    a: 'હા! સદગુરુ કાર મેળો અઠવાડિયાના તમામ 7 દિવસ (સોમવાર થી રવિવાર) સવારે 9:00 AM થી રાત્રે 8:00 PM સુધી ખુલ્લો રહે છે. તમે રવિવારે પણ તમારા પરિવાર સાથે આવીને કાર નિહાળી શકો છો.',
  },
  {
    q: 'ટેસ્ટ ડ્રાઈવ માટે શું કોઈ ચાર્જ છે અથવા અગાઉથી બુકિંગ જરૂરી છે?',
    en: 'Are test drives free, and do I need a prior appointment?',
    a: 'ના, ટેસ્ટ ડ્રાઈવ સંપૂર્ણપણે 100% મફત છે. કોઈ અગાઉથી એપોઇન્ટમેન્ટ લેવાની જરૂર નથી. તમે શોરૂમ પહોંચીને તમારી પસંદગીની કોઈપણ કારની લાઇવ રોડ ટેસ્ટ ડ્રાઇવ લઈ શકો છો.',
  },
  {
    q: 'જૂની કાર વેચવા અથવા Exchange કરવા આવતી વખતે કયા કાગળો લાવવા?',
    en: 'What documents should I bring for selling or exchanging my car?',
    a: 'કારની ઓરિજિનલ RC Book, ચાલુ ઇન્સ્યોરન્સ પોલિસી, માન્ય PUC સર્ટિફિકેટ, 2 ચાવીઓ (જો ઉપલબ્ધ હોય) અને તમારું આધાર કાર્ડ તથા પાન કાર્ડ સાથે લાવવા. 30 મિનિટમાં બેસ્ટ વેલ્યુએશન અને ઇન્સ્ટન્ટ બેંક ટ્રાન્સફર થાય છે.',
  },
  {
    q: 'શું શોરૂમ પર સ્થળ પર જ Car Loan / Finance મંજૂર થઈ શકે?',
    en: 'Can I get on-the-spot car finance approval at the showroom?',
    a: 'ચોક્કસ! HDFC, ICICI, SBI, Axis, Bank of Baroda સહિતની તમામ અગ્રણી બેંકો અને NBFCs ના પ્રતિનિધિઓ અમારા શોરૂમ પર ઉપસ્થિત હોય છે. મિનિમમ પેપરવર્ક અને આકર્ષક વ્યાજ દરે સ્થળ પર જ લોન પ્રક્રિયા શરૂ કરી શકાય છે.',
  },
  {
    q: 'ગાડી ખરીદ્યા પછી RTO નામ ટ્રાન્સફર (RC Transfer) ની પ્રક્રિયા કોણ કરશે?',
    en: 'Who handles the RTO RC ownership transfer paperwork?',
    a: 'RTO દસ્તાવેજ ટ્રાન્સફરની 100% જવાબદારી સદગુરુ કાર મેળો પોતાની ગેરંટી સાથે નિભાવે છે. દસ્તાવેજો તૈયાર કરવાથી લઈને નવું RC સ્માર્ટકાર્ડ તમારા ઘર સુધી પહોંચાડવા સુધીની સંપૂર્ણ કાનૂની સુરક્ષા અમે પૂરી પાડીએ છીએ.',
  },
  {
    q: 'જો હું સુરત બહારથી હોઉં, તો શું મને વીડિયો કોલ પર કાર બતાવવામાં આવશે?',
    en: 'Can buyers from outside Surat get digital HD video walkarounds?',
    a: 'ચોક્કસ! તમે અમારા સત્તાવાર WhatsApp નંબર પર સંપર્ક કરી શકો છો. અમારા એક્ઝિક્યુટિવ તમને કારનો 360° HD વોકઅરાઉન્ડ વીડિયો, એન્જિન સાઉન્ડ અને તમામ ડોક્યુમેન્ટ્સ WhatsApp પર શેર કરશે.',
  },
];

export default function ContactFaqSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const [showAllMobile, setShowAllMobile] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-100 shadow-xl shadow-slate-200/40">
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-heading font-semibold tracking-wider uppercase mb-3">
          <HelpCircle className="w-3.5 h-3.5" /> સામાન્ય પ્રશ્નો · FREQUENTLY ASKED QUESTIONS
        </div>
        <h3 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 leading-tight">
          મુલાકાત લેતા પહેલા ગ્રાહકોના સામાન્ય પ્રશ્નો
        </h3>
        <p className="font-body text-slate-600 text-sm mt-2">
          સદગુરુ કાર મેળો વિશે ગ્રાહકો દ્વારા સૌથી વધુ પૂછાતા સવાલોના પારદર્શક જવાબો.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {CONTACT_FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const isHiddenOnMobile = !showAllMobile && idx >= 3;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isHiddenOnMobile ? 'hidden sm:block' : 'block'
              } ${
                isOpen
                  ? 'border-brand-orange/40 bg-amber-50/20 shadow-sm'
                  : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-brand-orange/10 text-brand-orange font-heading font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-heading font-bold text-sm sm:text-base text-slate-900 leading-snug">
                      {faq.q}
                    </h4>
                    <span className="font-body text-[11px] text-slate-500 block mt-0.5">
                      {faq.en}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-brand-orange text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 sm:px-6 sm:pb-6 text-slate-700 font-body text-xs sm:text-sm leading-relaxed border-t border-slate-100/80 animate-in fade-in slide-in-from-top-2 duration-200">
                  <p className="bg-white/80 p-3.5 rounded-xl border border-slate-200/60 shadow-2xs">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* Mobile View More Button (Desktop keeps all visible) */}
        {!showAllMobile && (
          <div className="sm:hidden text-center pt-2">
            <button
              type="button"
              onClick={() => setShowAllMobile(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-heading font-bold text-xs border border-slate-200 shadow-2xs active:scale-95 transition-all"
            >
              <span>વધુ સવાલો જુઓ · View More FAQs ({CONTACT_FAQS.length - 3})</span>
              <ChevronDown className="w-3.5 h-3.5 text-brand-orange" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
