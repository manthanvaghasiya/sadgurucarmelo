import React, { useState, useEffect } from 'react';
import { Calculator, ShieldCheck, Info } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';

export default function EmiCalculator({ carPrice = 500000, carTitle = 'this vehicle' }) {
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
    <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 mt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" />
            સરળ કાર ફાઇનાન્સ · Easy Car Finance
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            EMI લોન કેલ્ક્યુલેટર <span className="text-brand-orange font-normal text-xl sm:text-2xl">· EMI Calculator</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-body mt-1">
            તમારી મનપસંદ કાર માટે માસિક હપ્તા અને ડાઉન પેમેન્ટની સરળ ગણતરી કરો.
          </p>
        </div>

        {/* Big EMI Highlight Card */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent border border-amber-500/20 p-5 rounded-2xl text-left sm:text-right shrink-0 min-w-[200px]">
          <span className="text-[11px] font-bold text-brand-orange uppercase tracking-wider block mb-1">
            અંદાજિત માસિક હપ્તો · Monthly EMI
          </span>
          <div className="flex items-baseline sm:justify-end gap-1">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
              {formatRupee(emi)}
            </span>
            <span className="text-xs font-bold text-slate-500">/મહિનો</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            મુદત: {tenureYears * 12} મહિના ({tenureYears} વર્ષ)
          </span>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="space-y-6">
        {/* 1. Down Payment Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              ડાઉન પેમેન્ટ (Down Payment): <span className="text-brand-orange">{downPaymentPercent}%</span>
            </label>
            <span className="text-sm font-bold text-slate-900">
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
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
            <span>0% (₹0)</span>
            <span>40%</span>
            <span>80% ({formatRupee((safeCarPrice * 80) / 100)})</span>
          </div>
        </div>

        {/* 2. Sliders row: Interest Rate & Loan Tenure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Interest Rate */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                વાર્ષિક વ્યાજ દર (Interest Rate p.a.)
              </label>
              <span className="text-sm font-bold text-slate-900">
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
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
              <span>8.5% (પ્રાઇમ બેંક)</span>
              <span>18%</span>
            </div>
          </div>

          {/* Loan Tenure */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                લોન મુદત (Loan Tenure)
              </label>
              <span className="text-sm font-bold text-slate-900">
                {tenureYears} વર્ષ ({tenureYears * 12} મહિના)
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
              <span>૧ વર્ષ</span>
              <span>૪ વર્ષ</span>
              <span>૭ વર્ષ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Bar & Details */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              મૂળ લોન રકમ (Principal Amount)
            </span>
            <span className="text-base font-bold text-slate-800">
              {formatRupee(loanPrincipal)}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              કુલ વ્યાજ (Total Interest)
            </span>
            <span className="text-base font-bold text-amber-600">
              {formatRupee(totalInterest)}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              કુલ ચૂકવણી (Total Payable)
            </span>
            <span className="text-base font-bold text-slate-900">
              {formatRupee(totalPayment)}
            </span>
          </div>
        </div>

        {/* Visual Progress Ratio Bar */}
        <div className="space-y-1.5 mb-6">
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
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
          <div className="flex justify-between text-[11px] font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800 inline-block" />
              મૂળ રકમ Principal ({principalPercent}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-orange inline-block" />
              વ્યાજ Interest ({interestPercent}%)
            </span>
          </div>
        </div>

        {/* Bottom Action: WhatsApp Loan Assistance */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs sm:text-sm">
                સરળ બેંક લોન સહાય અને ઝડપી મંજૂરી · Quick Loan Approval
              </p>
              <p className="text-slate-600 text-[11px]">
                HDFC, ICICI, SBI, Axis, Kotak, IDFC બેંકો સાથે ટાઇ-અપ — સૌથી ઓછું વ્યાજ અને ઓછામાં ઓછું કાગળકામ.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/919913634447?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shrink-0"
          >
            <WhatsAppIcon className="w-4 h-4" />
            લોન માટે WhatsApp કરો
          </a>
        </div>
      </div>
    </div>
  );
}
