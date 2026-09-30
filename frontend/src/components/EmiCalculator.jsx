import React, { useState, useEffect } from 'react';
import { Calculator, ShieldCheck } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { buildWhatsAppUrl } from '../utils/whatsapp';

export default function EmiCalculator({ carPrice = 500000, carTitle = 'this vehicle', isSidebar = false }) {
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(10.5);
  const [tenureYears, setTenureYears] = useState(5);

  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  const safeCarPrice = Math.max(Number(carPrice) || 500000, 50000);
  const downPaymentAmount = Math.round((safeCarPrice * downPaymentPercent) / 100);
  const loanPrincipal = Math.max(safeCarPrice - downPaymentAmount, 0);

  useEffect(() => {
    calculateEMI();
  }, [downPaymentPercent, interestRate, tenureYears, safeCarPrice]);

  const calculateEMI = () => {
    const P = loanPrincipal;
    const r = interestRate / 12 / 100; // monthly interest rate
    const n = tenureYears * 12; // total months

    if (P <= 0) {
      setEmi(0);
      setTotalInterest(0);
      setTotalPayment(downPaymentAmount);
      return;
    }

    if (r === 0) {
      const emiAmt = P / n;
      setEmi(Math.round(emiAmt));
      setTotalInterest(0);
      setTotalPayment(safeCarPrice);
      return;
    }

    // Standard EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emiAmt = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPay = emiAmt * n;
    const totalInt = totalPay - P;

    setEmi(Math.round(emiAmt));
    setTotalInterest(Math.round(totalInt));
    setTotalPayment(Math.round(totalPay + downPaymentAmount));
  };

  const formatRupee = (val) => {
    if (!val || isNaN(val)) return '₹0';
    return `₹${Number(val).toLocaleString('en-IN')}`;
  };

  const principalPercent = totalPayment > 0 ? Math.round((loanPrincipal / (loanPrincipal + totalInterest)) * 100) : 70;
  const interestPercent = 100 - principalPercent;

  const whatsappMessage = encodeURIComponent(
    `Hello Sadguru Car Melo, I am interested in finance options for ${carTitle}.
Vehicle Price: ${formatRupee(safeCarPrice)}
Estimated Down Payment: ${formatRupee(downPaymentAmount)} (${downPaymentPercent}%)
Calculated EMI: ${formatRupee(emi)}/month for ${tenureYears} years (${interestRate}% p.a.)
Please guide me with the loan approval process.`
  );

  return (
    <div className={`bg-surface rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 ${isSidebar ? 'mt-0' : 'mt-3 sm:mt-4'}`}>
      {/* ── Header Row ── */}
      {isSidebar ? (
        <div className="flex flex-col gap-2 mb-3 pb-2.5 border-b border-slate-100">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange text-[10px] font-bold uppercase tracking-wider">
              <Calculator className="w-3 h-3" />
              સરળ કાર ફાઇનાન્સ
            </span>
            <div className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-500/25 px-2.5 py-1 rounded-xl shadow-2xs">
              <span className="text-[10px] font-bold text-brand-orange">EMI:</span>
              <span className="text-base sm:text-lg font-black text-slate-900 font-heading leading-none">
                {formatRupee(emi)}
              </span>
              <span className="text-[9px] font-bold text-slate-500">/mo*</span>
            </div>
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
            EMI લોન કેલ્ક્યુલેટર · Loan Calculator
          </h3>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange text-[10px] font-bold uppercase tracking-wider">
              <Calculator className="w-3 h-3" />
              સરળ કાર ફાઇનાન્સ · Easy Car Finance
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
              EMI લોન કેલ્ક્યુલેટર
            </h3>
          </div>

          {/* Compact EMI Highlight Pill */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-500/25 px-3 py-1.5 rounded-xl shrink-0 self-start sm:self-auto shadow-2xs">
            <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider">
              અંદાજિત EMI:
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 font-heading leading-none">
                {formatRupee(emi)}
              </span>
              <span className="text-[10px] font-bold text-slate-500">/mo*</span>
            </div>
          </div>
        </div>
      )}

      {/* ── 3 Sliders (Stacked in Sidebar, 3-Col in Full Width) ── */}
      <div className={`grid gap-3 ${isSidebar ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3 sm:gap-4'}`}>
        {/* 1. Down Payment Slider */}
        <div className="p-2.5 bg-slate-50/70 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              ડાઉન પેમેન્ટ: <span className="text-brand-orange">{downPaymentPercent}%</span>
            </label>
            <span className="text-xs font-bold text-slate-900">
              {formatRupee(downPaymentAmount)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="5"
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
          />
          <div className="flex justify-between text-[9px] text-slate-400 font-semibold mt-1">
            <span>0% (₹0)</span>
            <span>80% ({formatRupee((safeCarPrice * 80) / 100)})</span>
          </div>
        </div>

        {/* 2. Interest Rate Slider */}
        <div className="p-2.5 bg-slate-50/70 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              વ્યાજ દર (Rate p.a.)
            </label>
            <span className="text-xs font-bold text-slate-900">
              {interestRate.toFixed(1)}%
            </span>
          </div>
          <input
            type="range"
            min="8.5"
            max="18"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
          />
          <div className="flex justify-between text-[9px] text-slate-400 font-semibold mt-1">
            <span>8.5% (પ્રાઇમ બેંક)</span>
            <span>18%</span>
          </div>
        </div>

        {/* 3. Loan Tenure Slider */}
        <div className="p-2.5 bg-slate-50/70 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              લોન મુદત (Tenure)
            </label>
            <span className="text-xs font-bold text-slate-900">
              {tenureYears} વર્ષ ({tenureYears * 12} mo)
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="7"
            step="1"
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
          />
          <div className="flex justify-between text-[9px] text-slate-400 font-semibold mt-1">
            <span>1 વર્ષ</span>
            <span>4 વર્ષ</span>
            <span>7 વર્ષ</span>
          </div>
        </div>
      </div>

      {/* ── Breakdown Stats & Progress Bar ── */}
      <div className="mt-3 pt-2.5 border-t border-slate-100">
        <div className="grid grid-cols-3 gap-2 mb-2.5 text-center">
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-100/80">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block leading-tight">
              મૂળ રકમ (Principal)
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              {formatRupee(loanPrincipal)}
            </span>
          </div>

          <div className="p-2 bg-slate-50 rounded-lg border border-slate-100/80">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block leading-tight">
              કુલ વ્યાજ (Interest)
            </span>
            <span className="text-xs sm:text-sm font-bold text-amber-600">
              {formatRupee(totalInterest)}
            </span>
          </div>

          <div className="p-2 bg-slate-50 rounded-lg border border-slate-100/80">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block leading-tight">
              કુલ ચૂકવણી (Total)
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900">
              {formatRupee(totalPayment)}
            </span>
          </div>
        </div>

        {/* Visual Progress Ratio Bar */}
        <div className="space-y-1 mb-3">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${principalPercent}%` }}
              className="bg-slate-800 transition-all duration-300"
              title={`Principal: ${principalPercent}%`}
            />
            <div
              style={{ width: `${interestPercent}%` }}
              className="bg-brand-orange transition-all duration-300"
              title={`Interest: ${interestPercent}%`}
            />
          </div>
          <div className="flex justify-between text-[10px] font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-800 inline-block" />
              મૂળ રકમ ({principalPercent}%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-brand-orange inline-block" />
              વ્યાજ ({interestPercent}%)
            </span>
          </div>
        </div>

        {/* Bottom Compact Action: WhatsApp Loan Assistance */}
        <div className={`p-2.5 sm:px-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex ${isSidebar ? 'flex-col gap-2.5' : 'flex-col sm:flex-row items-center justify-between gap-2.5'}`}>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <p className="font-bold text-slate-900 text-xs leading-snug">
              ઝડપી બેંક લોન સહાય (HDFC, ICICI, SBI, Axis, Kotak, IDFC)
            </p>
          </div>

          <a
            href={buildWhatsAppUrl(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-3.5 py-2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0 ${isSidebar ? 'w-full' : 'w-full sm:w-auto'}`}
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>લોન માટે WhatsApp કરો</span>
          </a>
        </div>
      </div>
    </div>
  );
}
